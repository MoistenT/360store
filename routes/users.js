var express = require('express');
const jwt = require("jsonwebtoken");

const {
  query
} = require('../conn/conn');

var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post("/phone_reg", async (req, res, next) => {
  // res.send('test');
  // console.log(req.body);
  let {
    phone,
    password
  } = req.body;
  const userInfo = {
    phone: phone,
    password: password,
  };
  // console.log(userInfo);
  let sql = `select * from users where phone=${phone}`;

  let result = await query(sql);
  // console.log(result.length);
  if (result.length == 0) {
    let sql = "INSERT INTO `users` (`id`, `phone`, `email`, `password`) VALUES " + `(NULL,'${phone}', '', '${password}')`;
    // console.log(sql);
    query(sql);
    const token = jwt.sign(userInfo, "pwd12345", {
      expiresIn: 3600
    });
    res.send({
      success: 1,
      msg: '注册成功',
      token,
      username: phone,
    }); // 响应数据
  } else {
    res.send({
      success: 0,
      msg: '手机号已注册'
    });
  }

});
router.post("/email_reg", async (req, res, next) => {
  // console.log(1);
  let {
    email,
    password
  } = req.body;
  const userInfo = {
    email: email,
    password: password,
  };
  // console.log(userInfo);
  let sql = `select * from users where email LIKE '${email}'`;

  let result = await query(sql);
  console.log(result);
  if (result.length == 0) {
    let sql = "INSERT INTO `users` (`id`, `phone`, `email`, `password`) VALUES " + `(NULL,'','${email}','${password}')`;
    // console.log(sql);
    query(sql);
    const token = jwt.sign(userInfo, "pwd12345", {
      expiresIn: 3600
    });
    res.send({
      success: 1,
      msg: '注册成功',
      token,
      username: email,
    }); // 响应数据
  } else {
    res.send({
      success: 0,
      msg: '邮箱已注册'
    });
  }
});

router.post("/account_log", async (req, res, next) => {
  // res.send('test');
  // console.log(req.body);
  let {
    account,
    password
  } = req.body;
  const userInfo = {
    account: account,
    password: password,
  };

  // console.log(account.indexOf('@'));
  let sql, result;
  if (account.indexOf('@') == -1) {
    sql = `select * from users where phone=${account}`;
    result = await query(sql);
  } else if (account.indexOf('@') != -1) {
    let sql = `select * from users where email LIKE '${account}'`;
    result = await query(sql);
  }

  // 获取数据库中的密码
  let pwd = result[0].password;
  // console.log();

  if (result.length != 0) {
    if (password == pwd) {
      const token = jwt.sign(userInfo, "pwd12345", {
        expiresIn: 3600
      });
      res.send({
        success: 1,
        msg: '登录成功',
        token,
        username: account,
      });
    } else {
      res.send({
        success: 0,
        msg: '用户名或密码错误',
      });
    }
  } else {
    // console.log(result);
    res.send({
      success: 0,
      msg: '用户名未注册'
    });
  }

});

// token验证
router.get("/token_check", (req, res, next) => {
  // 从请求头中 获得token
  let token = req.headers.authorization;

  // 没有token
  if (!token || token === "null") {
    return res.send({
      success: 0,
      msg: "login.html"
    });
  }

  jwt.verify(token, "rootbk.cn", (err, data) => {
    if (err && err.message === "jwt expired") {
      return res.send({
        success: 0,
        msg: "login.html"
      });
    }
    if (err && err.message === "invalid token") {
      return res.send({
        success: 0,
        msg: "login.html"
      });
    }
    res.send({
      success: 1,
      msg: 'shop.html'
    });
  });
});

module.exports = router;