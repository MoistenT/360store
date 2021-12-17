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

// token验证
require(["axios", "jquery"], (axios, $) => {
  let instance = axios.create({
    baseUrl: "http://localhost:8080",
  });
  // 添加请求拦截器
  instance.interceptors.request.use((config) => {
    config.headers.authorization = localStorage.getItem("token");
    return config; // 放出请求
  });
  // 添加响应拦截器
  instance.interceptors.response.use((response) => {
    return response; // 放出响应
  });

  instance
    .get("/users/token_check")
    .then((res) => {
      // console.log(res.data);
      let data = res.data;
      if (data.success) {
        let username = localStorage.getItem('username')
        $('#top-box .username').text(username);
        $('.login-btn').css('display', 'none');
        $('.register-btn').css('display', 'none');
        $('.shopping-btn').attr('href', `./${data.msg}`);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// 数据渲染
require(["axios", "jquery"], (axios, $) => {
  axios
    .get("../product/getitems")
    .then((res) => {
      let data = res.data;
      console.log(data);
      let temp = $('.more-item-box').html();
      // console.log(temp);
      data.forEach((elm) => {
        let pic = JSON.parse(elm.picture);
        // console.log(pic);

        temp += `<div class="more-item">
        <a href="./item.html?id=${elm.id}">
          <img src="${pic[0].src}" alt="">
          <p class="name text-center">${elm.title}</p>
          <p class="price text-center">¥${elm.nowprice}</p>
          <div class="bottom-label text-center">直降</div>
        </a>
      </div>`;

        $('.more-item-box').html(temp);
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

// 登录注册框
// require(["jquery"], ($) => {
//   // 登录
//   let mask = $('#mask');
//   $(".login-btn").on('click', function () {
//     mask.css('display', 'block');
//     let login = mask.find('.login').css('display', 'block');

//     $('.login>.method>a').on('click', function () {
//       $('.login .method').children().removeClass('active');
//       if ($(this).attr('class') === 'note-login') {
//         login.find('.phonenumber').attr('placeholder', '手机号');
//         login.find('.note-code').css('display', 'block');
//         login.find('.pwd').css('display', 'node');
//         login.find('.node-check>button').css('display', 'block');
//       } else {
//         login.find('.phonenumber').attr('placeholder', '手机号/用户名/邮箱');
//         login.find('.pwd').css('display', 'none');
//         login.find('.note-code').css('display', 'block');
//         login.find('.node-check>button').css('display', 'none');
//       }
//       $(this).addClass('active');
//     })

//     $('.login .reg-btn').on('click', function () {
//       mask.find('.login').css('display', 'none');
//       mask.find('.register').css('display', 'block');
//     })
//     // 点击关闭
//     login.find('.close').on('click', function () {
//       mask.css('display', 'none').find('.login').css('display', 'none');
//     })
//   })
//   $(".register-btn").on('click', function () {
//     mask.css('display', 'block');
//     let register = mask.find('.register').css('display', 'block');

//     $('.register .log-btn').on('click', function () {
//       mask.find('.register').css('display', 'none');
//       mask.find('.login').css('display', 'block');
//     })
//     // 点击关闭
//     register.find('.close').on('click', function () {
//       mask.css('display', 'none').find('.register').css('display', 'none');
//     })
//   })
// })

// 左侧边栏
require(["jquery"], ($) => {


  // 楼梯特效
  $("#left-aside>a").on("click", function () {
    let selector = $(this).attr("data-title");
    let elm = $("." + selector);
    let top = elm.offset().top;
    console.log(top);

    $("html").animate({
        scrollTop: top - 50,
      },
      800
    );
  });

  let modTops = [];
  for (let i = 1; i < 9; i++) {
    modTops.push($('.mod-' + i).offset().top - 50);
  }
  $(window).on("scroll", function () {
    let top = $(document).scrollTop(); // 滚动距离
    if (top >= modTops[0]) {
      $('#left-aside').css('transform', 'scale(1)');
      $('#right-aside .back-top').css('transform', 'scale(1)');
    } else {
      $('#left-aside').css('transform', 'scale(0)');
      $('#right-aside .back-top').css('transform', 'scale(0)');
    }

    let _index;
    for (let i = 0; i < 7; i++) {
      if (top >= modTops[i] && top < modTops[i + 1]) {
        _index = i;
      }
    }
    if (top >= modTops[7]) _index = 7;

    $("#left-aside>a").removeClass("current");
    $("#left-aside>a:eq(" + _index + ")").addClass("current");
  });

  // 返回顶部
  $("#right-aside").on("click", '.back-top', function () {
    $("html").animate({
        scrollTop: 0,
      },
      1000
    );
  });
})