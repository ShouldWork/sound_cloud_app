var express = require('express'); //including the express module
var app = express(); // so we can have easy access to all the functionalities provided by express

app.use(express.static('www')); // public/index.html


// app.get('/movie/:name', function (request, response) {
//   var movieName = request.params.name.toUpperCase();
//   var bestQuote = movies[movieName];
//   if(!bestQuote)
//   {
//     response.status(404).send("Can not find " + request.params.name)
//   }else
//   {
//     response.send(bestQuote);
//   }
// });

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

