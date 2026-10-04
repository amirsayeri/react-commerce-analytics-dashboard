import test from 'node:test'
import assert from 'node:assert/strict'
import { selectOrders, paginateOrders, createOrder, ordersToCsv } from './ordersModel.js'

const orders = [
  { id: '#ORD-101', customer: 'علی رضایی', phone: '09121234567', product: 'چراغ', status: 'paid', amount: 900000, date: '2026-10-02' },
  { id: '#ORD-102', customer: 'مریم احمدی', phone: '09351234567', product: 'صندلی', status: 'processing', amount: 2400000, date: '2026-10-03' },
  { id: '#ORD-103', customer: 'علی کریمی', phone: '09129876543', product: 'چراغ', status: 'processing', amount: 600000, date: '2026-10-04' },
]

test('search normalizes Persian digits and Arabic letters', () => {
  assert.deepEqual(selectOrders(orders, { query: 'علي' }).map((order) => order.id), ['#ORD-103', '#ORD-101'])
  assert.deepEqual(selectOrders(orders, { query: '۱۰۲' }).map((order) => order.id), ['#ORD-102'])
})

test('search, status and date filters combine', () => {
  assert.deepEqual(selectOrders(orders, { query: 'چراغ', status: 'processing', from: '2026-10-04', to: '2026-10-04' }).map((order) => order.id), ['#ORD-103'])
  assert.deepEqual(selectOrders(orders, { query: 'ناموجود' }), [])
})

test('amount sorting uses numbers without changing source data', () => {
  assert.deepEqual(selectOrders(orders, { sort: 'amount-desc' }).map((order) => order.id), ['#ORD-102', '#ORD-101', '#ORD-103'])
  assert.deepEqual(orders.map((order) => order.id), ['#ORD-101', '#ORD-102', '#ORD-103'])
})

test('pagination clamps a stale page after filtering or deletion', () => {
  assert.deepEqual(paginateOrders(orders, 9, 2), { items: [orders[2]], page: 2, pages: 2, total: 3 })
  assert.deepEqual(paginateOrders([], 9, 2), { items: [], page: 1, pages: 1, total: 0 })
})

test('new orders calculate totals and reject invalid quantities and empty customer', () => {
  const input = { customer: ' سارا ', product: 'میز', phone: '09121234567', address: 'تهران', price: '120000', quantity: '3', status: 'processing' }
  assert.equal(createOrder(input, orders).amount, 360000)
  assert.equal(createOrder(input, orders).customer, 'سارا')
  assert.notEqual(createOrder(input, orders).id, orders[0].id)
  assert.throws(() => createOrder({ ...input, quantity: 0 }, orders))
  assert.throws(() => createOrder({ ...input, quantity: 1.5 }, orders))
  assert.throws(() => createOrder({ ...input, price: -1 }, orders))
  assert.throws(() => createOrder({ ...input, customer: ' ' }, orders))
})

test('CSV preserves Persian, escapes quotes and neutralizes spreadsheet formulas', () => {
  const csv = ordersToCsv([{ ...orders[0], customer: '=SUM(1,2)', product: 'چراغ "سفید"' }])
  assert.ok(csv.startsWith('\uFEFF'))
  assert.ok(csv.includes('"\'=SUM(1,2)"'))
  assert.ok(csv.includes('"چراغ ""سفید"""'))
})
