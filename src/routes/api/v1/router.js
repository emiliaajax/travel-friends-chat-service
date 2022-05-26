/**
 * API version 1 routes
 *
 * @author Emilia Hansson <eh222yn@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import { router as conversationsRouter } from './conversations-router.js'
import { router as messagesRouter } from './messages-router.js'

export const router = express.Router()

router.get('/', (req, res) => res.json({
  message: 'Welcome to version 1 of this API!'
}))

router.use('/', conversationsRouter)
router.use('/messages', messagesRouter)
