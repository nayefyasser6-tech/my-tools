import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// تهيئة العميل ليشير لسيرفر xAI (Grok)
const xai = new OpenAI({
  apiKey: process.env.XAI_API_KEY, // تأكد أن هذا هو اسم المتغير في ملف .env.local
  baseURL: 'https://api.x.ai/v1', // يجب أن ينتهي بـ /v1
});

export async function POST(req: Request) {
  try {
    const { name, role, experience, skills, education } = await req.json();

    const prompt = `اكتب سيرة ذاتية احترافية ATS-friendly بالعربية:
الاسم: ${name}
الوظيفة: ${role}
الخبرة: ${experience}
المهارات: ${skills}
التعليم: ${education}`;

    const completion = await xai.chat.completions.create({
      model: 'grok-2-latest', // استخدم اسم موديل حالي وصالح (مثل grok-2-latest أو grok-3)
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
    });

    const cv = completion.choices[0]?.message?.content || 'لم يتم التوليد';
    return NextResponse.json({ cv });
  } catch (e: any) {
    console.error('Grok API Error:', e); // اطبع الخطأ الحقيقي في terminal
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}