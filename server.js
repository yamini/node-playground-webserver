const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// configure to use environment variable for heroku, or 3000 for local app
const port = process.env.PORT || 3000;

var app = express();

//register partials directory
hbs.registerPartials(__dirname + '/views/partials');

//set express related configs
app.set('view engine', 'hbs');


//use middleware to write to a log
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;

    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log.')
        }
    });
    next();
});

//use middleware to display maintenance page
// app.use((req, res, next) => {
//     res.render('maintenance.hbs', {
//         pageTitle: 'Under Maintenance',
//         welcomeMessage: 'Work in Progress'
//     });
// });

//set up middleware to serve up public files
app.use(express.static(__dirname + '/public'));


//register handlebars helpers
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()
});

//helper function that takes an argument
hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

//register handler for http get
//root route
app.get('/', (req, res) => {
    // res.send('<h1>Hello Express</h1>');
    // res.send({
    //     name: 'Andrew',
    //     likes: [
    //         'Reading',
    //         'Music',
    //         'Canoeing'
    //     ]
    // })
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to my Website'
    });
});

//about route
app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
        welcomeMessage: 'About my Website'
    });
});

// create a route called bad - send back json with an errorMessage property
app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to handle request'
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});