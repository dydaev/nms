import express from 'express'

const app = express()
let clientIp = '';
const port = 8080;

app.use('/', (req, res, next) => {
    clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('Client(' + clientIp + ') sent request');
    next();
})

app.use('/login', (req, res, next) => {
    if (clientIp !== 7798) {
        next();
    }
})

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
