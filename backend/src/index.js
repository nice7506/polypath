import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'

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

app.listen(port, () => {
  console.log(`API ready on http://localhost:${port}`)
})
