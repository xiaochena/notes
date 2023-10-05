# 基于 umi-request 的下载、打印 excel 表格(Post 请求)

项目:海口市数据统计

需求:

1. 下载 excel 并且给 excel 赋予后端在 content-disposition 中定义的文件名

2. 打印 excel 中的数据

## 一、excel 下载

### 1. 获取 excel 表格数据

使用`umi-request`调用后端接口，`/flowApi/exportExcel`。

在请求中设置请求返回类型 `responseType: "blob"`:这样将会在响应中的二进制数据自动得到一个 Blob 对象。

```javascript
import request from "umi-request";

export const DownLoadExcel = () =>
  request("http://47.111.3.71:8082/flowApi/exportExcel", {
    method: "POST",
    data: data,
    responseType: "blob", // 代表内存之中的一段为二进制大对象
  });
```

> Blob 也是比较有意思，mdn 上的解释是 Blob 对象表示不可变的类似文件对象的原始数据。Blob 表示不一定是 JavaScript 原生形式的数据。
>
> 其实就是英文`Binary large Object`（二进制大对象），mysql 有此类型数据结构

vue：点击按钮调用接口

```html
<el-button type="primary" @click="Download">下载excel按钮</el-button>
```

```javascript
async Download() {
  const response = await DownLoadExcel();
  console.log(response, "response");
},
```

后端返回二进制文件流时，比如获取后端返回的 excel 表格，前端一般接到的是一堆乱码数据

![基于umi-request的下载、打印excel表格(Post请求)-2023-10-05-11-00-10](/attachments/基于umi-request的下载、打印excel表格(Post请求)-2023-10-05-11-00-10.png)

而设置了`responseType: "blob"`之后通过打印`console.log(res, "res");`可以发现获取的 res 为一个 blob 对象

![基于umi-request的下载、打印excel表格(Post请求)-2023-10-05-11-00-25](/attachments/基于umi-request的下载、打印excel表格(Post请求)-2023-10-05-11-00-25.png)

完整的下载按钮调用下载接口为：

Request:

```javascript
import request from "umi-request";

export const DownLoadExcel = () =>
  request("http://47.111.3.71:8082/flowApi/exportExcel", {
    method: "POST",
    data: data,
    responseType: "blob", // 代表内存之中的一段为二进制大对象
  });
```

Vue:

```html
<el-button type="primary" @click="Download">下载excel按钮</el-button>
```

JavaScript:

```javascript
async Download() {
  const blob = await DownLoadExcel();
  let link = document.createElement("a");
  link.href = URL.createObjectURL( new Blob([blob], { type: "application/vnd.ms-excel" }) );
  link.download = '下载.xlsx';
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(link.href);
  document.body.removeChild(link);
},
```

### 2. 获取后端在 content-disposition 中定义的文件名

上面我们给下载的文件设置了其下载名称以及后缀名，但是有时候是文件名需要后端来返回,首先我们查看接受到的请求头

1. 查看调用接口返回的信息: 发现后端将文件名存在了`content-disposition`中

![基于umi-request的下载、打印excel表格(Post请求)-2023-10-05-11-00-39](/attachments/基于umi-request的下载、打印excel表格(Post请求)-2023-10-05-11-00-39.png)

这里要注意一下，虽然我们在浏览器中看得到，但是我们并不能拿到这个请求头

打印出来的数据只能拿到默认的响应头

默认的响应头：

- Cache-Control
- Content-Language
- Content-Type
- Expires
- Last-Modified
- Pragma

如果想让浏览器能访问到其他响应头的话，`需要后端在服务器上设置Access-Control-Expose-Headers`

```http
Access-Control-Expose-Headers : 'content-disposition'
```

后端大致的写法:

```http
headers.add("Access-Control-Expose-Headers", "Content-Disposition");
```

这样才可以在 response 中通过`const disposition = response.headers.get('Content-Disposition');`

2. decodeURI 的使用

直接取得的`disposition` 还是 URI 编码格式的，因此我们还需要使用 window.decodeURI()方法对 URI 进行解码。

```javascript
// decodeURI 作用
decodeURI("http://www.w3school.com.cn/My%20first/");
// 输出 http://www.w3school.com.cn/My first/
```

3. 现在让我们从头开始

首先我们修改发送请求

```javascript
import request from "umi-request";

export const DownLoadExcel = () =>
  request("http://47.111.3.71:8082/flowApi/exportExcel", {
    method: "POST",
    data: data,
    // responseType: "blob", // 注释掉这一段
  });
```

这样在调用的时候

```html
<el-button type="primary" @click="Download">下载excel按钮</el-button>
```

```javascript
async Download() {
  const response = await DownLoadExcel();
  console.log(response, "response");
},
```

通过打印我们获得的是如下的一大段二进制编码、我们没办法在这里获取请求头

> （也可能是我姿势不对(￣ ε(#￣)）

![基于umi-request的下载、打印excel表格(Post请求)-2023-10-05-11-00-49](/attachments/基于umi-request的下载、打印excel表格(Post请求)-2023-10-05-11-00-49.png)

别慌，我们设置`umi-request`响应拦截，处理获得的数据并且获取请求头

```javascript
request.interceptors.response.use(async (response) => {
  const disposition = response.headers.get("Content-Disposition"); // 获取Content-Disposition
  return disposition // 当Content-Disposition中有值的时候进行处理，其他请求的响应则放过
    ? {
        blob: await response.blob(), // 将二进制的数据转为blob对象，这一步是异步的因此使用async/await
        fileName: decodeURI(disposition.split(";")[1].split("filename=")[1]), // 处理Content-Disposition，获取header中的文件名
      }
    : response;
});
```

这样子在`console.log(response, "response");`中打印的数据被我处理为：

![基于umi-request的下载、打印excel表格(Post请求)-2023-10-05-11-00-57](/attachments/基于umi-request的下载、打印excel表格(Post请求)-2023-10-05-11-00-57.png)

这样我们即获取了 excel 的 blob 对象，同时也获取了`content-disposition`中的文件名

### 3. 完整的代码结构

完整的下载代码结构为：

Request:

```javascript
import request from "umi-request";

// 响应拦截
request.interceptors.response.use(async (response) => {
  const disposition = response.headers.get("Content-Disposition"); // 获取Content-Disposition
  return disposition // 当Content-Disposition中有值的时候进行处理，其他请求的响应则放过
    ? {
        blob: await response.blob(), // 将二进制的数据转为blob对象，这一步是异步的因此使用async/await
        fileName: decodeURI(disposition.split(";")[1].split("filename=")[1]), // 处理Content-Disposition，获取header中的文件名
      }
    : response;
});

export const DownLoadExcel = () =>
  request("http://47.111.3.71:8082/flowApi/exportExcel", {
    method: "POST",
    data: data,
    // responseType: "blob", // 注释掉这一段
  });
```

Vue:

```html
<el-button type="primary" @click="Download">下载excel按钮</el-button>
```

JavaScript：

```javascript
async Download() {
  const response = await DownLoadExcel();
  const { blob, fileName } = response;
  let link = document.createElement("a");
  link.href = URL.createObjectURL( new Blob([blob], { type: "application/vnd.ms-excel" }) );
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(link.href);
  document.body.removeChild(link);
},
```

## 二、打印 XLSX、或将 XLSX 转为 HTML

### 1. JS 调用`iframe`实现打印页面、保证原页面不失效

创建一个 Vue 按钮，用来触发打印事件，调用`Print`方法

```html
<el-button type="primary" @click="print">打印excel按钮</el-button>
```

print 方法：

```javascript
print() {
  // 创建 iframe 标签，并设置样式
  const iframe = document.createElement("IFRAME");
  iframe.setAttribute(
    "style",
    "position:absolute;width:0px;height:0px;left:-500px;top:-500px;"
  );

  document.body.appendChild(iframe);
  const doc = iframe.contentWindow.document;
  doc.write("这里是要打印的内容");

  doc.close();
  iframe.contentWindow.focus();
  iframe.contentWindow.print();
  setTimeout(() => {
    document.body.removeChild(iframe);
  }, 2000);
},
```

这样就可以给`IFRAME`传入数据，在保证原页面不失效的情况下进行打印。

### 2. 将 xlsx 转为 HTML

这里我们需要使用到一个 js 插件，由[SheetJS](https://sheetjs.com/)出品的`js-xlsx`。

```
npm install xlsx --save
```

官方 github：https://github.com/SheetJS/js-xlsx

这一部分还算简单，我们只需要知道如何使用`js-xlsx`就好[[SheetJS\] js-xlsx 模块学习指南](https://segmentfault.com/a/1190000018077543)

在之前的基础上因为我们在响应拦截中处理了 XLSX 文件为 Blob，因此这里我们需要将 Blob 再读取为二进制（就是将 Blob 对象再转化为二进制数据，如果一开始就是二进制数据的话就不用转换了）

```javascript
import XLSX from "xlsx";

const reader = new FileReader();
reader.readAsBinaryString(blob);

reader.onload = (e) => {
  var data = e.target.result;
  // data 就是我们要的二进制数据
};
```

再由`js-xlsx`解析

```javascript
import XLSX from "xlsx";

const reader = new FileReader();
reader.readAsBinaryString(blob);

reader.onload = (e) => {
  var data = e.target.result;
  const wb = XLSX.read(data, {
    type: "binary", // 输出的数据类型
  });
  // 解析xlsx生成html表格
  const xlsxHTML = XLSX.utils.sheet_to_html(wb.Sheets[wb.SheetNames[0]]);
  console.log(xlsxHTML, "xlsxHTML");
};
```

- 输入类型

字符串可以多种方式解析。在`type`为参数`read` 告诉库如何解析数据参数：

| `type`     | 预期输入                                              |
| ---------- | ----------------------------------------------------- |
| `"base64"` | 字符串：文件的Base64编码                              |
| `"binary"` | 字符串：二进制字符串（字节`n`为`data.charCodeAt(n)`） |
| `"string"` | 字符串：JS字符串（字符解释为UTF8）                    |
| `"buffer"` | nodejs缓冲区                                          |
| `"array"`  | 数组：8位无符号整数数组（字节`n`为`data[n]`）         |
| `"file"`   | 字符串：将被读取的文件的路径（仅nodejs）              |

通过打印`xlsxHTML`可以看见输出为：

```
<html><head><meta charset="utf-8"/><title>SheetJS Table Export</title></head><body><table><tr><td colspan="2" t="s" id="sjs-A1" v="路口车辆流量（按路口）">路口车辆流量（按路口）</td></tr><tr><td t="s" id="sjs-A2" v="时间">时间</td><td t="s" id="sjs-B2" v="车辆流量">车辆流量</td></tr><tr><td t="s" id="sjs-A3" v="2020-07-17 21:55">2020-07-17 21:55</td><td t="s" id="sjs-B3" v="12">12</td></tr><tr><td t="s" id="sjs-A4" v="2020-07-17 22:25">2020-07-17 22:25</td><td t="s" id="sjs-B4" v="2">2</td></tr><tr><td t="s" id="sjs-A5" v="2020-07-17 22:55">2020-07-17 22:55</td><td t="s" id="sjs-B5" v="6">6</td></tr></table></body></html> xlsxHTML
```

接下来使用`IFRAME`来打印这一段`HTML`

完整的代码为：

HTML

```html
<el-button type="primary" @click="print">打印excel按钮</el-button>
```

JavaScript

```javascript
async print() {
  const response = await DownLoadExcel();
  const { blob } = response;

  const reader = new FileReader();
  reader.readAsBinaryString(blob);
  reader.onload = (e) => {
    var data = e.target.result;
    const wb = XLSX.read(data, {
      type: "binary",
    });
    // 解析xlsx生成html表格
    const xlsxHTML = XLSX.utils.sheet_to_html(wb.Sheets[wb.SheetNames[0]]);

    const iframe = document.createElement("IFRAME");
    iframe.setAttribute(
      "style",
      "position:absolute;width:0px;height:0px;left:-500px;top:-500px;"
    );

    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.body.innerHTML = xlsxHTML;

    // 设置打印页眉
    const Title = doc.body.getElementsByTagName("title")[0];
    Title.innerText = "海口市道路交通数据统计系统";

    // 设置表格样式
    const Table = doc.getElementsByTagName("table")[0];
    Table.setAttribute(
      "style",
      "border-collapse: collapse; text-align: center;"
    );
    Table.setAttribute("border", "2");
    Table.setAttribute("cellpadding", "6");
    Table.setAttribute("width", "90%");
    Table.setAttribute("align", "center");

    doc.close();
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 2000);
  };
},
```
