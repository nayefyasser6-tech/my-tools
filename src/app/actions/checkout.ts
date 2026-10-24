"use server";

import { lemonSqueezySetup, createCheckout } from "@lemonsqueezy/lemonsqueezy.js";
import { createClient } from "@/utils/supabase/server";

export async function createCheckoutSession(_userId?: string) {
  try {
    // 1) التحقق من المستخدم من الجلسة (وليس من المتصفح)
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "يرجى تسجيل الدخول أولاً." };
    }

    const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
    const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
    const variantId = process.env.LEMON_SQUEEZY_VARIANT_ID;

    if (!apiKey || !storeId || !variantId) {
      return { error: "يرجى التأكد من إضافة مفاتيح API_KEY و STORE_ID و VARIANT_ID في ملف .env وفي إعدادات Vercel" };
    }

    lemonSqueezySetup({ apiKey });

    const { data, error } = await createCheckout(storeId, variantId, {
      checkoutData: {
        // تعبئة البريد تلقائياً في صفحة الدفع
        email: user.email ?? undefined,
        // نفس المفتاح user_id الذي يقرأه الـ webhook لترقية الحساب
        custom: { user_id: user.id },
      },
      productOptions: {
        // الرجوع إلى موقعك الحقيقي الثابت بعد الدفع
        redirectUrl: "https://my-tools-five-nu.vercel.app/tools",
      },
    });

    if (error) {
      console.error("Lemon Squeezy API Error:", error.message);
      return { error: `رسالة من بوابة الدفع: ${error.message}` };
    }

    if (data?.data?.attributes?.url) {
      return { url: data.data.attributes.url };
    }

    return { error: "لم يتم إنشاء الرابط بنجاح، يرجى التحقق من لوحة تحكم Lemon Squeezy." };
  } catch (err: any) {
    console.error("Server Error:", err);
    return { error: `مشكلة في الخادم: ${err.message}` };
  }
}