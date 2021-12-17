require.config({
  baseUrl: "../javascripts/library", // 基础路径
  paths: {
    jquery: "jquery",
    axios: "axios",
    cookie: "cookie",
  },
  // shim用于管理第三方插件的依赖
  shim: {},
});

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
      } else {
        location.href = '../html/login.html';
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// 页面渲染
require(["axios", "jquery", "cookie"], function (axios, $, cookie) {
  let shop = cookie.get("shop");
  if (!shop) return;

  shop = JSON.parse(shop);

  if (shop.length == 0) return;

  $('.shopping').css('display', 'block');
  $('.empty').css('display', 'none');

  let idList = shop.map((el) => el.id).join();

  axios
    .get("../product/getshopdata", {
      params: {
        idList,
      },
    })
    .then((res) => {
      let data = res.data;
      // console.log(data);
      let template = "";
      let goodsNum = 0;
      let goodsPrice = 0;

      data.forEach((el, i) => {
        let pic = JSON.parse(el.picture);
        let type = JSON.parse(el.type);

        let current = shop.filter((elm) => elm.id == el.id);
        if (current[0].num > el.num) current[0].num = el.num;

        // console.log(current);
        let all_price = parseFloat(el.nowprice * current[0].num).toFixed(2);
        goodsNum += parseInt(current[0].num);
        goodsPrice += parseInt(all_price);

        template += `
        <div class="item">
            <div class="col-1">
              <input type="checkbox" class="checkbox">
            </div>
            <div class="col-2 good-info">
              <img src="${pic[0].src}" alt="">
              <a href="javascript:;">${el.title}</a>
            </div>
            <div class="col-3 good-type">分类:${type[0].name}</div>
            <div class="col-4 single-price">¥${parseFloat(el.nowprice).toFixed(2)}</div>
            <div class="col-5 good-num">
              <div class="box" data-id="${el.id}">
                <a href="javascript:;" class="sub">-</a>
                <input type="text" value="${current[0].num}" max="${el.num}" min="1" class="goodsCount">
                <a href="javascript:;" class="add">+</a>
              </div>
            </div>
            <div class="col-6 all-price">${all_price}</div>
            <div class="col-7 delete">
              <a href="javascript:;" data-id="${el.id}" class="delete-btn">删除</a>
            </div>
          </div>
        `;
      });

      $(".shopping-items")
        .html(template)
        .find(".delete-btn")
        .on("click", function () {
          // console.log($(this).attr("data-id"));

          let res = shop.filter((el) => el.id != $(this).attr("data-id"));
          cookie.set("shop", JSON.stringify(res));
          location.reload();
        });

      // 全选
      $('.allcheck').on('click', function () {
        // 点击全选控制所有复选框
        $(':checkbox').prop('checked', $(this).prop('checked'));
      })
      $(':checkbox:not(.allcheck)').on('click', function () {

        let flag = Array.from($(':checkbox:not(.allcheck)')).every(el => $(el).prop('checked'));
        $('.allcheck').prop('checked', flag);
      })

      // 增加减少
      $(".sub").on('click', function () {
        let maxNum = $(this).parent().find('.goodsCount').attr('max');
        let val = $(this).parent().find('.goodsCount').val();
        if (val > 1) {
          $(this).parent().find('.goodsCount').val(--val);
          if (val == 1) {
            $(this).addClass('disabled');
          }
          if (val != maxNum) {
            $(".add").removeClass('disabled');
          }
        }
        addItem($(this).parent().attr('data-id'), val);
      })
      $(".add").on('click', function () {
        let maxNum = $(this).parent().find('.goodsCount').attr('max');
        let val = $(this).parent().find('.goodsCount').val();
        if (val < maxNum) {
          $(this).parent().find('.goodsCount').val(++val);
          if (val == maxNum) {
            $(this).addClass('disabled');
          }
          if (val != 1) {
            $(".sub").removeClass('disabled');
          }
        }
        addItem($(this).parent().attr('data-id'), val);
      })
      // 总件数和总价格
      $('.goods-num').text(goodsNum + '件');
      // console.log(goodsPrice);
      $('.goods-price').text(parseFloat(goodsPrice).toFixed(2));


      // 选中删除
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
        shop[index].num = parseInt(num);
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