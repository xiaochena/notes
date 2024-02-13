# 19 | Promise：使用Promise，告别回调函数
Promise 解决的是异步编码风格的问题

## 回调函数的问题：
### 代码逻辑不连续
异步回调会影响到我们的编码方式。假设有一个下载的需求，使用 XMLHttpRequest 来实现，
```js
//执行状态
function onResolve(response){console.log(response) }
function onReject(error){console.log(error) }

let xhr = new XMLHttpRequest()
xhr.ontimeout = function(e) { onReject(e)}
xhr.onerror = function(e) { onReject(e) }
xhr.onreadystatechange = function () { onResolve(xhr.response) }

//设置请求类型，请求URL，是否同步信息
let URL = 'https://time.geekbang.com'
xhr.open('Get', URL, true);

//设置参数
xhr.timeout = 3000 //设置xhr请求的超时时间
xhr.responseType = "text" //设置响应返回的数据格式
xhr.setRequestHeader("X_TEST","time.geekbang")

//发出请求
xhr.send();
```
五次回调，导致代码的逻辑不连贯、不线性，非常不符合人的直觉。

### 回调地狱
一旦接触到稍微复杂点的项目时，如果嵌套了太多的回调函数就很容易使得自己陷入了回调地狱，不能自拔。
```js
$.ajax({
  url: '/api/data1',
  success: function(data1) {
    $.ajax({
      url: '/api/data2?param=' + data1,
      success: function(data2) {
        $.ajax({
          url: '/api/data3?param=' + data2,
          success: function(data3) {
            // 处理 data3
            console.log(data3);
          },
          error: function() {
            console.error('Error in fetching data3');
          }
        });
      },
      error: function() {
        console.error('Error in fetching data2');
      }
    });
  },
  error: function() {
    console.error('Error in fetching data1');
  }
});
```

## Promise 
以上两个问题都可以通过 Promise 来解决。
```js
function getData(url) {
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: url,
      success: function(data) {
        resolve(data);
      },
      error: function(error) {
        reject(error);
      }
    });
  });
}

getData('/api/data1')
  .then(function(data1) {
    return getData('/api/data2?param=' + data1);
  })
  .then(function(data2) {
    return getData('/api/data3?param=' + data2);
  })
  .then(function(data3) {
    // 处理 data3
    console.log(data3);
  })
  .catch(function(error) {
    // 处理错误
    console.error('Error in fetching data:', error);
  });
```

## 总结
`Promise` 解决了以下问题:
1. **`Promise` 封装异步代码，让处理流程变得线性**，更符合人的直觉。解决异步函数代码逻辑不连续、回调地狱的问题。
2. **消灭嵌套调用和多次错误处理**