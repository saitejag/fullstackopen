const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.startsWith('Bearer ')) {
//     return authorization.replace('Bearer ', '')
//   }
//   return null
// }

blogsRouter.get('/', async (request, response) => {
  // Blog.find({}).then((blogs) => {
  //   response.json(blogs)
  // })
  blogs = await Blog.find({}).populate('user', {username: 1,name: 1,id: 1})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  try{
    const body = request.body
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })  
    }
    const user = await User.findById(decodedToken.id)
    if (!user) {
      return response.status(400).json({ error: 'userId missing or not valid' })
    }    
    const blog = new Blog({...request.body,user: user._id})
    const result = await blog.save()
    user.blogs = user.blogs.concat(result._id)
    await user.save()
    response.status(201).json(result)
  }
  catch (exception){
    // response.status(400).json({ error: 'Bad Request', message: exception.message })
    next(exception)
  }

  // blog.save().then((result) => {
  //   response.status(201).json(result)
  // })
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try{
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })  
    }

    const blog = await Blog.findById(request.params.id)

    if(blog.user.toString() == decodedToken.id){
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).send()
    }
    else{
      response.status(401).json({error: 'wrong user'})
    }

  }
  catch (exception){
    // response.status(204).send()
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const {title, author, url, likes} = request.body
  try{
    const result = await Blog.findById(request.params.id)
    if(!result){
      return response.status(404).send()
    }
    else{
      result.title = title
      result.author = author
      result.url = url
      result.likes = likes
      updatedresult = await result.save()
      return response.json(updatedresult)
    }
  }
  catch (exception){
    next(error)
  }
})

module.exports = blogsRouter