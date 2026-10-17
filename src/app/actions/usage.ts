"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

// تحديد الحد الأقصى لكل أداة لأصحاب الخطة المجانية
const FREE_LIMITS = {
  'pdf-merge': 2,
  'remove-bg': 2,
  'cv-maker': 1
};

export async function checkAndIncrementUsage(toolName: keyof typeof FREE_LIMITS) {
  try {
    const cookieStore = cookies();
    
    // 1. الاتصال العادي لمعرفة المستخدم
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value; },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { allowed: false, error: "يجب تسجيل الدخول أولاً" };

    // 2. التحقق من نوع الخطة
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan_type')
      .eq('id', user.id)
      .single();

    // إذا كان محترفاً، اسمح له فوراً وبلا حدود!
    if (profile?.plan_type === 'pro') {
      return { allowed: true, isPro: true };
    }

    // --- منطق الخطة المجانية ---
    
    // استخدام مفتاح الإدمن (الذي أضفناه سابقاً) لتعديل العداد بصلاحيات مطلقة
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 3. جلب أو إنشاء سجل الاستخدام للأداة المطلوبة
    let { data: usageRecord } = await supabaseAdmin
      .from('user_usage')
      .select('*')
      .eq('user_id', user.id)
      .eq('tool_name', toolName)
      .single();

    const today = new Date().toISOString().split('T')[0]; // تاريخ اليوم YYYY-MM-DD

    // إذا لم يكن لديه سجل سابق لهذه الأداة، ننشئ واحداً
    if (!usageRecord) {
      const { data: newRecord } = await supabaseAdmin
        .from('user_usage')
        .insert({ user_id: user.id, tool_name: toolName, usage_count: 0, last_reset_date: today })
        .select()
        .single();
      usageRecord = newRecord;
    }

    // 4. تصفير العداد إذا مر يوم جديد (لتجديد الباقة المجانية يومياً)
    if (usageRecord.last_reset_date !== today) {
      usageRecord.usage_count = 0;
      usageRecord.last_reset_date = today;
    }

    // 5. التحقق من الوصول للحد الأقصى
    const limit = FREE_LIMITS[toolName];
    if (usageRecord.usage_count >= limit) {
      return { 
        allowed: false, 
        error: `لقد استنفدت الحد المسموح للخطة المجانية اليوم (${limit} مرات). قم بترقية خطتك للوصول غير المحدود!`,
        requiresUpgrade: true
      };
    }

    // 6. زيادة العداد والسماح للمستخدم بتشغيل الأداة
    await supabaseAdmin
      .from('user_usage')
      .update({ 
        usage_count: usageRecord.usage_count + 1,
        last_reset_date: today
      })
      .eq('id', usageRecord.id);

    return { allowed: true, remaining: limit - (usageRecord.usage_count + 1) };

  } catch (error) {
    console.error("Usage Check Error:", error);
    return { allowed: false, error: "حدث خطأ في النظام، يرجى المحاولة لاحقاً." };
  }
}