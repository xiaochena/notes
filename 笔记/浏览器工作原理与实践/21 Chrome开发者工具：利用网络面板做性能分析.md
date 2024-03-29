# 21 | Chrome开发者工具：利用网络面板做性能分析

## Chrome 开发者工具
![21 Chrome开发者工具：利用网络面板做性能分析-2024-02-16-16-20-49](/attachments/21%20Chrome开发者工具：利用网络面板做性能分析-2024-02-16-16-20-49.png)

它一共包含了 10 个功能面板，包括了 Elements、Console、Sources、NetWork、Performance、Memory、Application、Security、Audits 和 Layers。

![21 Chrome开发者工具：利用网络面板做性能分析-2024-02-16-16-21-29](/attachments/21%20Chrome开发者工具：利用网络面板做性能分析-2024-02-16-16-21-29.png)


## 网络面板
网络面板由控制器、过滤器、抓图信息、时间线、详细列表和下载信息概要这 6 个区域构成（如下图所示）。

![21 Chrome开发者工具：利用网络面板做性能分析-2024-02-16-16-23-03](/attachments/21%20Chrome开发者工具：利用网络面板做性能分析-2024-02-16-16-23-03.png)

**1.控制器**

其中，控制器有 4 个比较重要的功能，
![21 Chrome开发者工具：利用网络面板做性能分析-2024-02-16-16-23-43](/attachments/21%20Chrome开发者工具：利用网络面板做性能分析-2024-02-16-16-23-43.png)

**2.过滤器**

主要就是起过滤功能。可以通过过滤器模块来筛选你想要的文件类型。

**3.抓图信息**

可以用来分析用户等待页面加载时间内所看到的内容，分析用户实际的体验情况。

**4.时间线**

时间线，主要用来展示 HTTP、HTTPS、WebSocket 加载的状态和时间的一个关系，用于直观感受页面的加载过程。如果是多条竖线堆叠在一起，那说明这些资源被同时被加载。

**5.详细列表**

这个区域是最重要的，它详细记录了每个资源从发起请求到完成请求这中间所有过程的状态，以及最终请求完成的数据信息。
**6.下载信息概要**

重点关注下 DOMContentLoaded 和 Load 两个事件
- DOMContentLoaded，这个事件发生后，说明页面已经构建好 DOM 了，这意味着构建 DOM 所需要的 HTML 文件、JavaScript 文件、CSS 文件都已经下载完成了。
- Load，说明浏览器已经加载了所有的资源（图像、样式表等）。

### 网络面板中的详细列表

**1. 列表的属性**

Name、Status、Type、Initiator 等等。
![21 Chrome开发者工具：利用网络面板做性能分析-2024-02-16-16-33-35](/attachments/21%20Chrome开发者工具：利用网络面板做性能分析-2024-02-16-16-33-35.png)

默认情况下，列表是按请求发起的时间来排序的，最早发起请求的资源在顶部。

**2. 详细信息**

如果你选中详细列表中的一项，右边就会出现该项的详细信息

![21 Chrome开发者工具：利用网络面板做性能分析-2024-02-16-16-34-08](/attachments/21%20Chrome开发者工具：利用网络面板做性能分析-2024-02-16-16-34-08.png)

**时间线**

HTTP 请求流程

![21 Chrome开发者工具：利用网络面板做性能分析-2024-02-16-16-34-51](/attachments/21%20Chrome开发者工具：利用网络面板做性能分析-2024-02-16-16-34-51.png)

发起一个 HTTP 请求之后，浏览器首先查找缓存，如果缓存没有命中，那么继续发起 DNS 请求获取 IP 地址，然后利用 IP 地址和服务器端建立 TCP 连接，再发送 HTTP 请求，等待服务器响应；不过，如果服务器响应头中包含了重定向的信息，那么整个流程就需要重新再走一遍。

详细列表中是如何表示出这个流程的呢？这就要重点看下时间线面板了。

![21 Chrome开发者工具：利用网络面板做性能分析-2024-02-16-16-35-43](/attachments/21%20Chrome开发者工具：利用网络面板做性能分析-2024-02-16-16-35-43.png)

**`第一个是 Queuing`**，也就是排队的意思当浏览器发起一个请求的时候，会有很多原因导致该请求不能被立即执行，而是需要排队等待。
- 首先，页面中的资源是有优先级的，比如 CSS、HTML、JavaScript 等都是页面中的核心文件，所以优先级最高；而图片、视频、音频这类资源就不是核心资源，优先级就比较低。通常当后者遇到前者时，就需要“让路”，进入待排队状态。
- 其次，我们前面也提到过，浏览器会为每个域名最多维护 6 个 TCP 连接，如果发起一个 HTTP 请求时，这 6 个 TCP 连接都处于忙碌状态，那么这个请求就会处于排队状态。
- 最后，网络进程在为数据分配磁盘空间时，新的 HTTP 请求也需要短暂地等待磁盘分配结束。

**`Stalled`**，它表示停滞的意思。在发起连接之前，还有一些原因可能导致连接过程被推迟

如果你使用了代理服务器，还会增加一个 **`Proxy Negotiation`** 阶段，也就是代理协商阶段，它表示代理服务器连接协商所用的时间，

**`Initial connection/SSL`**, 初始链接/SSL，也就是和服务器建立连接的阶段，这包括了建立 TCP 连接所花费的时间；不过如果你使用了 HTTPS 协议，那么还需要一个额外的 SSL 握手时间，这个过程主要是用来协商一些加密信息的。

**`Request sent`**,准备请求数据，并将其发送给网络。

**`Waiting (TTFB)`**, 等待服务器响应，也就是等待服务器响应的时间，这个时间包括了服务器处理请求的时间和网络传输的时间。

**`Content Download`**,下载内容从服务器响应后到接收到全部响应数据所用的时间。


## 优化时间线上耗时项
**1. 排队（Queuing）时间过久**：

大概率是由浏览器为每个域名最多维护 6 个连接导致的。可以让 1 个站点下面的资源放在多个域名下面，比如放到 3 个域名下面，这样就可以同时支持 18 个连接了，这种方案称为**域名分片技术**。或把站点升级到 HTTP2，因为 HTTP2 已经没有每个域名最多维护 6 个 TCP 连接的限制了。

**2. 第一字节时间（TTFB）时间过久**

可能的原因有：
- **服务器生成页面数据的时间过久**。
- **网络的原因**。比如使用了低带宽的服务器，或者本来用的是电信的服务器，可联通的网络用户要来访问你的服务器，这样也会拖慢网速。
- **发送请求头时带上了多余的用户信息**。比如一些不必要的 Cookie 信息