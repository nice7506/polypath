import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'

import draftHandler from './api/draft.js'
import realizeHandler from './api/realize.js'
import executeHandler from './api/execute.js'

const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  })
})

app.get('/', (_req, res) => {
  res.json({
    message: 'Polypath backend is running',
    docs: '/health',
  })
})

// Adapt the Vercel-style handlers to Express for local dev
const wrap = (handler) => async (req, res) => {
  try {
    const url = `http://localhost${req.originalUrl || req.url}`
    const init = {
      method: req.method,
      headers: req.headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body),
    }
    const response = await handler(new Request(url, init))
    const text = await response.text()

    // copy headers through (content-type, etc.)
    response.headers.forEach((value, key) => res.setHeader(key, value))
    res.status(response.status).send(text)
  } catch (error) {
    console.error('Route error', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

app.post('/api/draft', wrap(draftHandler))
app.post('/api/realize', wrap(realizeHandler))
app.post('/api/execute', wrap(executeHandler))

app.listen(port, () => {
  console.log(`API ready on http://localhost:${port}`)
})
