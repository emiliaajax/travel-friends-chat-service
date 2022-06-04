/**
 * Module for the ConversationsController.
 *
 * @author Emilia Hansson <eh222yn@student.lnu.se>
 * @version 1.0.0
 */

import { Conversation } from '../../models/conversation.js'
import createError from 'http-errors'

/**
 * Encapsulates a controller.
 */
export class ConversationsController {
  /**
   * Authorizes the user.
   *
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   * @param {Function} next Express next middleware function.
   * @returns {Function} Express next middleware function.
   */
  async authorize (req, res, next) {
    if (req.user.profileId !== req.params.id) {
      next(createError(403))
    }
    next()
  }

  /**
   * Provides req.conversations to the routes if id is present.
   *
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   * @param {object} next Express next function middleware.
   * @param {string} id The value of the id.
   */
  async loadConversations (req, res, next, id) {
    try {
      const conversations = await Conversation.find({
        members: { $in: [id] }
      })

      if (!conversations) {
        return next(createError(404))
      }

      req.conversations = conversations

      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends a JSON response containing conversations of one user.
   *
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   * @param {Function} next Express next middleware function.
   */
  async find (req, res, next) {
    res
      .status(200)
      .json(req.conversations)
  }

  /**
   * Creates a conversation.
   *
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   * @param {object} next Express next function middleware.
   */
  async create (req, res, next) {
    try {
      let conversation = await Conversation.find({
        members: { $all: [req.body.senderId, req.body.receiverId] }
      })

      if (conversation.length === 0) {
        conversation = new Conversation({
          members: [req.body.senderId, req.body.receiverId]
        })

        await conversation.save()
      }

      res
        .status(201)
        .json(conversation)
    } catch (error) {
      next(error)
    }
  }
}
