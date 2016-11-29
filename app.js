/**
 * Created by 724291943 on 2016/11/10.
 */
var express = require('express')
var port = process.env.PORT || 3000
var app = express()
var _ = require('underscore')
var mongoose = require('mongoose')
var path = require('path')
var bodyParser = require('body-parser')
var Movie = require('./models/movie')

mongoose.connect('mongodb://localhost/carry')

app.locals.moment = require('moment');
app.set('views','./views/pages')
app.set('view engine','jade')
app.use(bodyParser.urlencoded({extend: true}))
app.listen(port)
app.use(express.static(path.join(__dirname, 'public')))

console.log('app.js is running on port ' + port)

//index page
app.get('/',function (req, res) {
    Movie.fetch(function(err, movies) {
        if(err) {
            console.log(err)
        }
        res.render('index',{
            title: 'carry 首页',
            movies: movies
        })
    })
})

//detail page
app.get('/movie/:id',function(req, res) {
    var id = req.params.id

    Movie.findById(id, function(err, movie) {
        if(err) {
            console.log(err)
        }
        if(movie){
            res.render('detail', {
                title: 'carry ' + movie.title,
                movie: movie
            })
        }else{
            console.log(movie + " mark from app.js:51")
        }
    })

})

//admin post movie
app.post('/admin/movie/new', function(req, res) {
    var id = req.body.movie._id
    var movieObj = req.body.movie
    var _movie
    if (id !== 'undefined') {
        Movie.findById(id, function(err, movie) {
            if(err) {
                console.log(err)
            }

            _movie = _.extend(movie, movieObj)
            _movie.save(function (err, movie) {
                if(err) {
                    console.log(err)
                }

                res.redirect('/movie/' + movie._id)
            })
        })
    }else{
        _movie = new Movie({
            director: movieObj.director,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            poster: movieObj.poster,
            flash: movieObj.flash,
            summary: movieObj.summary,
            year: movieObj.year
        })

        _movie.save(function(err, movie) {
            if(err) {
                console.log(err)
            }

            res.redirect('/movie/' + movie._id)
        })
    }
})

//list page
app.get('/admin/list',function(req, res) {
    Movie.fetch(function (err, movies) {
        if(err) {
            console.log(err)
        }
        res.render('list',{
            title: 'carry 列表页',
            movies: movies
        })
    })
})

//admin page
app.get('/admin/movie',function(req, res) {
    res.render('admin',{
        title: 'carry 后台录入页',
        movie: {
            title: '',
            director: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    })
})

//admin update movie
app.get('/admin/update/:id', function(req, res) {
    var id = req.params.id

    if(id) {
        Movie.findById(id, function(err, movie) {
            res.render('admin', {
                title: 'carry 后台更新页',
                movie: movie
            })
        })
    }

})

//list delete movie
app.delete('/admin/list', function (req, res) {
    var id = req.query.id

    if(id) {
        Movie.remove({_id: id}, function (err , movie) {
            if(err) {
                console.log(err)
            }else{
                res.json({success: 1})
            }
        })
    }
})
