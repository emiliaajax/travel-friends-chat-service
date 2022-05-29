/**
 * The starting point of the application.
 *
 * @author Emilia Hansson <eh222yn@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import logger from 'morgan'
import { router } from './routes/router.js'
import { connectDB } from './config/mongoose.js'
import helmet from 'helmet'
import cors from 'cors'
import { Server } from 'socket.io'
import { createServer } from 'http'

try {
  // Connects to MongoDB.
  await connectDB()

  // Creates an Express application.
  const app = express()

  const server = createServer(app)

  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000'
    }
  })

  // https://github.com/safak/youtube/blob/chat-app/socket/index.js

  // Users array
  let users = []

  /**
   * Add connected user.
   *
   * @param {string} userId The user id.
   * @param {string} socketId The socket id.
   */
  const addUser = (userId, socketId) => {
    if (!users.some(user => user.userId === userId)) {
      users.push({ userId, socketId })
    }
  }

  /**
   * Remove disconnected user.
   *
   * @param {string} socketId The socket id.
   */
  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId)
  }

  /**
   * Get user.
   *
   * @param {string} userId The user id.
   * @returns {object} The user with user id.
   */
  const getUser = (userId) => {
    return users.find(user => user.userId === userId)
  }

  io.on('connection', (socket) => {
    console.log('A user connected')

    socket.on('addUser', (userId) => {
      addUser(userId, socket.id)
      io.emit('getUsers', users)
    })

    socket.on('sendMessage', ({ senderId, receiverId, message }) => {
      const user = getUser(receiverId)
      io.to(user?.socketId).emit('getMessage', {
        senderId,
        message
      })
    })

    socket.on('disconnect', () => {
      console.log('A user disconnected')
      removeUser(socket.id)
      io.emit('getUsers', users)
    })
  })

  // Sets HTTP headers to make application more secure.
  app.use(helmet())

  // Sets cors
  app.use(cors())

  // Sets up a morgan logger using the dev format for log entries.
  app.use(logger('dev'))

  // Parses requests of the content type application/json.
  app.use(express.json({ limit: '50mb' }))

  // Registers routes.
  app.use('/', router)

  // Error handler.
  app.use(function (err, req, res, next) {
    err.status = err.status || 500

    if (req.app.get('env') !== 'development') {
      return res
        .status(err.status)
        .json({
          status: err.status,
          message: err.message
        })
    }

    // Development only!
    return res
      .status(err.status)
      .json({
        status: err.status,
        message: err.message,
        cause: err.cause
          ? {
              status: err.cause.status,
              message: err.cause.message,
              stack: err.cause.stack
            }
          : null,
        stack: err.stack
      })
  })

  // Starts the HTTP server listening for connections.
  server.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
    console.log('Press Ctrl-C to terminate...')
  })
} catch (error) {
  console.error(error)
  process.exitCode = 1
}
