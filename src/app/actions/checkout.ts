"use server";

import { headers } from "next/headers";
import { lemonSqueezySetup, createCheckout } from "@lemonsqueezy/lemonsqueezy.js";
import { createClient } from "@/utils/supabase/server";

// رابط الموقع الحقيقي: من متغير البيئة إن وُجد (يُفضّل ضبطه في Vercel)، وإلا من الطلب نفسه.
// هكذا يعمل تلقائياً على جهازك (localhost) وعلى Vercel بدون تعديل الكود.
async function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, "");

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

// ملاحظة: بقي المعامل userId اختيارياً حتى لا تتعطل الاستدعاءات الحالية،
// لكننا لا نثق به. المستخدم الحقيقي يُؤخذ من جلسته على السيرفر.
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

    const siteUrl = await getSiteUrl();

    const { data, error } = await createCheckout(storeId, variantId, {
      checkoutData: {
        // تعبئة البريد تلقائياً في صفحة الدفع
        email: user.email ?? undefined,
        // نفس المفتاح user_id الذي يقرأه الـ webhook لترقية الحساب
        custom: { user_id: user.id },
      },
      productOptions: {
        // الرجوع إلى موقعك الحقيقي بعد الدفع
        redirectUrl: `${siteUrl}/tools`,
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