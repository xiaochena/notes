# script 标签中 defer 和 async 的区别

## script

当浏览器加载 HTML 并遇到`<script>...</script>`标签时，它无法继续构建 DOM。它必须立即执行脚本。外部脚本`<script src="..."></script>`也是如此：<u>浏览器必须等待脚本下载，执行下载的脚本，然后才能处理页面的其余部分。</u>它会“阻塞页面”。在下载并运行之前，用户无法看到页面内容。

## defer

`defer`属性告诉浏览器不要等待脚本，浏览器会继续处理 HTML，构建 DOM。<u>该脚本“在后台”加载，然后在 DOM 完全构建完成后再运行。</u>

```html
<p>...content before script...</p>

<script
  defer
  src="https://javascript.info/article/script-async-defer/long.js?speed=1"
></script>

<!-- 不等待脚本,立即显示 -->
<p>...content after script...</p>
```

`defer`脚本总是在 DOM 准备好时执行（但在`DOMContentLoaded`事件之前）

> 当纯 HTML 被完全加载以及解析时，**`DOMContentLoaded`** 事件会被触发，而不必等待样式表，图片或者子框架完成加载。

`defer`**脚本保持相对顺序来执行**，就像常规脚本一样

## async

`async`属性意味着该脚本是完全独立的：

- 浏览器不会阻止 async 脚本

- 其他脚本也不会等待 async 脚本，async 脚本也不会等待其他脚本

- ```
  DOMContentLoaded
  ```

  和 async 脚本不会互相等待

  - `DOMContentLoaded`可能在 async 脚本执行之前触发（如果 async 脚本在页面解析完成后完成加载）
  - 或在 async 脚本执行之后触发（如果 async 脚本很快加载完成或在 HTTP 缓存中）

简单来说就是 async 脚本在后台加载完就**立即运行**

### Dynamic scripts 动态脚本

创建一个脚本并使用 JavaScript 将其动态添加到文档中

```javascript
let script = document.createElement("script");
script.src = "/article/script-async-defer/long.js";
document.body.append(script); // (*)
```

当脚本被添加到文档后立即开始加载

默认情况下，动态脚本表现为"async"

当然也可以设置 `script.async=false`，这样脚本会表现为 defer

---

> async 和 defer 属性都仅适用于外部脚本，如果 script 标签没有 src 属性，尽管写了 async、defer 属性也会被忽略

### 总结

1. script 是会阻碍 HTML 解析的，只有下载好并执行完脚本才会继续解析 HTML
2. defer 和 async 有一个共同点：**下载**此类脚本都不会阻止页面呈现（异步加载），区别在于：
   - 加载顺序：async 执行与文档顺序无关，先加载哪个就先执行哪个；defer 会按照文档中的顺序执行
   - 执行时机：async 脚本加载完成后立即执行，可以在 DOM 尚未完全下载完成就加载和执行；而 defer 脚本需要等到文档所有元素解析完成之后才执行
