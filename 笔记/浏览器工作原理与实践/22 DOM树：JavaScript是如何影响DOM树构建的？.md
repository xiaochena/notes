# 22 | DOM树：JavaScript是如何影响DOM树构建的？
HTML 文件字节流是无法直接被渲染引擎理解的，所以要将其转化为渲染引擎能够理解的内部结构，这个结构就是 DOM。

## DOM 树如何生成
HTML 解析器并不是等整个文档加载完成之后再解析的，**而是网络进程加载了多少数据，HTML 解析器便解析多少数据。**

当网络进程接收到响应数据时，根据响应头中的 content-type 字段来判断文件的类型，比如 content-type 的值是“text/html”，浏览器就会为该请求选择或者创建一个渲染进程，网络进程一边接收数据一边交给HTML 解析器，将其解析为 DOM。


## DOM 的生成流程
网络进程接受的字节流转换为 DOM 的过程：
![22 DOM树：JavaScript是如何影响DOM树构建的？-2024-02-21-23-21-53](/attachments/22%20DOM树：JavaScript是如何影响DOM树构建的？-2024-02-21-23-21-53.png)

**第一个阶段，通过分词器将字节流转换为 Token。**
![22 DOM树：JavaScript是如何影响DOM树构建的？-2024-02-21-23-23-20](/attachments/22%20DOM树：JavaScript是如何影响DOM树构建的？-2024-02-21-23-23-20.png)
Tag Token 又分 StartTag 和 EndTag，比如就是 StartTag ，就是EndTag，分别对于图中的蓝色和红色块，文本 Token 对应的绿色块。

**第二个阶段，通过解析器将 Token 转换为 DOM 节点。同时将 DOM 节点添加到 DOM 树中。**

HTML 解析器维护了一个 Token 栈结构，该 Token 栈主要用来计算节点之间的父子关系。
```html
<html>
<body>
    <div>1</div>
    <div>test</div>
</body>
</html>
```

一：HTML 解析器开始工作，默认**创建一个根为 document 的空 DOM 结构，同时将一个 StartTag document 的 Token 压入栈底。**

然后经过分词器解析出来的第一个 StartTag html Token 会被压入到栈中，并创建一个 html 的 DOM 节点，添加到 document 上，
![22 DOM树：JavaScript是如何影响DOM树构建的？-2024-02-21-23-50-20](/attachments/22%20DOM树：JavaScript是如何影响DOM树构建的？-2024-02-21-23-50-20.png)

二：解析出来 StartTag body 和 StartTag div
![22 DOM树：JavaScript是如何影响DOM树构建的？-2024-02-21-23-54-10](/attachments/22%20DOM树：JavaScript是如何影响DOM树构建的？-2024-02-21-23-54-10.png)

三：第一个 div 的文本 Token，渲染引擎会为该 Token 创建一个文本节点并将该 Token 添加到 DOM 中。**它的父节点就是当前 Token 栈顶元素对应的节点**
![22 DOM树：JavaScript是如何影响DOM树构建的？-2024-02-21-23-55-26](/attachments/22%20DOM树：JavaScript是如何影响DOM树构建的？-2024-02-21-23-55-26.png)

四：解析出来第一个 EndTag div、HTML 解析器去判断当前栈顶的元素是否是 StartTag div，是则从栈顶弹出 StartTag div。
![22 DOM树：JavaScript是如何影响DOM树构建的？-2024-02-21-23-56-08](/attachments/22%20DOM树：JavaScript是如何影响DOM树构建的？-2024-02-21-23-56-08.png)

五：一路解析
![22 DOM树：JavaScript是如何影响DOM树构建的？-2024-02-21-23-56-37](/attachments/22%20DOM树：JavaScript是如何影响DOM树构建的？-2024-02-21-23-56-37.png)

## JavaScript 是如何影响 DOM 生成的

### 直接内嵌 JavaScript 脚本
```html
<html>
<body>
    <div>1</div>
    <script>
    let div1 = document.getElementsByTagName('div')[0]
    div1.innerText = 'time.geekbang'
    </script>
    <div>test</div>
</body>
</html>
```
在两段 div 中间插入了一段 JavaScript 脚本

当解析到 script 标签时，**渲染引擎判断这是一段脚本，HTML 解析器会暂停 DOM 的解析，将 script 标签中的内容交给 JavaScript 引擎执行**

因为接下来的 JavaScript 可能要修改当前已经生成的 DOM 结构。

当解析到 script 脚本标签，但是JavaScript 引擎还没有介入时的DOM 树结构

![22 DOM树：JavaScript是如何影响DOM树构建的？-2024-02-22-22-36-28](/attachments/22%20DOM树：JavaScript是如何影响DOM树构建的？-2024-02-22-22-36-28.png)

JavaScript 引擎介入，并执行 script 标签中的这段脚本结束后，div 节点内容已经修改为 time.geekbang 了。

### 在页面中引入 JavaScript 文件
```javascript
//foo.js
let div1 = document.getElementsByTagName('div')[0]
div1.innerText = 'time.geekbang'
```

```html
<html>
<body>
    <div>1</div>
    <script type="text/javascript" src='foo.js'></script>
    <div>test</div>
</body>
</html>
```

执行到 JavaScript 标签时，HTML 解析器会**暂停 DOM 的解析，将 foo.js 文件交给网络进程去加载，JavaScript 文件的下载过程会阻塞 DOM 解析，加载完成后交给 JavaScript 引擎执行。**

针对 JavaScript 文件的加载，浏览器会有一些优化策略，比如预解析，预加载等。 当渲染引擎接受到网络进程发来的数据，会开启一个预解析线程，用来分析 HTML 文件中包含的 JavaScript、CSS 等相关文件，解析到相关文件之后，预解析线程会提前下载这些文件。

### async 或 defer
如果 JavaScript 文件中没有操作 DOM 相关代码，就可以通过 async 或 defer 将该 JavaScript 脚本设置为异步加载

- async：当浏览器解析到这个 script 标签时，会停止解析 HTML，**并且立即下载并执行该脚本，执行完毕后再继续解析 HTML。**
- defer：当浏览器解析到这个 script 标签时，会停止解析 HTML，**并且立即下载该脚本，但是不会执行，直到 HTML 解析完毕之后，DOMContentLoaded 事件之前执行。**


