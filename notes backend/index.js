require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
var cors = require('cors')
const Person = require('./models/person')
const person = require('./models/person')


const PORT = process.env.PORT || 8080
var app = express()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(
    morgan( //morgan for logging of requests
        (tokens, request, response) => {
            return [
                tokens.method(request, response),
                tokens.url(request, response),
                tokens.status(request, response),
                tokens.res(request, response, 'content-length'), '-',
                tokens['response-time'](request, response), 'ms',
                tokens.data(request, response)
            ].join(' ')
        }
    )
)

// default val for data so requests other than POST don't show {}
morgan.token(
    'data',
    (request, response) => {
        return ""
    }
)


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


// json of all people in persons
app.get(
    '/api/persons', (request, response) => {

        Person.find({})
            .then(
                persons => {
                    response.json(persons)
                }
            )
            .catch((err) => console.log(err.message))
    }
)

//single phonebook, returns status 200 if found, 204 if not
app.get(
    '/api/persons/:id', (request, response) => {

        Person
            .findById(request.params.id)
            .then(
                result => {
                    response.json(result)
                }
            )
            .catch(err => {
                console.log('person not found')
                response
                    .status(204)
                    .end()
            })
    }
)

// delete request response 200 if existed, 204 if resource did not exist
app.delete(
    '/api/persons/:id', (request, response) => {
        id = Number(request.params.id)

        personToRemove = persons.find(
            person => {
                return person.id === id
            }
        )

        if ( // returns false if person does not exist, undef is falsey
            !personToRemove
        ) {
            return (
                response
                    .status(204)
                    .end()
            )
        }
        persons = persons.filter(
            person => {
                return person.id !== id
            }
        )
        response
            .send(`${JSON.stringify(personToRemove)}`)
            .status(200)
            .end()
    }
)

// post requests

// new note
app.post(
    '/api/persons', (request, response) => {

        morgan.token( // morgan token to display content
            'data',
            (request, response) => {
                return JSON.stringify(request.body)
            }
        )

        const body = request.body

        //saving person to object then adding to persons
        const person = new Person(
            {
                name: body.name,
                number: body.number,
            }
        )
        person
            .save()
            .then(savedPerson => {
                response.json(savedPerson)
            })
            .catch((err) => console.log(err.message))
    }
)


// info page
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
    PORT, () => {5
        console.log(`\x1b[35mPhonebook backend running on port ${PORT}\x1b[0m`)
    }
)

