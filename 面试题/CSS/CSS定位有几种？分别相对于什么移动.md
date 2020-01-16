# CSS 定位属性详解

[掘金](https://juejin.im/post/5a1bb35ff265da43231ab164)

## 一、文档流和 position 属性介绍

#### 1. 文档流

在介绍 postion 之前，有必要先了解下文档流。

简单说就是元素按照其在 HTML 中的位置顺序决定排布的过程。HTML 的布局机制就是用文档流模型的，即块元素（block）独占一行，内联元素（inline），不独占一行。

一般使用 margin 是用来隔开元素与元素的间距；padding 是用来隔开元素与内容的间隔。margin 用于布局分开元素使元素与元素互不相干；padding 用于元素与内容之间的间隔，让内容（文字）与（包裹）元素之间有一段“距离”。

只要不是 float 和绝对定位方式布局的，都在文档流里面。
表现如下：

```html
<div style="border:1px solid black">div1</div>
<div style="border:1px solid red">div2</div>
这是一张图片
<img src="test.png" />
```

![表现](https://user-gold-cdn.xitu.io/2017/11/27/15ffc349c0fb5c53?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

#### 2. position 属性介绍

- static，默认值。位置设置为 static 的元素，它始终会处于文档流给予的位置。
- inherit，规定应该从父元素继承 position 属性的值。但是任何的版本的 Internet Explorer （包括 IE8）都不支持属性值 “inherit”。
- fixed，生成绝对定位的元素。默认情况下，可定位于**相对于浏览器窗口**的指定坐标。元素的位置通过 “left”, “top”, “right” 以及 “bottom” 属性进行规定。不论窗口滚动与否，元素都会留在那个位置。**但当祖先元素具有 transform 属性且不为 none 时**，就会**相对于祖先元素**指定坐标，而不是浏览器窗口。
- absolute，生成绝对定位的元素，相对于距该元素最近的已定位的祖先元素进行定位。如果元素没有已定位的祖先元素，那么它的位置相对于<html>。此元素的位置可通过 “left”、”top”、”right” 以及 “bottom” 属性来规定。
- relative，生成相对定位的元素，**相对于该元素在文档中的初始位置进行定位**。通过 “left”、”top”、”right” 以及 “bottom” 属性来设置此元素相对于自身位置的偏移。  
  **不管是哪种定位，都必须有一个参照物。找对了参照物，就成功了一半。**

## 二、static 定位

HTML 元素的默认值，即没有定位，遵循正常的文档流对象。
静态定位的元素不会受到 top, bottom, left, right 影响。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>菜鸟教程(runoob.com)</title>
    <style>
      div.static {
        position: static;
        border: 3px solid #73ad21;
      }
    </style>
  </head>
  <body>
    <h2>position: static;</h2>

    <p>使用 position: static; 定位的元素，无特殊定位，遵循正常的文档流对象:</p>

    <div class="static">
      该元素使用了 position: static;
    </div>
  </body>
</html>
```

点击此处[查看 DEMO](https://www.runoob.com/try/try.php?filename=trycss_position_static)

## 三、relative 相对定位

**relative**生成相对定位的元素，相对于其正常位置进行定位。且原来的位置依旧存在

相对定位完成的过程如下：

- 按默认方式（static）生成一个元素(并且元素像层一样浮动了起来)。
- 相对于以前的位置移动，移动的方向和幅度由 left、right、top、bottom 属性确定，偏移前的位置保留不动。

实例：

```css
<style type="text/css">
        #box1 {
            margin: 20px;
            width: 200px;
            height: 200px;
            background-color: yellow;
        }
        #box2 {
            margin: 20px;
            width: 200px;
            height: 200px;
            background-color: red;
            /*position: relative;
            left: 100px;
            top: 100px;*/
        }
    </style>

    <div id="box1"></div>
    <div id="box2"></div>
```

其中 box2 中的注释代码未生效前，是按照文档流进行排序呈现。

![注释代码未生效前](https://user-gold-cdn.xitu.io/2017/11/27/15ffc349bb52b5e2?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

但是，当注释代码取消注释生效后，就会相对文档流中应当呈现的位置进行移动。

![image](https://user-gold-cdn.xitu.io/2017/11/27/15ffc349c1e56d91?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

**所以，相对定位的参照物是它本身。**

## 四、absolute 绝对定位

绝对定位与相对定位的一大不同之处就是，当我们把一个元素设置成绝对定位，那么**这个元素将会脱离文档流**，

其他元素就会认为这个元素不存在于文档流中而填充它原来的位置。绝对定位元素根据它的参照物移动自己的位置，而参照物则需要根据它祖先元素的定位设置来确定。

所谓根据它祖先元素的定位设置来确定简单理解为：相对于该元素最近的已定位的祖先元素，如果没有一个祖先元素设置定位，那么参照物是 body 层。

![image](https://user-gold-cdn.xitu.io/2017/11/27/15ffc349bb665a60?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

以上面的图形来展示绝对定位的特性。可以看出最里层是两个盒子，外面嵌套了两层祖先元素。

#### 1. 祖先元素没定位

在祖先元素没定位的情况下，使用 absolute。

```css
#box1 {
  width: 150px;
  height: 150px;
  margin-left: 20px;
  margin-bottom: 20px;
  background-color: yellow;
  position: absolute;
  top: 30px;
  left: 30px;
}
```

![image](https://user-gold-cdn.xitu.io/2017/11/27/15ffc349bad17584?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

**在这种情况下，参考物就是 body。**

#### 2.祖先元素有定位

祖先元素只要设置了值不为**position:static**之外的值，都视为有定位，并且最近的祖先元素会被设置为绝对定位元素的参照物。

```css
#orange {
  width: 400px;
  height: 400px;
  background-color: orange;
  position: absolute;
}

#box1 {
  width: 150px;
  height: 150px;
  margin-left: 20px;
  margin-bottom: 20px;
  background-color: yellow;
  position: absolute;
  top: 30px;
  left: 220px;
}
```

![image](https://user-gold-cdn.xitu.io/2017/11/27/15ffc349c101faa4?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

**在这种情况下，参考物就是最近的祖先元素。**

除了上述两种情况外，在用户没给 absolute 元素设置 left/right、top/bottom 的情况下，所对应的参考物会有变化。

#### 3. 未设置 left/right、top/bottom

在没设置 left/right、top/bottom 的情况下，absolute 元素的位置就是该元素在文档流里的位置
#box1 {
width: 150px;
height: 150px;
margin-left: 20px;
margin-bottom: 20px;
background-color: yellow;
position: absolute;
}
  
![image](https://user-gold-cdn.xitu.io/2017/11/27/15ffc349f552bf2d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

上图可以看出两个盒子重叠了，这是因为：absolute 元素由于没有设置 left/right、top/bottom 就按照其应该在文档流中出现的位置进行定位，而 absolute 元素脱离文档流，红色的盒子元素并不知道 absolute 元素的存在，就继续放置在该位置，并且 absolute 元素会覆盖正常文档流中的元素。

## 五、fixed 固定定位

fixed 定位
元素的位置相对于浏览器窗口是固定位置。
即使窗口是滚动的它也不会移动：

fixed 定位不为元素预留空间，而是通过指定元素相对于屏幕视口（viewport）的位置来指定元素位置

**当元素祖先的 transform 属性非 none 时，容器由视口改为该祖先。**
这一句很重要，

也就是一个元素的「祖先元素」有设置 transform 属性且不为 none,
那么这个时候，fixed 就是基于这个元素定位了，而不是基于「窗口定位」

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>菜鸟教程(runoob.com)</title>
    <style>
      p.pos_fixed {
        position: fixed;
        top: 30px;
        right: 5px;
      }
    </style>
  </head>
  <body>
    <p class="pos_fixed">Some more text</p>
    <p><b>注意:</b> IE7 和 IE8 支持只有一个 !DOCTYPE 指定固定值.</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
  </body>
</html>
```

点击此处[查看 Demo](https://www.runoob.com/try/try.php?filename=trycss_position_fixed)

## 六、sticky 定位

sticky 英文字面意思是粘，粘贴，所以可以把它称之为粘性定位。

position: sticky; 基于用户的滚动位置来定位。

粘性定位的元素是依赖于用户的滚动，在 position:relative 与 position:fixed 定位之间切换。

它的行为就像 position:relative; 而当页面滚动超出目标区域时，它的表现就像 position:fixed;，它会固定在目标位置。

元素定位表现为在跨越特定阈值前为相对定位，之后为固定定位。

这个特定阈值指的是 top, right, bottom 或 left 之一，换言之，指定 top, right, bottom 或 left 四个阈值其中之一，才可使粘性定位生效。否则其行为与相对定位相同。

**注意:** Internet Explorer, Edge 15 及更早 IE 版本不支持 sticky 定位。 Safari 需要使用 -webkit- prefix (查看以下实例)。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>菜鸟教程(runoob.com)</title>
    <style>
      div.sticky {
        position: -webkit-sticky;
        position: sticky;
        top: 0;
        padding: 5px;
        background-color: #cae8ca;
        border: 2px solid #4caf50;
      }
    </style>
  </head>
  <body>
    <p>尝试滚动页面。</p>
    <p>注意: IE/Edge 15 及更早 IE 版本不支持 sticky 属性。</p>

    <div class="sticky">我是粘性定位!</div>

    <div style="padding-bottom:2000px">
      <p>滚动我</p>
      <p>来回滚动我</p>
      <p>滚动我</p>
      <p>来回滚动我</p>
      <p>滚动我</p>
      <p>来回滚动我</p>
    </div>
  </body>
</html>
```

**[尝试一下](https://www.runoob.com/try/try.php?filename=trycss_position_sticky)**
