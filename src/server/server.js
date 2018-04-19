import express from 'express'

const app = express()
const port = 8080;

app.get('/api_v.1', (req, res) => {
    res.send({
      message: 'version .11'
    })
})
console.log('Mode ', process.env.NODE_ENV)
if (process.env.NODE_ENV === 'production') {
    console.log('Listen port: ' + port);
    app.listen(port);
}
export default app;
