// 首页的JS入口文件
require.config({
  baseUrl: "../javascripts/library", // 基础路径
  paths: {
    jquery: "jquery",
    axios: "axios",
  },
  // shim用于管理第三方插件的依赖
  shim: {},
});

// 切换登录方式
require(["axios", "jquery"], (axios, $) => {
  $('.method>a').on('click', function () {
    let className = $(this).attr('data-title');
    let elm = $('.' + className);

    $('.method>a').removeClass('cur');
    $(this).addClass('cur');

    $('.register-box').css('display', 'none');
    elm.css('display', 'block');
  })
});

// 用户注册
require(["axios", "jquery"], (axios, $) => {

  // 注册，写入数据库
  $('.submit').on('click', function () {
    const params = new URLSearchParams();
    let temp = $(this).attr('data-text');
    let reg = $('.' + temp);
    let flag = 1;
    if (temp === 'phone_reg') {
      // console.log(reg.find('.agree-box input').prop('checked'));
      if (!!reg.find('.phonenumber').val() && !!reg.find('.checkcode-box>input').val() &&
        !!reg.find('.note-check>input').val() && !!reg.find('.agree-box input').prop('checked')) {
        params.append('phone', reg.find('.phonenumber').val());
      } else {
        flag = 0;
      }
    } else if (temp === 'email_reg') {
      if (!!reg.find('.emailVal').val() && !!reg.find('.checkcode-box>input').val() &&
        !!reg.find('.agree-box input').prop('checked')) {
        params.append('email', reg.find('.emailVal').val());
      } else {
        flag = 0;
      }
    }

    if (reg.find('.password').val()) {
      params.append('password', `${reg.find('.password').val()}`);
    } else {
      flag = 0;
    }

    if (flag) {
      axios
        .post(`../users/${temp}`, params)
        .then((res) => {
          let data = res.data;
          console.log(data);
          if (data.success) {
            // 注册成功，将token写入本地存储
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.username);
            location.href = "../html/index.html";
            // console.log(data.msg);
          } else {
            console.log(reg.find('form>div:first-child .err-msg'));
            reg.find('form>div:first-child .err-msg').text(data.msg).css('display', 'block');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  })

})