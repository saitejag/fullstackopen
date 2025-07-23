const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }
    return blogs.reduce(reducer,0)
}

const favoriteBlog = (blogs) => {
    const reducer = (max, blog) => {
        return blog.likes > max.likes ? blog : max;
    }
    if(blogs.length === 0)return null
    return blogs.reduce(reducer,blogs[0])
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}