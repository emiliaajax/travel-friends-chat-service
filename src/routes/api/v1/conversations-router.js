/**
 * Conversations routes.
 *
 * @author Emilia Hansson <eh222yn@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import { ConversationsController } from '../../../controllers/api/conversations-controller.js'

export const router = express.Router()

const controller = new ConversationsController()

/**
 * Authenticates the request.
 *
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 * @param {Function} next Express next middleware function.
 */
const authenticateJWT = (req, res, next) => {
  try {
    const [authenticationScheme, token] = req.headers.authorization?.split(' ')

    if (authenticationScheme !== 'Bearer') {
      throw new Error('Invalid authentication scheme')
    }

    const payload = jwt.verify(token, Buffer.from(process.env.PUBLIC_KEY, 'base64').toString('ascii'),
      {
        algorithms: 'RS256'
      })

    req.user = {
      id: payload.sub,
      profileId: payload.profile
    }

    next()
  } catch (error) {
    const err = createError(401)
    err.message = 'Access token invalid or not provided.'
    err.cause = error
    next(err)
  }
}

router.param('id', (req, res, next, id) => controller.loadConversations(req, res, next, id))

router.post('/',
  authenticateJWT,
  (req, res, next) => controller.create(req, res, next)
)

router.get('/:id',
  authenticateJWT,
  (req, res, next) => controller.authorize(req, res, next),
  (req, res, next) => controller.find(req, res, next)
)
