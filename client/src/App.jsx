import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { io } from "socket.io-client"
import { Container } from '@mui/system'
import { Box, Button, Stack, TextField, Typography, Chip } from '@mui/material'

function App() {
  const socket = useMemo(() => io("http://localhost:3000/"), [])
  const [message, setMessage] = useState('')
  const [room, setRoom] = useState('')
  const [socketID, setSocketID] = useState('')
  const [messages, setMessages] = useState([])
  const [roomName, setRoomName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    socket.emit("message", { message, room })

    setMessage('')

  }
  
  const handleJoin = (e)=>{
    e.preventDefault()

    socket.emit("join-room",roomName)
    setRoomName('')
  }

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id)
      setSocketID(socket.id)

      socket.on("welcome", (s) => {
        console.log(s)
      })

      socket.on("receive-message", (s) => {
        console.log(s)
        setMessages((messages) => [...messages, s])
      })

      socket.emit("disconnecte", `${socket.id} is disconnected`)

    })

    return () => {
      socket.disconnect()
    }


  }, [])
  return (
    <>
      <Container maxWidth="sm">
        <Box sx={{ height: 300 }} />
        <Typography variant='h4' component="div" gutterBottom>
          Welcome to socket.io
        </Typography>
        <Typography variant='h5' component="div" gutterBottom>
          {socketID}
        </Typography>

        <form onSubmit={handleJoin}>
        <TextField value={roomName} onChange={e => setRoomName(e.target.value)} id='outlined-basic' label="Room-Name" variant="outlined" />
          <Button variant='contained' type='submit' color='primary'>Join</Button>

        </form>
        <form onSubmit={handleSubmit}>
          <TextField value={message} onChange={e => setMessage(e.target.value)} id='outlined-basic' label="message" variant="outlined" />
          <TextField value={room} onChange={e => setRoom(e.target.value)} id='outlined-basic' label="Room" variant="outlined" />
          <Button variant='contained' type='submit' color='primary'>Send</Button>

        </form>

        <Stack>
          {
            messages.map((m, i) => (
            <div key={i} style={{backgroundColor:"lightblue" , width:"fit-content", margin:"5px",padding:"5px",borderRadius:'5px'
            }}>
              <h1 style={{margin:"0",color:'whitesmoke'}}>{m}</h1>
            </div>
            ))
          }
        </Stack>
      </Container>
    </>
  )
}

export default App
