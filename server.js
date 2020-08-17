if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const bcrypt = require('bcrypt')
const initializePassword = require('./passport-config')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')


initializePassword(
    passport,
    email => user.find(user => user.email === email),
    id => user.find(user => user.id === id)
)
const app = express()

const user = []

app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session( {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.set('view engine', 'ejs')



app.get('/', checkAuthenticated, (req, res) => {
    res.render('index', {name: req.user.name})
   
   
})

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

app.get('/login', checkIsNotAuthenticated, (req, res) => {
    res.render('login')
})

app.post('/login', checkIsNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkIsNotAuthenticated, (req, res) => {
    res.render('register')
})

app.post('/register', checkIsNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        user.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    } catch  {
        res.redirect('/register')
    }
    console.log(user)
})

function checkAuthenticated(req, res, next){
    if( req.isAuthenticated()){
        return next()
    }

    res.redirect('/login')
}

function checkIsNotAuthenticated(req, res, next){
    if( req.isAuthenticated()){
        return res.redirect('/')
    }

     next()
}

app.listen(3000)