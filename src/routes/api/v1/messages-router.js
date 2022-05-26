/**
 * Messages routes.
 *
 * @author Emilia Hansson <eh222yn@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import { MessagesController } from '../../../controllers/api/messages-controller.js'

export const router = express.Router()

const controller = new MessagesController()

router.param('id', (req, res, next, id) => controller.loadMessages(req, res, next, id))

router.post('/', (req, res, next) => controller.create(req, res, next))

router.get('/:id', (req, res, next) => controller.find(req, res, next))
