const express = require("express")
const cors = require("cors")
const http = require("http")
const {Server} = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = new Server(server,{cors:{origin:"*"}})

app.use(cors())
app.use(express.json())

let show=null
let seats=[]

function generateSeats(){

seats=[]

const letters="ABCDEFGHIJKLMNOPQRSTUVWXYZ"

for(let r=0;r<26;r++){

for(let n=1;n<=14;n++){

seats.push({
seat:letters[r]+n,
booked:false,
name:null
})

}

}

}

app.post("/show",(req,res)=>{

if(show){
return res.json({error:"show exists"})
}

show=req.body
generateSeats()

io.emit("showCreated",show)

res.json({status:"created"})
})

app.get("/show",(req,res)=>{
res.json({show,seats})
})

app.post("/book",(req,res)=>{

const {name}=req.body

const free=seats.filter(s=>!s.booked)

if(free.length===0){
return res.json({error:"full"})
}

const seat=free[Math.floor(Math.random()*free.length)]

seat.booked=true
seat.name=name

io.emit("seatBooked",seat)

res.json(seat)
})

app.delete("/show",(req,res)=>{

show=null
seats=[]

io.emit("showDeleted")

res.json({status:"deleted"})
})

server.listen(process.env.PORT||3000)