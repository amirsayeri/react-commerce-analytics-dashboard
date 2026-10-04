export const statusLabels = { processing: 'در حال پردازش', paid: 'پرداخت‌شده', shipped: 'ارسال‌شده', delivered: 'تحویل‌شده', cancelled: 'لغوشده', refunded: 'بازپرداخت‌شده' }

function normalize(value) {
  return String(value ?? '').replace(/ي/g, 'ی').replace(/ك/g, 'ک').replace(/[۰-۹]/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)).replace(/[٠-٩]/g, (digit) => '٠١٢٣٤٥٦٧٨٩'.indexOf(digit)).replace(/\u200c/g, ' ').toLowerCase().trim()
}

export function selectOrders(orders, { query = '', status = 'all', from = '', to = '', sort = 'newest' } = {}) {
  const search = normalize(query)
  return orders.filter((order) => (
    (!search || normalize([order.id, order.customer, order.phone, order.product, statusLabels[order.status]].join(' ')).includes(search)) &&
    (status === 'all' || order.status === status) && (!from || order.date >= from) && (!to || order.date <= to)
  )).sort((a, b) => {
    if (sort === 'amount-desc') return b.amount - a.amount
    if (sort === 'amount-asc') return a.amount - b.amount
    const byDate = a.date.localeCompare(b.date) || a.id.localeCompare(b.id, 'en', { numeric: true })
    return sort === 'oldest' ? byDate : -byDate
  })
}

export function paginateOrders(orders, requestedPage = 1, pageSize = 5) {
  const size = Math.max(1, Math.floor(pageSize) || 5)
  const pages = Math.max(1, Math.ceil(orders.length / size))
  const page = Math.min(pages, Math.max(1, Math.floor(requestedPage) || 1))
  return { items: orders.slice((page - 1) * size, page * size), page, pages, total: orders.length }
}

export function createOrder(input, orders) {
  const customer = input.customer?.trim()
  const product = input.product?.trim()
  const phone = normalize(input.phone)
  const address = input.address?.trim()
  const quantity = Number(input.quantity)
  const price = Number(input.price)
  if (!customer || !product || !address || !/^09\d{9}$/.test(phone)) throw new Error('نام، محصول، آدرس و شماره موبایل معتبر را وارد کنید.')
  if (!Number.isInteger(quantity) || quantity < 1 || !Number.isSafeInteger(price) || price <= 0 || !Number.isSafeInteger(price * quantity)) throw new Error('تعداد باید عدد صحیح مثبت و قیمت باید مبلغی معتبر به تومان باشد.')
  if (!statusLabels[input.status]) throw new Error('وضعیت سفارش معتبر نیست.')
  const nextId = Math.max(8492, ...orders.map((order) => Number(order.id.replace(/\D/g, '')) || 0)) + 1
  return { id: `#ORD-${nextId}`, customer, product, phone, address, quantity, price, amount: price * quantity, status: input.status, date: new Date().toLocaleDateString('en-CA') }
}

export function ordersToCsv(orders) {
  const cell = (value) => {
    let text = String(value ?? '')
    if (/^[\s]*[=+@-]/.test(text)) text = `'${text}`
    return `"${text.replace(/"/g, '""')}"`
  }
  const rows = [['شماره سفارش', 'مشتری', 'موبایل', 'محصول', 'مبلغ (تومان)', 'وضعیت', 'تاریخ'], ...orders.map((order) => [order.id, order.customer, order.phone, order.product, order.amount, statusLabels[order.status], order.date])]
  return '\uFEFF' + rows.map((row) => row.map(cell).join(',')).join('\r\n')
}

export const sampleOrders = [
  ['مریم احمدی', 'چراغ رومیزی نوردیک', 2490000, 'paid', 'تهران، خیابان ولیعصر', 1],
  ['علی رضایی', 'صندلی راحتی مینیمال', 4890000, 'processing', 'اصفهان، خیابان چهارباغ', 1],
  ['زهرا محمدی', 'میز جلو مبلی بلوط', 3290000, 'shipped', 'شیراز، بلوار چمران', 1],
  ['محمد حسینی', 'ست گلدان سرامیکی', 1190000, 'refunded', 'مشهد، بلوار سجاد', 2],
  ['سارا کریمی', 'شال مبل کتانی', 890000, 'processing', 'تبریز، خیابان آبرسان', 1],
  ['رضا موسوی', 'چراغ رومیزی نوردیک', 2490000, 'delivered', 'رشت، خیابان گلسار', 2],
  ['نگار مرادی', 'صندلی راحتی مینیمال', 4890000, 'cancelled', 'تهران، خیابان شریعتی', 1],
  ['امیر کاظمی', 'میز جلو مبلی بلوط', 3290000, 'paid', 'کرج، بلوار طالقانی', 1],
  ['نیلوفر جعفری', 'ست گلدان سرامیکی', 1190000, 'shipped', 'یزد، خیابان کاشانی', 1],
  ['حسین نادری', 'شال مبل کتانی', 890000, 'delivered', 'کرمان، بلوار جمهوری', 3],
  ['فاطمه رحیمی', 'چراغ رومیزی نوردیک', 2490000, 'paid', 'قزوین، خیابان خیام', 1],
  ['پارسا اکبری', 'ست گلدان سرامیکی', 1190000, 'processing', 'اهواز، کیانپارس', 1],
].map(([customer, product, price, status, address, quantity], index) => {
  const date = new Date()
  date.setDate(date.getDate() - index * 2)
  return { id: `#ORD-${8492 - index}`, customer, product, price, quantity, amount: price * quantity, status, address, phone: `0912${String(3456700 + index)}`, date: date.toLocaleDateString('en-CA') }
})
