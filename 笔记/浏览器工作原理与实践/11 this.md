# 从JavaScript执行上下文的视角讲清楚this

## JavaScript 中的 this 是什么
执行上下文中包含了变量环境、词法环境、外部环境**以及this**
![11 this-2023-09-17-14-39-19](/attachments/11%20this-2023-09-17-14-39-19.png)
**this 是和执行上下文绑定的**，也就是说每个执行上下文中都有一个 this。

> 执行上下文主要分为三种：全局执行上下文、函数执行上下文和 eval 执行上下文。    
> 所以对应的 this 也只有这三种：全局执行上下文中的 this、函数中的 this 和 eval 中的 this。

## 执行上下文中的 this
### 全局执行上下文中的 this
在控制台中输入console.log(this)来打印出来全局执行上下文中的 this，**非严格模式下，全局上下文的this指向的是window对象，严格模式下指的是undefined**

这也是 this 和作用域链的唯一交点，作用域链的最底端包含了 window 对象，全局执行上下文中的 this 也是指向 window 对象。

### 函数执行上下文中的 this
- 在默认情况下调用一个函数，其执行上下文中的 this 也是指向 window 对象的。
```js
function foo(){
  console.log(this)
}
foo() // window
```
- `call` 、`bind` 和 `apply`: 这三个方法都可以显式地指定函数执行时的 this 指向。
```js 
let bar = {
  myName : "极客邦",
  test1 : 1
}
function foo(){
  this.myName = "极客时间"
}
foo.call(bar)
console.log(bar) // {"myName":"极客时间","test1":1}
``` 
- 通过对象调用方法设置 this，执行这段代码，你可以看到，最终输出的 this 值是指向 myObj 的。
```js
var myObj = {
  name : "极客时间", 
  showThis: function(){
    console.log(this)
  }
}
myObj.showThis()
```
然而当我们把 showThis 赋给一个全局对象，然后再调用该对象，你会发现 this 又指向了全局 window 对象。
```js
var myObj = {
  name : "极客时间",
  showThis: function(){
    this.name = "极客邦"
    console.log(this)
  }
}
var foo = myObj.showThis
foo()
```

### 结论：
- **在全局环境中调用一个函数，函数内部的 this 指向的是全局变量 window。**
- **通过一个对象来调用其内部的一个方法，该方法的执行上下文中的 this 指向对象本身。**

## 3. 通过构造函数中设置
构造函数中的 this 其实就是新对象本身。
```js
function CreateObj(){
  this.name = "极客时间"
}
var myObj = new CreateObj()
```
当执行 new CreateObj() 的时候，JavaScript 引擎做了如下四件事：
- 首先创建了一个空对象 tempObj；
- 接着调用 CreateObj.call 方法，并将 tempObj 作为 call 方法的参数，这样当 CreateObj 的执行上下文创建时，它的 this 就指向了 tempObj 对象；
- 然后执行 CreateObj 函数，此时的 CreateObj 函数执行上下文中的 this 指向了 tempObj 对象；
- 最后返回 tempObj 对象。

