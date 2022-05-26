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

router.post('/', (req, res, next) => controller.create(req, res, next))
