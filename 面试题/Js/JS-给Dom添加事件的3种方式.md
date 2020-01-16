# JS 给Dom添加事件的3种方式
[简书](https://www.jianshu.com/p/40f2918bf136)
## 1.在html中添加事件

直接在dom对象上注册事件名称，就是DOM0写法，所有浏览器支持
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Test</title>

</head>
<body>

 <button onclick='handle()'>12123123</button> 
 <script>
  function handle(){
    alert('hello world')
  }
  </script>
</body>
</html>
```
## 2.在js中添加事件
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Test</title>

</head>
<body>
  <button id='aaa'>12123123</button>
  <script>
    function handle(){
      alert('hello world')
    }
    //document.getElementById('aaa').onclick=function(){alert('hello world')};
    document.getElementById('aaa').onclick=handle
  </script>
</body>
</html>
```
js里面有两种写法
另外有趣的一点是如果document.getElementById('aaa').onclick=handle
写成
document.getElementById('aaa').onclick=handle()
会是什么情况?
加括号会默认为window的函数调用,不点击就会执行，不加才是#aaa的onclick调用
```html
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>无标题文档</title>
<style>
#div1{width:100px; height:100px; background:red;}
</style>

</head>
<body>
<div id="div1"></div>
<script>

  document.getElementById('div1').onclick=function(){
fn1(1)


  function fn1(a){
      alert(a)
  }; 
};
</script>
</body>
</html>
```
## 3.监听事件
dom2事件通过addEventListener事件绑定，有三个阶段

事件捕获阶段
处于目标阶段
事件冒泡阶段

可以同时绑定多个事件，按顺序执行；

如果绑定的函数为匿名函数，则不能将监听事件移除。addEventListener事件地第三个参数：第三个参数false，表示在事件第三阶段（冒泡）触发，true表示在事件第一阶段（捕获）触发。
```html
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>无标题文档</title>
<style>
#div1{width:100px; height:100px; background:red;}
</style>

</head>
<body>
<div id="div1"></div>
<script>

  document.getElementById('div1').addEventListener('click',function(){

this.style.backgroundColor='yellow';

})
</script>
</body>
</html>
```
如果要传参，参照js绑定传参处理。

dom3级事件，包含焦点事件，键盘事件等等；
阻止冒泡事件： 

window.event? window.event.cancelBubble = true : e.stopPropagation();

前者兼容ie，后者是w3c标准
