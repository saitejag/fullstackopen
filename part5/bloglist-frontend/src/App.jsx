import { useState, useEffect, useRef } from 'react'
import { Blog, BlogForm } from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'


const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [url, setUrl] = useState('')
  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [user, setUser] = useState(null)
  const [notifMessage, setNotifMessage] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs( blogs )

    }
    )
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      console.log(user)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      // setErrorMessage('Wrong credentials')
      // setTimeout(() => {
      //   setErrorMessage(null)
      // }, 5000)
      setNotifMessage('wrong username or password')
      setTimeout(() => {
        setNotifMessage(null)
      }, 5000)
      console.log(exception)
    }
  }

  const handleLogout = async (event) => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    const blogObj = {
      'title':title,
      'author':author,
      'url':url,
      'likes':0
    }
    try{
      const resp = await blogService.create(blogObj)
      blogFormRef.current.toggleVisibility()
      console.log(resp)

      setBlogs(blogs.concat(resp).sort((a, b) => b.likes - a.likes))
      setTitle('')
      setAuthor('')
      setUrl('')
      setNotifMessage(resp.title + ' by ' + resp.author + ' added')
      setTimeout(() => {
        setNotifMessage(null)
      }, 5000)
    }
    catch (exception){
      console.log(exception)
      setNotifMessage(exception)
      setTimeout(() => {
        setNotifMessage(null)
      }, 5000)
    }
  }

  const handleLike = (event, blog) => {
    event.preventDefault()
    try{
      const newObj = { ...blog, likes: blog.likes + 1 }
      blogService.update(blog.id, newObj)
      const updatedBlogs = blogs.map(b => b.id === blog.id ? { ...b, likes: blog.likes + 1 } : b)
      updatedBlogs.sort((a, b) => b.likes - a.likes)
      setBlogs(updatedBlogs)
    }
    catch(exception){
      console.log(exception)
    }
  }

  const handleDelete = async (event, blog) => {
    event.preventDefault()
    if(window.confirm(`Remove ${blog.title} by ${blog.author}?`)){
      try{
        await blogService.remove(blog.id)
        const updatedBlogs = blogs.filter(b => b.id !== blog.id)
        setBlogs(updatedBlogs)
      }
      catch(exception){
        console.log(exception)
      }
    }
  }

  const blogDiv = () => (
    <div>
      <h2>blogs</h2>
      <Notification message={notifMessage} type="noti"/>
      {user.name} logged in<button onClick={handleLogout}>logout</button>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} handleLike={handleLike}  handleDelete={handleDelete}/>
      )}
      <Togglable buttonLabel="new note" ref={blogFormRef}>
        <BlogForm handleCreate={handleCreate} setTitle={setTitle} setAuthor={setAuthor} setUrl={setUrl} title={title} url={url} author={author}/>
      </Togglable>
    </div>
  )

  const loginForm = () => {
    return (
      <Togglable buttonLabel="login">
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </Togglable>
    )
  }

  return (
    <div>
      <Notification message={notifMessage} type="noti"/>
      {user === null?loginForm():blogDiv()}
    </div>
  )
}

export default App