var mongoose = require('mongoose')
var MovieSchema = require('../schemas/movie')
var Movie = mongoose.model('Movie', MovieSchema)
// Movie.fetch(function (err, movies) {
//     if(err){
//
//     }else {
//         console.log(movies)
//     }
// })

module.exports = Movie
//exports.Movie = Movie