var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host:'localhost',
  port:3306,
  user:'root',
  password:'csedbadmin',
  database:'jsonman'
});

connection.connect();

router.get('/', function(request, response){
    response.sendFile(path.join(__dirname, '../public/form.html'));
});

router.post('/form', function(request, response){
  response.render('email.ejs', {'email': request.body.email});
});

router.post('/ajax', function(request, response){
  var email = request.body.email;
  var responseData = {};

  var query = connection.query('select name from user where email="'+email+'"',function(err, rows){
    if(err) throw err;
    if(rows[0]){
      responseData.result = "ok";
      responseData.name = rows[0].name;
    }else{
      responseData.result="none";
      responseData.name="";
    }
    response.json(responseData);
  });
});

module.exports = router;
