const express = require('express')
require('./database/mongoose');
const { router } = require('./router/user')

const app = express();
app.use(express.json())
app.use(router)

// CORS HEADERS MIDDLEWARE
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");

    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );

    next();
});


/**
 * GET /users/me/access-token
 * Purpose: generates and returns an access token
 */
// app.get('/users/me/access-token', verifySession, (req, res) => {
//     // we know that the user/caller is authenticated and we have the user_id and user object available to us
//     req.userObject.generateAccessAuthToken().then((accessToken) => {
//         res.header('x-access-token', accessToken).send({ accessToken });
//     }).catch((e) => {
//         res.status(400).send(e);
//     });
// })


app.listen(3000, () => {
    console.log("Server is listening on port 3000");
})
