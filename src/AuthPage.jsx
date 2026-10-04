import { useState } from 'react'
import { ArrowLeft, ArrowUpLeft, Check, Eye, EyeOff, LockKeyhole, Mail, ShoppingBag, TrendingUp, UserRound } from 'lucide-react'

export default function AuthPage({ onPreview }) {
  const [mode, setMode] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const isSignup = mode === 'signup'
  const fieldClass = 'h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/70 pr-11 pl-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10'

  function changeMode(nextMode) {
    setMode(nextMode)
    setShowPassword(false)
    setMessage('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    setMessage('این فرم نمایشی است؛ ورود و ثبت‌نام واقعی هنوز به سرویس احراز هویت متصل نشده است.')
  }

  return (
    <main dir="rtl" className="grid min-h-screen bg-white lg:grid-cols-2">
      <section className="flex flex-col px-6 py-7 sm:px-12 lg:px-16">
        <a href="#" onClick={(event) => { event.preventDefault(); onPreview() }} className="inline-flex w-fit items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-600 text-xl font-black text-white shadow-lg shadow-indigo-600/20">ک</span>
          <span><span className="block text-sm font-bold text-slate-950">کامرس‌آی‌کیو</span><span className="mt-0.5 block text-xs text-slate-400">یک نگاه، تمام فروشگاه</span></span>
        </a>

        <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-12 sm:py-16">
          <div className="mb-7 grid h-12 w-12 place-items-center rounded-2xl border border-indigo-100 bg-indigo-50 text-indigo-600"><LockKeyhole size={22} /></div>
          <p className="mb-3 text-xs font-semibold text-indigo-600">فضای مدیریت فروشگاه شما</p>
          <h1 className="text-3xl font-bold leading-normal tracking-tight text-slate-950 sm:text-4xl">{isSignup ? 'شروع یک مسیر تازه' : 'خوش برگشتی!'}</h1>
          <p className="mt-3 text-sm leading-7 text-slate-500">{isSignup ? 'حساب بساز و فروشگاهت را از یک جای ساده مدیریت کن.' : 'وارد حساب شو؛ نبض فروشگاهت اینجاست.'}</p>

          <div className="mt-8 grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1" role="tablist" aria-label="ورود یا ثبت‌نام">
            {['login', 'signup'].map((tab) => (
              <button key={tab} id={`auth-tab-${tab}`} type="button" role="tab" aria-selected={mode === tab} aria-controls="auth-panel" onClick={() => changeMode(tab)} className={`rounded-xl py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${mode === tab ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
                {tab === 'login' ? 'ورود به حساب' : 'ساخت حساب جدید'}
              </button>
            ))}
          </div>

          <form key={mode} id="auth-panel" role="tabpanel" aria-labelledby={`auth-tab-${mode}`} onSubmit={handleSubmit} className="mt-7 space-y-5">
            {isSignup && <div>
              <label htmlFor="auth-name" className="mb-2 block text-sm font-semibold text-slate-700">نام و نام خانوادگی</label>
              <div className="relative"><UserRound size={18} className="pointer-events-none absolute right-4 top-4 text-slate-400" /><input id="auth-name" name="name" autoComplete="name" required placeholder="مثلاً علی رضایی" className={fieldClass} /></div>
            </div>}
            <div>
              <label htmlFor="auth-email" className="mb-2 block text-sm font-semibold text-slate-700">آدرس ایمیل</label>
              <div className="relative"><Mail size={18} className="pointer-events-none absolute right-4 top-4 text-slate-400" /><input id="auth-email" name="email" type="email" autoComplete="email" required dir="ltr" placeholder="you@example.com" className={`${fieldClass} text-left`} /></div>
            </div>
            <div>
              <label htmlFor="auth-password" className="mb-2 block text-sm font-semibold text-slate-700">رمز عبور</label>
              <div className="relative">
                <LockKeyhole size={18} className="pointer-events-none absolute right-4 top-4 text-slate-400" />
                <input id="auth-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete={isSignup ? 'new-password' : 'current-password'} minLength={isSignup ? 8 : undefined} required placeholder={isSignup ? 'حداقل ۸ کاراکتر' : 'رمز عبورت را وارد کن'} className={`${fieldClass} !pl-12`} />
                <button type="button" aria-label={showPassword ? 'پنهان کردن رمز عبور' : 'نمایش رمز عبور'} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)} className="absolute left-2 top-2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
              {isSignup && <p className="mt-2 text-xs text-slate-400">برای رمز عبور از حداقل ۸ کاراکتر استفاده کن.</p>}
            </div>
            {message && <p role="status" className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-xs leading-6 text-indigo-700">{message}</p>}
            <button type="submit" className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 active:scale-[0.99]">{isSignup ? 'ساخت حساب کاربری' : 'ورود به حساب'}<ArrowLeft size={18} /></button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">{isSignup ? 'قبلاً حساب ساخته‌ای؟' : 'هنوز حساب نداری؟'} <button type="button" onClick={() => changeMode(isSignup ? 'login' : 'signup')} className="rounded-md font-semibold text-indigo-600 hover:text-indigo-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">{isSignup ? 'وارد شو' : 'ثبت‌نام کن'}</button></p>
          <div className="mt-8 flex items-center gap-4"><span className="h-px flex-1 bg-slate-100" /><span className="text-xs text-slate-400">یک نگاه قبل از شروع</span><span className="h-px flex-1 bg-slate-100" /></div>
          <button type="button" onClick={onPreview} className="mx-auto mt-5 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">مشاهده داشبورد<ArrowUpLeft size={15} /></button>
        </div>
        <p className="text-center text-[11px] text-slate-400">کامرس‌آی‌کیو · فضای تحلیل فروش</p>
      </section>

      <aside className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-center xl:p-20">
        <div aria-hidden="true" className="pointer-events-none absolute -left-28 -top-28 h-96 w-96 rounded-full bg-indigo-600/30 blur-[100px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-violet-600/20 blur-[100px]" />
        <div className="relative mx-auto w-full max-w-lg">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-indigo-200"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />همه‌چیز، زیر یک سقف</span>
          <h2 className="mt-6 text-4xl font-bold leading-[1.7] xl:text-5xl">پشت هر فروش،<br /><span className="text-indigo-300">یک تصمیم هوشمند.</span></h2>
          <p className="mt-4 max-w-sm text-sm leading-8 text-slate-400">از اولین سفارش تا رشدهای بزرگ؛ آمار فروشگاهت را ببین و با خیال روشن‌تر قدم بعدی را بردار.</p>

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500/15 text-indigo-300"><TrendingUp size={20} /></span><div><p className="text-sm font-semibold">فروش در یک نگاه</p><p className="mt-1 text-xs text-slate-500">گزارش هفتگی فروشگاه</p></div></div><span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-300" dir="ltr">+۱۲٫۸٪</span></div>
            <div className="mt-6 flex items-end gap-2"><span className="text-3xl font-bold">۸۴٬۲۶۰</span><span className="pb-1 text-xs text-slate-500">فروش این هفته</span></div>
            <div aria-hidden="true" className="mt-6 flex h-28 items-end gap-3 border-b border-white/10 pb-2">{[34, 48, 40, 63, 57, 82, 100].map((height, index) => <div key={index} className={`flex-1 rounded-t-lg ${index === 6 ? 'bg-indigo-400' : 'bg-gradient-to-t from-indigo-600/20 to-indigo-500/60'}`} style={{ height: `${height}%` }} />)}</div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400"><span className="flex items-center gap-2"><ShoppingBag size={14} />۱٬۲۸۴ سفارش</span><span>هفته‌ای پربارتر از همیشه</span></div>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-slate-400">{['آمار شفاف', 'مدیریت ساده', 'نگاه دقیق‌تر'].map((label) => <span key={label} className="flex items-center gap-2"><Check size={14} className="text-indigo-400" />{label}</span>)}</div>
        </div>
      </aside>
    </main>
  )
}
