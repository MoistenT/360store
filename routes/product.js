const express = require('express');

const {
  query
} = require('../conn/conn');

const router = express.Router();

router.get("/getItems", async (req, res, next) => {
let sql = "select * from product";

let result = await query(sql); // 查询数据
// console.log(result);
res.send(result); // 响应数据
});

router.get("/getItem", async (req, res, next) => {
  let { id } = req.query;

  let sql = `select * from product where id=${id}`;

  let result = await query(sql);

  res.send(result);
});

router.get("/getshopdata", async (req, res, next) => {
  let { idList } = req.query;

  let sql = `select * from product where id in (${idList})`;

  let result = await query(sql);

  res.send(result);
});

module.exports = router;