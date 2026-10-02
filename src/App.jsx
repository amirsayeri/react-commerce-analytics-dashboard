import { useMemo, useState } from 'react'
import {
  ArrowDownRight, ArrowUpRight, Bell, Boxes, CalendarDays, ChevronDown,
  CircleDollarSign, CreditCard, LayoutDashboard, Menu, PackageSearch, Search,
  ShoppingBag, TrendingUp, Users, X,
} from 'lucide-react'
import {
  Area, AreaChart, CartesianGrid, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts'

const salesData = [
  { day: 'Mon', revenue: 8200, orders: 98 },
  { day: 'Tue', revenue: 9400, orders: 121 },
  { day: 'Wed', revenue: 7600, orders: 102 },
  { day: 'Thu', revenue: 11200, orders: 146 },
  { day: 'Fri', revenue: 12800, orders: 165 },
  { day: 'Sat', revenue: 15400, orders: 193 },
  { day: 'Sun', revenue: 13900, orders: 174 },
]

const channelData = [
  { name: 'Online Store', value: 46, fill: '#4f46e5' },
  { name: 'Mobile', value: 31, fill: '#0f172a' },
  { name: 'Marketplace', value: 23, fill: '#10b981' },
]

const orders = [
  { id: '#ORD-8492', customer: 'Amelia Stone', product: 'Nordic Desk Lamp', amount: '$249.00', status: 'Paid' },
  { id: '#ORD-8491', customer: 'Noah Carter', product: 'Minimal Lounge Chair', amount: '$489.00', status: 'Processing' },
  { id: '#ORD-8490', customer: 'Mia Clark', product: 'Oak Coffee Table', amount: '$329.00', status: 'Paid' },
  { id: '#ORD-8489', customer: 'Liam Brooks', product: 'Ceramic Vase Set', amount: '$119.00', status: 'Refunded' },
  { id: '#ORD-8488', customer: 'Ava Bennett', product: 'Soft Linen Throw', amount: '$89.00', status: 'Processing' },
]

const products = [
  { name: 'Minimal Lounge Chair', sold: 129, revenue: '$18.4k', stock: 18 },
  { name: 'Nordic Desk Lamp', sold: 104, revenue: '$13.9k', stock: 32 },
  { name: 'Oak Coffee Table', sold: 88, revenue: '$11.2k', stock: 11 },
]

const metrics = [
  { label: 'Revenue', value: '$84,260', delta: '+12.8%', trend: 'up', icon: CircleDollarSign },
  { label: 'Orders', value: '1,284', delta: '+8.4%', trend: 'up', icon: ShoppingBag },
  { label: 'Customers', value: '3,642', delta: '+5.1%', trend: 'up', icon: Users },
  { label: 'Conversion', value: '4.82%', delta: '-0.6%', trend: 'down', icon: TrendingUp },
]

function MetricCard({ metric }) {
  const Icon = metric.icon
  const TrendIcon = metric.trend === 'up' ? ArrowUpRight : ArrowDownRight
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white"><Icon size={20} /></div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${metric.trend === 'up' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
          <TrendIcon size={13} />{metric.delta}
        </span>
      </div>
      <div className="mt-6">
        <p className="text-sm font-medium text-slate-500">{metric.label}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">{metric.value}</p>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = { Paid: 'bg-emerald-50 text-emerald-700', Processing: 'bg-amber-50 text-amber-700', Refunded: 'bg-rose-50 text-rose-700' }
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>{status}</span>
}

function Sidebar({ open, onClose }) {
  const items = [
    [LayoutDashboard, 'Overview', true], [ShoppingBag, 'Orders'], [PackageSearch, 'Products'],
    [Users, 'Customers'], [Boxes, 'Inventory'], [CreditCard, 'Payments'],
  ]
  return (
    <>
      {open && <button onClick={onClose} className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm lg:hidden" aria-label="Close navigation overlay" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white px-5 py-6 transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-600 font-black text-white">C</div>
            <div><p className="font-bold text-slate-950">CommerceIQ</p><p className="text-xs text-slate-400">Analytics workspace</p></div>
          </div>
          <button className="rounded-xl p-2 text-slate-500 lg:hidden" onClick={onClose}><X size={20} /></button>
        </div>
        <nav className="mt-10 space-y-2">
          {items.map(([Icon, label, active]) => (
            <button key={label} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${active ? 'bg-slate-950 text-white shadow-lg shadow-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-950'}`}>
              <Icon size={18} />{label}
            </button>
          ))}
        </nav>
        <div className="mt-auto rounded-3xl bg-slate-950 p-5 text-white">
          <p className="text-sm font-semibold">Monthly goal</p>
          <div className="mt-4 h-2 rounded-full bg-white/10"><div className="h-2 w-3/4 rounded-full bg-emerald-400" /></div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-300"><span>$84.2k</span><span>$110k target</span></div>
        </div>
      </aside>
    </>
  )
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [period, setPeriod] = useState('Last 7 days')
  const [search, setSearch] = useState('')
  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase().trim()
    if (!query) return orders
    return orders.filter((order) => [order.id, order.customer, order.product, order.status].join(' ').toLowerCase().includes(query))
  }, [search])

  return (
    <div className="min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-slate-50/80 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 lg:hidden" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
              <div><h1 className="text-lg font-bold text-slate-950 sm:text-xl">Analytics Overview</h1><p className="hidden text-sm text-slate-500 sm:block">Monitor store performance and recent activity.</p></div>
            </div>
            <div className="flex items-center gap-2">
              <button className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600"><Bell size={18} /></button>
              <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 sm:flex">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-indigo-100 text-xs font-bold text-indigo-700">JD</div>
                <div className="leading-tight"><p className="text-sm font-semibold text-slate-900">Jordan Davis</p><p className="text-xs text-slate-400">Store admin</p></div>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-600">Dashboard</p>
              <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Store performance</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">A compact e-commerce analytics dashboard built with React, Tailwind CSS and Recharts.</p>
            </div>
            <button className="flex h-11 items-center gap-2 self-start rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm sm:self-auto">
              <CalendarDays size={17} />
              <select value={period} onChange={(e) => setPeriod(e.target.value)} className="appearance-none bg-transparent outline-none">
                <option>Last 7 days</option><option>Last 30 days</option><option>Last 90 days</option>
              </select>
              <ChevronDown size={15} />
            </button>
          </section>

          <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}</section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.55fr_0.85fr]">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-soft sm:p-6">
              <div className="mb-6 flex items-center justify-between">
                <div><h3 className="font-bold text-slate-950">Revenue trend</h3><p className="mt-1 text-sm text-slate-500">Daily revenue for {period.toLowerCase()}.</p></div>
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">+12.8%</span>
              </div>
              <div className="h-[310px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                    <defs><linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4f46e5" stopOpacity={0.28} /><stop offset="100%" stopColor="#4f46e5" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 16px 40px rgba(15, 23, 42, 0.12)' }} formatter={(v) => [`$${v.toLocaleString()}`, 'Revenue']} />
                    <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fill="url(#revenueGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-soft sm:p-6">
              <div><h3 className="font-bold text-slate-950">Sales channels</h3><p className="mt-1 text-sm text-slate-500">Order distribution by source.</p></div>
              <div className="mt-5 h-[220px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={channelData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={86} paddingAngle={4} /><Tooltip /></PieChart></ResponsiveContainer></div>
              <div className="space-y-3">{channelData.map((channel) => (
                <div key={channel.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: channel.fill }} /><span className="text-slate-600">{channel.name}</span></div>
                  <span className="font-semibold text-slate-950">{channel.value}%</span>
                </div>
              ))}</div>
            </div>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-soft">
              <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div><h3 className="font-bold text-slate-950">Recent orders</h3><p className="mt-1 text-sm text-slate-500">Latest customer purchases.</p></div>
                <label className="flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 sm:w-64"><Search size={17} className="text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" placeholder="Search orders..." /></label>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left">
                  <thead><tr className="border-b border-slate-100 bg-slate-50/70 text-xs uppercase tracking-wide text-slate-400"><th className="px-6 py-4 font-semibold">Order</th><th className="px-6 py-4 font-semibold">Customer</th><th className="px-6 py-4 font-semibold">Product</th><th className="px-6 py-4 font-semibold">Amount</th><th className="px-6 py-4 font-semibold">Status</th></tr></thead>
                  <tbody>{filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-100 last:border-0"><td className="px-6 py-4 text-sm font-semibold text-slate-950">{order.id}</td><td className="px-6 py-4 text-sm text-slate-600">{order.customer}</td><td className="px-6 py-4 text-sm text-slate-600">{order.product}</td><td className="px-6 py-4 text-sm font-semibold text-slate-950">{order.amount}</td><td className="px-6 py-4"><StatusBadge status={order.status} /></td></tr>
                  ))}</tbody>
                </table>
                {filteredOrders.length === 0 && <div className="px-6 py-10 text-center text-sm text-slate-500">No orders match your search.</div>}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-soft sm:p-6">
              <div className="flex items-center justify-between"><div><h3 className="font-bold text-slate-950">Top products</h3><p className="mt-1 text-sm text-slate-500">Best sellers this week.</p></div><PackageSearch size={20} className="text-slate-400" /></div>
              <div className="mt-6 space-y-5">{products.map((product, index) => (
                <div key={product.name}>
                  <div className="flex items-start gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-slate-100 text-sm font-bold text-slate-500">{index + 1}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-950">{product.name}</p><p className="mt-1 text-xs text-slate-400">{product.sold} sold · {product.stock} in stock</p></div><span className="text-sm font-bold text-slate-950">{product.revenue}</span></div>
                  <div className="mt-3 h-1.5 rounded-full bg-slate-100"><div className="h-1.5 rounded-full bg-indigo-600" style={{ width: `${82 - index * 15}%` }} /></div>
                </div>
              ))}</div>
              <button className="mt-7 w-full rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">View product report</button>
            </div>
          </section>
          <footer className="py-7 text-center text-xs text-slate-400">React Commerce Analytics Dashboard · Portfolio Project</footer>
        </div>
      </main>
    </div>
  )
}
