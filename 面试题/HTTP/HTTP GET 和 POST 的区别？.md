# GET 和 POST 的区别？ 。
参考连接：[知乎](https://www.zhihu.com/question/28586791)

>这个问题虽然看上去很初级，但实际上却涉及到方方面面，这也就是为啥面试里老爱问这个的原因之一。

HTTP最早被用来做浏览器与服务器之间交互HTML和表单的通讯协议；后来又被被广泛的扩充到接口格式的定义上。所以在讨论GET和POST区别的时候，需要现确定下到底是浏览器使用的GET/POST还是用HTTP作为接口传输协议的场景。

## 一、浏览器的GET和POST
这里特指浏览器中非Ajax的HTTP请求，即从HTML和浏览器诞生就一直使用的HTTP协议中的GET/POST。浏览器用GET请求来获取一个html页面/图片/css/js等资源；用POST来提交一个<form>表单，并得到一个结果的网页。

浏览器将GET和POST定义为
#### GET
“读取“一个资源。比如Get到一个html文件。反复读取不应该对访问的数据有副作用。比如”GET一下，用户就下单了，返回订单已受理“，这是不可接受的。没有副作用被称为“幂等“（Idempotent)。

因为GET因为是读取，就可以对GET请求的数据做缓存。这个缓存可以做到浏览器本身上（彻底避免浏览器发请求），也可以做到代理上（如nginx），或者做到server端（用Etag，至少可以减少带宽消耗）
#### POST
在页面里<form>标签会定义一个表单。点击其中的submit元素会发出一个POST请求让服务器做一件事。这件事往往是有副作用的，不幂等的。

不幂等也就意味着不能随意多次执行。因此也就不能缓存。比如通过POST下一个单，服务器创建了新的订单，然后返回订单成功的界面。这个页面不能被缓存。试想一下，如果POST请求被浏览器缓存了，那么下单请求就可以不向服务器发请求，而直接返回本地缓存的“下单成功界面”，却又没有真的在服务器下单。那是一件多么滑稽的事情。

因为POST可能有副作用，所以浏览器实现为不能把POST请求保存为书签。想想，如果点一下书签就下一个单，是不是很恐怖？。

此外如果尝试重新执行POST请求，浏览器也会弹一个框提示下这个刷新可能会有副作用，询问要不要继续。
![在chrome中尝试重新提交表单会弹框。](https://pic4.zhimg.com/80/v2-cf007063e5b1416e95935ffa9bcc6470_hd.jpg)
---
当然，服务器的开发者完全可以把GET实现为有副作用；把POST实现为没有副作用。只不过这和浏览器的预期不符。把GET实现为有副作用是个很可怕的事情。 我依稀记得很久之前百度贴吧有一个因为使用GET请求可以修改管理员的权限而造成的安全漏洞。反过来，把没有副作用的请求用POST实现，浏览器该弹框还是会弹框，对用户体验好处改善不大。

###### 扩充
GET和POST携带数据的格式也有区别。当浏览器发出一个GET请求时，就意味着要么是用户自己在浏览器的地址栏输入，要不就是点击了html里a标签的href中的url。所以其实并不是GET只能用url，而是浏览器直接发出的GET只能由一个url触发。所以没办法，GET上要在url之外带一些参数就只能依靠url上附带querystring。但是HTTP协议本身并没有这个限制。        

浏览器的POST请求都来自表单提交。每次提交，表单的数据被浏览器用编码到HTTP请求的body里。浏览器发出的POST请求的body主要有有两种格式，一种是application/x-www-form-urlencoded用来传输简单的数据，大概就是"key1=value1&key2=value2"这样的格式。另外一种是传文件，会采用multipart/form-data格式。采用后者是因为application/x-www-form-urlencoded的编码方式对于文件这种二进制的数据非常低效。  

浏览器在POST一个表单时，url上也可以带参数，只要<form action="url" >里的url带querystring就行。只不过表单里面的那些用<input> 等标签经过用户操作产生的数据都在会在body里。

因此我们一般会泛泛的说“GET请求没有body，只有url，请求数据放在url的querystring中；POST请求的数据在body中“。但这种情况仅限于浏览器发请求的场景。

##  二、 接口中的GET和POST    
这里是指通过浏览器的Ajax api，或者iOS/Android的App的http    client，java的commons-httpclient/okhttp或者是curl，postman之类的工具发出来的GET和POST请求。此时GET/POST不光能用在前端和后端的交互中，还能用在后端各个子服务的调用中（即当一种RPC协议使用）。尽管RPC有很多协议，比如thrift，grpc，但是http本身已经有大量的现成的支持工具可以使用，并且对人类很友好，容易debug。HTTP协议在微服务中的使用是相当普遍的。

当用HTTP实现接口发送请求时，就没有浏览器中那么多限制了，只要是符合HTTP格式的就可以发。HTTP请求的格式，大概是这样的一个字符串（为了美观，我在\r\n后都换行一下）：
```
<METHOD> <URL> HTTP/1.1\r\n 
<Header1>: <HeaderValue1>\r\n   
<Header2>: <HeaderValue2>\r\n   
...     
<HeaderN>: <HeaderValueN>\r\n   
...    
<Body Data....>
```

其中的“<METHOD>"可以是GET也可以是POST，或者其他的HTTP Method，如PUT、DELETE、OPTION……。从协议本身看，并没有什么限制说GET一定不能没有body，POST就一定不能把参放到<URL>的querystring上。因此其实可以更加自由的去利用格式。比如Elastic Search的_search api就用了带body的GET；也可以自己开发接口让POST一半的参数放在url的querystring里，另外一半放body里；你甚至还可以让所有的参数都放Header里——可以做各种各样的定制，只要请求的客户端和服务器端能够约定好。

当然，太自由也带来了另一种麻烦，开发人员不得不每次讨论确定参数是放url的path里，querystring里，body里，header里这种问题，太低效了。于是就有了一些列接口规范/风格。其中名气最大的当属REST。REST充分运用GET、POST、PUT和DELETE，约定了这4个接口分别获取、创建、替换和删除“资源”，REST最佳实践还推荐在请求体使用json格式。这样仅仅通过看HTTP的method就可以明白接口是什么意思，并且解析格式也得到了统一。

>  json相对于x-www-form-urlencoded的优势在于1）可以有嵌套结构；以及 2）可以支持更丰富的数据类型。通过一些框架，json可以直接被服务器代码映射为业务实体。用起来十分方便。但是如果是写一个接口支持上传文件，那么还是multipart/form-data格式更合适。

REST中GET和POST不是随便用的。在REST中, 【GET】 + 【资源定位符】被专用于获取资源或者资源列表，比如：
```
GET http://foo.com/books          获取书籍列表    
GET http://foo.com/books/:bookId  根据bookId获取一本具体的书
```

与浏览器的场景类似，REST GET也不应该有副作用，于是可以被反复无脑调用。浏览器（包括浏览器的Ajax请求）对于这种GET也可以实现缓存（如果服务器端提示了明确需要Caching）；但是如果用非浏览器，有没有缓存完全看客户端的实现了。当然，也可以从整个App角度，也可以完全绕开浏览器的缓存机制，实现一套业务定制的缓存框架。
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

这里你就能留意到浏览器中用来实现表单提交的POST，和REST里实现创建资源的POST语义上的不同。
###### 扩充：
>顺便讲下REST POST和REST PUT的区别。有些api是使用PUT作为创建资源的Method。PUT与POST的区别在于，PUT的实际语义是“replace”replace。REST规范里提到PUT的请求体应该是完整的资源，包括id在内。比如上面的创建一本书的api也可以定义为：
```http
PUT http://foo.com/books
{
  "id": "BOOK:affe001bbe0556a",
  "title": "大宽宽的碎碎念",
  "author": "大宽宽",
  ...
}
```
>服务器应该先根据请求提供的id进行查找，如果存在一个对应id的元素，就用请求中的数据整体替换已经存在的资源；如果没有，就用“把这个id对应的资源从【空】替换为【请求数据】“。直观看起来就是“创建”了。

>与PUT相比，POST更像是一个“factory”，通过一组必要的数据创建出完整的资源。
至于到底用PUT还是POST创建资源，完全要看是不是提前可以知道资源所有的数据（尤其是id），以及是不是完整替换。比如对于AWS S3这样的对象存储服务，当想上传一个新资源时，其id就是“ObjectName”可以提前知道；同时这个api也总是完整的replace整个资源。这时的api用PUT的语义更合适；而对于那些id是服务器端自动生成的场景，POST更合适一些。

有点跑题，就此打住。
## 三、关于安全性
我们常听到GET不如POST安全，因为POST用body传输数据，而GET用url传输，更加容易看到。但是从攻击的角度，无论是GET还是POST都不够安全，因为HTTP本身是**明文协议。每个HTTP请求和返回的每个byte都会在网络上传播，不管是url，header还是body**。这完全不是一个“是否容易在浏览器地址栏上看到“的问题。   
为了避免传输中数据被窃取，必须做从客户端到服务器的端端加密。业界的通行做法就是https——即用SSL协议协商出的密钥加密明文的http数据。这个加密的协议和HTTP协议本身相互独立。如果是利用HTTP开发公网的站点/App，要保证安全，https是最最基本的要求。
> 当然，端端加密并不一定非得用https。比如国内金融领域都会用私有网络，也有GB的加密协议SM系列。但除了军队，金融等特殊机构之外，似乎并没有必要自己发明一套类似于ssl的协议。

回到HTTP本身，的确GET请求的参数更倾向于放在url上，因此有更多机会被泄漏。比如携带私密信息的url会展示在地址栏上，还可以分享给第三方，就非常不安全了。此外，从客户端到服务器端，有大量的中间节点，包括网关，代理等。他们的access log通常会输出完整的url，比如nginx的默认access log就是如此。如果url上携带敏感数据，就会被记录下来。但请注意，就算私密数据在body里，也是可以被记录下来的，因此如果请求要经过不信任的公网，避免泄密的唯一手段就是https。这里说的“避免access log泄漏“仅仅是指避免可信区域中的http代理的默认行为带来的安全隐患。比如你是不太希望让自己公司的运维同学从公司主网关的log里看到用户的密码吧.
![image](https://pic4.zhimg.com/80/v2-df2df6dc0f0717f126bdfd67a52b4de9_hd.jpg)

另外，上面讲过，如果是用作接口，GET实际上也可以带body，POST也可以在url上携带数据。所以实际上到底怎么传输私密数据，要看具体场景具体分析。当然，绝大多数场景，用POST + body里写私密数据是合理的选择。一个典型的例子就是“登录”：
```http
POST http://foo.com/user/login
{
  "username": "dakuankuan",
  "passowrd": "12345678"
}
```
安全是一个巨大的主题，有由很多细节组成的一个完备体系，比如返回私密数据的mask，XSS，CSRF，跨域安全，前端加密，钓鱼，salt，…… POST和GET在安全这件事上仅仅是个小角色。因此单独讨论POST和GET本身哪个更安全意义并不是太大。只要记得一般情况下，私密数据传输用POST + body就好。 
## 四、关于编码
常见的说法有，比如GET的参数只能支持ASCII，而POST能支持任意binary，包括中文。但其实从上面可以看到，GET和POST实际上都能用url和body。因此所谓编码确切地说应该是http中url用什么编码，body用什么编码。
先说下url。url只能支持ASCII的说法源自于[RFC1738](https://link.zhihu.com/?target=https%3A//www.ietf.org/rfc/rfc1738.txt)
> Thus, only alphanumerics, the special characters "$-_.+!*'(),", and
reserved characters used for their reserved purposes may be used
unencoded within a URL.

> 只有字母数字、特殊字符“$- .+!*”()和用于保留目的的保留字符可以在URL中不加编码地使用。

实际上这里规定的仅仅是一个ASCII的子集[a-zA-Z0-9$-_.+!*'(),]。它们是可以“不经编码”在url中使用。比如尽管空格也是ASCII字符，但是不能直接用在url里。    
以下省略    
[GET 和 POST的区别？](https://www.zhihu.com/question/28586791ttps://note.youdao.com/)     
[关于url的编码](http://www.ruanyifeng.com/blog/2010/02/url_encoding.html)
## 关于数据限制
因为上面提到了不论是GET和POST都可以使用URL传递数据，所以我们常说的“GET数据有长度限制“其实是指”URL的长度限制“。

HTTP协议本身对URL长度并没有做任何规定。实际的限制是由客户端/浏览器以及服务器端决定的。

先说浏览器。不同浏览器不太一样。比如我们常说的2048个字符的限制，其实是IE8的限制。并且原始文档的说的其实是“URL的最大长度是2083个字符，path的部分最长是2048个字符“。见https://support.microsoft.com/en-us/help/208427/maximum-url-length-is-2-083-characters-in-internet-explorer。IE8之后的IE URL限制我没有查到明确的文档，但有些资料称IE 11的地址栏只能输入法2047个字符，但是允许用户点击html里的超长URL。我没实验，哪位有兴趣可以试试。   
Chrome的URL限制是2MB，Safari，Firefox等浏览器也有自己的限制，但都比IE大的多，