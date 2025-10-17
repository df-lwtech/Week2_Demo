const http = require('http')
const fetch = require('node-fetch')

async function wait(ms){return new Promise(r=>setTimeout(r,ms))}

async function run(){
  // give the server a moment to start
  await wait(500)
  const base = 'http://localhost:3000'
  console.log('POST /items')
  let res = await fetch(base + '/items', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ name: 'Test', description: 'desc' })})
  console.log('status', res.status)
  let created = await res.json()
  console.log('created', created)

  console.log('GET /items')
  res = await fetch(base + '/items')
  console.log('status', res.status)
  console.log('body', await res.json())

  const id = created.id
  console.log('GET /items/' + id)
  res = await fetch(base + '/items/' + id)
  console.log('status', res.status)
  console.log('body', await res.json())

  console.log('PUT /items/' + id)
  res = await fetch(base + '/items/' + id, { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name: 'Updated', description: 'updated desc'})})
  console.log('status', res.status)
  console.log('body', await res.json())

  console.log('DELETE /items/' + id)
  res = await fetch(base + '/items/' + id, { method: 'DELETE' })
  console.log('status', res.status)

  process.exit(0)
}

run().catch(err=>{console.error(err); process.exit(1)})
