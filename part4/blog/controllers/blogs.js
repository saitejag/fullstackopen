const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  // Blog.find({}).then((blogs) => {
  //   response.json(blogs)
  // })
  blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  try{
    const blog = new Blog(request.body)
    const result = await blog.save()
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
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).send()
  }
  catch (exception){
    // response.status(204).send()
    next(error)
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