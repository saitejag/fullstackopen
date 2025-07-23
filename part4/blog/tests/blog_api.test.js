const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const helper = require('./test_helper')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('get all users',async () => {
    response = await api.get('/api/users')
    assert.strictEqual(response.body[0].username,'root')
  })
  
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('Username minLength = 3', async () => {

    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ab',
      name: 'abc',
      password: 'abc',
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await helper.usersInDb()

    assert(result.body.error.includes('User validation failed: username: Path `username` (`ab`) is shorter than the minimum allowed length (3).'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('Password minLength = 3', async () => {

    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'abc',
      name: 'abc',
      password: 'ab',
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await helper.usersInDb()

    assert(result.body.error.includes('Password length should be >= 3'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })  

})

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('Blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('Blogs have an unique identifier named id', async () => {
  const response = await api.get('/api/blogs')
  assert.ok('id' in response.body[0])
})

test('a valid blag can be added ', async () => {
  const newBlog = {
    title: "ABCD",
    author: "DEF",
    url: "a.com",
    likes: "10"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)


  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)


  const contents = blogsAtEnd.map(n => n.title)
  assert(contents.includes('ABCD'))
})

test('Default likes set to zero', async () => {
  const newBlog = {
    title: "ABCD",
    author: "DEF",
    url: "a.com"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)


  const addedBlog = await Blog.find({title: "ABCD"})
  assert.strictEqual(addedBlog[0].likes, 0)

})

test('blog without title is not added', async () => {
  const newBlog = {
    author: "DEF",
    url: "a.com"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)


  const blogsAtEnd = await helper.blogsInDb()


  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('blog without url is not added', async () => {
  const newBlog = {
    author: "DEF",
    title: "ABCD"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)


  const blogsAtEnd = await helper.blogsInDb()


  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('Delete a blog', async () => {
  const newBlog = {
    title: "ABCD",
    author: "DEF",
    url: "a.com",
    likes: "10"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const addedBlog = await Blog.find({title: "ABCD"})
  // console.log(addedBlog[0].toJSON())

  await api
    .delete(`/api/blogs/${addedBlog[0]._id}`)
    .expect(204)

  const blogsAtEnd2 = await helper.blogsInDb()
  
  assert.strictEqual(blogsAtEnd2.length, helper.initialBlogs.length)  

})

test('Update a blog', async () => {
  const newBlog = {
    title: "ABCD",
    author: "DEF",
    url: "a.com",
    likes: "10"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const addedBlog = await Blog.find({title: "ABCD"})
  // console.log(addedBlog[0].toJSON())
  
  const newBlog2 = {
    title: "ABCD",
    author: "DEF",
    url: "ab.com",
    likes: "14"
  }


  await api
    .put(`/api/blogs/${addedBlog[0]._id}`)
    .send(newBlog2)

  const updatedBlog = await Blog.findById(addedBlog[0]._id)
  // console.log(updatedBlog)
  assert.strictEqual(updatedBlog.likes, 14)  

})

after(async () => {
  await mongoose.connection.close()
})