if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const bcrypt = require('bcrypt')
const initializePassword = require('./passport-config')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')


initializePassword(
    passport,
    email => user.find(user => user.email === email)
)
const app = express()

const user = []

app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.set('view engine', 'ejs')



app.get('/', (req, res) => {
    res.render('index', {name: 'ariel'})
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
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


app.listen(3000)