# CSS中的浮动和清除浮动
[简书](https://www.jianshu.com/p/09bd5873bed4)  
## 什么是浮动？
浮动核心就一句话：  
- 浮动元素会脱离文档流并向左/向右浮动，直到碰到父元素或者另一个浮动元素。请默念3次！

浮动最初设计的目的并没那么多事儿，就只是用来实现文字环绕效果而已，如下所示：
![文字环绕效果](https://upload-images.jianshu.io/upload_images/1158202-27ac63a8ae142d04.png?imageMogr2/auto-orient/strip|imageView2/2/w/457/format/webp)
但是早期的前端开发者发现：浮动的元素可以设置宽高并且可以内联排列，是介于==inline==和==block==之间的一个神奇的存在，在**inline-block**出来之前，浮动大行其道。直到inline-block出来后，浮动也有它自己独特的使用场景。

---------------------------------------------------
## 浮动有哪些特征？
浮动的特征就体现在前文的那句话中，别忘了默念三次！此外，浮动带来的负效果也算是它的特征之一。
#### 浮动会脱离文档
脱离文档，也就是说浮动不会影响普通元素的布局
![浮动会脱离文档流](https://upload-images.jianshu.io/upload_images/1158202-022687081cf649ce.png?imageMogr2/auto-orient/strip|imageView2/2/w/837/format/webp)
从上图可以看出，默认三个设置了宽高==的block==元素，本来会格子独占一行；如果框1设置了向左/向右浮动，他会忽略框2和框3，直到碰到父元素；同时也存在盖住普通元素的风险。
#### 浮动可以内联排列
浮动会向左/向右浮动，直到碰到另一个浮动元素为止，这是浮动可以内联排列的特征。也就是说，浮动可以设置宽高，并且能够一行多个，是介于==block==和==inline==之间的存在。
![浮动可以内联排列](https://upload-images.jianshu.io/upload_images/1158202-6d074de3fdb03dc1.png?imageMogr2/auto-orient/strip|imageView2/2/w/836/format/webp)
从上图可以看出，对多个元素设置浮动，可以实现类似inline-block的效果；但是如果每个元素的高度不一致，**会出现“卡住”的情况**。

#### 浮动会导致父元素高度坍塌
浮动会脱离文档流，这个问题对整个页面布局有很大的影响。
```css
.box-wrapper {
  border: 5px solid red;
}
.box-wrapper .box {
  float: left; 
  width: 100px; 
  height: 100px; 
  margin: 20px; 
  background-color: green;
}

<!-- html -->
<div class="box-wrapper">
  <div class="box"></div>
  <div class="box"></div>
  <div class="box"></div>
</div>
```
结果如下，浮动元素脱离了文档流，并不占据文档流的位置，自然父元素也就不能被撑开，所以没了高度。
![父元素高度坍塌](https://upload-images.jianshu.io/upload_images/1158202-62ba6cdb840c8262.png?imageMogr2/auto-orient/strip|imageView2/2/w/626/format/webp)
那怎么办呢？那就需要我们清除浮动，来解决高度坍塌问题！
清除浮动主要有两种方式，分别是clear清除浮动和BFC清除浮动。

#### clear如何清除浮动？
**clear属性不允许被清除浮动的元素的左边/右边挨着浮动元素，底层原理是在被清除浮动的元素上边或者下边添加足够的清除空间**。这句话，请默念5次！     
- clear语法：   
        clear : none | left | right | both
- 取值：    
        none : 默认值。允许两边都可以有浮动对象  
        left : 不允许左边有浮动对象     
        right : 不允许右边有浮动对象        
        both : 不允许有浮动对象     

要注意了，我们是通过由于==不允许==某个元素的左/右有浮动对象    
使得当前元素自动向下一行
```html
<div class="box-wrapper">
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
    <div style="clear:both;"></div>
</div>
```
![clear清除浮动](https://upload-images.jianshu.io/upload_images/1158202-95dc95435147ea24.png?imageMogr2/auto-orient/strip|imageView2/2/w/613/format/webp)
#### 在浮动元素上使用clear
但是有人问到，如果我们给第三个元素加上clear:both，结果会怎样？
```html
<div class="box-wrapper">
    <div class="box"></div>
    <div class="box"></div>
    <div class="box" style="clear:both;"></div>
</div>
```
![image](https://upload-images.jianshu.io/upload_images/1158202-6782d8a18742d175.png?imageMogr2/auto-orient/strip|imageView2/2/w/614/format/webp)
诶？给第三个元素加上==clear:both==之后，第三个元素的左右都没有挨着浮动元素，但是为什么高度还是坍塌了呢？机智的你可能发现了，由于第三个元素是浮动元素，脱离了文档流，就算给第三个元素上下加了清除空间，也是没有任何意义的。  
而由于==clear==第三个元素不允许左右有浮动元素因此该浮动元素自动跳到下一行
#### clear清除浮动最佳实践
那么clear清除浮动的最佳实践是什么呢？请看如下代码：
```css
// 现代浏览器clearfix方案，不支持IE6/7
.clearfix:after {
    display: table;
    content: " ";
    clear: both;
}

// 全浏览器通用的clearfix方案
// 引入了zoom以支持IE6/7
.clearfix:after {
    display: table;
    content: " ";
    clear: both;
}
.clearfix{
    *zoom: 1;
}

// 全浏览器通用的clearfix方案【推荐】
// 引入了zoom以支持IE6/7
// 同时加入:before以解决现代浏览器上边距折叠的问题
.clearfix:before,
.clearfix:after {
    display: table;
    content: " ";
}
.clearfix:after {
    clear: both;
}
.clearfix{
    *zoom: 1;
}
```
![image](https://upload-images.jianshu.io/upload_images/1158202-4801624dbc6162e8.png?imageMogr2/auto-orient/strip|imageView2/2/w/543/format/webp)
## BFC清除浮动
BFC全称是块状格式化上下文，它是按照块级盒子布局的。我们了解他的特征、触发方式、常见使用场景这些就够了。
#### BFC的主要特征
- BFC容器是一个隔离的容器，和其他元素互不干扰；所以我们可以用触发两个元素的BFC来解决垂直边距折叠问题。
- BFC可以包含浮动；通常用来解决浮动父元素高度坍塌的问题。    
[块格式化上下文](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context)
其中，BFC清除浮动就是用的“包含浮动”这条特性。
那么，怎样才能触发BFC呢？
#### BFC的触发方式
我们可以给父元素添加以下属性来触发BFC：

- **float 为:** left | right
- **overflow 为:** hidden | auto | scorll
- **display 为:** table-cell | table-caption | inline-block | flex | inline-flex
- **position 为:** absolute | fixed

所以我们可以给父元素设置overflow:auto来简单的实现BFC清除浮动，但是为了兼容IE最好用overflow:hidden。但是这样元素阴影或下拉菜单会被截断，比较局限。
```css
.box-wrapper{
  overflow: hidden;
}
```
#### display: flow-root
使用 overflow 来创建一个新的BFC，是因为 overflow 属性告诉浏览器你想要怎样处理溢出的内容。

当你使用这个属性只是为了创建BFC的时候，你可能会发现一些不想要的问题，比如滚动条或者一些剪切的阴影，需要注意。

另外，对于后续的开发，可能不是很清楚当时为什么使用overflow。所以你最好添加一些注释来解释为什么这样做。
一个新的 display 属性的值，它可以创建无副作用的BFC。在父级块中使用 display: flow-root 可以创建新的BFC。
```css
.box-wrapper {
      border: 5px solid red;
      display: flow-root;
    }
```

## 浮动的适用场景有哪些？
#### 文字环绕效果
这个不用说了，浮动本来就是为文字环绕效果而生，这是最基本的
![文字环绕效果](https://upload-images.jianshu.io/upload_images/1158202-27ac63a8ae142d04.png?imageMogr2/auto-orient/strip|imageView2/2/w/457/format/webp)
#### 页面布局
浮动可以实现常规的多列布局，但个人推荐使用inline-block。
浮动更适合实现自适应多列布局，比如左侧固定宽度，右侧根据父元素宽度自适应。
![页面布局](https://upload-images.jianshu.io/upload_images/1158202-27fab30165fb9883.png?imageMogr2/auto-orient/strip|imageView2/2/w/725/format/webp)
#### 多个元素内联排列
如果前文提到的，浮动可以实现类似inline-block的排列，比如菜单多个元素内联排列。但个人推荐使用==inline-block==。
![多个元素内联排列](https://upload-images.jianshu.io/upload_images/1158202-54628e91168f7e16.png?imageMogr2/auto-orient/strip|imageView2/2/w/601/format/webp)