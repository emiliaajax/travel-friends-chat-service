/**
 * Module for the MessagesController.
 *
 * @author Emilia Hansson <eh222yn@student.lnu.se>
 * @version 1.0.0
 */

import { Message } from '../../models/message.js'
import createError from 'http-errors'

/**
 * Encapsulates a controller.
 */
export class MessagesController {
  /**
   * Authorizes the user.
   *
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   * @param {Function} next Express next middleware function.
   * @returns {Function} Express next middleware function.
   */
  async authorize (req, res, next) {
    for (const message of req.messages) {
      if ((req.user.profileId !== message.sender) && (req.user.profileId !== message.receiver)) {
        next(createError(403))
      }
    }
    next()
  }

  /**
   * Provides req.messages to the routes if id is present.
   *
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   * @param {object} next Express next function middleware.
   * @param {string} id The value of the id.
   */
  async loadMessages (req, res, next, id) {
    try {
      const messages = await Message.find({
        conversationId: id
      })

      if (!messages) {
        return next(createError(404))
      }

      req.messages = messages

      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends a JSON response containing messages of a conversation.
   *
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   * @param {Function} next Express next middleware function.
   */
  async find (req, res, next) {
    res
      .status(200)
      .json(req.messages)
  }

  /**
   * Creates a message.
   *
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   * @param {object} next Express next function middleware.
   */
  async create (req, res, next) {
    try {
      const message = new Message(req.body)

      await message.save()

      const location = new URL(
        `${req.protocol}://${req.get('host')}${req.baseUrl}/${message._id}`
      )

      res
        .location(location.href)
        .status(201)
        .json(message)
    } catch (error) {
      next(error)
    }
  }
}
