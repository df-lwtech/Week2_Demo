const http = require('http')
const fetch = require('node-fetch')
const app = require('./app')

let server

async function wait(ms){return new Promise(r=>setTimeout(r,ms))}

async function run(){
  server = app.listen(3000)
  // give server a moment
  await wait(200)
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

  server.close()
}

run().catch(err=>{console.error(err); if (server) server.close(); process.exit(1)})
