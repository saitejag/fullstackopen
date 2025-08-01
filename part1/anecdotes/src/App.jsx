import { useState } from 'react'

const Header = ({text}) => {
  return (
    <h1>{text}</h1>
  )
}

const Anecdote = ({text,votes}) => {
  return (
    <>
      {text}
      <p>has {votes} votes</p>
    </>
  )
}

const Button = ({onClick,text}) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  const [selected, setSelected] = useState(0)
  const [maxm, setMaxm] = useState({index:0,maxval:0})
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))
  const addVote = (index) => {
    const votes_copy = [...votes]
    const maxm_copy = {...maxm}
    votes_copy[index]++;
    if(maxm_copy.maxval < votes_copy[index]){
      maxm_copy.maxval = votes_copy[index];
      maxm_copy.index = index;
    }
    setVotes(votes_copy);
    setMaxm(maxm_copy);
  }   
  return (
    <div>
      <Header text='Anecdote of the day'></Header>
      <Anecdote text={anecdotes[selected]} votes = {votes[selected]}></Anecdote>
      <div>
        <Button onClick={()=>addVote(selected)} text='vote'></Button>
        <Button onClick={()=>setSelected(Math.floor(Math.random() * anecdotes.length))} text='next anecdote'></Button>
      </div>
      <Header text='Anecdote with most votes'></Header>
      <Anecdote text={anecdotes[maxm.index]} votes = {votes[maxm.index]}></Anecdote>

    </div>
  )
}

export default App