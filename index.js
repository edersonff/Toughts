/* -- Modules configuration -- */
// External
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('express-flash');

// Initialization
const app = express();

// Internal
const conn = require('./db/conn');

// Router
const toughtRouter = require('./routes/toughtRouter')
const userRoutes = require('./routes/userRoutes')

// Controllers
const toughtController = require('./controller/ToughtController')

// Models
const User = require('./models/User')
const Tought = require('./models/Tought')

/* -- App configuration -- */

// Received body
app.use(
    express.urlencoded()
)
app.use(
    express.json()
)

// Template
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

// Session middleware
app.use(session({
    name: "session",
    secret: "nosso_secret",
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
        logFn: function (){},
        path: require('path').join(require('os').tmpdir(), 'sessions'),
    }),
    cookie: {
        secure: false,
        maxAge: 360000,
        expires: new Date(Date.now() + 360000),
        httpOnly: true
    }
}))

// Flash message
app.use(flash())

// Public path
app.use(express.static('public'))

// Set session to res
app.use((req, res, next)=>{
    if(req.session.userid){
        res.locals.session = req.session;
    }

    next();
})

// Routes
app.use('/tought', toughtRouter);
app.use('/', userRoutes);

app.get('/', toughtController.showToughts);

// Database connection
conn
//.sync({force:true})
.sync()
.then(()=>{
    app.listen(80);
})
.catch((err)=>{
    console.error(err)
})