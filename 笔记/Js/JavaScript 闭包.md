# JavaScript 闭包

[原文链接](https://segmentfault.com/a/1190000006875662)

### 1.什么是闭包（Closure）

> 简单讲，[闭包](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)就是指有权访问另一个函数作用域中的变量的函数。

> **MDN 上面这么说：闭包是一种特殊的对象**。它由两部分构成：函数，以及创建该函数的环境。环境由闭包创建时在作用域中的任何局部变量组成。

### 2.产生一个闭包

**创建闭包最常见方式，就是在一个函数内部创建另一个函数**。下面例子中的 closure 就是一个闭包：

```JavaScript
function func(){
  var a = 1,b = 2;

  function closure(){
    return a+b;
  }
  return closure;
}
```

**闭包的作用域链包含着它自己的作用域，以及包含它的函数的作用域和全局作用域。**
