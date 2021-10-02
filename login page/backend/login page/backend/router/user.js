const express = require('express')
const { User } = require('../model/user')
const { authenticate, verifySession }  = require('../middleware/auth')
const router = new express.Router()

// singup router
router.post('/users/signup', (req, res) => {
    
    const body = req.body;
    console.log(body)
    const newUser = new User(body);
    console.log(newUser)

    newUser.save().then(() => {
        return newUser.createSession();
    }).then((refreshToken) => {
        // Session created successfully - refreshToken returned.
        // now we geneate an access auth token for the user
        console.log(refreshToken)

        return newUser.generateAccessAuthToken().then((accessToken) => {
            // access auth token generated successfully, now we return an object containing the auth tokens
            console.log(accessToken)
            return { accessToken, refreshToken }
        });
    }).then((authTokens) => {
        // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
        console.log(authTokens)
        res
            .header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send(newUser);
    }).catch((e) => {
        res.status(400).send(e);
    })
})

// login router
router.post('/users/login', (req, res) => {
    console.log(req.body)
    const email = req.body.username;
    const password = req.body.password;

    User.findByCredentials(email, password).then((user) => {
        return user.createSession().then((refreshToken) => {
            // Session created successfully - refreshToken returned.
            // now we geneate an access auth token for the user

            return user.generateAccessAuthToken().then((accessToken) => {
                // access auth token generated successfully, now we return an object containing the auth tokens
                return { accessToken, refreshToken }
            });
        }).then((authTokens) => {
            // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(user);
        })
    }).catch((e) => {
        res.status(400).send(e);
    });
})

// logout router
router.post('/users/logout', verifySession, async (req, res) => {
    try {
        req.user.sessions = req.user.sessions.filter((session) => {
            return session.token !== req.refreshToken
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// generate the new access token when the user is valid
router.get('/users/access-token', verifySession, (req, res) => {
    
    req.user.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((e) => {
        res.status(400).send(e);
    });
})

module.exports = {
    router
}