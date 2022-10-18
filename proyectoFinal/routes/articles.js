const { Router } = require('express')
const express = require('express')
const Article = require('../models/article')
const router = express.Router()



//Ruta para nuevo artículo
router.get("/new", (req, res) => {
    res.render("articles/new", { article: new Article() });
});

/*Ruta para el gestor de artículos
router.get('/manager', async (req, res) => {
    const article = await Article.find()
    res.render('articles/manager', { articles: article })
})*/

//Ruta para el inicio de sesión
router.get('/login', (req, res) => {
    res.render('articles/login')
})



// Ruta para renderizar el Articulo a Editar
router.get('/edit/:id', async (req, res, next) => {
    const article = await Article.findById(req.params.id);
    res.render('articles/edit', { article: article });
})

//Obtenemos el artículo con slug aplicado

router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug })
    if (article == null) res.redirect('/')
    res.render('articles/show', { article: article })
})




//Creamos nuevo artículo
router.post('/', async (req, res, next) => {
    req.article = new Article()
    next()
}, saveArticleAndRedirect('new'))


// Editar Articulo x ID
router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
}, saveArticleAndRedirect('edit'))



  
//Eliminar artículo x ID

router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/articles/manager')
})


//Guardar artículo y redireccionar
function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown
        article.image = req.body.image
        try {
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)
        } catch (e) {
            res.render(`articles/${path}`, { article: article })
        }
    }
}




module.exports = router

