const express = require('express')
const morgan = require('morgan')
// const cors = require('cors')

const app = express()

// app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('tiny'))

let phonebook = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get('/api/persons', (request, response) => {
  response.json(phonebook)
})

app.get('/info',(request, response) => {
    const now = new Date();
    response.end(`Phone book has info for ${phonebook.length} people\n${now}`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = phonebook.find(person => person.id === id)
  if (person) {
    response.json(person)
  }
  else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  phonebook = phonebook.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  return String(Math.floor(Math.random() * 1000000000))
}

app.post('/api/persons', (request, response) => {
  const body = request.body
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
  else if (phonebook.map(p => p.name).includes(body.name)) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }  

  const person = {
    name: body.name,
    number: body.number || '',
    id: generateId(),
  }

  phonebook = phonebook.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
