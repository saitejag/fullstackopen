const Part = (props) => {
  return (
    <p>{props.crs_prt.part} {props.crs_prt.exercise}</p>
  )
}
const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}
const Content = (props) => {
  return (
    <>
      <Part crs_prt={props.crs_prts[0]}></Part>
      <Part crs_prt={props.crs_prts[1]}></Part>
      <Part crs_prt={props.crs_prts[2]}></Part>
    </>
  )
}
const Total = (props) => {
  return (
      <p>Number of exercises {props.crs_prts[0].exercise + props.crs_prts[1].exercise + props.crs_prts[2].exercise}</p>
  )
}
const App = () => {
  const course = 'Half Stack application development'
  const course_parts = [
    {part: 'Fundamentals of React', exercise: 10},
    {part: 'Using props to pass data', exercise: 7},
    {part: 'State of a component', exercise: 14},
  ]

  return (
    <div>
      <Header course={course} />
      <Content crs_prts={course_parts} />
      <Total crs_prts={course_parts} />
    </div>
  )
}

export default App