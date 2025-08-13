# Build Your Own React

tag: JS | TS, React
创建日期: 2025 年 8 月 11 日 00:04
最后编辑日期: 2025 年 8 月 11 日 00:04

https://pomb.us/build-your-own-react/

https://chemistwang.github.io/post/translate/build-your-own-react/

我的实现

[https://github.com/xiaochena/build-your-own-react](https://github.com/xiaochena/build-your-own-react)

# 前言：`React`、`JSX` 、`DOM`  的关系

```jsx
import React from "react";
import ReactDOM from "react-dom";

const element = <h1 title="foo">Hello React</h1>;
const container = document.getElementById("root");
ReactDOM.render(element, container);
```

`element` 尽管看上去像是一个 `HTML` 、实际上它是一个   使用 `JSX` 语法声明的`React`  元素。通常经过像  `Babel`  这样的构建工具转换为对  `React.createElement`  的调用。

```jsx
import React from "react";
import ReactDOM from "react-dom";

const element = React.createElement("h1", { title: "foo" }, "Hello React");
const container = document.getElementById("root");
ReactDOM.render(element, container);
```

[函数 `React.createElement`](https://zh-hans.react.dev/reference/react/createElement) 根据其参数创建一个 `React 元素` ，除了一些验证外，这几乎就是`React.createElement` 的全部功能。

`React 元素` 是一个具有两个属性的对象：`type`  和  `props` ，正真的 `createElement` 返回的 `React 元素` 对象还有更多的属性，但我们只关心这两个。

```jsx
const element = {
  type: "h1",
  props: {
    title: "foo",
    children: "Hello React",
  },
};

const container = document.getElementById("root");
ReactDOM.render(element, container);
```

- `type`  是一个字符串，用于指定我们要创建的 `DOM` 的类型。它就是你在创建 HTML 元素时传递给  `document.createElement`  的标签名。(它也可以是一个函数，但我们暂且不讨论这一点)
- `props`  是另一个对象，它包含了 JSX 属性的所有键和值。此外，它还有一个特殊的属性：`children`。

---

接下来我们尝试将 `element` 对象渲染到页面中去

```jsx
const element = {
  type: "h1",
  props: {
    title: "foo",
    children: "Hello React",
  },
};

const container = document.getElementById("root");

// // 创建一个 DOM ，类型为 "element.type"
const node = document.createElement(element.type);
node["title"] = element.props.title;

// 创建一个文本节点，内容为 "element.props.children"
const text = document.createTextNode("");
text["nodeValue"] = element.props.children;

node.appendChild(text);
container.appendChild(node);
```

在没有使用 `React` 的情况下、我们将 `h1` 渲染到了页面中。

# 一、**`createElement` 函数**

让我们从另一个应用程序开始。

```jsx
import React from "react";
import ReactDOM from "react-dom";

const element = (
  <div title="demo">
    <h1>Hello World</h1>
    <h2>from Didact</h2>
  </div>
);

const container = document.getElementById("react-root");
ReactDOM.render(element, container);
```

将 `html` ( 左 ) 转换为 `JavaScript` ( 右)，以便我们可以清晰的看到  `createElement`  是如何调用的。

```jsx
const element = (
  <div title="demo">
    <h1>Hello World</h1>
    <h2>from Didact</h2>
  </div>
);
```

```jsx
const element = React.createElement(
  "div",
  { title: "demo" },
  React.createElement("h1", null, "Hello World"),
  React.createElement("h2", null, "from Didact")
);
```

正如我们在前面的步骤中所看到的，一个 `React 元素` 的本质是一个有 `type`  和  `props` 属性的对象。`createElement 函数` 唯一需要做的就是创建这个对象。

```jsx
// createElement 用来构建虚拟 DOM 节点（Virtual DOM Object）
// - type：元素类型（如 "div"、"h1"）
// - props：属性对象（如 style、onClick 等）
// - children：子元素数组（可能是对象，也可能是纯文本）
// - 核心思路：把所有子元素统一处理成虚拟 DOM 结构（对象表示法）
function createElement(type, props, ...children) {
  return {
    type,
    props: { ...props, children },
  };
}
```

`createElement("div", { title: "demo" });`  返回

```json
{
  "type": "div",
  "props": { "title": "demo" }
}
```

`createElement("h1");`  返回

```json
{
  "type": "h1",
  "props": { "children": [] }
}
```

接下来我们针对 `HTML`中的文本节点 做特殊的处理、它与 `HTML` 元素节点不同 文本节点没有 `type` 和 `props`，而是一个简单的字符串。

```jsx
// createElement 用来构建虚拟 DOM 节点（Virtual DOM Object）
// - type：元素类型（如 "div"、"h1"）
// - props：属性对象（如 title、style 等）
// - children：子元素数组（可能是对象，也可能是纯文本）
// - 核心思路：把所有子元素统一处理成虚拟 DOM 结构（对象表示法）
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      // 将文本节点也转成对象形式的虚拟节点，保持数据结构一致
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

// 专门创建文本节点的虚拟 DOM
// - 因为文本在 DOM 中也是一个节点，但没有标签
// - 这里统一用 type="TEXT_ELEMENT" 来表示纯文本节点
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text, // 文本内容
      children: [], // 文本节点没有子元素
    },
  };
}
```

将我们自己实现的 `createElement` 放入 `Didact` 中，至此我们实现了 全部的 `createElement` 。

```jsx
const Didact = { createElement };

const element = Didact.createElement(
  "div",
  { title: "demo" },
  React.createElement("h1", null, "Hello World"),
  React.createElement("h2", null, "from Didact")
);
```

将生成

```jsx
const element = {
  type: "div",
  props: {
    title: "demo",
    children: [
      {
        type: "h1",
        props: {
          children: [
            {
              type: "TEXT_ELEMENT",
              props: { nodeValue: "Hello World", children: [] },
            },
          ],
        },
      },
      {
        type: "h2",
        props: {
          children: [
            {
              type: "TEXT_ELEMENT",
              props: { nodeValue: "from Didact", children: [] },
            },
          ],
        },
      },
    ],
  },
};
```

完整代码：

```jsx
// createElement 用来构建虚拟 DOM 节点（Virtual DOM Object）
// - type：元素类型（如 "div"、"h1"）
// - props：属性对象（如 title、style 等）
// - children：子元素数组（可能是对象，也可能是纯文本）
// - 核心思路：把所有子元素统一处理成虚拟 DOM 结构（对象表示法）
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      // 将文本节点也转成对象形式的虚拟节点，保持数据结构一致
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

// 专门创建文本节点的虚拟 DOM
// - 因为文本在 DOM 中也是一个节点，但没有标签
// - 这里统一用 type="TEXT_ELEMENT" 来表示纯文本节点
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text, // 文本内容
      children: [], // 文本节点没有子元素
    },
  };
}

// Didact 对象：模拟 React 的 API 接口
const Didact = { createElement };

// 告诉 JSX 编译器在创建元素时调用 Didact.createElement 而不是 React.createElement
/** @jsx Didact.createElement */
const element = (
  <div title="demo">
    <h1>Hello World</h1>
    <h2>from Didact</h2>
  </div>
);

console.log(element, "Didact");
```

# 二、render 函数

接下来，我们需要实现一个自己的  `ReactDOM.render`  函数。让经过`Didact.createElement` 编译的 `element` 能够渲染在页面中

```jsx
// render 用来把虚拟 DOM 转换成真实 DOM 并挂载到页面
// - element：虚拟 DOM 节点
// - container：真实 DOM 容器
// - 核心思路：递归遍历虚拟 DOM 树 → 创建真实 DOM → 挂载到父节点
function render(element, container) {
  // 1、如果是文本节点，创建 TextNode，否则创建对应标签
  const dom =
    element.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  // 2、获取元素的所有属性键，过滤出 DOM 属性(过滤掉 children )，然后设置到 DOM 元素上
  // 用于判断属性是否为 DOM 属性（排除 children ）
  const isProperty = (key) => key !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => {
      // 将属性值赋给 DOM 元素
      dom[name] = element.props[name];
    });

  // 3、递归地渲染子元素
  element.props.children.forEach((child) => render(child, dom));

  // 4、将渲染后的元素附加到容器
  container.appendChild(dom);
}
```

1. 根据  `element`  的  `type`  属性生成  `DOM`，如果元素类型为  `TEXT_ELEMENT` 我们创建一个文本节点而不是常规节点。
2. 获取元素的所有属性键，过滤出 `DOM` 属性(过滤掉 `children` )，然后设置到 `DOM` 上
3. 递归地渲染子元素
4. 将渲染后的元素附加到容器

在线   [`codesandbox`](https://codesandbox.io/s/didact-2-k6rbj)

## 全部代码：

```jsx
// createElement 用来构建虚拟 DOM 节点（Virtual DOM Object）
// - type：元素类型（如 "div"、"h1"）
// - props：属性对象（如 title、style 等）
// - children：子元素数组（可能是对象，也可能是纯文本）
// - 核心思路：把所有子元素统一处理成虚拟 DOM 结构（对象表示法）
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      // 将文本节点也转成对象形式的虚拟节点，保持数据结构一致
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

// 专门创建文本节点的虚拟 DOM
// - 因为文本在 DOM 中也是一个节点，但没有标签
// - 这里统一用 type="TEXT_ELEMENT" 来表示纯文本节点
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text, // 文本内容
      children: [], // 文本节点没有子元素
    },
  };
}

// render 用来把虚拟 DOM 转换成真实 DOM 并挂载到页面
// - element：虚拟 DOM 节点
// - container：真实 DOM 容器
// - 核心思路：递归遍历虚拟 DOM 树 → 创建真实 DOM → 挂载到父节点
function render(element, container) {
  // 1、如果是文本节点，创建 TextNode，否则创建对应标签
  const dom =
    element.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  // 2、获取元素的所有属性键，过滤出 DOM 属性(过滤掉 children )，然后设置到 DOM 元素上
  // 用于判断属性是否为 DOM 属性（排除 children ）
  const isProperty = (key) => key !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => {
      // 将属性值赋给 DOM 元素
      dom[name] = element.props[name];
    });

  // 3、递归地渲染子元素
  element.props.children.forEach((child) => render(child, dom));

  // 4、将渲染后的元素附加到容器
  container.appendChild(dom);
}

// Didact 对象：模拟 React 的 API 接口
const Didact = { createElement, render };

// 告诉 JSX 编译器在创建元素时调用 Didact.createElement 而不是 React.createElement
/** @jsx Didact.createElement */
const element = (
  <div title="demo">
    <h1>Hello World</h1>
    <h2>from Didact</h2>
  </div>
);

const container = document.getElementById("didact-root");

// 启动渲染：虚拟 DOM → 真实 DOM → 挂载到页面
Didact.render(element, container);
```

# **三、`Concurrent Mode` (并发模式) & `Fibers` 树**

## **`Concurrent Mode` (并发模式)**

在上一步中、`render` 使用递归解析渲染，一旦开始渲染，就会一口气把整个元素树都渲染完才罢休。要是元素树特别庞大，主线程就会被卡住老半天。这时候浏览器就算有更要紧的活儿——比如处理用户操作或者保持动画流畅——也得干等着渲染完才能动弹。

因此需要将解析 `element` 的工作拆分成一个一个小的任务。每搞定一个小块儿就让浏览器喘口气，要是还有别的事儿要处理，随时可以插队！

```jsx
// ...
// 要处理的工作单元
let nextUnitOfWork = null;
// ...

// 工作循环函数，在空闲时间执行工作单元
// - deadline:当前帧的空闲时间信息
function workLoop(deadline) {
  // 标记是否应该让出控制权给浏览器
  let shouldYield = false;

  // 在有待处理工作且不需要让出控制权的情况下持续工作
  while (nextUnitOfWork && !shouldYield) {
    // 执行当前工作单元，并获取下一个要处理的工作单元
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // 检查剩余时间是否少于1毫秒，如果是则应该让出控制权
    // 这样可以避免阻塞浏览器的其他任务（如用户交互、动画等）
    shouldYield = deadline.timeRemaining() < 1;
  }

  // 当前工作循环结束后，注册下一次空闲时的回调
  // 这样就能在下一个空闲时间继续处理剩余的工作
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function performUnitOfWork(nextUnitOfWork) {
  // TODO
}
```

使用 `requestIdleCallback` 来制作一个循环可以将  `requestIdleCallback`  视为  `setTimeout`。浏览器会在主线程空闲时自动触发回调函数。

`requestIdleCallback`  还给我们提供了 `deadline` 参数，可以用来计算浏览器下次接管前还剩多少时间。

- `requestIdleCallback` 负责持续运行 `workLoop` 函数
- `workLoop` 函数负责判断当剩余时间少于 1 毫秒时、停止`performUnitOfWork` 函数的执行
- `performUnitOfWork` 函数负责处理当前的工作单元，并返回下一个需要处理的工作单元

## **`Fibers` 树**

为了管理这些工作单元，咱们需要个数据结构：`fiber 树`。每个元素都会对应一个 `fiber`，每个 `fiber` 就是一个独立的工作单元。

假设我们要渲染这样一个元素树：

```jsx
Didact.render(
  <div>
    <h1>
      <p />
      <a />
    </h1>
    <h2 />
  </div>,
  container
);
```

![Build Your Own React-2025-08-13-23-31-41](/attachments/Build%20Your%20Own%20React-2025-08-13-23-31-41.png)

这种数据结构的设计初衷之一，就是为了能轻松找到下一个待处理任务。

所以每个 `fiber` 都自带三个关键链接：指向长子节点、相邻兄弟节点和父节点的指针

- 某个 `fiber` 处理结束之后，要是它有  `child` ，那这个 `child` 就会是下一个要处理的任务。
- 要是 `fiber` 没有  `child`  的话，就去找它的  `sibling`  作为下一个要处理的任务
- 要是 `fiber` 既没有  `child`  也没有  `sibling` ，就去找它的"叔叔"——也就是  `parent`  的  `sibling` 。
- 如果  `parent`  没有  `sibling` ，就顺着  `parent`  链往上找，直到逮着个带  `sibling`  的，或者一路摸到根节点。

要是都爬到根节点了，这意味着我们已经完成了这次渲染的所有工作。

![Build Your Own React-2025-08-13-23-32-13](/attachments/Build%20Your%20Own%20React-2025-08-13-23-32-13.png)

我们把先 `render` 中创建 DOM 节点的代码单独封装成函数，后面会用到。

```jsx
// 创建虚拟DOM
function createDom(fiber) {
  // 1、如果是文本节点，创建 TextNode，否则创建对应标签
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  // 2、获取元素的所有属性键，过滤出 DOM 属性(过滤掉 children )，然后设置到 DOM 元素上
  // 用于判断属性是否为 DOM 属性（排除 children ）
  const isProperty = (key) => key !== "children";
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((name) => {
      // 将属性值赋给 DOM 元素
      dom[name] = fiber.props[name];
    });

  return dom;
}
```

在  `render`  里创建根  `fiber`，把它赋值给  `nextUnitOfWork` 。

```jsx
function render(element, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  };
}
```

任务开始，等浏览器准备好了，`requestIdleCallback` 就会调用  `workLoop`  函数，继而函数 `performUnitOfWork` 开始处理节点。

## `PerformUnitOfWork`  函数

`performUnitOfWork` 函数负责处理当前的工作单元，并返回下一个需要处理的工作单元

`performUnitOfWork`  函数会对每个  `fiber`  节点执行三个操作：

1. 将当前 `fiber` 对应的元素添加到  `DOM`  中
2. 为元素的子节点创建对应的  `fiber`  结构
3. 选择下一个工作单元

首先，我们为当前  `fiber`  节点创建对应的  `DOM`  节点。然后将其添加到父节点中。

```jsx
// 1. 将当前 fiber 对应的元素添加到 `DOM` 中
// 如果当前 fiber 节点还没有对应的 DOM 节点，则创建一个
if (!fiber.dom) {
  fiber.dom = createDom(fiber);
}

// 如果当前 fiber 节点有父节点，将当前节点的 DOM 添加到父节点的 DOM 中
// 这样就构建了实际的 DOM 树结构
if (fiber.parent) {
  fiber.parent.dom.appendChild(fiber.dom);
}
```

然后为每个子元素创建其对应的  `fiber`  对象，根据是否是第一个子节点，将其设置为子节点或兄弟节点

每个  `fiber`  对象都对应一个  `DOM`  节点。

```jsx
// 2. 为元素的子节点创建对应的 fiber 结构
// 创建 fiber 子节点
const elements = fiber.props.children;
let index = 0;
let prevSibling = null;

while (index < elements.length) {
  const element = elements[index];

  const newFiber = {
    type: element.type,
    props: element.props,
    parent: fiber,
    dom: null,
  };

  // 将其添加到 fiber 树中
  // 根据是否是第一个子节点，将其设置为子节点或兄弟节点
  // 注意：这里构建的是单向链表，而不是树结构
  if (index === 0) {
    fiber.child = newFiber;
  } else {
    prevSibling.sibling = newFiber;
  }

  prevSibling = newFiber;
  index++;
}
```

`fiber`  对象的结构：

```jsx
type Fiber = {
  type: string, // 元素类型 如 div、h1、p、a 等
  props: Record<string, any>, // 元素属性 如 style、className、children 等
  parent: Fiber, // 指向父 fiber 节点
  dom: HTMLElement | Text | null, // 对应的 DOM 节点
  child: Fiber | null, // 指向第一个子 fiber 节点
  sibling: Fiber | null, // 指向兄弟 fiber 节点
};
```

最后我们寻找下一个工作单元。首先尝试子节点，然后是兄弟节点，接着是叔伯节点，依此类推。

```jsx
// 3.选择下一个工作单元
// 如果当前 Fiber 节点有子节点，则返回子节点
// 否则，向上遍历父节点，直到找到有兄弟节点的节点，并返回该兄弟节点
if (fiber.child) {
  return fiber.child;
}

let nextFiber = fiber;
while (nextFiber) {
  if (nextFiber.sibling) {
    return nextFiber.sibling;
  }
  nextFiber = nextFiber.parent;
}
```

## 全部代码

```jsx
// createElement 用来构建虚拟 DOM 节点（Virtual DOM Object）
// - type：元素类型（如 "div"、"h1"）
// - props：属性对象（如 title、style 等）
// - children：子元素数组（可能是对象，也可能是纯文本）
// - 核心思路：把所有子元素统一处理成虚拟 DOM 结构（对象表示法）
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      // 将文本节点也转成对象形式的虚拟节点，保持数据结构一致
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

// 专门创建文本节点的虚拟 DOM
// - 因为文本在 DOM 中也是一个节点，但没有标签
// - 这里统一用 type="TEXT_ELEMENT" 来表示纯文本节点
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text, // 文本内容
      children: [], // 文本节点没有子元素
    },
  };
}

// 要处理的工作单元
let nextUnitOfWork = null;

function render(element, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  };
}

// 创建虚拟DOM
function createDom(fiber) {
  // 1、如果是文本节点，创建 TextNode，否则创建对应标签
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  // 2、获取元素的所有属性键，过滤出 DOM 属性(过滤掉 children )，然后设置到 DOM 元素上
  // 用于判断属性是否为 DOM 属性（排除 children ）
  const isProperty = (key) => key !== "children";
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((name) => {
      // 将属性值赋给 DOM 元素
      dom[name] = fiber.props[name];
    });

  return dom;
}

// 工作循环函数，在空闲时间执行工作单元
// - deadline:当前帧的空闲时间信息
function workLoop(deadline) {
  // 标记是否应该让出控制权给浏览器
  let shouldYield = false;

  // 在有待处理工作且不需要让出控制权的情况下持续工作
  while (nextUnitOfWork && !shouldYield) {
    // 执行当前工作单元，并获取下一个要处理的工作单元
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // 检查剩余时间是否少于1毫秒，如果是则应该让出控制权
    // 这样可以避免阻塞浏览器的其他任务（如用户交互、动画等）
    shouldYield = deadline.timeRemaining() < 1;
  }

  // 当前工作循环结束后，注册下一次空闲时的回调
  // 这样就能在下一个空闲时间继续处理剩余的工作
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

// 执行一个工作单元
// - fiber:当前的 fiber 节点
function performUnitOfWork(fiber) {
  // 1. 将当前 fiber 对应的元素添加到 `DOM` 中
  // 如果当前 fiber 节点还没有对应的 DOM 节点，则创建一个
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // 如果当前 fiber 节点有父节点，将当前节点的 DOM 添加到父节点的 DOM 中
  // 这样就构建了实际的 DOM 树结构
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }

  // 2. 为元素的子节点创建对应的 fiber 结构
  // 创建 fiber 子节点
  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;

  while (index < elements.length) {
    const element = elements[index];

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };

    // 将其添加到 fiber 树中
    // 根据是否是第一个子节点，将其设置为子节点或兄弟节点
    // 注意：这里构建的是单向链表，而不是树结构
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }

  // 3.选择下一个工作单元
  // 如果当前 Fiber 节点有子节点，则返回子节点
  // 否则，向上遍历父节点，直到找到有兄弟节点的节点，并返回该兄弟节点
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

// Didact 对象：模拟 React 的 API 接口
const Didact = { createElement, render };

// 告诉 JSX 编译器在创建元素时调用 Didact.createElement 而不是 React.createElement
/** @jsx Didact.createElement */
const element = (
  <div title="demo">
    <h1>
      <p>Hello World</p>
      <a>link</a>
    </h1>
    <h2>from Didact</h2>
  </div>
);

const container = document.getElementById("didact-root");

// 启动渲染：虚拟 DOM → 真实 DOM → 挂载到页面
Didact.render(element, container);
```

# **四、渲染与提交阶段**

```jsx
// 执行一个工作单元
// - fiber:当前的 fiber 节点
function performUnitOfWork(fiber) {
  // ...
  // 如果当前 fiber 节点有父节点，将当前节点的 DOM 添加到父节点的 DOM 中
  // 这样就构建了实际的 DOM 树结构
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }
  // ...
}
```

这里存在着另一个问题，我们每次处理元素时都会向  `DOM`  添加新节点，但浏览器可能在完整渲染整棵树之前就中断我们的工作。此时用户将看到不完整的界面。

因此我们需要移除这部分会直接操作 DOM 的代码。使用一个全局变量  `wipRoot`  来追踪整个  `fiber`  树的根节点。

> _wipRoot: 是 work in progress root 的缩写，表示进行中的工作根节点。_

## `wipRoot` (进行中的工作根节点)

```jsx
// ...
let nextUnitOfWork = null; // 下一个要处理的工作单元
let wipRoot = null; // fiber 树的根节点
// ...

function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
  };

  nextUnitOfWork = wipRoot;
}
```

当我们完成所有工作（没有下一个工作单元了），就将 `wipRoot` 中保存的整个 `fiber` 树提交到 `DOM` 中。

```jsx
// 工作循环函数，在空闲时间执行工作单元
// - deadline:当前帧的空闲时间信息
function workLoop(deadline) {
  // 标记是否应该让出控制权给浏览器
  let shouldYield = false;

  // 在有待处理工作且不需要让出控制权的情况下持续工作
  while (nextUnitOfWork && !shouldYield) {
    // 执行当前工作单元，并获取下一个要处理的工作单元
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // 检查剩余时间是否少于1毫秒，如果是则应该让出控制权
    // 这样可以避免阻塞浏览器的其他任务（如用户交互、动画等）
    shouldYield = deadline.timeRemaining() < 1;
  }

  // 当没有下一个工作单元且有工作根节点时
  if (!nextUnitOfWork && wipRoot) {
    // 调用 commitRoot 提交 fiber 根节点、将fiber 转换成虚拟 Dom，挂载到页面
    commitRoot();
  }

  // 当前工作循环结束后，注册下一次空闲时的回调
  // 这样就能在下一个空闲时间继续处理剩余的工作
  requestIdleCallback(workLoop);
}
```

## `commitRoot` (提交阶段)

接下来让我们实现 `commitRoot` 函数，将 `wipRoot` 中保存的整个 `fiber` 树提交到 `DOM` 中。

```jsx
// 提交 fiber 树的根节点、让 commitWork 递归地将 fiber 树中的每一个节点附加到实际的 DOM 中
function commitRoot() {
  commitWork(wipRoot.child);
  // 提交完成后清空工作根节点
  wipRoot = null;
}

// 递归地将 fiber 树中的每一个节点附加到实际的 DOM 中
function commitWork(fiber) {
  if (!fiber) {
    return;
  }
  const domParent = fiber.parent.dom;
  domParent.appendChild(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}
```

## 全部代码

```jsx
// createElement 用来构建虚拟 DOM 节点（Virtual DOM Object）
// - type：元素类型（如 "div"、"h1"）
// - props：属性对象（如 title、style 等）
// - children：子元素数组（可能是对象，也可能是纯文本）
// - 核心思路：把所有子元素统一处理成虚拟 DOM 结构（对象表示法）
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      // 将文本节点也转成对象形式的虚拟节点，保持数据结构一致
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

// 专门创建文本节点的虚拟 DOM
// - 因为文本在 DOM 中也是一个节点，但没有标签
// - 这里统一用 type="TEXT_ELEMENT" 来表示纯文本节点
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text, // 文本内容
      children: [], // 文本节点没有子元素
    },
  };
}

let nextUnitOfWork = null; // 下一个要处理的工作单元
let wipRoot = null; // fiber 树的根节点

function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
  };

  nextUnitOfWork = wipRoot;
}

// 创建虚拟DOM
function createDom(fiber) {
  // 1、如果是文本节点，创建 TextNode，否则创建对应标签
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  // 2、获取元素的所有属性键，过滤出 DOM 属性(过滤掉 children )，然后设置到 DOM 元素上
  // 用于判断属性是否为 DOM 属性（排除 children ）
  const isProperty = (key) => key !== "children";
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((name) => {
      // 将属性值赋给 DOM 元素
      dom[name] = fiber.props[name];
    });

  return dom;
}

// 工作循环函数，在空闲时间执行工作单元
// - deadline:当前帧的空闲时间信息
function workLoop(deadline) {
  // 标记是否应该让出控制权给浏览器
  let shouldYield = false;

  // 在有待处理工作且不需要让出控制权的情况下持续工作
  while (nextUnitOfWork && !shouldYield) {
    // 执行当前工作单元，并获取下一个要处理的工作单元
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // 检查剩余时间是否少于1毫秒，如果是则应该让出控制权
    // 这样可以避免阻塞浏览器的其他任务（如用户交互、动画等）
    shouldYield = deadline.timeRemaining() < 1;
  }

  // 当没有下一个工作单元且有工作根节点时
  if (!nextUnitOfWork && wipRoot) {
    // 调用 commitRoot 提交 fiber 根节点、将fiber 转换成虚拟 Dom，挂载到页面
    commitRoot();
  }

  // 当前工作循环结束后，注册下一次空闲时的回调
  // 这样就能在下一个空闲时间继续处理剩余的工作
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

// 提交 fiber 树的根节点、让 commitWork 递归地将 fiber 树中的每一个节点附加到实际的 DOM 中
function commitRoot() {
  commitWork(wipRoot.child);
  // 提交完成后清空工作根节点
  wipRoot = null;
}

// 递归地将 fiber 树中的每一个节点附加到实际的 DOM 中
function commitWork(fiber) {
  if (!fiber) {
    return;
  }
  const domParent = fiber.parent.dom;
  domParent.appendChild(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

// 执行一个工作单元
// - fiber:当前的 fiber 节点
function performUnitOfWork(fiber) {
  // 1. 将当前 fiber 对应的元素添加到 `DOM` 中
  // 如果当前 fiber 节点还没有对应的 DOM 节点，则创建一个
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // 如果当前 fiber 节点有父节点，将当前节点的 DOM 添加到父节点的 DOM 中
  // 这样就构建了实际的 DOM 树结构
  // if (fiber.parent) {
  //   fiber.parent.dom.appendChild(fiber.dom);
  // }

  // 2. 为元素的子节点创建对应的 fiber 结构
  // 创建 fiber 子节点
  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;

  while (index < elements.length) {
    const element = elements[index];

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };

    // 将其添加到 fiber 树中
    // 根据是否是第一个子节点，将其设置为子节点或兄弟节点
    // 注意：这里构建的是单向链表，而不是树结构
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }

  // 3.选择下一个工作单元
  // 如果当前 Fiber 节点有子节点，则返回子节点
  // 否则，向上遍历父节点，直到找到有兄弟节点的节点，并返回该兄弟节点
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

// Didact 对象：模拟 React 的 API 接口
const Didact = { createElement, render };

// 告诉 JSX 编译器在创建元素时调用 Didact.createElement 而不是 React.createElement
/** @jsx Didact.createElement */
const element = (
  <div title="demo">
    <h1>
      <p>Hello World</p>
      <a>link</a>
    </h1>
    <h2>from Didact</h2>
  </div>
);

const container = document.getElementById("didact-root");

// 启动渲染：虚拟 DOM → 真实 DOM → 挂载到页面
Didact.render(element, container);
```

# **五、`Reconciliation` (协调阶段)**

目前为止、我们完成了向  `DOM`  添加内容的能力。接下来实现更新或删除节点。

我们需要需要将  `render`  函数接收到的元素与上次提交到  `DOM`  的  `fiber`  树进行比较。

因此，在完成提交后，我们需要保存一个对 “提交到  `DOM`  的  `fiber`  树” 的引用。我们称之为  `currentRoot` 。

```jsx
// ...
let nextUnitOfWork = null; // 下一个要处理的工作单元
let wipRoot = null; // fiber 树的根节点
let currentRoot = null; // 已经提交到 DOM 的 fiber 树
// ...
```

```jsx
// 提交 fiber 树的根节点、让 commitWork 递归地将 fiber 树中的每一个节点附加到实际的 DOM 中
function commitRoot() {
  commitWork(wipRoot.child);
  // 保存以提交到 DOM 的 fiber 树
  currentRoot = wipRoot;
  // 提交完成后清空工作根节点
  wipRoot = null;
}
```

我们还为每个  `fiber`  添加  `alternate`  属性。这个属性用于保存当前`fiber`对应的旧  `fiber` 节点

```jsx
function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  };

  nextUnitOfWork = wipRoot;
}
```

接下来从  `performUnitOfWork`  中提取创建新  `fiber`  的代码到一个新的  `reconcileChildren`  函数中。

```jsx
// 执行一个工作单元
// - fiber:当前的 fiber 节点
function performUnitOfWork(fiber) {
  // 1. 将当前 fiber 对应的元素添加到 `DOM` 中
  // 如果当前 fiber 节点还没有对应的 DOM 节点，则创建一个
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // 如果当前 fiber 节点有父节点，将当前节点的 DOM 添加到父节点的 DOM 中
  // 这样就构建了实际的 DOM 树结构
  // if (fiber.parent) {
  //   fiber.parent.dom.appendChild(fiber.dom);
  // }

  // 2. 为元素的子节点创建对应的 fiber 结构
  // 创建 fiber 子节点
  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;

  while (index < elements.length) {
    const element = elements[index];

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };

    // 将其添加到 fiber 树中
    // 根据是否是第一个子节点，将其设置为子节点或兄弟节点
    // 注意：这里构建的是单向链表，而不是树结构
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }

  // 3.选择下一个工作单元
  // 如果当前 Fiber 节点有子节点，则返回子节点
  // 否则，向上遍历父节点，直到找到有兄弟节点的节点，并返回该兄弟节点
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}
```

```jsx
// 执行一个工作单元
// - fiber:当前的 fiber 节点
function performUnitOfWork(fiber) {
  // 1. 将当前 fiber 对应的元素添加到 `DOM` 中
  // 如果当前 fiber 节点还没有对应的 DOM 节点，则创建一个
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // 如果当前 fiber 节点有父节点，将当前节点的 DOM 添加到父节点的 DOM 中
  // 这样就构建了实际的 DOM 树结构
  // if (fiber.parent) {
  //   fiber.parent.dom.appendChild(fiber.dom);
  // }

  // 2. 为元素的子节点创建对应的 fiber 结构
  // 创建 fiber 子节点
  const elements = fiber.props.children;
  reconcileChildren(fiber, elements);

  // 3.选择下一个工作单元
  // 如果当前 Fiber 节点有子节点，则返回子节点
  // 否则，向上遍历父节点，直到找到有兄弟节点的节点，并返回该兄弟节点
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

// 为子元素创建对应的 fiber 结构
function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let prevSibling = null;

  while (index < elements.length) {
    const element = elements[index];

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: wipFiber,
      dom: null,
    };

    // 将其添加到 fiber 树中
    // 根据是否是第一个子节点，将其设置为子节点或兄弟节点
    // 注意：这里构建的是单向链表，而不是树结构
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}
```

我们将在  `reconcileChildren`  中协调旧  `fiber`  与新元素。同时遍历旧  `fiber`  的子节点( `wipFiber.alternate` ) 和需要协调的元素数组。

## 实现 `reconcileChildren` 函数

我们需要在  `reconcileChildren`  中比较   比较  `oldFiber`  和  `element` ，来决定如何更新  `DOM` 。

- 如果 `element`  有对应的 `oldFiber` 、且元素类型相同。复用旧元素。为 `fiber` 标记 `effectTag` 为 `UPDATE` 。
- 如果 `element` 没有对应的 `oldFiber`、或元素类型不同。为 `fiber` 标记 `effectTag` 为 `PLACEMENT` 。
- 如果 `oldFiber` 没有对应的 `element` 、或元素类型不同。为 `oldFiber` 标记 `effectTag` 为 `DELETION` 。

> React 使用了 key 属性来实现更高效的协调算法。例如，当检测到子元素在数组中的位置发生变化时，它能够智能处理这种情况。

如果我们忽略同时遍历数组和链表所需的所有样板代码，剩下的就是其中最关键的部分： `oldFiber`  和  `element` 。其中  `element`  是我们想要渲染到  `DOM`  的内容，而  `oldFiber`  则是我们上一次渲染的结果。

```jsx
// 协调子节点，对比新旧 Fiber 树并生成更新
function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let prevSibling = null;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;

  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;

    // 判断新旧元素是否为同一类型，用于决定如何处理这个节点。
    // 三个条件的检查：新旧元素存在、旧元素存在、且新旧元素的 element.type == oldFiber.type 类型相同
    const sameType = oldFiber && element && element.type == oldFiber.type;

    // 如果 element 有对应的 oldFiber 、且元素类型相同。复用旧元素。
    // 为 fiber 标记 effectTag 为 UPDATE 。
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      };
    }

    // 如果 element 没有对应的 oldFiber、或元素类型不同。
    // 为 fiber 标记 effectTag 为 PLACEMENT 。
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      };
    }

    // 如果 oldFiber 没有对应的 element 、或元素类型不同。
    // 为 oldFiber 标记 effectTag 为 DELETION 。
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION";
    }

    // 移动 oldFiber 指针到下一个兄弟节点，用于下一轮循环的比较
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (element) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}
```

对于需要删除节点的情况，由于没有对应的新  `fiber`  节点，我们在旧  `fiber`  上添加  `effect`  标记。但在我们最终是将新  `fiber`  树提交到  `DOM`。因此我们需要一个数组来追踪需要移除的节点。

```jsx
// ...
let nextUnitOfWork = null; // 下一个要处理的工作单元
let wipRoot = null; // fiber 树的根节点
let currentRoot = null; // 已经提交到 DOM 的 fiber 树
let deletions = null; // 需要删除的 fiber 节点
// ...
```

```jsx
// 协调子节点，对比新旧 Fiber 树并生成更新
function reconcileChildren(wipFiber, elements) {
  // ...
  // 如果 oldFiber 没有对应的 element 、或元素类型不同。
  // 为 oldFiber 标记 effectTag 为 DELETION 。
  if (oldFiber && !sameType) {
    oldFiber.effectTag = "DELETION";
    deletions.push(oldFiber);
  }
  // ...
}
```

```jsx
function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  };

  deletions = [];
  nextUnitOfWork = wipRoot;
}
```

这样当我们向  `DOM`  提交变更时，就可以先删除不需要的节点。

```jsx
// 提交 fiber 树的根节点、让 commitWork 递归地将 fiber 树中的每一个节点附加到实际的 DOM 中
function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  // 保存以提交到 DOM 的 fiber 树
  currentRoot = wipRoot;
  // 提交完成后清空工作根节点
  wipRoot = null;
}
```

## 改造  `commitWork`  函数

接下来我们改造一下 `commitWork` 函数，来处理 `fiber` 的 `effect` 标记。

- 如果  `fiber`  带有  `PLACEMENT`  效果标签，我们将  `DOM`  节点附加到父  `fiber`  的节点上。
- 如果  `fiber`  带有  `UPDATE`  效果标签，我们将更新  `DOM`  节点。
- 如果  `fiber`  带有  `DELETION`  效果标签，我们将  `DOM`  节点从父  `fiber`  的节点上移除。

```jsx
// 递归处理 fiber 节点
function commitWork(fiber) {
  if (!fiber) {
    return;
  }
  const domParent = fiber.parent.dom;
  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    // 如果 fiber 带有 PLACEMENT 效果标签，我们将 DOM 节点附加到父 fiber 的节点上
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    // 如果 fiber 带有 UPDATE 效果标签，我们更新 DOM 节点
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    // 如果 fiber 带有 DELETION 效果标签，我们将 DOM 节点从父 fiber 的节点上移除
    domParent.removeChild(fiber.dom);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}
```

## 实现 `updateDom` 函数

实现 `updateDom` 函数，来更新 `DOM` 节点。将旧 `fiber` 的 `props` 与新 `fiber` 的 `props` 进行比较，移除已消失的 `props`，并设置新增或更改的 `props`。

```jsx
// isProperty 判断属性是否为 children 且不是事件属性
const isProperty = (key) => key !== "children";
// isNew 判断属性是否为新属性
const isNew = (prev, next) => (key) => prev[key] !== next[key];
// isGone 判断属性是否被删除
const isGone = (prev, next) => (key) => !(key in next);

// 处理 fiber 节点更新逻辑
function updateDom(dom, prevProps, nextProps) {
  // 移除旧的属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = "";
    });

  // 设置新的或更改的属性
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = nextProps[name];
    });
}
```

我们还需要特别处理的一类属性是事件监听器，因此如果属性名以  `"on"`  前缀开头，我们将采用不同的处理方式。

如果事件处理程序发生变化，我们会将其从节点中移除。然后添加新的处理程序。

```jsx
// isEvent 判断属性是否为名以 `"on"` 前缀开头的事件
const isEvent = (key) => key.startsWith("on");
// isProperty 判断属性是否为 children 且不是事件属性
const isProperty = (key) => key !== "children" && !isEvent(key);
// isNew 判断属性是否为新属性
const isNew = (prev, next) => (key) => prev[key] !== next[key];
// isGone 判断属性是否被删除
const isGone = (prev, next) => (key) => !(key in next);

// 处理 fiber 节点更新逻辑
function updateDom(dom, prevProps, nextProps) {
  // 移除旧的或更改的事件监听器
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // 移除旧的属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = "";
    });

  // 设置新的或更改的属性
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = nextProps[name];
    });

  // 添加事件监听器
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}
```

最后：更新 `createDom` 。可以使用 `updateDom` 来初始化 `dom` 属性了

```jsx
// 创建虚拟DOM
function createDom(fiber) {
  // 1、如果是文本节点，创建 TextNode，否则创建对应标签
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  // 2、获取元素的所有属性键，过滤出 DOM 属性(过滤掉 children )，然后设置到 DOM 元素上
  // 用于判断属性是否为 DOM 属性（排除 children ）
  const isProperty = (key) => key !== "children";
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((name) => {
      // 将属性值赋给 DOM 元素
      dom[name] = fiber.props[name];
    });

  return dom;
}
```

```
// 创建虚拟DOM
function createDom(fiber) {
  // 1、如果是文本节点，创建 TextNode，否则创建对应标签
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  // 2、更新 DOM 节点属性
  updateDom(dom, {}, fiber.props);

  return dom;
}
```

在  [`CodeSandbox`](https://codesandbox.io/s/didact-6-96533)  上尝试带协调功能的版本。

## 全部代码

```jsx
// createElement 用来构建虚拟 DOM 节点（Virtual DOM Object）
// - type：元素类型（如 "div"、"h1"）
// - props：属性对象（如 title、style 等）
// - children：子元素数组（可能是对象，也可能是纯文本）
// - 核心思路：把所有子元素统一处理成虚拟 DOM 结构（对象表示法）
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      // 将文本节点也转成对象形式的虚拟节点，保持数据结构一致
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

// 专门创建文本节点的虚拟 DOM
// - 因为文本在 DOM 中也是一个节点，但没有标签
// - 这里统一用 type="TEXT_ELEMENT" 来表示纯文本节点
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text, // 文本内容
      children: [], // 文本节点没有子元素
    },
  };
}

let nextUnitOfWork = null; // 下一个要处理的工作单元
let wipRoot = null; // fiber 树的根节点
let currentRoot = null; // 已经提交到 DOM 的 fiber 树
let deletions = null; // 需要删除的 fiber 节点

function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  };

  deletions = [];
  nextUnitOfWork = wipRoot;
}

// 创建虚拟DOM
function createDom(fiber) {
  // 1、如果是文本节点，创建 TextNode，否则创建对应标签
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  // 2、初始化 DOM 节点
  updateDom(dom, {}, fiber.props);

  return dom;
}

// 工作循环函数，在空闲时间执行工作单元
// - deadline:当前帧的空闲时间信息
function workLoop(deadline) {
  // 标记是否应该让出控制权给浏览器
  let shouldYield = false;

  // 在有待处理工作且不需要让出控制权的情况下持续工作
  while (nextUnitOfWork && !shouldYield) {
    // 执行当前工作单元，并获取下一个要处理的工作单元
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // 检查剩余时间是否少于1毫秒，如果是则应该让出控制权
    // 这样可以避免阻塞浏览器的其他任务（如用户交互、动画等）
    shouldYield = deadline.timeRemaining() < 1;
  }

  // 当没有下一个工作单元且有工作根节点时
  if (!nextUnitOfWork && wipRoot) {
    // 调用 commitRoot 提交 fiber 根节点、将fiber 转换成虚拟 Dom，挂载到页面
    commitRoot();
  }

  // 当前工作循环结束后，注册下一次空闲时的回调
  // 这样就能在下一个空闲时间继续处理剩余的工作
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

// 提交 fiber 树的根节点、让 commitWork 递归地将 fiber 树中的每一个节点附加到实际的 DOM 中
function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  // 保存以提交到 DOM 的 fiber 树
  currentRoot = wipRoot;
  // 提交完成后清空工作根节点
  wipRoot = null;
}

// 递归处理 fiber 节点
function commitWork(fiber) {
  if (!fiber) {
    return;
  }
  const domParent = fiber.parent.dom;
  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    // 如果 fiber 带有 PLACEMENT 效果标签，我们将 DOM 节点附加到父 fiber 的节点上
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    // 如果 fiber 带有 UPDATE 效果标签，我们更新 DOM 节点
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    // 如果 fiber 带有 DELETION 效果标签，我们将 DOM 节点从父 fiber 的节点上移除
    domParent.removeChild(fiber.dom);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

// isEvent 判断属性是否为名以 `"on"` 前缀开头的事件
const isEvent = (key) => key.startsWith("on");
// isProperty 判断属性是否为 children 且不是事件属性
const isProperty = (key) => key !== "children" && !isEvent(key);
// isNew 判断属性是否为新属性
const isNew = (prev, next) => (key) => prev[key] !== next[key];
// isGone 判断属性是否被删除
const isGone = (prev, next) => (key) => !(key in next);

// 处理 fiber 节点更新逻辑
function updateDom(dom, prevProps, nextProps) {
  // 移除旧的或更改的事件监听器
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // 移除旧的属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = "";
    });

  // 设置新的或更改的属性
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = nextProps[name];
    });

  // 添加事件监听器
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}

// 执行一个工作单元
// - fiber:当前的 fiber 节点
function performUnitOfWork(fiber) {
  // 1. 将当前 fiber 对应的元素添加到 `DOM` 中
  // 如果当前 fiber 节点还没有对应的 DOM 节点，则创建一个
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // 如果当前 fiber 节点有父节点，将当前节点的 DOM 添加到父节点的 DOM 中
  // 这样就构建了实际的 DOM 树结构
  // if (fiber.parent) {
  //   fiber.parent.dom.appendChild(fiber.dom);
  // }

  // 2. 为元素的子节点创建对应的 fiber 结构
  // 创建 fiber 子节点
  const elements = fiber.props.children;
  reconcileChildren(fiber, elements);

  // 3.选择下一个工作单元
  // 如果当前 Fiber 节点有子节点，则返回子节点
  // 否则，向上遍历父节点，直到找到有兄弟节点的节点，并返回该兄弟节点
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

// 协调子节点，对比新旧 Fiber 树并生成更新
function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let prevSibling = null;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;

  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;

    // 判断新旧元素是否为同一类型，用于决定如何处理这个节点。
    // 三个条件的检查：新旧元素存在、旧元素存在、且新旧元素的 element.type == oldFiber.type 类型相同
    const sameType = oldFiber && element && element.type == oldFiber.type;

    // 如果 element 有对应的 oldFiber 、且元素类型相同。复用旧元素。
    // 为 fiber 标记 effectTag 为 UPDATE 。
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      };
    }

    // 如果 element 没有对应的 oldFiber、或元素类型不同。
    // 为 fiber 标记 effectTag 为 PLACEMENT 。
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      };
    }

    // 如果 oldFiber 没有对应的 element 、或元素类型不同。
    // 为 oldFiber 标记 effectTag 为 DELETION 。
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber);
    }

    // 移动 oldFiber 指针到下一个兄弟节点，用于下一轮循环的比较
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (element) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}

// Didact 对象：模拟 React 的 API 接口
const Didact = { createElement, render };

const updateValue = (e) => {
  rerender(e.target.value);
};

const rerender = (value = "") => {
  // 告诉 JSX 编译器在创建元素时调用 Didact.createElement 而不是 React.createElement
  /** @jsx Didact.createElement */
  const element = (
    <div>
      <input onInput={updateValue} value={value} />

      <div>请输入</div>
      {value ? value : <h2>Hello React</h2>}
    </div>
  );
  // 获取要挂载的 DOM 容器
  const container = document.getElementById("didact-root");

  // 使用 Didact 的 render 方法将 JSX 渲染到实际的 DOM 中
  Didact.render(element, container);
};

rerender();
```

# **六**、**`Function Components` 函数组件**

接下来我们需要搞定函数组件的支持。先换个例子示范。这次用个超简单的函数组件，它直接返回个 `h1` 元素。

```jsx
function App(props) {
  return <h1>Hi {props.name}</h1>;
}
const element = <App name="foo" />;
const container = document.getElementById("didact-root");
Didact.render(element, container);
```

这里要是把  `jsx`  转成  `js`  的话，代码会变成这样：

```jsx
function App(props) {
  return Didact.createElement("h1", null, "Hi ", props.name);
}
const element = Didact.createElement(App, {
  name: "foo",
});
```

生成的虚拟 `dom` 结构示例

```jsx
const element = {
  props: { name: "foo", children: [] },
  type: "[ƒ App(props)]",
};
```

函数组件在两个方面有所不同：

- 函数组件生成的  `fiber`  没有对应的  `DOM`  节点
- 函数组件的子元素是通过执行函数获得的，而不是直接从  `props`  里拿

让我们修改 `performUnitOfWork` 函数

```jsx
// 执行一个工作单元
// - fiber:当前的 fiber 节点
function performUnitOfWork(fiber) {
  // 1. 将当前 fiber 对应的元素添加到 `DOM` 中
  // 如果当前 fiber 节点还没有对应的 DOM 节点，则创建一个
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // 2. 为元素的子节点创建对应的 fiber 结构
  // 创建 fiber 子节点
  const elements = fiber.props.children;
  reconcileChildren(fiber, elements);

  // 3.选择下一个工作单元
  // 如果当前 Fiber 节点有子节点，则返回子节点
  // 否则，向上遍历父节点，直到找到有兄弟节点的节点，并返回该兄弟节点
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}
```

先判断  `fiber`  类型是不是函数，然后走不同的更新逻辑

- 当  `fiber`  类型不是函数组件时，我们调用  `updateHostComponent`  函数，执行与之前相同的操作。
- 当  `fiber`  类型是函数组件时，我们调用  `updateFunctionComponent`  函数。通过执行函数组件，来获取子元素。

```jsx
// 执行一个工作单元
// - fiber:当前的 fiber 节点
function performUnitOfWork(fiber) {
  // 判断 fiber 节点是否为函数组件对应不同的处理逻辑
  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  // 选择下一个工作单元
  // 如果当前 Fiber 节点有子节点，则返回子节点
  // 否则，向上遍历父节点，直到找到有兄弟节点的节点，并返回该兄弟节点
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

// 处理普通的fiber节点
function updateHostComponent(fiber) {
  // 如果当前 fiber 节点还没有对应的 DOM 节点，则创建一个
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // 为元素的子节点创建对应的 fiber 结构
  const elements = fiber.props.children;
  reconcileChildren(fiber, elements);
}

// 处理函数组件对应的 fiber 节点
function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}
```

之后协调（ `reconcileChildren` ）过程还是老样子走流程，这块完全不用动。

真正要改的是  `commitWork` 函数。因为现在  `fiber`树中有了不带  `DOM`  的  `fiber`  节点。

```jsx
// 递归处理 fiber 节点
function commitWork(fiber) {
  if (!fiber) {
    return;
  }
  const domParent = fiber.parent.dom;
  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    // 如果 fiber 带有 PLACEMENT 效果标签，我们将 DOM 节点附加到父 fiber 的节点上
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    // 如果 fiber 带有 UPDATE 效果标签，我们更新 DOM 节点
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    // 如果 fiber 带有 DELETION 效果标签，我们将 DOM 节点从父 fiber 的节点上移除
    domParent.removeChild(fiber.dom);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}
```

主要的改动是：

- 要找到  `DOM`  对应的父级  `DOM`，得顺着  `fiber`  树往上找，如果父  `fiber`  节点没有  `DOM`，则继续往上找，直到找到一个有  `DOM`  节点的父  `fiber`  节点。
- 删除时如果当前  `fiber`  节点没有  `DOM`，则需要往下找，直到找到一个有  `DOM`  节点的子`fiber`  节点。

```jsx
// 递归处理 fiber 节点
function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  // 如果父 fiber 节点没有 dom (即为函数组件)
  // 则顺着 fiber 树往上找，直到找到一个有 dom 的父 fiber 节点。
  const domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }

  const domParent = domParentFiber.dom;
  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    // 如果 fiber 带有 PLACEMENT 效果标签，我们将 DOM 节点附加到父 fiber 的节点上
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    // 如果 fiber 带有 UPDATE 效果标签，我们更新 DOM 节点
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, domParent);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

// 如果当前 fiber 节点没有 dom (即为函数组件)
// 则需要往下找，直到找到一个有 DOM 节点的子fiber 节点。
function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child, domParent);
  }
}
```

## 全部代码

```jsx
// createElement 用来构建虚拟 DOM 节点（Virtual DOM Object）
// - type：元素类型（如 "div"、"h1"）
// - props：属性对象（如 title、style 等）
// - children：子元素数组（可能是对象，也可能是纯文本）
// - 核心思路：把所有子元素统一处理成虚拟 DOM 结构（对象表示法）
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      // 将文本节点也转成对象形式的虚拟节点，保持数据结构一致
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

// 专门创建文本节点的虚拟 DOM
// - 因为文本在 DOM 中也是一个节点，但没有标签
// - 这里统一用 type="TEXT_ELEMENT" 来表示纯文本节点
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text, // 文本内容
      children: [], // 文本节点没有子元素
    },
  };
}

let nextUnitOfWork = null; // 下一个要处理的工作单元
let wipRoot = null; // fiber 树的根节点
let currentRoot = null; // 已经提交到 DOM 的 fiber 树
let deletions = null; // 需要删除的 fiber 节点

function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  };

  deletions = [];
  nextUnitOfWork = wipRoot;
}

// 创建虚拟DOM
function createDom(fiber) {
  // 1、如果是文本节点，创建 TextNode，否则创建对应标签
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  // 2、初始化 DOM 节点
  updateDom(dom, {}, fiber.props);

  return dom;
}

// 工作循环函数，在空闲时间执行工作单元
// - deadline:当前帧的空闲时间信息
function workLoop(deadline) {
  // 标记是否应该让出控制权给浏览器
  let shouldYield = false;

  // 在有待处理工作且不需要让出控制权的情况下持续工作
  while (nextUnitOfWork && !shouldYield) {
    // 执行当前工作单元，并获取下一个要处理的工作单元
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // 检查剩余时间是否少于1毫秒，如果是则应该让出控制权
    // 这样可以避免阻塞浏览器的其他任务（如用户交互、动画等）
    shouldYield = deadline.timeRemaining() < 1;
  }

  // 当没有下一个工作单元且有工作根节点时
  if (!nextUnitOfWork && wipRoot) {
    // 调用 commitRoot 提交 fiber 根节点、将fiber 转换成虚拟 Dom，挂载到页面
    commitRoot();
  }

  // 当前工作循环结束后，注册下一次空闲时的回调
  // 这样就能在下一个空闲时间继续处理剩余的工作
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

// 提交 fiber 树的根节点、让 commitWork 递归地将 fiber 树中的每一个节点附加到实际的 DOM 中
function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  // 保存以提交到 DOM 的 fiber 树
  currentRoot = wipRoot;
  // 提交完成后清空工作根节点
  wipRoot = null;
}

// 递归处理 fiber 节点
function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  // 如果父 fiber 节点没有 dom (即为函数组件)
  // 则顺着 fiber 树往上找，直到找到一个有 dom 的父 fiber 节点。
  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }

  const domParent = domParentFiber.dom;
  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    // 如果 fiber 带有 PLACEMENT 效果标签，我们将 DOM 节点附加到父 fiber 的节点上
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    // 如果 fiber 带有 UPDATE 效果标签，我们更新 DOM 节点
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, domParent);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

// 如果当前 fiber 节点没有 dom (即为函数组件)
// 则需要往下找，直到找到一个有 DOM 节点的子fiber 节点。
function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child, domParent);
  }
}

// isEvent 判断属性是否为名以 `"on"` 前缀开头的事件
const isEvent = (key) => key.startsWith("on");
// isProperty 判断属性是否为 children 且不是事件属性
const isProperty = (key) => key !== "children" && !isEvent(key);
// isNew 判断属性是否为新属性
const isNew = (prev, next) => (key) => prev[key] !== next[key];
// isGone 判断属性是否被删除
const isGone = (prev, next) => (key) => !(key in next);

// 处理 fiber 节点更新逻辑
function updateDom(dom, prevProps, nextProps) {
  // 移除旧的或更改的事件监听器
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // 移除旧的属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = "";
    });

  // 设置新的或更改的属性
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = nextProps[name];
    });

  // 添加事件监听器
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}

// 执行一个工作单元
// - fiber:当前的 fiber 节点
function performUnitOfWork(fiber) {
  // 判断 fiber 节点是否为函数组件对应不同的处理逻辑
  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  // 选择下一个工作单元
  // 如果当前 Fiber 节点有子节点，则返回子节点
  // 否则，向上遍历父节点，直到找到有兄弟节点的节点，并返回该兄弟节点
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

// 处理普通的fiber节点
function updateHostComponent(fiber) {
  // 如果当前 fiber 节点还没有对应的 DOM 节点，则创建一个
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // 为元素的子节点创建对应的 fiber 结构
  const elements = fiber.props.children;
  reconcileChildren(fiber, elements);
}

// 处理函数组件对应的 fiber 节点
function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

// 协调子节点，对比新旧 Fiber 树并生成更新
function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let prevSibling = null;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;

  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;

    // 判断新旧元素是否为同一类型，用于决定如何处理这个节点。
    // 三个条件的检查：新旧元素存在、旧元素存在、且新旧元素的 element.type == oldFiber.type 类型相同
    const sameType = oldFiber && element && element.type == oldFiber.type;

    // 如果 element 有对应的 oldFiber 、且元素类型相同。复用旧元素。
    // 为 fiber 标记 effectTag 为 UPDATE 。
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      };
    }

    // 如果 element 没有对应的 oldFiber、或元素类型不同。
    // 为 fiber 标记 effectTag 为 PLACEMENT 。
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      };
    }

    // 如果 oldFiber 没有对应的 element 、或元素类型不同。
    // 为 oldFiber 标记 effectTag 为 DELETION 。
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber);
    }

    // 移动 oldFiber 指针到下一个兄弟节点，用于下一轮循环的比较
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (element) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}

// Didact 对象：模拟 React 的 API 接口
const Didact = { createElement, render };

function App(props) {
  return <h1>Hi {props.name}</h1>;
}
// 告诉 JSX 编译器在创建元素时调用 Didact.createElement 而不是 React.createElement
/** @jsx Didact.createElement */
const element = <App name="foo" />;
const container = document.getElementById("didact-root");
Didact.render(element, container);
```

# 七、**`Hooks`**

最后一步！既然已经搞定了函数组件，现在把状态管理也加进来。 先把示例换成经典计数器组件。每次点击它，状态值就会+1。

```jsx
// ...
function useState(initial) {
  // TODO
}
// ...
const Didact = { createElement, render, useState };

/** @jsx Didact.createElement */
function Counter() {
  const [state, setState] = Didact.useState(1);
  return <h1 onClick={() => setState((c) => c + 1)}>Count: {state}</h1>;
}
const element = <Counter />;
const container = document.getElementById("root");
Didact.render(element, container);
```

首先需要在  `updateFunctionComponent`  中初始化几个全局变量，才能在调用函数组件时，让  `useState`  函数内部用上这些变量。

- `wipFiber`：当前正在处理的  `fiber`  节点
- `hookIndex`：当前函数组件中  `useState`  调用的索引

同时在  `fiber`  上增加  `hooks`  数组。保存组件中所有的  `hook`  状态

```jsx
// ...
let nextUnitOfWork = null; // 下一个要处理的工作单元
let wipRoot = null; // fiber 树的根节点
let currentRoot = null; // 已经提交到 DOM 的 fiber 树
let deletions = null; // 需要删除的 fiber 节点
let wipFiber = null; // 当前正在工作的函数组件 fiber 节点
let hookIndex = null; // 当前正在处理的 hook 在 hooks 数组中的位置
// ...

// ...
function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = [];
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}
// ...
```

接下来开始编写  `useState`  函数。

- 尝试获取旧  `hook`
- 构造新  `hook`，如果有旧  `hook`，就用旧状态；否则使用初始状态。
- 执行旧  `hook`  上  `queue`  中的所有`action`: 得到最新状态
- 定义  `setState`: 把新的  `action`  放入  `hook`  的  `queue`  任务队列,并重新触发渲染
- 存储  `hook`、返回状态和更新函数

```jsx
function useState(initial) {
  // 1:从旧 Fiber 中获取当前 hook 对应的旧值（用以保留 state）
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex];

  // 2:创建新的 hook 实例，初始化 state（若旧 hook 存在，则复用旧 state）
  const hook = {
    state: oldHook ? oldHook.state : initial, // 当前状态值
    queue: [], // 将来的 setState 动作列表（action 队列）
  };

  // 3:将旧的 action 队列执行一遍，得到最终的 state（支持多次 setState 累积）
  const actions = oldHook ? oldHook.queue : [];
  actions.forEach((action) => {
    hook.state = action(hook.state); // action 是函数:上一个 state => 新 state
  });

  // 4:定义 setState，用于更新当前 hook 的状态
  const setState = (action) => {
    // 把新的更新 action 放入当前 hook 的 queue
    hook.queue.push(action);

    // 触发整个应用重新渲染:构建新的 Fiber 树根节点
    wipRoot = {
      dom: currentRoot.dom, // 当前根节点 DOM
      props: currentRoot.props, // 当前根节点 props（即 App）
      alternate: currentRoot, // 指向旧的 Fiber 树（用于 diff）
    };
    nextUnitOfWork = wipRoot; // 设置下一轮的第一个工作单元
    deletions = []; // 初始化删除节点数组
  };

  // 5:将当前 hook 添加进当前正在处理的 Fiber 节点
  wipFiber.hooks.push(hook);
  hookIndex++; // 为下一个 hook 做准备

  // 6:返回当前状态值和 setState 函数
  return [hook.state, setState];
}
```

## 全部代码

```jsx
// createElement 用来构建虚拟 DOM 节点（Virtual DOM Object）
// - type：元素类型（如 "div"、"h1"）
// - props：属性对象（如 title、style 等）
// - children：子元素数组（可能是对象，也可能是纯文本）
// - 核心思路：把所有子元素统一处理成虚拟 DOM 结构（对象表示法）
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      // 将文本节点也转成对象形式的虚拟节点，保持数据结构一致
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

// 专门创建文本节点的虚拟 DOM
// - 因为文本在 DOM 中也是一个节点，但没有标签
// - 这里统一用 type="TEXT_ELEMENT" 来表示纯文本节点
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text, // 文本内容
      children: [], // 文本节点没有子元素
    },
  };
}

let nextUnitOfWork = null; // 下一个要处理的工作单元
let wipRoot = null; // fiber 树的根节点
let currentRoot = null; // 已经提交到 DOM 的 fiber 树
let deletions = null; // 需要删除的 fiber 节点
let wipFiber = null; // 当前正在工作的函数组件 fiber 节点
let hookIndex = null; // 当前正在处理的 hook 在 hooks 数组中的位置

function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  };

  deletions = [];
  nextUnitOfWork = wipRoot;
}

// 创建虚拟DOM
function createDom(fiber) {
  // 1、如果是文本节点，创建 TextNode，否则创建对应标签
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  // 2、初始化 DOM 节点
  updateDom(dom, {}, fiber.props);

  return dom;
}

// 工作循环函数，在空闲时间执行工作单元
// - deadline:当前帧的空闲时间信息
function workLoop(deadline) {
  // 标记是否应该让出控制权给浏览器
  let shouldYield = false;

  // 在有待处理工作且不需要让出控制权的情况下持续工作
  while (nextUnitOfWork && !shouldYield) {
    // 执行当前工作单元，并获取下一个要处理的工作单元
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // 检查剩余时间是否少于1毫秒，如果是则应该让出控制权
    // 这样可以避免阻塞浏览器的其他任务（如用户交互、动画等）
    shouldYield = deadline.timeRemaining() < 1;
  }

  // 当没有下一个工作单元且有工作根节点时
  if (!nextUnitOfWork && wipRoot) {
    // 调用 commitRoot 提交 fiber 根节点、将fiber 转换成虚拟 Dom，挂载到页面
    commitRoot();
  }

  // 当前工作循环结束后，注册下一次空闲时的回调
  // 这样就能在下一个空闲时间继续处理剩余的工作
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

// 提交 fiber 树的根节点、让 commitWork 递归地将 fiber 树中的每一个节点附加到实际的 DOM 中
function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  // 保存以提交到 DOM 的 fiber 树
  currentRoot = wipRoot;
  // 提交完成后清空工作根节点
  wipRoot = null;
}

// 递归处理 fiber 节点
function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  // 如果父 fiber 节点没有 dom (即为函数组件)
  // 则顺着 fiber 树往上找，直到找到一个有 dom 的父 fiber 节点。
  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }

  const domParent = domParentFiber.dom;
  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    // 如果 fiber 带有 PLACEMENT 效果标签，我们将 DOM 节点附加到父 fiber 的节点上
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    // 如果 fiber 带有 UPDATE 效果标签，我们更新 DOM 节点
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, domParent);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

// 如果当前 fiber 节点没有 dom (即为函数组件)
// 则需要往下找，直到找到一个有 DOM 节点的子fiber 节点。
function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child, domParent);
  }
}

// isEvent 判断属性是否为名以 `"on"` 前缀开头的事件
const isEvent = (key) => key.startsWith("on");
// isProperty 判断属性是否为 children 且不是事件属性
const isProperty = (key) => key !== "children" && !isEvent(key);
// isNew 判断属性是否为新属性
const isNew = (prev, next) => (key) => prev[key] !== next[key];
// isGone 判断属性是否被删除
const isGone = (prev, next) => (key) => !(key in next);

// 处理 fiber 节点更新逻辑
function updateDom(dom, prevProps, nextProps) {
  // 移除旧的或更改的事件监听器
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // 移除旧的属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = "";
    });

  // 设置新的或更改的属性
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = nextProps[name];
    });

  // 添加事件监听器
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}

// 执行一个工作单元
// - fiber:当前的 fiber 节点
function performUnitOfWork(fiber) {
  // 判断 fiber 节点是否为函数组件对应不同的处理逻辑
  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  // 选择下一个工作单元
  // 如果当前 Fiber 节点有子节点，则返回子节点
  // 否则，向上遍历父节点，直到找到有兄弟节点的节点，并返回该兄弟节点
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

// 处理普通的fiber节点
function updateHostComponent(fiber) {
  // 如果当前 fiber 节点还没有对应的 DOM 节点，则创建一个
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // 为元素的子节点创建对应的 fiber 结构
  const elements = fiber.props.children;
  reconcileChildren(fiber, elements);
}

// 处理函数组件对应的 fiber 节点
function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = [];
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function useState(initial) {
  // 1:从旧 Fiber 中获取当前 hook 对应的旧值（用以保留 state）
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex];

  // 2:创建新的 hook 实例，初始化 state（若旧 hook 存在，则复用旧 state）
  const hook = {
    state: oldHook ? oldHook.state : initial, // 当前状态值
    queue: [], // 将来的 setState 动作列表（action 队列）
  };

  // 3:将旧的 action 队列执行一遍，得到最终的 state（支持多次 setState 累积）
  const actions = oldHook ? oldHook.queue : [];
  actions.forEach((action) => {
    hook.state = action(hook.state); // action 是函数:上一个 state => 新 state
  });

  // 4:定义 setState，用于更新当前 hook 的状态
  const setState = (action) => {
    // 把新的更新 action 放入当前 hook 的 queue
    hook.queue.push(action);

    // 触发整个应用重新渲染:构建新的 Fiber 树根节点
    wipRoot = {
      dom: currentRoot.dom, // 当前根节点 DOM
      props: currentRoot.props, // 当前根节点 props（即 App）
      alternate: currentRoot, // 指向旧的 Fiber 树（用于 diff）
    };
    nextUnitOfWork = wipRoot; // 设置下一轮的第一个工作单元
    deletions = []; // 初始化删除节点数组
  };

  // 5:将当前 hook 添加进当前正在处理的 Fiber 节点
  wipFiber.hooks.push(hook);
  hookIndex++; // 为下一个 hook 做准备

  // 6:返回当前状态值和 setState 函数
  return [hook.state, setState];
}

// 协调子节点，对比新旧 Fiber 树并生成更新
function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let prevSibling = null;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;

  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;

    // 判断新旧元素是否为同一类型，用于决定如何处理这个节点。
    // 三个条件的检查：新旧元素存在、旧元素存在、且新旧元素的 element.type == oldFiber.type 类型相同
    const sameType = oldFiber && element && element.type == oldFiber.type;

    // 如果 element 有对应的 oldFiber 、且元素类型相同。复用旧元素。
    // 为 fiber 标记 effectTag 为 UPDATE 。
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      };
    }

    // 如果 element 没有对应的 oldFiber、或元素类型不同。
    // 为 fiber 标记 effectTag 为 PLACEMENT 。
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      };
    }

    // 如果 oldFiber 没有对应的 element 、或元素类型不同。
    // 为 oldFiber 标记 effectTag 为 DELETION 。
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber);
    }

    // 移动 oldFiber 指针到下一个兄弟节点，用于下一轮循环的比较
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (element) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}

// Didact 对象：模拟 React 的 API 接口
const Didact = { createElement, render, useState };

// 告诉 JSX 编译器在创建元素时调用 Didact.createElement 而不是 React.createElement
/** @jsx Didact.createElement */
function Counter() {
  const [state, setState] = Didact.useState(1);
  return <h1 onClick={() => setState((c) => c + 1)}>Count: {state}</h1>;
}

const element = <Counter />;
const container = document.getElementById("didact-root");
Didact.render(element, container);
```
