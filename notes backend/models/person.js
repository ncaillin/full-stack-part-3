const mongoose = require('mongoose')

const url = process.env.MONGODB_URL

console.log('connecting to', url)

mongoose.connect(url)
    .then(
        result => {
            console.log('connected to MongoDB')
        }
    )
    .catch((error) => {
        console.log('error connecting to MongoDB', error.message)
    })

const personSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            minLength: 3,
            required: true
        },
        number: {
            type: String,
            validate: {
                validator: v => {
                    return /^\d{2,3}(-)\d*$/.test(v)
                },
                message: 'number not in valid format'
            },
            required: true
        }
    }
)

personSchema.set('toJSON' , {
    transform: (document, returnedObj) => {
        returnedObj.id = document._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
    }
})


module.exports = mongoose.model('Person', personSchema)
