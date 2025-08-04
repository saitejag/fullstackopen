import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete}) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [visible, setVisible] = useState(false)

  
  if(!visible){
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author}
        <button onClick={() => {setVisible(!visible)}}>view</button>
      </div>  
    )
  }
  else{
    return (
      <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={() => setVisible(!visible)}>hide</button>
      <br />
      <a href={blog.url}>{blog.url}</a>
      <br />
      likes {blog.likes}
      <button onClick={(event) => handleLike(event, blog)}>like</button>
      <p>{blog.user.name}</p>
      <button onClick={(event) => handleDelete(event, blog)} style={{ color: 'blue' }}>remove</button>
      </div>  
    )
  }
}

const BlogForm = ({handleCreate,setTitle,setAuthor,setUrl,title,author,url}) => {
  return (
    <div>
      <h2>create new</h2>
      title:<input value={title} onChange={({ target }) => setTitle(target.value)}/><br />
      author:<input value={author} onChange={({ target }) => setAuthor(target.value)}/><br />
      url:<input value={url} onChange={({ target }) => setUrl(target.value)}/><br />
      <button onClick={handleCreate}>create</button>
    </div>
  )

}

export { Blog, BlogForm };