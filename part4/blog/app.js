const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const {info, } = require('./utils/logger')
const Blog = require('./models/blog')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')

const app = express()

mongoose.connect(config.MONGODB_URI)


app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app