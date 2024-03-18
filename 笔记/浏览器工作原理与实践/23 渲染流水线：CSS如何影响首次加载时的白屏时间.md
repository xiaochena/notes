# 23 | 渲染流水线：CSS如何影响首次加载时的白屏时间

## 渲染流水线视角下的 CSS

```css
//theme.css
div{ 
    color : coral;
    background-color:black
}
```

```html
<html>
<head>
    <link href="theme.css" rel="stylesheet">
</head>
<body>
    <div>geekbang com</div>
</body>
</html>
```

![23 渲染流水线：CSS如何影响首次加载时的白屏时间-2024-03-11-22-59-36](/attachments/23%20渲染流水线：CSS如何影响首次加载时的白屏时间-2024-03-11-22-59-36.png)

当渲染进程接收 HTML 文件字节流时，会先开启一个预解析线程，如果遇到 JavaScript 文件或者 CSS 文件，那么预解析线程会提前下载这些数据。

在 DOM 构建结束之后、theme.css 文件还未下载完成的这段时间内，渲染流水线无事可做

因为下一步是合成布局树，而**合成布局树需要 CSSOM 和 DOM**，所以这里需要等待 CSS 加载结束并解析成 CSSOM。

**渲染流水线为什么需要 CSSOM？**
因为渲染引擎也是无法直接理解 CSS 文件内容的，所以需要将 CSS 文件解析成 CSSOM。

- **一是提供给 JavaScript 操作样式表的能力。**
- **二是为布局树的合成提供基础的样式信息。**

这个 CSSOM 体现在 DOM 中就是 `document.styleSheets`

有了 DOM 和 CSSOM 之后，渲染引擎就可以开始合成布局树了。**布局树的结构基本上就是复制 DOM 树的结构，不同之处在于 DOM 树中那些不需要显示的元素会被过滤掉，如 display:none 属性的元素、head 标签、script 标签等**

之后渲染引擎会为对应的 DOM 元素选择对应的样式信息，这个过程就是**样式计算**。
样式计算完成之后，渲染引擎还需要计算布局树中每个元素对应的几何位置，这个过程就是**计算布局。**

通过样式计算和计算布局就完成了最终布局树的构建。再之后，就该进行后续的绘制操作了。

## 有了 JavaScript 时的渲染流水线

```css
/* theme.css */
div{ 
    color : coral;
    background-color:black
}
```

```html
<html>
<head>
    <link href="theme.css" rel="stylesheet">
</head>
<body>
    <div>geekbang com</div>
    <script>
        console.log('time.geekbang.org')
    </script>
    <div>geekbang com</div>
</body>
</html>
```

![23 渲染流水线：CSS如何影响首次加载时的白屏时间-2024-03-12-08-42-38](/attachments/23%20渲染流水线：CSS如何影响首次加载时的白屏时间-2024-03-12-08-42-38.png)

- 因为 **JavaScript 有可能会修改当前状态下的 DOM**。所以渲染引擎在解析 DOM 的过程中，如果遇到了 JavaScript 脚本，那么需要先暂停 DOM 解析去执行 JavaScript
- 因为 **JavaScript 有修改 CSSOM 的能力**。所以在执行 JavaScript 之前，还需要依赖 CSSOM。那么渲染引擎需要等待 `<link href="theme.css" rel="stylesheet"/>` 的下载,还需要将这些内容转换为 CSSOM, 也就是说 **CSS 在部分情况下也会阻塞 DOM 的生成。**
