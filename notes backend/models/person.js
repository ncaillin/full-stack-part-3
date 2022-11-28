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
        name: String,
        number: String
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
