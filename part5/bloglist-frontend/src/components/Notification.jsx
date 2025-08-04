const Notification = ({ message , type }) => {
  if (message === null) {
    return null
  }

  return <h2 className={type}>{message}</h2>
}

export default Notification