import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Download, Eye, Plus, Search, ShoppingBag, Trash2, Truck, Wallet, X } from 'lucide-react'
import { createOrder, ordersToCsv, paginateOrders, sampleOrders, selectOrders, statusLabels } from './ordersModel'

const number = (value) => value.toLocaleString('fa-IR')
const money = (value) => `${number(value)} تومان`
const dateLabel = (value) => new Date(`${value}T12:00:00`).toLocaleDateString('fa-IR')
const statusStyles = { processing: 'bg-amber-50 text-amber-700', paid: 'bg-emerald-50 text-emerald-700', shipped: 'bg-indigo-50 text-indigo-700', delivered: 'bg-teal-50 text-teal-700', cancelled: 'bg-slate-100 text-slate-600', refunded: 'bg-rose-50 text-rose-700' }
const inputClass = 'h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
const buttonClass = 'inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40'

function OrderStatus({ status }) {
  return <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[status]}`}>{statusLabels[status]}</span>
}

function OrderDialog({ title, onClose, children }) {
  const ref = useRef(null)
  useEffect(() => {
    const dialog = ref.current
    dialog.showModal()
    return () => dialog.close()
  }, [])
  return <dialog ref={ref} onCancel={onClose} onClick={(event) => { if (event.target === ref.current) onClose() }} aria-labelledby="order-dialog-title" className="m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-3xl border-0 bg-white p-0 text-right text-slate-900 shadow-2xl backdrop:bg-slate-950/40 backdrop:backdrop-blur-sm">
    <div className="flex items-center justify-between border-b border-slate-100 p-5"><h2 id="order-dialog-title" className="text-lg font-bold">{title}</h2><button type="button" onClick={onClose} aria-label="بستن پنجره" className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"><X size={20} /></button></div>
    <div className="p-5 sm:p-6">{children}</div>
  </dialog>
}

export default function OrdersPage() {
  const [orders, setOrders] = useState(sampleOrders)
  const [filters, setFilters] = useState({ query: '', status: 'all', from: '', to: '', sort: 'newest' })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [selected, setSelected] = useState([])
  const [bulkStatus, setBulkStatus] = useState('processing')
  const [modal, setModal] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const filtered = selectOrders(orders, filters)
  const pagination = paginateOrders(filtered, page, pageSize)
  const currentOrder = modal?.id ? orders.find((order) => order.id === modal.id) : null
  const allPageSelected = pagination.items.length > 0 && pagination.items.every((order) => selected.includes(order.id))
  const earned = orders.filter((order) => ['paid', 'shipped', 'delivered'].includes(order.status)).reduce((sum, order) => sum + order.amount, 0)
  const cards = [
    { label: 'کل سفارش‌ها', value: number(orders.length), icon: ShoppingBag, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'در انتظار پردازش', value: number(orders.filter((order) => order.status === 'processing').length), icon: Wallet, color: 'bg-amber-50 text-amber-600' },
    { label: 'در مسیر ارسال', value: number(orders.filter((order) => order.status === 'shipped').length), icon: Truck, color: 'bg-sky-50 text-sky-600' },
    { label: 'مبلغ سفارش‌های پرداخت‌شده', value: money(earned), icon: Wallet, color: 'bg-emerald-50 text-emerald-600' },
  ]

  function changeFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }))
    setPage(1)
    setSelected([])
  }

  function updateStatus(ids, status) {
    setOrders((current) => current.map((order) => ids.includes(order.id) ? { ...order, status } : order))
    setSelected([])
    setNotice('وضعیت سفارش‌ها به‌روز شد.')
  }

  function exportCsv() {
    const url = URL.createObjectURL(new Blob([ordersToCsv(filtered)], { type: 'text/csv;charset=utf-8;' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'orders.csv'
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  function submitOrder(event) {
    event.preventDefault()
    try {
      const order = createOrder(Object.fromEntries(new FormData(event.currentTarget)), orders)
      setOrders((current) => [order, ...current])
      setFilters({ query: '', status: 'all', from: '', to: '', sort: 'newest' })
      setPage(1)
      setSelected([])
      setModal(null)
      setNotice(`سفارش ${order.id} ثبت شد.`)
    } catch (failure) { setError(failure.message) }
  }

  return <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div><p className="text-sm font-medium text-indigo-600">مدیریت فروشگاه</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">سفارش‌ها</h1><p className="mt-2 text-sm text-slate-500">از ثبت سفارش تا تحویل؛ همه‌چیز را از اینجا پیگیری کن.</p></div>
      <div className="flex flex-wrap gap-2"><button type="button" disabled={!filtered.length} onClick={exportCsv} className={buttonClass}><Download size={17} />خروجی CSV</button><button type="button" onClick={() => { setError(''); setModal({ type: 'create' }) }} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/15 hover:bg-indigo-700"><Plus size={18} />سفارش جدید</button></div>
    </section>
    <p className="mt-4 text-xs leading-6 text-slate-400">داده‌های این صفحه نمونه‌اند؛ تغییرات تا بارگذاری دوباره صفحه نگه داشته می‌شوند.</p>
    {notice && <div role="status" className="mt-4 flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}<button type="button" onClick={() => setNotice('')} aria-label="بستن پیام"><X size={16} /></button></div>}
    <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ label, value, icon: Icon, color }) => <div key={label} className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-soft"><div className={`mb-4 grid h-11 w-11 place-items-center rounded-2xl ${color}`}><Icon size={21} /></div><p className="text-xs text-slate-500">{label}</p><p className="mt-2 text-xl font-bold text-slate-950">{value}</p></div>)}</section>

    <section aria-label="لیست سفارش‌ها" className="mt-6 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-soft">
      <div className="space-y-4 border-b border-slate-100 p-5 sm:p-6">
        <div className="flex flex-col gap-3 lg:flex-row">
          <label className="relative flex-1"><span className="sr-only">جستجوی سفارش‌ها</span><Search size={18} className="absolute right-3 top-3.5 text-slate-400" /><input value={filters.query} onChange={(event) => changeFilter('query', event.target.value)} placeholder="شماره سفارش، نام مشتری، موبایل یا محصول..." className={`${inputClass} pr-10`} /></label>
          <select aria-label="فیلتر وضعیت" value={filters.status} onChange={(event) => changeFilter('status', event.target.value)} className={`${inputClass} lg:w-44`}><option value="all">همه وضعیت‌ها</option>{Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select>
          <select aria-label="مرتب‌سازی سفارش‌ها" value={filters.sort} onChange={(event) => changeFilter('sort', event.target.value)} className={`${inputClass} lg:w-44`}><option value="newest">جدیدترین سفارش‌ها</option><option value="oldest">قدیمی‌ترین سفارش‌ها</option><option value="amount-desc">بیشترین مبلغ</option><option value="amount-asc">کمترین مبلغ</option></select>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <label className="min-w-0 flex-1 text-xs text-slate-500 sm:flex-none">از تاریخ (میلادی)<input type="date" value={filters.from} max={filters.to || undefined} onChange={(event) => changeFilter('from', event.target.value)} className={`${inputClass} mt-1 sm:w-44`} /></label>
          <label className="min-w-0 flex-1 text-xs text-slate-500 sm:flex-none">تا تاریخ (میلادی)<input type="date" value={filters.to} min={filters.from || undefined} onChange={(event) => changeFilter('to', event.target.value)} className={`${inputClass} mt-1 sm:w-44`} /></label>
          <button type="button" onClick={() => { setFilters({ query: '', status: 'all', from: '', to: '', sort: 'newest' }); setPage(1); setSelected([]) }} className="h-11 rounded-xl px-3 text-xs font-semibold text-indigo-600 hover:bg-indigo-50">پاک کردن فیلترها</button>
          <span className="text-xs text-slate-400 sm:mr-auto">{number(filtered.length)} سفارش یافت شد</span>
        </div>
      </div>
      {selected.length > 0 && <div className="flex flex-wrap items-center gap-3 border-b border-indigo-100 bg-indigo-50 px-5 py-3"><span className="text-sm font-semibold text-indigo-700">{number(selected.length)} سفارش انتخاب شده</span><select aria-label="وضعیت سفارش‌های انتخاب‌شده" value={bulkStatus} onChange={(event) => setBulkStatus(event.target.value)} className={`${inputClass} w-40`}>{Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select><button type="button" onClick={() => updateStatus(selected, bulkStatus)} className={buttonClass}>اعمال وضعیت</button><button type="button" onClick={() => setModal({ type: 'delete', ids: selected })} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"><Trash2 size={16} />حذف انتخاب‌شده‌ها</button></div>}
      <div className="overflow-x-auto"><table className="w-full min-w-[880px] text-right text-sm">
        <thead className="border-b border-slate-100 bg-slate-50 text-xs text-slate-400"><tr><th className="p-4"><input type="checkbox" aria-label="انتخاب سفارش‌های این صفحه" checked={allPageSelected} disabled={!pagination.items.length} onChange={() => setSelected((current) => allPageSelected ? current.filter((id) => !pagination.items.some((order) => order.id === id)) : [...new Set([...current, ...pagination.items.map((order) => order.id)])])} className="h-4 w-4 accent-indigo-600" /></th>{['شماره سفارش', 'مشتری', 'محصول', 'تاریخ', 'مبلغ', 'وضعیت', 'عملیات'].map((title) => <th key={title} className="whitespace-nowrap px-4 py-4 font-semibold">{title}</th>)}</tr></thead>
        <tbody>{pagination.items.map((order) => <tr key={order.id} className={`border-b border-slate-100 last:border-0 ${selected.includes(order.id) ? 'bg-indigo-50/50' : 'hover:bg-slate-50/60'}`}>
          <td className="p-4"><input type="checkbox" aria-label={`انتخاب ${order.id}`} checked={selected.includes(order.id)} onChange={() => setSelected((current) => current.includes(order.id) ? current.filter((id) => id !== order.id) : [...current, order.id])} className="h-4 w-4 accent-indigo-600" /></td>
          <td className="px-4 py-5"><button type="button" dir="ltr" onClick={() => setModal({ type: 'details', id: order.id })} className="font-semibold text-indigo-600 hover:underline">{order.id}</button></td>
          <td className="px-4 py-5"><p className="font-semibold text-slate-800">{order.customer}</p><p dir="ltr" className="mt-1 text-right text-xs text-slate-400">{order.phone}</p></td>
          <td className="px-4 py-5"><p className="text-slate-600">{order.product}</p><p className="mt-1 text-xs text-slate-400">{number(order.quantity)} عدد</p></td>
          <td className="whitespace-nowrap px-4 py-5 text-slate-500">{dateLabel(order.date)}</td><td className="whitespace-nowrap px-4 py-5 font-semibold text-slate-900">{money(order.amount)}</td><td className="px-4 py-5"><OrderStatus status={order.status} /></td>
          <td className="px-4 py-5"><div className="flex gap-1"><button type="button" aria-label={`جزئیات ${order.id}`} onClick={() => setModal({ type: 'details', id: order.id })} className="rounded-lg p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"><Eye size={18} /></button><button type="button" aria-label={`حذف ${order.id}`} onClick={() => setModal({ type: 'delete', ids: [order.id] })} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={17} /></button></div></td>
        </tr>)}</tbody>
      </table></div>
      {!filtered.length && <div className="px-6 py-14 text-center"><ShoppingBag size={32} className="mx-auto text-slate-300" /><p className="mt-4 font-semibold text-slate-700">سفارشی پیدا نشد</p><p className="mt-2 text-sm text-slate-400">فیلترها را تغییر بده یا یک سفارش جدید ثبت کن.</p></div>}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
        <label className="flex items-center gap-2">تعداد در صفحه<select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); setSelected([]) }} className="rounded-lg border border-slate-200 px-2 py-1.5">{[5, 10, 20].map((size) => <option key={size} value={size}>{number(size)}</option>)}</select></label>
        <span>{filtered.length ? `${number((pagination.page - 1) * pageSize + 1)} تا ${number(Math.min(pagination.page * pageSize, filtered.length))}` : '۰'} از {number(filtered.length)} سفارش</span>
        <div className="flex items-center gap-2"><button type="button" aria-label="صفحه قبل" disabled={pagination.page === 1} onClick={() => setPage(pagination.page - 1)} className={`${buttonClass} !px-2 !py-2`}><ChevronRight size={16} /></button><span>صفحه {number(pagination.page)} از {number(pagination.pages)}</span><button type="button" aria-label="صفحه بعد" disabled={pagination.page === pagination.pages} onClick={() => setPage(pagination.page + 1)} className={`${buttonClass} !px-2 !py-2`}><ChevronLeft size={16} /></button></div>
      </div>
    </section>

    {modal?.type === 'create' && <OrderDialog title="ثبت سفارش جدید" onClose={() => setModal(null)}><form onSubmit={submitOrder} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">{[['customer', 'نام مشتری', 'text'], ['phone', 'شماره موبایل', 'tel'], ['product', 'نام محصول', 'text'], ['quantity', 'تعداد', 'number'], ['price', 'قیمت واحد (تومان)', 'number']].map(([name, label, type]) => <label key={name} className="block text-xs font-semibold text-slate-600">{label}<input name={name} type={type} required min={type === 'number' ? 1 : undefined} step={type === 'number' ? 1 : undefined} defaultValue={name === 'quantity' ? 1 : undefined} dir={type === 'tel' ? 'ltr' : undefined} autoComplete={name === 'phone' ? 'tel' : name === 'customer' ? 'name' : undefined} className={`${inputClass} mt-2`} /></label>)}<label className="text-xs font-semibold text-slate-600">وضعیت<select name="status" defaultValue="processing" className={`${inputClass} mt-2`}>{Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label></div>
      <label className="block text-xs font-semibold text-slate-600">آدرس تحویل<textarea name="address" autoComplete="street-address" required rows={3} className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></label>
      {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-xs leading-6 text-rose-600">{error}</p>}
      <div className="flex gap-2 border-t border-slate-100 pt-4"><button type="submit" className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700">ثبت سفارش</button><button type="button" onClick={() => setModal(null)} className={buttonClass}>انصراف</button></div>
    </form></OrderDialog>}
    {modal?.type === 'details' && currentOrder && <OrderDialog title={`جزئیات سفارش ${currentOrder.id}`} onClose={() => setModal(null)}>
      <div className="mb-5 flex items-center justify-between"><OrderStatus status={currentOrder.status} /><span className="text-xs text-slate-400">{dateLabel(currentOrder.date)}</span></div>
      <dl className="grid grid-cols-2 gap-5 rounded-2xl bg-slate-50 p-5">{[['مشتری', currentOrder.customer], ['شماره موبایل', currentOrder.phone], ['محصول', currentOrder.product], ['تعداد', number(currentOrder.quantity)], ['قیمت واحد', money(currentOrder.price)], ['مبلغ کل', money(currentOrder.amount)]].map(([label, value]) => <div key={label}><dt className="text-xs text-slate-400">{label}</dt><dd className="mt-2 text-sm font-semibold text-slate-800">{value}</dd></div>)}<div className="col-span-2"><dt className="text-xs text-slate-400">آدرس تحویل</dt><dd className="mt-2 text-sm leading-7 text-slate-700">{currentOrder.address}</dd></div></dl>
      <label className="mt-5 block text-sm font-semibold text-slate-700">تغییر وضعیت سفارش<select value={currentOrder.status} onChange={(event) => updateStatus([currentOrder.id], event.target.value)} className={`${inputClass} mt-2`}>{Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
      <button type="button" onClick={() => setModal({ type: 'delete', ids: [currentOrder.id] })} className="mt-5 flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"><Trash2 size={16} />حذف سفارش</button>
    </OrderDialog>}
    {modal?.type === 'delete' && <OrderDialog title="حذف سفارش" onClose={() => setModal(null)}><p className="text-sm leading-8 text-slate-600">آیا می‌خواهی {number(modal.ids.length)} سفارش انتخاب‌شده را حذف کنی؟ این تغییر قابل بازگشت نیست.</p><div className="mt-6 flex gap-2"><button type="button" onClick={() => { setOrders((current) => current.filter((order) => !modal.ids.includes(order.id))); setSelected((current) => current.filter((id) => !modal.ids.includes(id))); setModal(null); setNotice('سفارش‌های انتخاب‌شده حذف شدند.') }} className="rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-700">حذف سفارش</button><button type="button" onClick={() => setModal(null)} className={buttonClass}>انصراف</button></div></OrderDialog>}
  </div>
}
