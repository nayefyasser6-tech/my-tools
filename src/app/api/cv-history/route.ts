import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// دالة مساعدة: تجيب الـ client والمستخدم الحقيقي من الـ cookies
async function getAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function GET() {
  const { supabase, user } = await getAuth();
  if (!user) return NextResponse.json({ history: [] });

  const { data, error } = await supabase
    .from('user_cvs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: 'فشل الجلب' }, { status: 500 });

  const history = data.map((r: any) => ({
    id: r.id,
    date: new Date(r.created_at).toLocaleDateString('ar-EG'),
    data: r.cv_data,
    photo: r.cv_data?.photo || null,
  }));
  return NextResponse.json({ history });
}

export async function POST(req: Request) {
  const { supabase, user } = await getAuth();
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const record = await req.json();

  // فحص الحد المجاني من السيرفر
  const { count, error: countError } = await supabase
    .from('user_cvs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);
  if (countError) return NextResponse.json({ error: 'خطأ' }, { status: 500 });
  if ((count ?? 0) >= 1) {
    return NextResponse.json({ error: 'تم الوصول للحد الأقصى', limitReached: true }, { status: 403 });
  }

  const cvData = record.photo ? { ...record.data, photo: record.photo } : record.data;

  const { error } = await supabase
    .from('user_cvs')
    .insert([{ id: record.id, cv_data: cvData, user_id: user.id }]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { supabase, user } = await getAuth();
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'بيانات مفقودة' }, { status: 400 });

  const { error } = await supabase
    .from('user_cvs')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);
  if (error) return NextResponse.json({ error: 'فشل الحذف' }, { status: 500 });

  return NextResponse.json({ success: true });
}