# Vue 异步加载在生命周期哪个阶段更合理

参考连接：[掘金](https://juejin.im/post/5c408be9f265da614f709043)

react 高阶面试题中有这么一道：为什么异步请求数据在 didMount 阶段更合适？同为 MVVM 中的翘楚，Vue 是否也有类似问题呢？另外，我在平时也无开发过程中也会发现，每个人选择的那个生命周期阶段去异步请求数据总会不一样，因此引发思考，到底哪个阶段更适合异步请求数据呢？在产品设计和用户体验方面又会有哪些影响？本篇记录就是为了解决这两个问题。

## 一、Vue 生命周期

首先再老话重提过一下 Vue 生命周期，以及每个阶段都做了什么事。

#### 1. beforeCreated：

生成\$options 选项，并给实例添加生命周期相关属性。在实例初始化之后，在 数据观测(data observer) 和 event/watcher 事件配置之前被调用，

也就是说，data，watcher，methods 都不存在这个阶段。但是有一个对象存在，那就是\$route，因此此阶段就可以根据路由信息进行重定向等操作。

#### 2. created：

初始化与依赖注入相关的操作，会遍历传入 methods 的选项，初始化选项数据，从$options获取数据选项(vm.$options.data)，给数据添加‘观察器’对象并创建观察器，定义 getter、setter 存储器属性。

在实例创建之后被调用，该阶段可以访问 data，使用 watcher、events、methods。

也就是说 数据观测(data observer) 和 event/watcher 事件配置 已完成。但是此时 dom 还没有被挂载。该阶段允许执行 http 请求操作。

#### 3. beforeMount：

将 HTML 解析生成 AST 节点，再根据 AST 节点动态生成渲染函数。
**相关 render 函数首次被调用(划重点)。**

#### 4. mounted：

在挂载完成之后被调用，执行 render 函数生成虚拟 dom，创建真实 dom 替换虚拟 dom，并挂载到实例。

可以操作 dom，比如事件监听

#### 5. beforeUpdate：

$vm.data更新之后，虚拟dom重新渲染之前被调用。在这个钩子可以修改$vm.data，并不会触发附加的重渲染过程。

#### 6. updated：

虚拟 dom 重新渲染后调用，若再次修改\$vm.data，会再次触发 beforeUpdate、updated，进入死循环。

#### 7. beforeDestroy：

实例被销毁前调用，也就是说在这个阶段还是可以调用实例的。

#### 8. destroyed：

实例被销毁后调用，所有的事件监听器已被移除，子实例被销毁。

总结来说，虚拟 dom 开始渲染是在 beforeMount 时，dom 实例挂载完成在 mounted 阶段显示。

那么接下来了解就是 render 函数。

```js
// render示例：
export default {
   data () {
       return {
           menu_items: []   // 请求返回如：[{fullname: '页面一'},{fullname: '页面二'},{fullname: '页面三'},{fullname: '页面四'}]
       }
   }, 　　render (createElement){　　　　return createElement(
          // 1. 第一个参数，要渲染的标签名称(必填)
          'ul',
          // 2. 第二个参数，1中要渲染的标签的属性，或者文本元素(可选)　　　　　　{

               class: {'uk-nav': true},           },          // 3. 第三个参数，1中标签的子元素，详情看官方文档(可选)
　　　　    this.menu_items.map(item=>createElement('li',item.fullname)))

       )　　}}
```

render 函数最终返回的是 createNodeDescription(节点描述)，即俗称 virtual node(虚拟节点)。用 template 写的话，就是下面这样：

```html
<template>
  <ul>
    <li v-for="item in menu_items">{{ item.fullname }}</li>
  </ul>
</template>
```

这个过程在 mounted 被调用前完成。详细参考可移步 [这里](https://juejin.im/post/5be2f0ae6fb9a049fa0f3dd2)

## 二、异步加载

#### setTimeout 等异步函数

异步函数跟同步函数的不同之处，最大的应该就是异步函数会等到所有同步函数执行完成之后再执行。具体的可以看 [事件循环 ](https://juejin.im/post/5bab1ed8e51d450e7428c558)。

```js
//data字段有个num
created: function () {
    console.group('created 创建完毕状态===============》')
    console.log('%c%s', 'color:red', 'el     : ' + this.$el) // undefined
    console.log('%c%s', 'color:red', 'data   : ' + this.$data) // 已被初始化
    console.log('%c%s', 'color:red', 'message: ' + this.message) // 已被初始化
    //新增代码片段
    setTimeout(() => { //这里只是为了偷懒用了ES6的箭头函数，如果是普通函数请注意this指针修改，vue中请不要滥用箭头函数，出了问题找都找不到
      this.num ++
      this.num += 2
    }, 0) //注意这里的延时都是0
    setTimeout(() => {
      this.num -= 5
    }, 0)
 }
```

控制台答应结果：

![image](https://user-gold-cdn.xitu.io/2019/1/19/1686595bd375e2ae?)

vue 在执行代码的时候，并没有去管定时器里发生了什么事情，甚至已经设置了 0 延时，他依旧会去顺序执行其他生命周期，看起来就像跳过了这些异步加载。因此可以确定一点，生命周期中的异步操作不会按照顺序执行，而是会等到非异步操作结束后执行。因此书写这部分代码的时候请注意里面的逻辑不要和顺序挂钩，要确保任何异步操作即使最后执行，之前的程序也不会发生异常从而阻塞整个进程。

#### ajax 异步请求

ajax 请求是异步操作，回调函数的执行时间是不确定的。也就是说，即使在 created 钩子发送请求，dom 被挂载之后请求仍没有返回结果，就很有可能导致运行出错，诸如：

![image](https://user-gold-cdn.xitu.io/2019/1/19/16865575332a611a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

因为此时上述 render 事例中的 menu_items 还是空置。

###### 解决方案:

针对 ajax 异步请求，这样的错误原因其实就是因为返回结果没赶上 dom 节点的渲染。所以可以从两方面做修改：一是返回结果的赋值变量上，另一个就是 dom 节点的渲染层面。

1. 给予赋值变量初始值，即定义时 menu_items：[ {fullname: ''} ]。

这么做的好处就是页面节点的渲染不受限于返回结果，静态文案照样会被渲染，动态数据则会在数据更新时被填充。给用户的感觉就是，页面渲染速度不错。

但是这种方式也有缺陷，后台返回数据字段不尽相同，要是都这么写那就真是麻烦了。

当然如果你使用 typescript 就没有这种烦恼，menu_items: { [propName: string]: any } = {}就搞定了。

2. v-if，控制 dom 节点的挂载，当且仅当 menu_items 被赋予返回值时，才开始渲染节点。

这么做的好处就是静态和动态文案同步展现在用户面前，不会有文案跳动，数据从无到有的过程。但是，副作用就是页面渲染时间、用户等待时间变长。

###### 那如果 dom 挂载前请求数据已经返回了，又会是怎样的结果呢？

我们可以用 setTimeout 来模拟一下这个过程

```
<span>{{person.name.firstName}}</span>
```

```js
data: function () {
    return {
      message: 'hello world',
      add: 1,
      person: {
        name: {}
      }
    }
  },
created: function () {
    console.group('created 创建完毕状态===============》')
    console.log('%c%s', 'color:red', 'el     : ' + this.$el) // undefined
    console.log('%c%s', 'color:red', 'data   : ' + this.$data) // 已被初始化
    console.log('%c%s', 'color:red', 'message: ' + this.message) // 已被初始化
    //假装接口返回了一些信息给你，如一个人，然后你把这些信息赋值给了this实力
    setTimeout(() => {
      this.person = {
        name: {
          lastName: 'carry',
          firstName: 'dong'
        },
        sex: '男'
      }
    }, 0)
```

请求够早了吧，但还是报错了，this.person.name.firstName 是 undefined，不过程序报完错后还是再继续执行了。

## 三、结论

既然异步函数并不会阻塞 vue 生命周期整个进程，那么在哪个阶段请求都可以。如果考虑到用户体验方面的影响，希望用户今早感知页面已加载，减少空白页面时间，建议就放在 created 阶段了，然后再处理会出现 null、undefined 这种情况就好。毕竟越早获取数据，在 mounted 实例挂载的时候渲染也就越及时。

当然即使是这种情况下，也不排除会触发 updated 生命钩子(data 有默认值且已渲染，之后数据被更新)，从而导致虚拟 dom 的重新渲染。

附：生命周期图示![生命周期图示](https://cn.vuejs.org/images/lifecycle.png)
