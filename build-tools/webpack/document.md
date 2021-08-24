```
// index.js
var add = require('add.js').default
console.log(add(1 , 2))

// add.js
exports.default = function(a,b) {return a + b}
```

在浏览器中直接执⾏这个程序肯定会有问题 最主要的问题是浏览器中没有exports对象与require⽅法所以⼀定
会报错。我们需要通过模拟exports对象和require⽅法。

在nodejs打包的时候我们会使⽤fs.readfileSync()来读取js⽂件。这样的话js⽂件会是⼀个字符串。
⽽如果需要将字符串中的代码运⾏会有两个⽅法分别是new Function与Eval

```
exports = {}
eval('exports.default = function(a,b) {return a + b}') // node⽂件读取后的代码字符串
exports.default(1,3)
```
由于⼦模块中会声明变量，为了不污染全局我们使⽤⼀个⾃运⾏函数来封装⼀下
```
var exports = {}
(function (exports, code) {
    eval(code)
})(exports, 'exports.default = function(a,b){return a + b}')
```

require函数的功能⽐较简单，就是根据提供的file名称加载对应的模块
```
function require(file) {
    var exports = {};
    (function (exports, code) {
        eval(code)
    })(exports, 'exports.default = function(a,b){return a + b}')
    return exports
}
var add = require('add.js').default
console.log(add(1 , 2))
```
将所有模块的⽂件名和代码字符串整理为⼀张key-value表就可以根
据传⼊的⽂件名加载不同的模块了。
```
(function (list) {
    function require(file) {
        var exports = {};
        (function (exports, code) {
            eval(code);
        })(exports, list[file]);
        return exports;
    }
    require("index.js");
})({
    "index.js": `
        var add = require('add.js').default
        console.log(add(1 , 2))
        `,
    "add.js": `exports.default = function(a,b){return a + b}`,
});
```
真正webpack⽣成的bundle.js⽂件中还需要增加模块间的依赖关系
```
{
    "./src/index.js": {
        "deps": { "./add.js": "./src/add.js" },
        "code": "....."
    },
    "./src/add.js": {
        "deps": {},
        "code": "......"
    }
}
```

### 总结⼀下思路，webpack打包可以分为以下三个步骤：
- 1、分析依赖
    - 将模块解析为抽象语法树AST。我们借助babel/parser来完成。
- 2、ES6转ES5
- 3、替换exports和require

将刚才编写的执⾏函数和依赖图合成起来输出最后的打包⽂件
```
function bundle(file) {
    const depsGraph = JSON.stringify(parseModules(file));
    return `(function (graph) {
        function require(file) {
            function absRequire(relPath) {
                return require(graph[file].deps[relPath])
            }
            var exports = {};
            (function (require,exports,code) {
                eval(code)
            })(absRequire,exports,graph[file].code)
            return exports
        }
        require('${file}')
    })(${depsGraph})`;
}
!fs.existsSync("./dist") && fs.mkdirSync("./dist");
fs.writeFileSync("./dist/bundle.js", content);
```

## 执行 
- node build-tools/webpack/webpack.js