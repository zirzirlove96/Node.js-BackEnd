var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var mysql = require('mysql');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var connection = mysql.createConnection({
  host:'localhost',
  port:3306,
  user:'root',
  password:'csedbadmin',
  database:'jsonman'
});

connection.connect();

router.get('/', function(request, response){
  //response.sendFile(path.join(__dirname, '../public/join.html'));
  var msg;
  var errMsg = request.flash('error');
  if(errMsg) msg = errMsg;
  response.render('join.ejs', {'message': msg});
});

//session에 id값을 저장한다.
passport.serializeUser(function(user, done){
  console.log('passport session save : ',user.id);
  done(null, user.id);
});

//session의 값을 뽑아서 전달하는 역할을 한다.
//deserializeUser를 통해 id값이 user라는 객체에 저장된다.
passport.deserializeUser(function(id, done){
  done(null, id);
});

//passport에 전략을 세운다음 router에 등록시켜줘야 한다.
passport.use('local-join', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(request, email, password, done){
  var query = connection.query('select * from user where email=?', [email],
  function(err, rows){

    if(err) return done(err);//err일 경우 done메소드를 사용해 준다.

    if(rows.length){//만약 email값이 있을 경우 즉 회원정보가 이미 있을 경우
      console.log('existed user');
      return done(null, false, {message: 'your email is already used'});
      //done메소드에서 false일 경우 router.post에서 failuerRedirect가 수행된다.
      //message는 flash 모듈을 사용함으로써 사용이 가능하다.

    }else{//inset 구문을 사용하여 DB에 적용시킨다.
      var sql = {email: email, password: password};
      var query = connection.query('insert into user set ? ', sql, function(err, rows){
        if(err) done(err);
        else done(null, {'email': email, 'id': rows.insertId});
        //회원정보를 done메소드를 사용해서 post하는데 /main으로 전달된다.
      });
    }
  })
}
));


router.post('/', passport.authenticate('local-join', {
  successRedirect: '/main',
  failureRedirect: '/join',
  failureFlash: true
}));


/*router.post('/', function(request, response){
  var body = request.body;
  var email = body.email;
  var name = body.name;
  var password = body.password;

  var sql = {email: email, name: name, password: password};
  var query = connection.query('insert into user set ?',sql, function(err, rows){
  if(err) {throw err;}
  //views라는 폴더의 welcome.ejs를 자동으로 찾고, name값과 id값을 ejs로 보낸다.
  response.render('welcome.ejs', {'name': name, 'id':rows.insertId});
});
});*/

module.exports = router;
