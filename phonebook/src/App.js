import { useEffect, useState } from 'react'
import personServices from './services/persons'



const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [notification, setNotification] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const updatePerson = () => {
    const person = persons.find(person => person.name === newName)
    const newPerson = {...person, number:newNum}
    personServices
      .updatePerson(person.id, newPerson)
      .then( // updating after PUT
        response => {
          setPersons(
            persons.map(
              person => {
                return (
                  person.id !== newPerson.id 
                    ? person 
                    : response
                )
              }
            )
          )
        }
      )
  }

  const deletePerson = (id) => {
    const person = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personServices
        .deletePerson(id)
        .catch(
          error => {
            setErrorMessage(`information of ${person.name} has already been removed from the server`)
            setTimeout(
              () => setErrorMessage(null),
              3000
            )
          }
        )
      const newPersons = persons.filter(
        person => {
          return person.id !== id
        }
      )
      setPersons(newPersons)
    }
  }

  const hook = () => {
    personServices
      .getAll()
      .then(
        initialPersons => setPersons(initialPersons)
      )
  }
  
  useEffect(hook, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (! persons.map(person => person.name).includes(newName)) {
      const personObject = {
        name: newName,
        number: newNum
      }
      
      personServices
        .create(personObject)
        .then(
          personObj => {
            setPersons(persons.concat(personObj))
          }
        )
        setNotification(`Added ${personObject.name}`)
        setTimeout(() => {
          setNotification(null)
        }, 3000)
      
    } else { // person already in db
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        updatePerson()
        setNotification(`Updated number for ${newName}`)
        setTimeout(() => {
        setNotification(null)
        }, 3000)
      }
    }
    setNewName('')
    setNewNum('')
  }

  const updateFilter = (event) => {
    setSearchTerm(event.target.value)
  }
  const updateName = (event) => {
    setNewName(event.target.value)
  }
  const updateNumber = (event) => {
    setNewNum(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <Error message={errorMessage} />
      <Filter value={searchTerm} onChange={updateFilter} />
      <h3>add a new</h3>
      <PersonForm 
        newName={newName} 
        changeName={updateName} 
        newNum={newNum} 
        changeNum={updateNumber} 
        onSubmit={addPerson}/>
      <h3>Numbers</h3>
      <Persons 
        persons={persons} 
        searchTerm={searchTerm} 
        onClick={deletePerson}
      />
    </div>
  )
}

const Persons = ({persons, searchTerm, onClick}) => {
  return (
    persons.filter(
      person => {
        return person.name.toLowerCase().includes(searchTerm.toLowerCase())
      }
    ).map(
      person => {
        return (
          <div key={person.id}>
            {person.name} {person.number}
            <button onClick={() => onClick(person.id)}>delete</button>
          </div>
        )
      }
    )
  )
}

const Filter = ({onChange, value}) => {
  return (
    <Input onChange={onChange} value={value} text='filter shown with' />
  )
}
const Input = ({onChange, value, text}) => {
  return (
    <div>
      {text}<input value={value} onChange={onChange} />
    </div>
  )
}


const PersonForm = ({newName, changeName, newNum, changeNum, onSubmit}) => {
  return (
    <form onSubmit={onSubmit}>
      <Input value={newName} onChange={changeName} text='name: ' />

      <Input value={newNum} onChange = {changeNum} text='number: ' />

      <div>
        <button type='submit'>add</button>
      </div>
      
    </form>
  )
}

const Notification = ({message}) => {
  const style = {
    color:'green',
    fontSize: 20,
    padding: 10,
    backgroundColor: 'lightgrey',
    borderSize: 2,
    borderStyle: 'solid',
    borderColor: 'green',
    borderRadius: 5,
    marginBottom: 10
  }
  if (message === null) {
    return null
  }

  return (
    <div style={style} >
      {message}
    </div>
  )
}
const Error = ({message}) => {
  const style = {
    color:'red',
    fontSize: 20,
    padding: 10,
    backgroundColor: 'lightgrey',
    borderSize: 2,
    borderStyle: 'solid',
    borderColor: 'red',
    borderRadius: 5,
    marginBottom: 10
  }
  if (message === null) {
    return null
  }

  return (
    <div style={style} >
      {message}
    </div>
  )
}

export default App
