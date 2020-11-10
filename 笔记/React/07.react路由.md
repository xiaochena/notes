# React Router

完整连接:[技术胖](https://jspang.com/detailed?id=49#toc33)

## 一、用 creact-react-app 脚手架初始化项目

### 1. 安装脚手架

```npm
npm install -g create-react-app
```

创建项目

```cmd
D:  //进入D盘
mkdir ReactRouterDemo   //创建ReactRouterDemo文件夹
cd ReactRouterDemo      //进入文件夹
create-react-app demo01  //用脚手架创建React项目
cd demo01   //等项目创建完成后，进入项目目录
npm  start  //预览项目
```

### 2.使用 npm 安装 React Router

```npm
npm install --save react-router-dom
```

## 二、路由

```jsx
import { Router, Route, Link } from "react-router-dom";
...
<Route path="/" exact component="{Index}" />
<Route path="/list/" component="{List}" />
```

### 1.exact 精准匹配的意思

路径信息要完全匹配成功，才可以实现跳转，匹配一部分是不行的。

如果把 Index 的精准匹配去掉

```jsx
import Index from "./Pages/Index";
...
<Route path="/" component="{Index}" />;
```

无论你的地址栏输入什么都可以匹配到 Index 组件,因为其局部匹配到了`/`而所有的路径第一个字符都是`/`。

所以我们加上了精准匹配 `exact`这样只有全字匹配到路径为`/`时才会匹配到 Index 组件

### 3.ReactRouter 重定向 Redirect 使用

- 标签式重定向:就是利用<Redirect>标签来进行重定向，业务逻辑不复杂时建议使用这种。
- 编程式重定向:这种是利用编程的方式，一般用于业务逻辑当中，比如登录成功挑战到会员中心页面。

#### 标签式重定向

一般用在不是很复杂的业务逻辑中，比如我们进入 `Index` 组件，然后 `Index` 组件,直接重定向到 `Home` 组件

引入`Redirect`后，直接在`render`函数里使用就可以了。

```jsx
import Home from './Pages/Home'
import { Link , Redirect , Route } from "react-router-dom";
...
<Route path="/home/" component={Home} />
<Redirect to="/home/" />
```

#### 编程式重定向

编程式重定向就是不再利用<Redirect/>标签，而是直接使用 JS 的语法实现重定向

直接在构造函数 constructor 中加入下面的重定向代码。

```jsx
this.props.history.push("/home/");
```

就可以顺利实现跳转，这样看起来和上面的过程是一样的。这两种方式的重定向你可以根据真实需求使用，这样能让你的程序更加的灵活。
