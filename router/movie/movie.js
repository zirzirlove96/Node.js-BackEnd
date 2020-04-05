var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host:'localhost',
  port:3306,
  user:'root',
  password: 'csedbadmin',
  database: 'jsonman'
});

connection.connect();

router.get('/list', function(req, res){
    res.render('movie.ejs');//ejs파일을 렌더링 해준다.
})

//모든영화보기를 눌렀을 때
//movie로 들어왓을 때 get방식으로 처리한다.
router.get('/', function(req, res){
  var responseData = {};

  var query = connection.query('select title from movie', function(err, rows){
    if(err) throw err;
    if(rows.length){
      console.log(rows);
      responseData.result = 1;
      responseData.data = rows;
    }
    else {
      responseData.result = 0;
    }
    res.json(responseData);
  });
});

//영화 추가.
router.post('/', function(req, res){
  var title = req.body.title;
  var type = req.body.type;
  var grade = req.body.grade;
  var actor = req.body.actor;//요청받은 것을 가져온다.

  var sql = {title,type,grade,actor};//key값 value값을 쓰지 않아도 된다.
  var query = connection.query('insert into movie set ?', sql, function(err, rows){
    if(err) throw err;
    return res.json({'result':1});//객체로 보내준다.
  });//데이터베이스에 영화에 대한 정보가 입력된다.
});

// 3. /movie/:title, GET
router.get('/:title', function(req, res){
  var title = req.params.title;//영화제목값을 가져와 데이터베이스에 담겨있는
  //영화제목을 가져온다.
  console.log('title ', title);

  var responseData = {};

  var query = connection.query('select * from movie where title=?', [title],
  function(err, rows){
    if(err) throw err;
    if(rows[0]){
      console.log(rows);
      responseData.result=1;
      responseData.data = rows;
    }else{
      responseData.result=0;
    }
    res.json(responseData);
  });
});


router.delete('/:title', function(req, res){
  var title = req.params.title;

  console.log('title ', title);

  var responseData = {};
  //query문으로 delete를 사용
  var query = connection.query('delete from movie where title=?', [title],
  function(err,rows){
  console.log(rows);
  if(err) throw err;
  if(rows.affectedRows>0){//rows배열에 있는 affectedRows의 유무가 데이터가 있는지 없는지 확인
    responseData.result=1;//있을 경우 1로
    responseData.data=title;//movie.ejs에서 나타내기 위해
  }else{
    responseData.result=0;
  }
  res.json(responseData);
});
});

module.exports = router;
