import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import { createClient } from '@supabase/supabase-js'

import draftHandler from './api/draft.js'
import realizeHandler from './api/realize.js'
import executeHandler from './api/execute.js'
import refineHandler from './api/refine.js'
import selectAgentHandler from './api/select-agent.js'
import resumeUploadHandler from './api/resume-upload.js'
import resumeGenerateHandler from './api/resume-generate.js'
import jobSearchHandler from './api/jobs-search.js'
import roadmapJobsHandler from './api/roadmap-jobs.js'

type VercelHandler = (req: Request) => Promise<Response>

const app = express()
const port = process.env.PORT || 4000

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/health', (_req: any, res: any) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  })
})

app.get('/', (_req: any, res: any) => {
  res.json({
    message: 'Polypath backend is running',
    docs: '/health',
  })
})

// Adapt the Vercel-style handlers to Express for local dev
const wrap =
  (handler: VercelHandler) =>
  async (req: any, res: any): Promise<void> => {
    try {
      const url = `http://localhost${req.originalUrl || req.url}`
      const init: RequestInit = {
        method: req.method,
        headers: req.headers as any,
        body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body),
      }
      const response = await handler(new Request(url, init))
      const text = await response.text()

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
app.post('/api/refine', wrap(refineHandler))
app.post('/api/roadmaps/:id/select-agent', wrap(selectAgentHandler))
app.post('/api/resume/upload', wrap(resumeUploadHandler))
app.post('/api/resume/generate', wrap(resumeGenerateHandler))
app.post('/api/jobs/search', wrap(jobSearchHandler))
app.post('/api/roadmaps/:id/jobs', wrap(roadmapJobsHandler))

// List roadmaps for a given user (dashboard)
app.get('/api/my-roadmaps', async (req: any, res: any) => {
  const userId = req.query.userId as string | undefined
  if (!userId) return res.status(400).json({ error: 'Missing userId query param' })

  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not configured on server' })
  }

  try {
    const { data, error } = await supabase
      .from('roadmaps')
      .select('id, config, final_roadmap, status, created_at')
      // filter by config.userId stored as JSON
      .eq('config->>userId', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase my-roadmaps error', error)
      return res.status(500).json({ error: 'Failed to load roadmaps' })
    }

    return res.json(data || [])
  } catch (err: any) {
    console.error('My roadmaps fetch error', err)
    return res.status(500).json({ error: err?.message || 'Failed to load roadmaps' })
  }
})

// Public roadmap fetch by ID (for sharing)
app.get('/api/roadmaps/:id', async (req: any, res: any) => {
  const { id } = req.params
  if (!id) return res.status(400).json({ error: 'Missing roadmap id' })

  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not configured on server' })
  }

  try {
    const { data, error, status } = await supabase
      .from('roadmaps')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (status === 406 || status === 404) {
        return res.status(404).json({ error: 'Roadmap not found' })
      }
      console.error('Supabase roadmap fetch error', error)
      return res.status(500).json({ error: 'Failed to load roadmap' })
    }

    if (!data) {
      return res.status(404).json({ error: 'Roadmap not found' })
    }

    return res.json(data)
  } catch (err: any) {
    console.error('Roadmap fetch error', err)
    return res.status(500).json({ error: err?.message || 'Failed to load roadmap' })
  }
})

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API ready on http://localhost:${port}`)
})
