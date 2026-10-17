import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // 1. السماح بزيارة صفحة /tools الرئيسية، وحماية الأدوات الفرعية وصفحة الدفع
  const isCheckout = path.startsWith('/checkout');
  const isSpecificTool = path.startsWith('/tools/') && path !== '/tools'; // حماية ما بداخل مجلد tools فقط

  if ((isCheckout || isSpecificTool) && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  // 2. منع المستخدم المسجل من العودة لصفحة تسجيل الدخول
  if (path.startsWith('/login') && user) {
    const toolsUrl = request.nextUrl.clone()
    toolsUrl.pathname = '/tools'
    return NextResponse.redirect(toolsUrl)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}