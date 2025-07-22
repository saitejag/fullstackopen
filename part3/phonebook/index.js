require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const morgan = require('morgan')
// const cors = require('cors')

const app = express()

// app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('tiny'))


app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    response.json(result)
  })
})

app.get('/info',(request, response) => {
  Person.countDocuments({}).then(result => {
    const now = new Date()
    response.send(`Phone book has info for ${result} people\n${now}`)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if(person){
        response.json(person)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => {
      // console.log(error)
      // response.status(400).send({ error: 'malformatted id' })
      next(error)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => {
      next(error)
    })
})

// const generateId = () => {
//   return String(Math.floor(Math.random() * 1000000000))
// }

app.put('/api/persons/:id',(request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id,person,{ new: true })
    .then(p => {
      console.log(p)
      return response.json(p)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  //   console.log(Person.exists({name: body.name}))
  //   console.log(body)
  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }
  else if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }
  //   Person.exists({name: body.name})
  //     .then(result => {
  //         if(result){
  //             return response.status(400).json({
  //             error: 'name must be unique'
  //             })
  //         }
  //     })
  //   else if (Person.exists({name: body.name})) {
  //   else if (phonebook.map(p => p.name).includes(body.name)) {
  //     return response.status(400).json({
  //       error: 'name must be unique'
  //     })
  //   }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    console.log(savedPerson)
    response.json(savedPerson)
  }).catch(error => {next(error)})
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })

  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
