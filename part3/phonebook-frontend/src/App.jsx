import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'

const Filter = ({handleFilterChange}) => {
  return (
    <>
      filter shown with<input onChange={handleFilterChange}/>
    </>
  )
}

const PersonForm = ({addName,newName,newNumber,handleNameChange,handleNumberChange}) => {
  return (
    <form onSubmit={addName}>
      <div>
        name: <input value={newName} onChange={handleNameChange}/>
      </div>
      <div>  
        number: <input value={newNumber} onChange={handleNumberChange}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>    
  )
}

const Phline = ({nameobj,deleteNumber}) => {
  return (
    <p>
      {nameobj.name} {nameobj.number}
      <button onClick={deleteNumber}>delete</button>
    </p>
  )
}


const Persons = ({personsToShow,deleteNumber}) => {
  return (
    <>
      {personsToShow.map(nameobj => (<Phline key={nameobj.id} nameobj={nameobj} deleteNumber={() => deleteNumber(nameobj.id)}/>))}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notifMessage, setNotifMessage] = useState(null)
  const [notifType, setNotifType] = useState('added')

  const eHook = () => {
    personService
      .getAll()
      .then(initialNames => {
        setPersons(initialNames)
      }
    )
  }
  useEffect(eHook,[])
  const addName = (event) => {
    event.preventDefault()
    const person = persons.filter(person => person.name === newName)
    // console.log(person)

    if(person.length != 0){
      // alert(`${person[0].name} is already added to phonebook`);
      if(window.confirm(`${person.name} is already added to phonebook, replace the old number with a new one?`)){
        const nameObject = {...person[0],name: newName,number: newNumber}
        personService
          .update(person[0].id,nameObject)
          .then(returnedPerson => {
            setNotifMessage(`Modified '${person[0].name}'`)
            setTimeout(() => {
              setNotifMessage(null)
            }, 5000)
            setPersons(persons.map((p) => (p.id !== person[0].id ? p : returnedPerson)))
          })
          .catch((error) => {
          setNotifMessage(`Information of '${person[0].name}' has already been removed from server`)
          setNotifType('error')
          setTimeout(() => {
            setNotifMessage(null)
            setNotifType('added')

          }, 5000)   
          setPersons(persons.filter((p) => p.id !== person[0].id))
        })
      }
    }
    else{
      const nameObject = {
        name: newName,
        number: newNumber,
      }
      personService
        .create(nameObject)
        .then(returnedName => {
          setNotifMessage(`Added '${returnedName.name}'`)
          setTimeout(() => {
            setNotifMessage(null)
          }, 5000)          
          setPersons(persons.concat(returnedName))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          setNotifMessage(error.response.data.error)
          setNotifType('error')
          setTimeout(() => {
            setNotifMessage(null)
            setNotifType('added')

          }, 5000)            
        })
    }
  }
  const handleNameChange = (event) => {
    // console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    // console.log(event.target.value)
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }    
  const personsToShow = persons.filter((person) => person.name.toLowerCase().startsWith(filter.toLowerCase()))
  const deleteNumber = (id) => {
    const person = persons.find((p) => p.id === id)
    if(window.confirm(`Delete ${person.name}?`)){
      personService
        .deleteId(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch((error) => {
          setNotifMessage(`Information of '${person.name}' has already been removed from server`)
          setNotifType('error')
          setTimeout(() => {
            setNotifMessage(null)
            setNotifType('added')

          }, 5000)   
          setPersons(persons.filter((person) => person.id !== id))
        })
    }

  }
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notifMessage} type={notifType}/>
      <Filter handleFilterChange={handleFilterChange}/>
      <h3>Add a new</h3>
      <PersonForm addName={addName} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}></PersonForm>
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} deleteNumber={deleteNumber}/>
    </div>
  )
}

export default App