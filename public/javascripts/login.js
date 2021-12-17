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

    $('.login-box').css('display', 'none');
    elm.css('display', 'block');
  })
});

// 登录
require(["axios", "jquery"], (axios, $) => {

  $('.submit').on('click', function () {
    const params = new URLSearchParams();
    let temp = $(this).attr('data-text');
    let login = $('.' + temp);
    // console.log(temp);
    let flag = 1;
    if (temp === 'account_log') {
      // console.log(reg.find('.agree-box input').prop('checked'));
      if (!!login.find('.account').val()) {
        params.append('account', login.find('.account').val());
      } else {
        flag = 0;
      }
    }
    // else if (temp === 'note_log') {
    //   if (!!log.find('.noteVal').val() && !!log.find('.checkcode-box>input').val() &&
    //     !!log.find('.agree-box input').prop('checked')) {
    //     params.append('note', log.find('.noteVal').val());
    //   } else {
    //     flag = 0;
    //   }
    // }

    if (login.find('.password').val()) {
      params.append('password', `${login.find('.password').val()}`);
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
            // 登录成功，将token写入本地存储
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.username);
            location.href = "../html/index.html";
            // console.log(data.msg);
          } else {
            // console.log(login.find('form>div:first-child .err-msg'));
            login.find('form>div:first-child .err-msg').text(data.msg).css('display', 'block');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  })

})