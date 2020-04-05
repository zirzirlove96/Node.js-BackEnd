var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var main = require('./main/main');
var email = require('./email/email');
var join = require('./join/index');
var login = require('./login/login');
var logout = require('./logout/logout');
var movie = require('./movie/movie');
//router.get('/', function(request, response){
  //response.sendFile(path.join(__dirname, '../public/main.html'));
//});

router.use('/main',main);
router.use('/email',email);
router.use('/join', join);
router.use('/login', login);
router.use('/logout', logout);
router.use('/movie', movie);

module.exports = router;
