# Ajax

**AJAX**即“**Asynchronous JavaScript and XML**”（异步的[JavaScript](https://zh.wikipedia.org/wiki/JavaScript)与[XML](https://zh.wikipedia.org/wiki/XML)技术）的简称，指的是一套综合了多项技术的[浏览器](https://zh.wikipedia.org/wiki/瀏覽器)端[网页](https://zh.wikipedia.org/wiki/網頁)开发技术

## Ajax出现的原因

在Ajax没有出现的时候、几乎所有的网站都是由HTML页面实现的、服务器处理每一个用户请求都需要重新加载网页、即使只是一部分页面元素改变也要重新加载整个页面，不仅要刷新改变的部分，连没有变化的部分也要刷新。Ajax的出现使得Web应用程序更为迅捷地回应用户动作，能在不更新整个页面的前提下维护数据，并避免了在网络上发送那些没有改变的信息。

## XMLHttpRequest

[`XMLHttpRequest`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest) API 是 Ajax 的核心。

```javascript
var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function(){
  // 通信成功时，状态值为4
  if (xhr.readyState === 4){
    if (xhr.status === 200){
      console.log(xhr.responseText);
    } else {
      console.error(xhr.statusText);
    }
  }
};

xhr.onerror = function (e) {
  console.error(xhr.statusText);
};

xhr.open('GET', '/endpoint', true);
xhr.send(null);
```

## 和fetch和axios的关系

简单来说、Axios 是一个基于 Promise 网络请求库，在客户端中针对 `XMLHttpRequest`  对象进行了封装

fetch 是现代浏览器后来出现的一个请求 api ,它不是一个封装`XMLHttpRequest`  对象的库、而是全新的JavaScript的接口。而且fetch api天生就是自带Promise的

现在的Ajax就有了两种方式: `XMLHttpRequest`  对象和fetch