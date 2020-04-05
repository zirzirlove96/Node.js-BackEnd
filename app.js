var express = require('express');
var body = require('body-parser');
var app = express();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var flash = require('connect-flash');
var index = require('./router/index');

app.listen(2000, function() {
  console.log('Start!');
});

app.use(express.static('public'));
app.use(body.json());
app.use(body.urlencoded({extended:true}));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'keyboard cat',//세션을 암호화 하기위한 key값
  resave: false,
  saveUninitialized: true//디테일한 값을 설정해주는 것이다.
  //default값으로 꼭 써줘야 한다.
}));
app.use(passport.initialize());//초기환
app.use(passport.session());
app.use(flash());//connect-flash

app.use(index);
