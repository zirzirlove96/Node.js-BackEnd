var express = require('express');
var app = express();
var router = express.Router();

//router.get을 통해 router/index.js에서 router을 하면 /logout으로 url을 정하지 않아오 된다.
router.get('/', function(request, response){
  request.logout();//로그아웃을 해준다.
  response.redirect('/main');//session이 없는 상태에서 main으로 이동
});

module.exports = router;
