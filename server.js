// Get our dependencies
var express = require('express');
var app = express();
var mysql = require("mysql");
var connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_NAME
});

connection.connect();

function getMovies(callback) {    
        connection.query("SELECT * FROM movie_db.moviereview",
            function (err, rows) {
                callback(err, rows); 
            }
        );    
}

// Implement the movies API endpoint
app.get('/movies', function(req, res){

    connection.query("select m.title, m.release, m.score, r.name as reviewer, p.name as publication from movie_db.moviereview m, movie_db.reviewer r, movie_db.publication p where r.publication=p.name and m.reviewer=r.name",function(err, rows){

        if(err) {
            console.log(err);
            return;
        }

        res.json(rows);
    });  
})

app.get('/', function(req, res, next) {

    //now you can call the get-driver, passing a callback function
    getMovies(function (err, moviesResult){ 
        
        if(err) {
            console.log(err);
            return;
        }

       res.json(moviesResult);

    });
});

// Implement the reviewers API endpoint
app.get('/reviewers', function(req, res){
  // Get a list of all of our reviewers
    connection.query("select r.name, r.publication, r.avatar from movie_db.reviewer r",function(err, rows){
          res.json(rows);
      });  
  
})

// Implement the publications API endpoint
app.get('/publications', function(req, res){
  // Get a list of publications
    connection.query("select * from movie_db.publication",function(err, rows){
          res.json(rows);
      }); 
})

// Implement the pending reviews API endpoint
app.get('/pending', function(req, res){
  // Get a list of pending movie reviews
     connection.query("select m.title, m.release, m.score, r.name as reviewer, p.name as publication from movie_db.moviereview m, movie_db.reviewer r, movie_db.publication p where r.publication=p.name and m.reviewer=r.name and m.release=2018",function(err, rows){
        res.json(rows);
    });  
})

console.log("server listening through port: "+process.env.PORT);
// Launch our API Server and have it listen on port 3000.
app.listen(process.env.PORT || 3000);
module.exports = app;