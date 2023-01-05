# HTML 行元素之间出现空白间隙原因及解决办法

## 一、背景介绍

## 1. inline-block 到底是什么？

#### 关于 inline-block 在 display 里的英文解释：

This value causes an element to generate an inline-level block container. The inside of an inline-block is formatted as a block box, and the element itself is formatted as an atomic inline-level box.

#### 大致意思就是：

inline-block 后的元素创建了一个行级的块容器，该元素内部（内容）被格式化成一个块元素，同时元素本身则被格式化成一个行内元素。

#### 一句话解释：

它是一个格式化为行内元素的块容器。兼具行内元素和块元素的特点。

## 2. inline-block 为什么会有间距？

归根结底这是一个西文排版的问题。

#### 举一个很简单的例子：

I am very happy

南京市长江大桥欢迎您

英文有空格作为词分界，而中文则没有。（这背后延伸出一个中文分词的问题）

这个问题的原因可以上述到 SGML(标准通用标记语言)和 TeX(排版工具)，它实际上是一个行内（inline）的问题，它由空格、换行或回车所产生空白符所致

而 html 还有一个空白字符压缩的特点，你换行也好，tab 也好，多个空格也好，都会压缩成一个空格

## 二、解决方案

方法 1: 改变书写方式

方法 2：font-size

方法 3：使用 margin 负值

方法 4：使用 word-spacing 或 letter-spacing

#### 1. 改变书写方式

也就是不换行

```html
<ul>
  <li>one</li>
  <li>two</li>
  <li>three</li>
</ul>
```

或者通过将上一个元素的闭合标签与下一个元素的开始标签写在同一行

```html
<ul>
  <li>one</li>
  <li>two</li>
  <li>three</li>
</ul>
```

或者将两个 inline-block 元素间加上空白注释

```html
<ul>
  <li>one</li>
  <!--  
    -->
  <li>two</li>
  <!--  
    -->
  <li>three</li>
</ul>
```

或者干脆不写元素的闭合标签等

```html
<ul>
  <li>one</li>
  <li>two</li>
  <li>three</li>
</ul>
```

缺点：这样写代码，太不优雅了，解读性太差。

这种方案是最直接的解决方案，但却也是最不靠谱的方案，存在很多不可控因素。 很多场景会让你崩溃：前后端协同；版本更迭；他人接手；自己忘了...，太多一不小心都可能让这个方案失效。

#### 方法 2：font-size

父元素设置 font-size 为 0，子元素单独再设置字体大小

但如果不需要文字的话，就很完美了。

```css
ul {
  font-size: 0;
}
ul > li {
  font-size: 16px;
}
```

#### 方法 3：使用 margin 负值

margin 负值的大小与上下文的字体和文字大小相关，Arial 字体的 margin 负值为-3 像素，Tahoma 和 Verdana 就是-4 像素，而 Geneva 为-6 像素。由于外部环境的不确定性，以及最后一个元素多出的父 margin 值等问题，这个方法不适合大规模使用。

```css
li {
  margin-right: -3px;
}
```

#### 方法 4：使用 word-spacing 或 letter-spacing

一个是字符间距(letter-spacing)一个是单词间距(word-spacing)，大同小异。

letter-spacing 子元素要设置 letter-spacing 为 0，不然会继承父元素的值；使用 word-spacing 时，只需设置父元素 word-spacing 为合适值即可。

使用 letter-spacing 和 word-spacing 时，其在不同浏览器下效果不同。

###### letter-spacing

```css
ul {
  letter-spacing: -0.5em;
}
ul > li {
  letter-spacing: 0;
}
```

###### word-spacing

```css
ul {
  word-spacing: -0.5em;
}
ul > li {
  word-spacing: 0;
}
```

## 参考文献

参考：张鑫旭-鑫空间-鑫生活
https://www.zhangxinxu.com/wordpress/2012/04/inline-block-space-remove-%E5%8E%BB%E9%99%A4%E9%97%B4%E8%B7%9D/

参考：CSS Flexible Box Layout Module Level 1
https://drafts.csswg.org/css-flexbox/

参考：使用 CSS 弹性盒子
https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout/Using_CSS_flexible_boxes

参考：有哪些好方法能处理 display: inline-block 元素之间出现的空格？
https://www.zhihu.com/question/21468450

参考：如何裁剪 CSS/JS 文件(使用 UglifyJS 和 UglifyCSS)
http://wiki.jikexueyuan.com/project/symfony-cookbook/minify-cssjs.html

参考：代码压缩 UglifyJS ——解决了 display:inline-block 之间留白问题
http://www.jianshu.com/p/ece740688a01
