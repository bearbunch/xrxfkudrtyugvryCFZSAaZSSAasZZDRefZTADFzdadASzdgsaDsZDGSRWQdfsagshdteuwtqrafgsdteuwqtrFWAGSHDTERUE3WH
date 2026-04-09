const express = require("express")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

let show = null
let bookings = []

function randomSeat(){

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const row = letters[Math.floor(Math.random()*26)]
const number = Math.floor(Math.random()*14)+1

return row + number

}

app.get("/ping",(req,res)=>{
res.json({status:"alive"})
})

app.post("/show",(req,res)=>{

if(show){
return res.json({error:"show already scheduled"})
}

const {name,date,time} = req.body

show = {
name,
date,
time
}

bookings = []

res.json({status:"created"})

})

app.get("/show",(req,res)=>{

if(!show){
return res.json(null)
}

res.json({
show,
bookings
})

})

app.post("/book",(req,res)=>{

if(!show){
return res.json({error:"no show"})
}

const name = req.body.name

const seat = randomSeat()

const booking = {
name,
seat
}

bookings.push(booking)

res.json(booking)

})

app.delete("/show",(req,res)=>{

show = null
bookings = []

res.json({status:"deleted"})

})

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
console.log("Server running")
})