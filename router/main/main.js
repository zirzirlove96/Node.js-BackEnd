var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');


router.get('/', function(request, response){
  console.log('main js loaded', request.user);
  var id = request.user;
  if(!id) response.render('login.ejs');//세션값이 없을 때는 초기 login화면
  response.render('main.ejs', {'id':id });
});//router/login/login.js에서의 deserializeUser때문에 session id값을 사용할 수 있다.

module.exports = router;
