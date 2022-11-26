const express = require('express')

const PORT = 3001
const app = express()
app.use(express.json())


let persons = [
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

// validate entries to phonebook
const isValidPerson = (entry) => {
    const returnObj = {
        "nameNotDuplicate": false,
        "numberExists": false
    }
    if (
        !persons.find(
            person => {
                return person.name === entry.name
            }
        )
    ) {
        returnObj.nameNotDuplicate = true
    }

    if (entry.number) {
        returnObj.numberExists = true
    }
    
    return returnObj
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

// json of all people in persons
app.get(
    '/api/persons', (request, response) => {
        response
            .json(persons)
            .status(200)
            .end()
    }
)

//single phonebook, returns status 200 if found, 204 if not
app.get(
    '/api/persons/:id', (request, response) => {

        const id = Number(request.params.id)

        const person = persons.find(
            person => {
                return person.id === id
            }
        )
        if (!person) { //person is undefined if not existing, undefined is falsey
            return (
                response
                    .status(204)
                    .end()
            )
        }

        response
            .json(person)
            .status(200)
            .end()

    }
)

// delete request response 200 if existed, 204 if resource did not exist
app.delete(
    '/api/persons/:id', (request, response) => {
        id = Number(request.params.id)
        if ( // returns false if person does not exist, undef is falsey
            !persons.find(
                person => {
                    return person.id === id
                }
            )
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
            .status(200)
            .end()
    }
)

// post requests

// new note
app.post(
    '/api/persons', (request, response) => {
        const body = request.body
        validity = isValidPerson(body)

        if (!(validity.nameNotDuplicate && validity.numberExists)) {
            if (!validity.nameNotDuplicate) {
                return (
                    response
                        .status(400)
                        .json({error: 'name must be unique'})
                )
            }
            return (
                response
                    .status(400)
                    .json({error: 'number must be added'})
            )
        }

        // generating random, valid ID
        let id = 0
        do {
            id = Math.floor(Math.random()*10000000000)
        }
        while(
            persons.find(
                person => {
                    return person.id === id
                }
            )
        )
        

        //saving person to object then adding to persons
        
        const personObj = {
            id,
            "name": body.name,
            "number": body.number
        }
        persons = persons.concat(personObj)
        response
            .status(200)
            .end()
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

