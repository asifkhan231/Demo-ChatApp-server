import express from "express";
import { Server } from "socket.io";
import { createServer } from "http"
import jwt from "jsonwebtoken";

const port = 3000;
const app = express();

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5175",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

app.get('/', (req, res) => {
    res.send("hello world")
})

io.on("connection", (socket) => {
    console.log("user connected");
    console.log("id", socket.id)

    socket.emit("welcome", `${socket.id} welcome to the server`)

    socket.on("message", ({ message, room }) => {
        console.log(message, "from ", socket.id)
        socket.to(room).emit("receive-message", message)
    })

    socket.on("disconnect", () => {
        console.log("disconnected", socket.id)
    })

    socket.on("join-room",(room)=>{
        socket.join(room)
        console.log("user join room")
    })

})
server.listen(port, () => {
    console.log(`server is running on port ${port}`)
})