const Part = (props) => {
  return (
    <p>{props.crs_prt.name} {props.crs_prt.exercises}</p>
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
      <p>Number of exercises {props.crs_prts[0].exercises + props.crs_prts[1].exercises + props.crs_prts[2].exercises}</p>
  )
}
const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content crs_prts={course.parts} />
      <Total crs_prts={course.parts} />
    </div>
  )
}

export default App