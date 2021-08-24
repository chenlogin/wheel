/**
 * call 和 apply 的区别：call 方法接收的是一个参数列表，apply 方法接收的是一个包含多个参数的数组。
 * 
 * call
 * 1.context 存在就使用 context，否则是 window
 * 2.使用 Object(context) 将 context 转换成对象，并通过 context.fn 将 this 指向 context
 * 3.循环参数，注意从 1 开始，第 0 个是上下文，后面才是我们需要的参数
 * 4.将参数字符串 push 进 args
 * 5.字符串和数组拼接时，数组会调用 toString 方法，这样可以实现将参数一个个传入，并通过 eval 执行
 * 6.拿到结果返回前，删除掉 fn
 */

 Function.prototype.call = function(context) {
    context = context ? Object(context) : window;
    context.fn = this;
    let args = [];
    for (let i = 1; i < arguments.length; i++) {
        args.push('arguments['+ i +']');
    }
    let res = eval('context.fn('+ args +')');
    delete context.fn;
    return res;
}

/**
 * apply
 * 1.apply 无需循环参数列表，传入的 args 就是数组
 * 2.但是 args 是可选参数，如果不传入的话，直接执行 
 */

 Function.prototype.apply = function(context, args) {
    context = context ? Object(context) : window;
    context.fn = this;
    if (!args) {
        return context.fn();
    }
    let res = eval('context.fn('+ args +')');
    delete context.fn;
    return res;
}

/**
 * bind
 * 1.bind 的参数可以在绑定和调用的时候分两次传入
 * 2.bindArgs 是绑定时除了第一个参数以外传入的参数，args 是调用时候传入的参数，将二者拼接后一起传入
 * 3.如果使用 new 运算符构造绑定函数，则会改变 this 指向，this 指向当前的实例
 * 4.通过 Fn 链接原型，这样 fBound 就可以通过原型链访问父类 Fn 的属性
 */
 Function.prototype.bind = function(context) {
    let that = this;
    let bindArgs = Array.prototype.slice.call(arguments, 1);
    function Fn () {};
    function fBound(params) {
        let args = Array.prototype.slice.call(arguments) ;
        return that.apply(this instanceof fBound ? this : context, bindArgs.concat(args));
    }
    Fn.prototype = this.prototype;
    fBound.prototype = new Fn();
    return fBound;
}