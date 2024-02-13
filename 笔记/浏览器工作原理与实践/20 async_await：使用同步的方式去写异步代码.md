# 20 | async/await：使用同步的方式去写异步代码
首先介绍生成器（Generator）是如何工作的，接着讲解 Generator 的底层实现机制——协程（Coroutine）；又因为 async/await 使用了 Generator 和 Promise 两种技术，所以紧接着我们就通过 Generator 和 Promise 来分析 async/await 到底是如何以同步的方式来编写异步代码的。
## 生成器 VS 协程

**生成器函数是一个带星号函数，而且是可以暂停执行和恢复执行的。**
```javascript
function* genDemo() {
  console.log("开始执行第一段")
  yield 'generator 2'

  console.log("开始执行第二段")
  yield 'generator 2'

  console.log("开始执行第三段")
  yield 'generator 2'

  console.log("执行结束")
  return 'generator 2'
}

console.log('main 0')
let gen = genDemo()
console.log(gen.next().value)
console.log('main 1')
console.log(gen.next().value)
console.log('main 2')
console.log(gen.next().value)
console.log('main 3')
console.log(gen.next().value)
console.log('main 4')
```
生成器函数的特性，**可以暂停执行，也可以恢复执行。** 全局代码和 genDemo 函数交替执行。

具体使用方式：
1. 在生成器函数内部执行一段代码，如果遇到 yield 关键字，那么 JavaScript 引擎将返回关键字后面的内容给外部，并暂停该函数的执行。
2. 外部函数可以通过 next 方法恢复函数的执行。

要搞懂函数为何能暂停和恢复，那你首先要了解协程的概念。**协程是一种比线程更加轻量级的存在**。可以把协程看成是跑在线程上的任务，**一个线程上可以存在多个协程，但是在线程上同时只能执行一个协程**。正如一个进程可以拥有多个线程一样，一个线程也可以拥有多个协程。

协程不是被操作系统内核所管理，而完全是由程序所控制（也就是在用户态执行）这样带来的好处就是性能得到了很大的提升，不会像线程切换那样消耗资源。

协程执行流程图:

![20 async_await：使用同步的方式去写异步代码-2024-02-13-23-18-45](/attachments/20%20async_await：使用同步的方式去写异步代码-2024-02-13-23-18-45.png)

## async/await
async/await 技术背后的秘密就是 Promise 和生成器应用，往低层说就是微任务和协程应用。要搞清楚 async 和 await 的工作原理，我们就得对 async 和 await 分开分析。

### async
根据 MDN 定义，async 是一个通过**异步执行并隐式返回 Promise 作为结果的函数。**

这里需要重点关注两个词：**异步执行**和**隐式返回 Promise**。

```javascript
async function foo() {
  return 2
}
console.log(foo())  // Promise {<resolved>: 2}
```

### await
结合代码
```javascript
async function foo() {
  console.log(1)
  let a = await 100
  console.log(a)
  console.log(2)
}
console.log(0)
foo()
console.log(3)
```

整体执行流程图：
![20 async_await：使用同步的方式去写异步代码-2024-02-13-23-48-08](/attachments/20%20async_await：使用同步的方式去写异步代码-2024-02-13-23-48-08.png)

1. 首先，执行 `console.log(0)` 这个语句，打印出来 0。
2. 紧接着就是执行 foo 函数，由于 foo 函数是被 async 标记过的，所以当进入该函数的时候，JavaScript 引擎会保存当前的调用栈等信息，然后执行 foo 函数中的 `console.log(1)` 语句，并打印出 1。
3. 接下来就执行到 foo 函数中的await 100这个语句了，在执行await 100这个语句时，JavaScript 引擎在背后为我们默默做了太多的事情，
   
   当执行到await 100时，会默认创建一个 Promise 对象，
    ```javascript
    let promise_ = new Promise((resolve,reject){
      resolve(100)
    })
    ```
    JavaScript 引擎会将 `resolve(100)` 任务提交给微任务队列
    
    然后 JavaScript 引擎会暂停当前协程的执行，将主线程的控制权转交给父协程执行，同时会将 `promise_` 对象返回给父协程。
    
    主线程的控制权已经交给父协程了，这时候父协程要做的一件事是调用 `promise_.then` 来监控 `promise` 状态的改变。

    接下来继续执行父协程的流程，这里我们执行 `console.log(3)` ，并打印出来 3。

    随后父协程将执行结束，在结束之前，进入微任务的检查点，然后执行微任务队列，微任务队列中有 `resolve(100)` 的任务等待执行，执行到这里的时候，会触发 promise_.then 中的回调函数

    ```javascript
    promise_.then((value)=>{
      //回调函数被激活后
      //将主线程控制权交给foo协程，并将vaule值传给协程
    })
    ```
    该回调函数被激活以后，会将主线程的控制权交给 foo 函数的协程，并同时将 value 值传给该协程。
    
    foo 协程激活之后，会把刚才的 value 值赋给了变量 a，然后 foo 协程继续执行后续语句，执行完成之后，将控制权归还给父协程。


## 总结
Promise 的编程模型依然充斥着大量的 then 方法，虽然解决了回调地狱的问题，但是在语义方面依然存在缺陷，代码中充斥着大量的 then 函数

使用 async/await 可以实现用同步代码的风格来编写异步代码，

async/await 的基础技术使用了生成器和 Promise，生成器是协程的实现，利用生成器能实现生成器函数的暂停和恢复。