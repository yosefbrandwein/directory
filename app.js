const directory = require('./routes/directory')
const users = require('./routes/users');
const flash = require('connect-flash');
const express = require('express');
const path = require('path');
const bodyParser= require('body-parser');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const app = express();
require('./prod.js')(app);
require('./config/.env');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));


//creating session, cookie
app.use(session({
    store: new mongoStore({
      url:  MONGODB_URI
    }),
    secret: 'lelov',
    cookie: {
        maxAge:  1000 * 60 * 60,
        httpOnly: false
    },
    resave: true,
    saveUninitialized: false 
}));
app.use(flash());
//making session accessible to templates
app.use( (req, res ,next) => {
    app.locals.name=req.session.name;
    res.locals = req.flash();
    next();
}); 

app.use(express.static(path.join(__dirname,'/public')));
app.use('/directory', directory);
app.use('/users', users);

app.set('view engine', 'pug');
app.set('views', './views')


app.get('/',async (req, res) => {
    res.render('layout.pug');
});

app.get('/tehillim', (req, res) => {
    res.render('tehillim');
});

app.get('/calendar',async  (req, res) => { 
    res.render('calendar'); 
});

app.get('/gallery', (req, res) => {
    //working on it
});


const port = process.env.PORT || 3000;
 app.listen(port, ()=> console.log(`Listening on port${port}`));
