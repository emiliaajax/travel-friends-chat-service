/**
 * Conversations routes.
 *
 * @author Emilia Hansson <eh222yn@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import { ConversationsController } from '../../../controllers/api/messages-controller.js'

export const router = express.Router()

const controller = new ConversationsController()
