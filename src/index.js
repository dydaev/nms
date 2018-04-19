import express from 'express'

const app = express()

app.get('/api_v.1', (req, res) => {
    res.send({
      message: 'version .11'
    })
})

app.listen(3000)
export default app