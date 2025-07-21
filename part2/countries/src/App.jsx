import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    console.log('effect run, /api/all call')
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  useEffect(() => {
    console.log(countriesToQuery)
  },[query])

  const handleChange = (event) => {
    setQuery(event.target.value)
  }

  const countriesToQuery = countries.filter(country => country.name.common.toLowerCase().includes(query.toLowerCase()))

  const Countries = ({countriesToQuery}) => {
    if(countriesToQuery.length > 10){
      return (
        <p>
          Too many matches, specify another filter
        </p>
      )
    }
    else if(countriesToQuery.length > 1){
      return (
        countriesToQuery.map(country => <p key={country.cca2}>{country.name.common}</p>)
      )
    }
    else if(countriesToQuery.length === 1){
      return (
        <div>
          <h1>{countriesToQuery[0].name.common}</h1>
          <p>Capital {countriesToQuery[0].capital[0]}</p>
          <p>Area {countriesToQuery[0].area}</p>
          <h2>Languages</h2>
          <ul>
            {console.log(countriesToQuery[0].languages)}
            {Object.values(countriesToQuery[0].languages).map((lang) => <li key={lang}>{lang}</li>)}
          </ul>
          <img src={countriesToQuery[0].flags.png}></img>
        </div>

      )
    }
  }

  return (
    <div>
      find countries<input onChange={handleChange}/>
      <Countries countriesToQuery={countriesToQuery} />
    </div>
  )
}

export default App