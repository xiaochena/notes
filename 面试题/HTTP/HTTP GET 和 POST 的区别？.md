# GET 和 POST 的区别？ 。

参考连接：[知乎](https://www.zhihu.com/question/28586791)

> 这个问题虽然看上去很初级，但实际上却涉及到方方面面，这也就是为啥面试里老爱问这个的原因之一。

HTTP 最早被用来做浏览器与服务器之间交互 HTML 和表单的通讯协议；后来又被被广泛的扩充到接口格式的定义上。所以在讨论 GET 和 POST 区别的时候，需要现确定下到底是浏览器使用的 GET/POST 还是用 HTTP 作为接口传输协议的场景。

## 一、浏览器的 GET 和 POST

这里特指浏览器中非 Ajax 的 HTTP 请求，即从 HTML 和浏览器诞生就一直使用的 HTTP 协议中的 GET/POST。浏览器用 GET 请求来获取一个 html 页面/图片/css/js 等资源；用 POST 来提交一个<form>表单，并得到一个结果的网页。

浏览器将 GET 和 POST 定义为

#### GET

“读取“一个资源。比如 Get 到一个 html 文件。反复读取不应该对访问的数据有副作用。比如”GET 一下，用户就下单了，返回订单已受理“，这是不可接受的。没有副作用被称为“幂等“（Idempotent)。

因为 GET 因为是读取，就可以对 GET 请求的数据做缓存。这个缓存可以做到浏览器本身上（彻底避免浏览器发请求），也可以做到代理上（如 nginx），或者做到 server 端（用 Etag，至少可以减少带宽消耗）

#### POST

在页面里<form>标签会定义一个表单。点击其中的 submit 元素会发出一个 POST 请求让服务器做一件事。这件事往往是有副作用的，不幂等的。

不幂等也就意味着不能随意多次执行。因此也就不能缓存。比如通过 POST 下一个单，服务器创建了新的订单，然后返回订单成功的界面。这个页面不能被缓存。试想一下，如果 POST 请求被浏览器缓存了，那么下单请求就可以不向服务器发请求，而直接返回本地缓存的“下单成功界面”，却又没有真的在服务器下单。那是一件多么滑稽的事情。

因为 POST 可能有副作用，所以浏览器实现为不能把 POST 请求保存为书签。想想，如果点一下书签就下一个单，是不是很恐怖？。

此外如果尝试重新执行 POST 请求，浏览器也会弹一个框提示下这个刷新可能会有副作用，询问要不要继续。
![在chrome中尝试重新提交表单会弹框。](https://pic4.zhimg.com/80/v2-cf007063e5b1416e95935ffa9bcc6470_hd.jpg)

---

当然，服务器的开发者完全可以把 GET 实现为有副作用；把 POST 实现为没有副作用。只不过这和浏览器的预期不符。把 GET 实现为有副作用是个很可怕的事情。 我依稀记得很久之前百度贴吧有一个因为使用 GET 请求可以修改管理员的权限而造成的安全漏洞。反过来，把没有副作用的请求用 POST 实现，浏览器该弹框还是会弹框，对用户体验好处改善不大。

###### 扩充

GET 和 POST 携带数据的格式也有区别。当浏览器发出一个 GET 请求时，就意味着要么是用户自己在浏览器的地址栏输入，要不就是点击了 html 里 a 标签的 href 中的 url。所以其实并不是 GET 只能用 url，而是浏览器直接发出的 GET 只能由一个 url 触发。所以没办法，GET 上要在 url 之外带一些参数就只能依靠 url 上附带 querystring。但是 HTTP 协议本身并没有这个限制。

浏览器的 POST 请求都来自表单提交。每次提交，表单的数据被浏览器用编码到 HTTP 请求的 body 里。浏览器发出的 POST 请求的 body 主要有有两种格式，一种是 application/x-www-form-urlencoded 用来传输简单的数据，大概就是"key1=value1&key2=value2"这样的格式。另外一种是传文件，会采用 multipart/form-data 格式。采用后者是因为 application/x-www-form-urlencoded 的编码方式对于文件这种二进制的数据非常低效。

浏览器在 POST 一个表单时，url 上也可以带参数，只要<form action="url" >里的 url 带 querystring 就行。只不过表单里面的那些用<input> 等标签经过用户操作产生的数据都在会在 body 里。

因此我们一般会泛泛的说“GET 请求没有 body，只有 url，请求数据放在 url 的 querystring 中；POST 请求的数据在 body 中“。但这种情况仅限于浏览器发请求的场景。

## 二、 接口中的 GET 和 POST

这里是指通过浏览器的 Ajax api，或者 iOS/Android 的 App 的 http client，java 的 commons-httpclient/okhttp 或者是 curl，postman 之类的工具发出来的 GET 和 POST 请求。此时 GET/POST 不光能用在前端和后端的交互中，还能用在后端各个子服务的调用中（即当一种 RPC 协议使用）。尽管 RPC 有很多协议，比如 thrift，grpc，但是 http 本身已经有大量的现成的支持工具可以使用，并且对人类很友好，容易 debug。HTTP 协议在微服务中的使用是相当普遍的。

当用 HTTP 实现接口发送请求时，就没有浏览器中那么多限制了，只要是符合 HTTP 格式的就可以发。HTTP 请求的格式，大概是这样的一个字符串（为了美观，我在\r\n 后都换行一下）：

```
<METHOD> <URL> HTTP/1.1\r\n
<Header1>: <HeaderValue1>\r\n
<Header2>: <HeaderValue2>\r\n
...
<HeaderN>: <HeaderValueN>\r\n
...
<Body Data....>
```

其中的“<METHOD>"可以是 GET 也可以是 POST，或者其他的 HTTP Method，如 PUT、DELETE、OPTION……。从协议本身看，并没有什么限制说 GET 一定不能没有 body，POST 就一定不能把参放到<URL>的 querystring 上。因此其实可以更加自由的去利用格式。比如 Elastic Search 的\_search api 就用了带 body 的 GET；也可以自己开发接口让 POST 一半的参数放在 url 的 querystring 里，另外一半放 body 里；你甚至还可以让所有的参数都放 Header 里——可以做各种各样的定制，只要请求的客户端和服务器端能够约定好。

当然，太自由也带来了另一种麻烦，开发人员不得不每次讨论确定参数是放 url 的 path 里，querystring 里，body 里，header 里这种问题，太低效了。于是就有了一些列接口规范/风格。其中名气最大的当属 REST。REST 充分运用 GET、POST、PUT 和 DELETE，约定了这 4 个接口分别获取、创建、替换和删除“资源”，REST 最佳实践还推荐在请求体使用 json 格式。这样仅仅通过看 HTTP 的 method 就可以明白接口是什么意思，并且解析格式也得到了统一。

> json 相对于 x-www-form-urlencoded 的优势在于 1）可以有嵌套结构；以及 2）可以支持更丰富的数据类型。通过一些框架，json 可以直接被服务器代码映射为业务实体。用起来十分方便。但是如果是写一个接口支持上传文件，那么还是 multipart/form-data 格式更合适。

REST 中 GET 和 POST 不是随便用的。在 REST 中, 【GET】 + 【资源定位符】被专用于获取资源或者资源列表，比如：

```
GET http://foo.com/books          获取书籍列表
GET http://foo.com/books/:bookId  根据bookId获取一本具体的书
```

与浏览器的场景类似，REST GET 也不应该有副作用，于是可以被反复无脑调用。浏览器（包括浏览器的 Ajax 请求）对于这种 GET 也可以实现缓存（如果服务器端提示了明确需要 Caching）；但是如果用非浏览器，有没有缓存完全看客户端的实现了。当然，也可以从整个 App 角度，也可以完全绕开浏览器的缓存机制，实现一套业务定制的缓存框架。
![image](https://pic4.zhimg.com/80/v2-d4e4eb5464ee621a83ad3925177ce775_hd.jpg)

REST 【POST】+ 【资源定位符】则用于“创建一个资源”，比如：

```HTTP
POST http://foo.com/books
{
  "title": "大宽宽的碎碎念",
  "author": "大宽宽",
  ...
}
```

这里你就能留意到浏览器中用来实现表单提交的 POST，和 REST 里实现创建资源的 POST 语义上的不同。

###### 扩充：

> 顺便讲下 REST POST 和 REST PUT 的区别。有些 api 是使用 PUT 作为创建资源的 Method。PUT 与 POST 的区别在于，PUT 的实际语义是“replace”replace。REST 规范里提到 PUT 的请求体应该是完整的资源，包括 id 在内。比如上面的创建一本书的 api 也可以定义为：

```http
PUT http://foo.com/books
{
  "id": "BOOK:affe001bbe0556a",
  "title": "大宽宽的碎碎念",
  "author": "大宽宽",
  ...
}
```

> 服务器应该先根据请求提供的 id 进行查找，如果存在一个对应 id 的元素，就用请求中的数据整体替换已经存在的资源；如果没有，就用“把这个 id 对应的资源从【空】替换为【请求数据】“。直观看起来就是“创建”了。

> 与 PUT 相比，POST 更像是一个“factory”，通过一组必要的数据创建出完整的资源。
> 至于到底用 PUT 还是 POST 创建资源，完全要看是不是提前可以知道资源所有的数据（尤其是 id），以及是不是完整替换。比如对于 AWS S3 这样的对象存储服务，当想上传一个新资源时，其 id 就是“ObjectName”可以提前知道；同时这个 api 也总是完整的 replace 整个资源。这时的 api 用 PUT 的语义更合适；而对于那些 id 是服务器端自动生成的场景，POST 更合适一些。

有点跑题，就此打住。

## 三、关于安全性

我们常听到 GET 不如 POST 安全，因为 POST 用 body 传输数据，而 GET 用 url 传输，更加容易看到。但是从攻击的角度，无论是 GET 还是 POST 都不够安全，因为 HTTP 本身是**明文协议。每个 HTTP 请求和返回的每个 byte 都会在网络上传播，不管是 url，header 还是 body**。这完全不是一个“是否容易在浏览器地址栏上看到“的问题。  
为了避免传输中数据被窃取，必须做从客户端到服务器的端端加密。业界的通行做法就是 https——即用 SSL 协议协商出的密钥加密明文的 http 数据。这个加密的协议和 HTTP 协议本身相互独立。如果是利用 HTTP 开发公网的站点/App，要保证安全，https 是最最基本的要求。

> 当然，端端加密并不一定非得用 https。比如国内金融领域都会用私有网络，也有 GB 的加密协议 SM 系列。但除了军队，金融等特殊机构之外，似乎并没有必要自己发明一套类似于 ssl 的协议。

回到 HTTP 本身，的确 GET 请求的参数更倾向于放在 url 上，因此有更多机会被泄漏。比如携带私密信息的 url 会展示在地址栏上，还可以分享给第三方，就非常不安全了。此外，从客户端到服务器端，有大量的中间节点，包括网关，代理等。他们的 access log 通常会输出完整的 url，比如 nginx 的默认 access log 就是如此。如果 url 上携带敏感数据，就会被记录下来。但请注意，就算私密数据在 body 里，也是可以被记录下来的，因此如果请求要经过不信任的公网，避免泄密的唯一手段就是 https。这里说的“避免 access log 泄漏“仅仅是指避免可信区域中的 http 代理的默认行为带来的安全隐患。比如你是不太希望让自己公司的运维同学从公司主网关的 log 里看到用户的密码吧.
![image](https://pic4.zhimg.com/80/v2-df2df6dc0f0717f126bdfd67a52b4de9_hd.jpg)

另外，上面讲过，如果是用作接口，GET 实际上也可以带 body，POST 也可以在 url 上携带数据。所以实际上到底怎么传输私密数据，要看具体场景具体分析。当然，绝大多数场景，用 POST + body 里写私密数据是合理的选择。一个典型的例子就是“登录”：

```http
POST http://foo.com/user/login
{
  "username": "dakuankuan",
  "passowrd": "12345678"
}
```

安全是一个巨大的主题，有由很多细节组成的一个完备体系，比如返回私密数据的 mask，XSS，CSRF，跨域安全，前端加密，钓鱼，salt，…… POST 和 GET 在安全这件事上仅仅是个小角色。因此单独讨论 POST 和 GET 本身哪个更安全意义并不是太大。只要记得一般情况下，私密数据传输用 POST + body 就好。

## 四、关于编码

常见的说法有，比如 GET 的参数只能支持 ASCII，而 POST 能支持任意 binary，包括中文。但其实从上面可以看到，GET 和 POST 实际上都能用 url 和 body。因此所谓编码确切地说应该是 http 中 url 用什么编码，body 用什么编码。
先说下 url。url 只能支持 ASCII 的说法源自于[RFC1738](https://link.zhihu.com/?target=https%3A//www.ietf.org/rfc/rfc1738.txt)

> Thus, only alphanumerics, the special characters "\$-\_.+!\*'(),", and
> reserved characters used for their reserved purposes may be used
> unencoded within a URL.

> 只有字母数字、特殊字符“\$- .+!\*”()和用于保留目的的保留字符可以在 URL 中不加编码地使用。

实际上这里规定的仅仅是一个 ASCII 的子集[a-zA-Z0-9$-_.+!*'(),]。它们是可以“不经编码”在 url 中使用。比如尽管空格也是 ASCII 字符，但是不能直接用在 url 里。  
以下省略  
[GET 和 POST 的区别？](https://www.zhihu.com/question/28586791ttps://note.youdao.com/)  
[关于 url 的编码](http://www.ruanyifeng.com/blog/2010/02/url_encoding.html)

## 关于数据限制

因为上面提到了不论是 GET 和 POST 都可以使用 URL 传递数据，所以我们常说的“GET 数据有长度限制“其实是指”URL 的长度限制“。

HTTP 协议本身对 URL 长度并没有做任何规定。实际的限制是由客户端/浏览器以及服务器端决定的。

先说浏览器。不同浏览器不太一样。比如我们常说的 2048 个字符的限制，其实是 IE8 的限制。并且原始文档的说的其实是“URL 的最大长度是 2083 个字符，path 的部分最长是 2048 个字符“。见https://support.microsoft.com/en-us/help/208427/maximum-url-length-is-2-083-characters-in-internet-explorer。IE8之后的IE URL 限制我没有查到明确的文档，但有些资料称 IE 11 的地址栏只能输入法 2047 个字符，但是允许用户点击 html 里的超长 URL。我没实验，哪位有兴趣可以试试。  
Chrome 的 URL 限制是 2MB，Safari，Firefox 等浏览器也有自己的限制，但都比 IE 大的多，
