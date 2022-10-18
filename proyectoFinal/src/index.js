const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const Article = require('../models/article')
const articleRouter = require('../routes/articles')
const methodOverride = require('method-override')
const article = require('../models/article')

const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const PassportLocal = require('passport-local').Strategy;



const app = express();
const port = process.env.PORT || 3000
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser('my Password'));

app.use(session({
    secret: 'my Password',
    //En cada peticion aunque la sesion no haya sido modificada, la vuelve a guardar
    resave: true,
    saveUninitialized: true

}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new PassportLocal(function (username, password, done) {
    if (username === "administrador" && password == "1234")
        return done(null, { id: 1, name: "Cody" });
    done(null, false);

}));

//Serialización
passport.serializeUser(function (user, done) {
    done(null, user.id);
})

//Deserialización
passport.deserializeUser(function (id, done) {
    done(null, { id: 1, name: "Cody" })
})

app.set('view engine', 'ejs')

app.get("/articles/manager", async (req, res, next) => {
    if (req.isAuthenticated()) {
        const article = await Article.find()
        res.render('articles/manager', { articles: article })
    } else {
        res.redirect("/login")
    }

})


app.get("/login", (req, res) => {
    //Mostrar el formulario de login
    res.render("articles/login")
})

app.post("/login", passport.authenticate('local', {
    successRedirect: "/articles/manager",
    failureRedirect: "/login"
}))

app.post("/login", (req, res) => {
    //Recibir credenciales e iniciar sesión
    res.send("Hola mundo")
})






app.use(methodOverride('_method'))

//Ruta principal Home
app.get('/', async (req, res) => {
    const articles = await Article.find().sort({
        createdAt: "desc"
        
    })
    res.render('articles/index', { articles: articles })
})


//MongoDB connection

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch((err) => console.error(err))


app.use('/articles', articleRouter)

app.use('/public/', express.static('./public/'))


app.listen(port, () => console.log(`Servidor escuchando en el puerto ${port}`))