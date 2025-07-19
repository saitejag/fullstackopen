import { useState } from 'react'

const Header = ({text}) => {
  return (
    <h1>{text}</h1>
  )
}

const Button = ({onClick,text}) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

const StatisticLine = ({text,value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({good,bad,neutral}) => {
  if(good == 0 && bad == 0 && neutral == 0){
    return (
      <div>No feedback given</div>
    )
  }
  else{
    return (
      <table>
        <tbody>
          <StatisticLine text="good" value={good}></StatisticLine>
          <StatisticLine text="bad" value={bad}></StatisticLine>
          <StatisticLine text="neutral" value={neutral}></StatisticLine>
          <StatisticLine text="average" value={(good - bad)/(good + neutral + bad)}></StatisticLine>
          <StatisticLine text="positive" value={(good*100)/(good + neutral + bad) + ' %'}></StatisticLine>
        </tbody>
      </table>
    )
  }

}
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Header text='give feedback'></Header>
      <Button onClick={()=>setGood(good+1)} text='good'></Button>
      <Button onClick={()=>setNeutral(neutral+1)} text='neutral'></Button>
      <Button onClick={()=>setBad(bad+1)} text='bad'></Button>
      <Header text='statistics'></Header>
      <Statistics good={good} bad={bad} neutral={neutral}></Statistics>
    </div>
  )
}

export default App