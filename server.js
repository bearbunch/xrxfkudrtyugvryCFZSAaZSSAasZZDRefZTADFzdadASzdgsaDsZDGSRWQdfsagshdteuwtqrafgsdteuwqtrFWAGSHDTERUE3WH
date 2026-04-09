const express = require("express")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

let currentShow = null
let lastPing = null

app.get("/ping", (req, res) => {
    lastPing = Date.now()
    res.json({status:"alive"})
})

app.post("/show", (req, res) => {

    const {name, date, time} = req.body

    currentShow = {
        name,
        date,
        time
    }

    res.json({status:"saved"})
})

app.get("/show", (req, res) => {
    res.json(currentShow)
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log("Server running")
})