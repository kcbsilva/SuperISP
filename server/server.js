const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())

app.get('/api/data', (req, res) => {
  res.json({ message: 'Data from separate backend' })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})