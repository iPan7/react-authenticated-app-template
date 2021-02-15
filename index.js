const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys =require('./config/keys')
require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// useNewUrlParser: true,
// useUnifiedTopology: true,
// ^ these code snippets get rid of those pesky deprecation warnings that mongoose devs haven't gotten rid of!


const app = express();

// sets a time limit for how long the cookie authentication will last for the user before expiring and requiring the user logs in again
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        // days * hours * minutes * seconds * milliseconds
        keys: [keys.cookieKey],
    })
)

app.use(passport.initialize());
app.use(passport.session());

(require('./routes/authRoutes')(app));


// To send production build to heroku
if (process.env.NODE_ENV === 'production') {
    // Express will serve up production assets
    app.use(express.static('client/build'));
    // Express will serve up the index.html file if routee isn't recognized
    const path = require('path');
    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    });
}

// PORT dynamically chosen between Heroku's assignment and the local machine port.

const PORT = process.env.PORT || 5000;
app.listen(PORT);

// app.get('/', (req,res) => {
//     res.send({hi: 'there'});
// });
// // get info

// app.post('/', function (req, res) {
//     res.send('POST request to the homepage');
//   });
// // send info

// app.put('/', function (req, res) {
//     res.send('PUT request to the homepage');
//   });
// // update all the properties of something

// app.delete('/', function (req, res) {
//     res.send('DELETE request to the homepage');
//   });
// // delete something

// app.patch('/', function (req, res) {
//     res.send('PATCH request to the homepage');
//   });
// // update one or two properties of something

// //req - object representing the incoming request
// // res - object representing the outgoing response
// // res.send - immediately send some JSON back to whoever made this request

// nodemon allows for the server to auto-restart after any saved changes to see edits in real time, saving time for developers