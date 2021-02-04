const express = require('express')
const path = require('path')
const app = express()

const port = 3005

const CONTACTS = [
  {id: 1, name: 'asjdasd', value: 1},
  {id: 2, name: 'ashfghdfghfgdasd', value: 2},
  {id: 3, name: 'fdgdfg', value: 3}
]

app.use(express.json())

app.get('/api/contacts', (req, res) => {
  res.status(200).json(CONTACTS)
}) 

app.post('/api/newContact', (req, res) => {
  const contact = {...req.body}
  res.json({status: 'OK'})
})

app.use(express.static(path.resolve(__dirname, 'client')))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
})

app.listen(port, () => console.log(`App running at: http://localhost:${port}/`))