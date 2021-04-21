const express = require('express'),
    cors = require('cors'),
    personRouter = require('./router/router'),
    PORT = process.env.PORT || 5000
    require('./mongoosConnection')

const app = express()
app.use(express.static('public'))
app.set("view engine", 'ejs')
app.use(cors())
app.use(express.json())
app.use(personRouter)

app.listen(PORT,() =>{
    console.log('http://localhost:5000')
})