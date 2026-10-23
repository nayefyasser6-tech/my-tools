import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const maxDuration = 60;

// الموديلات بالترتيب: الأساسي ثم احتياطيان (لكل موديل حصة مستقلة).
// يمكنك تغييرها بدون تعديل الكود بإضافة GEMINI_MODELS في .env.local
// مثال: GEMINI_MODELS=gemini-3.8-flash,gemini-3.6-flash,gemini-2.5-flash
const MODELS = (process.env.GEMINI_MODELS || 'gemini-3.8-flash,gemini-3.6-flash,gemini-2.5-flash')
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean);

// ميزانية الوقت: لا ننتظر أكثر من 30 ثانية إجمالاً، ولا أكثر من 15 ثانية لكل محاولة
const BUDGET_MS = 30000;
const PER_CALL_MS = 15000;
const MIN_LEFT_MS = 4000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// يستخرج مدة الانتظار من رسالة Gemini، مثل: "Please retry in 4.66s" أو "retry in 11h56m9.8s"
function retrySeconds(msg: string): number {
  const m = msg.match(/retry in\s+(?:(\d+)h)?(?:(\d+)m)?([\d.]+)s/i);
  if (!m) return 0;
  return Number(m[1] || 0) * 3600 + Number(m[2] || 0) * 60 + Number(m[3] || 0);
}

// وضع "التفكير" يبطّئ الرد كثيراً وغير مفيد لكتابة سيرة ذاتية، فنقلّله لأدنى حد
function thinkingFor(model: string): Record<string, unknown> | undefined {
  if (/2\.5/.test(model)) return { thinkingBudget: 0 };
  if (/gemini-3/.test(model)) return { thinkingLevel: 'low' };
  return undefined;
}

const schema = {
  type: 'OBJECT',
  properties: {
    summary: { type: 'STRING' },
    experience: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          role: { type: 'STRING' },
          company: { type: 'STRING' },
          location: { type: 'STRING' },
          duration: { type: 'STRING' },
          description: { type: 'STRING' },
        },
        required: ['role', 'company', 'duration', 'description'],
      },
    },
    education: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          degree: { type: 'STRING' },
          university: { type: 'STRING' },
          duration: { type: 'STRING' },
        },
        required: ['degree', 'university', 'duration'],
      },
    },
    skills: { type: 'ARRAY', items: { type: 'STRING' } },
    languages: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: { name: { type: 'STRING' }, level: { type: 'STRING' } },
        required: ['name', 'level'],
      },
    },
  },
  required: ['summary', 'experience', 'education', 'skills', 'languages'],
};

export async function POST(req: Request) {
  try {
    // 1) التحقق من المستخدم
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'غير مصرح. يرجى تسجيل الدخول.' }, { status: 401 });
    }

    const body = await req.json();
    const { data = {}, language, isTranslation, cvDataToTranslate } = body;
    const { name, title, notes } = data;
    const isEn = language === 'en';

    const busyMsg = isEn
      ? 'The AI servers are busy right now. Please try again in a moment.'
      : 'خوادم الذكاء الاصطناعي مشغولة حالياً، حاول مجدداً بعد لحظات.';
    const quotaMsg = isEn
      ? 'The AI service has reached its daily limit. Please try again later.'
      : 'وصلت خدمة الذكاء الاصطناعي لحدها اليومي. حاول لاحقاً.';
    const failMsg = isEn
      ? 'AI failed to generate the CV. Please try again.'
      : 'لم يتمكن الذكاء الاصطناعي من توليد السيرة. حاول مجدداً.';

    // 2) الحد المجاني: سيرة واحدة (لا ينطبق على الترجمة)
    if (!isTranslation) {
      const { count } = await supabase
        .from('user_cvs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if ((count ?? 0) >= 1) {
        return NextResponse.json(
          { error: 'تم الوصول للحد الأقصى', limitReached: true },
          { status: 403 }
        );
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'مفتاح API غير موجود' }, { status: 500 });
    }

    const targetLang = language === 'en' ? 'English' : language === 'tr' ? 'Turkish' : 'Arabic';

    let prompt = '';
    if (isTranslation) {
      prompt = `أنت مترجم محترف. قم بترجمة بيانات السيرة الذاتية التالية إلى اللغة (${targetLang}) بدقة عالية.
      حافظ على نفس المفاتيح (keys) باللغة الإنجليزية كما هي تماماً، وترجم القيم (values) فقط.
      البيانات: ${JSON.stringify(cvDataToTranslate)}`;
    } else {
      // مخرجات أقصر = رد أسرع
      prompt = `أنت خبير توظيف (HR). اكتب سيرة ذاتية احترافية ومختصرة لشخص اسمه "${name || 'غير محدد'}" ومسماه الوظيفي "${title}".
      ${notes ? `ملاحظات: ${notes}` : ''}
      اللغة المطلوبة: ${targetLang}.
      الشروط: ملخص مهني من 3 جمل فقط، خبرتان إلى ثلاث خبرات فقط، و3 نقاط إنجاز مختصرة لكل خبرة في حقل الوصف (كل نقطة في سطر)، و6 إلى 8 مهارات، ولغتان أو ثلاث. أعد النتيجة بصيغة JSON فقط.`;
    }

    const buildPayload = (model: string, withThinking: boolean) => {
      const thinking = thinkingFor(model);
      return {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: schema,
          temperature: 0.4,
          maxOutputTokens: 3000,
          ...(withThinking && thinking ? { thinkingConfig: thinking } : {}),
        },
      };
    };

    // 3) استدعاء Gemini: موديل أساسي ثم احتياطي، ضمن ميزانية وقت محدودة
    const startedAt = Date.now();
    const timeLeft = () => BUDGET_MS - (Date.now() - startedAt);

    let lastStatus = 500;
    let sawShortLimit = false; // حد 429 مؤقت (في الدقيقة) وليس يومياً

    outer: for (let i = 0; i < MODELS.length; i++) {
      const model = MODELS[i];
      // نعيد المحاولة مرة واحدة فقط للموديل الأول (عند الازدحام)
      const maxAttempts = i === 0 ? 2 : 1;
      let attempts = 0;
      let withThinking = true;

      while (attempts < maxAttempts) {
        attempts++;

        const left = timeLeft();
        if (left < MIN_LEFT_MS) break outer; // انتهت الميزانية
        const timeout = Math.min(PER_CALL_MS, left);

        let response: Response | null = null;
        let resData: any = {};
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeout);
        try {
          response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(buildPayload(model, withThinking)),
              signal: controller.signal,
            }
          );
          resData = await response.json().catch(() => ({}));
        } catch {
          response = null;
        } finally {
          clearTimeout(timer);
        }

        // انتهت المهلة أو انقطع الاتصال: ننتقل مباشرة للموديل التالي
        if (!response) {
          lastStatus = 504;
          console.error(`[ai-cv] ${model} -> timeout or network error`);
          break;
        }

        if (response.ok) {
          const text = resData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            try {
              return NextResponse.json({ result: JSON.parse(text) });
            } catch {
              console.error(`[ai-cv] JSON parse failed (${model})`);
            }
          }
          lastStatus = 502; // رد فارغ أو مقطوع
          if (attempts < maxAttempts) {
            await sleep(500);
            continue;
          }
          break;
        }

        lastStatus = response.status;
        const msg: string = resData.error?.message || '';
        console.error(`[ai-cv] ${model} -> ${response.status}`, msg.slice(0, 160));

        // الموديل لم يقبل إعداد التفكير: نعيد نفس الطلب بدونه (لا تُحسب كمحاولة)
        if (response.status === 400 && withThinking && thinkingFor(model)) {
          withThinking = false;
          attempts--;
          continue;
        }

        // ازدحام مؤقت عند Google: انتظر قليلاً وأعد المحاولة (إن بقيت محاولة)
        if ((response.status === 503 || response.status === 500) && attempts < maxAttempts) {
          await sleep(1000);
          continue;
        }

        // تجاوز الحد: لا فائدة من إعادة المحاولة على نفس الموديل، ننتقل للتالي
        if (response.status === 429 && retrySeconds(msg) <= 120) {
          sawShortLimit = true;
        }
        break;
      }
    }

    // حد الدقيقة أو انتهاء المهلة مؤقتان، فنعاملهما كازدحام ونطلب إعادة المحاولة بعد لحظات
    let finalStatus = lastStatus;
    if (finalStatus === 504) finalStatus = 503;
    if (finalStatus === 429 && sawShortLimit) finalStatus = 503;

    const error = finalStatus === 429 ? quotaMsg : finalStatus === 503 ? busyMsg : failMsg;
    return NextResponse.json({ error, busy: finalStatus === 503 }, { status: finalStatus });
  } catch (error: any) {
    console.error('[ai-cv] server error', error);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}