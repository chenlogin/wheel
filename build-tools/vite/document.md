snowpack / vite 等基于 ESM 的构建⼯具出现，让项⽬的⼯程构建不再需要构建⼀个完整的 bundle。很多⼈都觉
得我们不再需要打包⼯具的时代即将到来。借助浏览器 ESM 的能⼒，⼀些代码基本可以做到⽆需构建直接运⾏。

Vite(读⾳类似于[weɪt]，法语，快的意思) 是⼀个由原⽣ ES Module 驱动的 Web 开发构建⼯具。在开发环境下基于
浏览器原⽣ ES imports 开发，在⽣产环境下基于 Rollup 打包

- Vite 要求项⽬完全由 ES Module 模块组成
- common.js 模块不能直接在 Vite 上使⽤
- 打包上依旧还是使⽤ rollup 等传统打包⼯具

```
<script src="./src/index.js" type="module"></script>
```

添加依赖解析
- From ('./xxxx') => from ('./xxx')
- From ('yyyy') => from ('/@modules/yyyy')
```
function rewriteImport(content) {
    return content.replace(/ from ['|"]([^'"]+)['|"]/g, function (s0, s1) {
        console.log("s", s0, s1);
        // . ../ /开头的，都是相对路径
        if (s1[0] !== "." && s1[1] !== "/") {
            return ` from '/@modules/${s1}'`;
        } else {
            return s0;
        }
    });
}
// 添加模块改写
ctx.body = rewriteImport(content);
```

js 文件经过 vite 处理后，其 import 的模块路径都会被修改，在前面加上 /@modules/。
当浏览器请求 import 模块的时候，vite 会在 node_modules 中找到对应的文件进行返回。
这样就省略了打包的过程，大大提升了开发效率。
