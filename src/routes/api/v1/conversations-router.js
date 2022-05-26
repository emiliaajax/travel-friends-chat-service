/**
 * Conversations routes.
 *
 * @author Emilia Hansson <eh222yn@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import { ConversationsController } from '../../../controllers/api/conversations-controller.js'

export const router = express.Router()

const controller = new ConversationsController()

router.param('id', (req, res, next, id) => controller.loadConversations(req, res, next, id))

router.post('/', (req, res, next) => controller.create(req, res, next))

router.get('/:id', (req, res, next) => controller.find(req, res, next))
