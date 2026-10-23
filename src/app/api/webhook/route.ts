import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    // قراءة البيانات القادمة من Lemon Squeezy (تم إصلاح الخطأ المطبعي هنا)
    const rawBody = await req.text();
    const signature = req.headers.get('x-signature') as string;
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!;

    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
    const signatureBuffer = Buffer.from(signature, 'utf8');

    if (!crypto.timingSafeEqual(digest, signatureBuffer)) {
      return NextResponse.json({ error: 'توقيع غير صالح' }, { status: 401 });
    }

    const data = JSON.parse(rawBody);
    const eventName = data.meta.event_name;

    if (eventName === 'subscription_created' || eventName === 'order_created') {
      const userId = data.meta.custom_data.user_id;

      if (userId) {
        // الاتصال بقاعدة البيانات باستخدام مفتاح الإدمن
        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { error } = await supabaseAdmin
          .from('profiles')
          .update({ plan_type: 'pro' })
          .eq('id', userId);

        if (error) throw error;
        
        console.log(`تم تحديث خطة المستخدم ${userId} إلى المحترفين بنجاح!`);
      }
    }

    return NextResponse.json({ message: 'تم استلام ومعالجة الـ Webhook' }, { status: 200 });
  } catch (err: any) {
    console.error('خطأ في الـ Webhook:', err);
    return NextResponse.json({ error: 'فشل في معالجة الطلب' }, { status: 500 });
  }
}