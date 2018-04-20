export default app => {
    app.post('/login', require('./authorizy').post);
    app.post('/login/updateToken', require('./authorizy').post);
}