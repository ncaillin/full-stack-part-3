const mongoose = require('mongoose')

if (!(process.argv.length === 3 || process.argv.length === 5)) {
    console.log('command format: node mongo.js <password> [name number]* ([]* is optional)')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fullstack2022:${password}@cluster0.zxzh8zi.mongodb.net/phoneBook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema(
    {
        name: String,
        number: String,
    }
)
const Person = mongoose.model('Person', personSchema)

// upload person to DB
if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]
    
    mongoose
        .connect(url)
        .then(
            result => {

                const person = new Person(
                    {
                        name,
                        number
                    }
                )
                return person.save()
            }
        )
        .then(
            result => {
                console.log(`added ${name} number ${number} to phonebook`)
                return mongoose.connection.close()
            }
        )
        .catch((err) => console.log(err))

} 
// view DB
if (process.argv.length === 3) {
    mongoose
        .connect(url)
        .then(result => {
            Person.find({}).then(
                result => {
                    console.log('phonebook:')
                    result.forEach(
                        person => {
                            console.log(`${person.name} ${person.number}`)
                        }
                    )
                    mongoose.connection.close()
                }
            )
        })
        .catch((err) => console.log(err))
}

