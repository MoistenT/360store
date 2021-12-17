define([], function () {
  return {
    get(key) {
      if (document.cookie) {
        let cookie = document.cookie.split("; ");
        for (let i in cookie) {
          let item = cookie[i].split("=");
          if (key === item[0]) {
            return item[1];
          }
        }
        return ""; // 循环结束没有执行返回则返回空字符串
      }
    },
    set(key, value, day, path = "/") {
      if (Number.isInteger(day)) {
        let d = new Date();
        d.setDate(d.getDate() + day);
        document.cookie = `${key}=${value};expires=${d};path=${path}`;
      } else {
        document.cookie = `${key}=${value};path=${path}`;
      }
      return this; // 支持链式调用
    },
    remove(key, path = "/") {
      this.set(key, "", -1, path);
      return this;
    },
  };
});
