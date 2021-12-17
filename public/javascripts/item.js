require.config({
  baseUrl: "../javascripts/library", // 基础路径
  paths: {
    jquery: "jquery",
    axios: "axios",
  },
  // shim用于管理第三方插件的依赖
  shim: {},
});

// 数据渲染
require(["axios", "jquery", "cookie"], function (axios, $, cookie) {
  let id = location.search.split("=")[1];

  axios
    .get("../product/getitem", {
      params: {
        id,
      },
    })
    .then((res) => {
      let data = res.data[0];
      // console.log(data);

      let pic = JSON.parse(data.picture);
      let type = JSON.parse(data.type);
      let typeList = `<li class="variety-item fl cur">
      <a href="javascript:;">${type[0].name}</a>
      </li>`;
      if (type.length != 0) {
        for (let i = 1; i < type.length; i++) {
          typeList += `
          <li class="variety-item fl">
                <a href="#">${type[i].name}</a>
              </li>`;
        }
      }
      // console.log(type);

      // pic
      let pics = '';
      pic.forEach(elm => {
        pics += `<div class="swiper-slide">
        <img src="${elm.src}" data-bigpic="${elm.bigsrc}">
      </div>`;
      });
      $('.piclist .swiper-wrapper').html(pics);
      $('.bigpic>img').attr('src', pic[0].bigsrc);

      // intro
      let intro = `<!-- 产品标题 -->
      <div class="info-title">${data.title}</div>
      <div class="info-subtitle">${data.subtitle}</div>
      <!-- 分割线 -->
      <div class="divider"></div>

      <div class="info-wrap wrap-1">
        <div class="info-wrap-item price">
          <div class="item-label fl">
            价格
          </div>
          <div class="item-content">
            <span class="nowprice">¥${data.nowprice}</span>
            <del class="oldprice">${data.oldprice}</del>
          </div>
        </div>
        <div class="info-wrap-item coupons">
          <div class="item-label fl">
            领券
          </div>
          <div class="item-content">
            <i>${data.coupon}</i>
          </div>
        </div>
        <div class="info-wrap-item activity">
          <div class="item-label fl">
            促销
          </div>
          <div class="item-content">
            <i class="tag">直降</i>
            <span>${data.activity}</span>
          </div>
        </div>
      </div>

      <!-- 公告 -->
      <div class="notice">
        物流公告：受疫情影响，北京、上海、黑龙江、吉林、辽宁、河北、江西、江苏、四川、甘肃、青海、新疆、宁夏回族自治区等部分地区暂缓发货。
      </div>

      <div class="info-wrap wrap-2">
        <div class="info-wrap-item variety">
          <div class="item-label fl">
            分类
          </div>
          <ul class="variety-list fl">
            ${typeList}
          </ul>
        </div>
        <div class="info-wrap-item number">
          <div class="item-label fl">
            数量
          </div>
          <div class="countipt">
            <a href="javascript:;" class="disabled sub">-</a>
            <input type="text" value="1" class="goodsCount fl" max="${data.num} min="1">
            <a href="javascript:;" class="add">+</a>
          </div>
        </div>
        <div class="info-wrap-item point">
          <div class="item-label fl">
            积分
          </div>
          <div class="point-text fl">
            <span>购买可获得${data.point}积分</span>
            <i class="tip icon"></i>
          </div>
        </div>
      </div>

      <!-- 按钮 -->
      <div class="jsbtn-box">
        <a href="javascript:;" class="buy">立即购买</a>
        <a href="javascript:;" class="add-shoppingC">加入购物车</a>
        <a href="javascript:;" class="like">
          <i class="icon-like"></i>
        </a>
      </div>`;

      $(".prod-intro>.info").html(intro)
        .find(".add-shoppingC").on('click', function () {
          addItem(data.id, $(".goodsCount").val());
        });

      // detail图片渲染
      $('.tab-detail>.img-box').html(data.details);
      // console.log($('.tab-detail>.img-box'));
      // console.log(data);

      $(".prod-intro>.info .sub").on('click', function () {
        let val = $('.goodsCount').val();
        if (val > 1) {
          $('.goodsCount').val(--val);
          if (val == 1) {
            $(this).addClass('disabled');
          }
          if (val != data.num) {
            $(".prod-intro>.info .add").removeClass('disabled');
          }
        }
      })
      $(".prod-intro>.info .add").on('click', function () {
        let val = $('.goodsCount').val();
        if (val < data.num) {
          $('.goodsCount').val(++val);
          if (val == data.num) {
            $(this).addClass('disabled');
          }
          if (val != 1) {
            $(".prod-intro>.info .sub").removeClass('disabled');
          }
        }
      })

      // $(".prod-intro>.info").on('click','.sub',function(e){
      //   e = e.originalEvent;
      //   let val = 
      // })
    })
    .catch((err) => {
      console.log(err);
    });

  // 加入购物车
  function addItem(id, num) {
    let product = {
      id,
      num
    };

    let shop = cookie.get("shop"); // 读取cookie中的购物车数据

    if (shop) {
      // 判断是否cookie数据中已有商品
      shop = JSON.parse(shop);

      // 判断当前商品在购物车数据中是否已经存在 如果数据存在 则修改数量 不存在则添加(push)
      if (shop.some((el) => el.id == id)) {
        let index = shop.findIndex((elm) => elm.id == id); // 查找当前商品id在数组中的索引
        let count = parseInt(shop[index].num); // 该商品当前的数量
        count += parseInt(num); // 改变数量
        shop[index].num = count;
      } else {
        shop.push(product);
      }
    } else {
      // 没有数据 初始化一个数组 存入数据
      shop = [];
      shop.push(product);
    }

    cookie.set("shop", JSON.stringify(shop));
  }
});

// 放大镜
require(["jquery"], function ($) {
  function Enlarge(ele) {
    this.ele = $(ele);
    // 原图片
    this.show = this.ele.find('.bigpic');
    this.mask = this.ele.find('.zoom');
    this.enlarge = this.ele.find('.zoom-preview');

    this.list = this.ele.find('.piclist');
    // 启动器
    this.init();
  }
  Enlarge.prototype.init = function () {
    this.overOut();
    this.getProp();
    // this.setScale();
    this.move();
    // this.bindEvent();
  };

  // 1. 移入移出
  Enlarge.prototype.overOut = function () {
    // 移入 show 显示, 移出 show 隐藏
    this.show.on('mouseover', () => {
      this.mask.css('display', 'block');
      this.enlarge.css('display', 'block');

      let bigsrc = this.show.find('img').attr('src');
      this.enlarge.css('backgroundImage', `url(${bigsrc})`);
    })

    this.show.on('mouseout', () => {
      this.mask.css('display', 'none');
      this.enlarge.css('display', 'none');
    })
    let that = this;

    this.list.on('mouseover', '.swiper-slide>img', function (e) {
      e = e.originalEvent;
      let bigpic = $(e.target).attr('data-bigpic');
      // console.log(bigpic);
      that.show.find('img').attr('src', bigpic);
    })
  }

  // 2. 获取尺寸
  Enlarge.prototype.getProp = function () {
    this.top = this.show.offset().top;
    this.left = this.show.offset().left;
    // console.log(top, left);
    // 2-1. 获取遮罩层尺寸
    this.mask_width = parseInt(this.mask.outerWidth());
    this.mask_height = parseInt(this.mask.outerWidth());

    // 2-2. show 盒子尺寸
    this.show_width = this.show.width();
    this.show_height = this.show.width();
    // 2-3. 背景图尺寸
    const bg = this.enlarge.css('backgroundSize').split(' ');
    this.bg_width = parseInt(bg[0]);
    this.bg_height = parseInt(bg[1]);

    this.enlarge_width = parseInt(this.enlarge.outerWidth());
    this.enlarge_height = parseInt(this.enlarge.outerHeight());
    // console.log(this.mask_width, this.mask_height);
    console.log(this.enlarge_width, this.enlarge_height);
  }


  // 3. 动起来
  Enlarge.prototype.move = function () {
    // 3-1. 给 show 盒子绑定一个鼠标移动事件
    this.show.on('mousemove', e => {
      e = e.originalEvent;
      let x = e.pageX - this.left - 150;
      let y = e.pageY - this.top - 150;

      if (x <= 0) x = 0;
      if (y <= 0) y = 0;
      if (x >= this.show_width - this.mask_width) x = this.show_width - this.mask_width;
      if (y >= this.show_height - this.mask_height) y = this.show_height - this.mask_height;
      // console.log(x, y);

      this.mask.css('left', x);
      this.mask.css('top', y);

      // 3-5. 右边跟着动
      const moveX = this.enlarge_width * x / this.mask_width
      const moveY = this.enlarge_height * y / this.mask_height

      // 3-6. 给背景图赋值
      this.enlarge.css('backgroundPosition', `-${moveX}px -${moveY}px`);
    })
  }

  new Enlarge('.pic');
})

// 返回顶部
require(["jquery"], ($) => {
  $(window).on("scroll", function () {
    let top = $(document).scrollTop(); // 滚动距离
    if (top >= $('.prod-info').offset().top - 50) {
      $('#right-aside .back-top').css('transform', 'scale(1)');
    } else {
      $('#right-aside .back-top').css('transform', 'scale(0)');
    }
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