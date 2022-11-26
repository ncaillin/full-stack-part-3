const express = require('express')

const PORT = 3001
const app = express()


const persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// processing
const info = () => {
    const numPeople = persons.length
    const date = new Date()

    return (
        {
            numPeople,
            date
        }
    )
}


// get requests

// preventing favicon.ico error
app.get(
    '/favicon.ico', (request, response) => {
        response
            .status(204)
            .end()
    }
)


app.get(
    '/api/persons', (request, response) => {
        response
            .json(persons)
            .status(200)
            .end()
    }
)

app.get(
    '/info', (request, response) => {
        const reqInfo = info()
        response.write(`<p>Phonebook has info for ${reqInfo.numPeople} people</p>`)
        response.write(`<p>${reqInfo.date}</p>`)
        response.status(200)
        response.end()
    }
)



// server setup

app.listen(
    PORT, () => {
        console.log(`Phonebook backend running on port ${PORT}`)
    }
)

