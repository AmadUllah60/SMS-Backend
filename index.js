const express = require("express")
const morgan = require("morgan")
const connectToDb = require("./db")
const signup = require('./Routes/signup')
const login = require('./Routes/login')
const app =express()
app.use(morgan('tiny'))
app.use(require("cors")())
app.use(express.json())
app.use('/api', signup)
app.use('/api', login)

app.get('/', (req, res) =>{
    res.send("Welcome To Student Management System")
    })
app.listen(9000, async () => {
    await connectToDb()
    console.log("Server is running on port 9000")
})

