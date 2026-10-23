"use server";

import { lemonSqueezySetup, createCheckout } from "@lemonsqueezy/lemonsqueezy.js";

export async function createCheckoutSession(userId: string) {
  try {
    const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
    const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
    const variantId = process.env.LEMON_SQUEEZY_VARIANT_ID;

    // التحقق من وجود المفاتيح
    if (!apiKey || !storeId || !variantId) {
      return { error: "يرجى التأكد من إضافة مفاتيح API_KEY و STORE_ID و VARIANT_ID في ملف .env" };
    }

    lemonSqueezySetup({ apiKey });

    const { data, error } = await createCheckout(
      storeId,
      variantId,
      {
        checkoutData: {
          custom: { user_id: userId }, // نرسل الـ ID لربط الدفع بالمستخدم
        },
        productOptions: {
          // التوجيه التلقائي إلى صفحة الأدوات بعد إتمام الدفع بنجاح
          redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://my-tools-qhii7zgmu-elmutasem.vercel.app'}/tools`,
        }
      }
    );

    if (error) {
      console.error("Lemon Squeezy API Error:", error.message);
      // إرجاع رسالة الخطأ الحقيقية القادمة من بوابة الدفع
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