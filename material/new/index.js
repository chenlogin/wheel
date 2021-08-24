/**
 * new
 * 1.Constructor 就是 new 时传入的第一个参数，剩余的 arguments 是其他的参数
 * 2.使用obj.__proto__ = Constructor.prototype 继承原型上的方法
 * 3.将剩余的 arguments 传给 Contructor ，绑定 this 指向为 obj，并执行
 * 4.如果构造函数返回的是引用类型，直接返回该引用类型，否则返回 obj
 */

const myNew = function() {
    let Constructor = Array.prototype.shift.call(arguments);
    let obj = {};
    obj.__proto__ = Constructor.prototype;
    let res = Constructor.apply(obj, arguments);
    return res instanceof Object ? res : obj;
}

/**
 * Object.create
 * 新建一个空的构造函数 F ，然后让 F.prototype 指向 obj，最后返回 F 的实例
 */
 const myCreate = function (obj) {
    function F() {};
    F.prototype = obj;
    return new F();
  }