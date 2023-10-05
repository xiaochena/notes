# JavaScript如何判断数据类型

Last edited time: July 19, 2023 10:23 PM
tag: JavaScript

# 使用 typeof 操作符

[typeof - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof)

`typeof` 操作符可以返回一个值的 基本数据类型。它的语法是`typeof value` ，其中 `value` 是你要判断类型的值。

| 类型 | 结果 |
| --- | --- |
| https://developer.mozilla.org/zh-CN/docs/Glossary/Number | "number" |
| https://developer.mozilla.org/zh-CN/docs/Glossary/BigInt | "bigint" |
| https://developer.mozilla.org/zh-CN/docs/Glossary/String | "string" |
| https://developer.mozilla.org/zh-CN/docs/Glossary/Boolean | "boolean" |
| https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol | "symbol" |
| https://developer.mozilla.org/zh-CN/docs/Glossary/Undefined | "undefined" |
| https://developer.mozilla.org/zh-CN/docs/Glossary/Null | "object"（https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof#typeof_null） |
| https://developer.mozilla.org/zh-CN/docs/Glossary/Function（在 ECMA-262 中实现 [[Call]]；https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/class也是函数) | "function" |
| 其他任何对象 | "object" |

虽然 `typeof` 在大多数情况下可以返回正确的结果，但是对于引用数据类型（如 对象、数组、正则、new Date() 等），`typeof` 只能返回 `'object'`。

同时对于一些特殊的场景如 `new Boolean(true)` 、 `new Number(1)` 、`new String('abc')` , `typeof` 只能返回 `'object'`。

```jsx
// 数值
typeof 37 === 'number';
typeof 3.14 === 'number';
typeof(42) === 'number';
typeof Math.LN2 === 'number';
typeof Infinity === 'number';
typeof NaN === 'number'; // 尽管它是 "Not-A-Number" (非数值) 的缩写
typeof Number(1) === 'number'; // Number 会尝试把参数解析成数值
typeof Number("shoe") === 'number'; // 包括不能将类型强制转换为数字的值

// bigint
typeof 42n === 'bigint';

// 字符串
typeof '' === 'string';
typeof 'bla' === 'string';
typeof `template literal` === 'string';
typeof '1' === 'string'; // 注意内容为数字的字符串仍是字符串
typeof (typeof 1) === 'string'; // typeof 总是返回一个字符串
typeof String(1) === 'string'; // String 将任意值转换为字符串，比 toString 更安全

// 布尔值
typeof true === 'boolean';
typeof false === 'boolean';
typeof Boolean(1) === 'boolean'; // Boolean() 会基于参数是真值还是虚值进行转换
typeof !!(1) === 'boolean'; // 两次调用 !（逻辑非）运算符相当于 Boolean()

// Symbols
typeof Symbol() === 'symbol';
typeof Symbol('foo') === 'symbol';
typeof Symbol.iterator === 'symbol';

// Undefined
typeof undefined === 'undefined';
typeof declaredButUndefinedVariable === 'undefined';
typeof undeclaredVariable === 'undefined';

// 函数
typeof function() {} === 'function';
typeof class C {} === 'function'
typeof Math.sin === 'function';

// 对象
typeof { a: 1 } === 'object';

// 使用 Array.isArray 或者 Object.prototype.toString.call
// 区分数组和普通对象
typeof [1, 2, 4] === 'object';

typeof new Date() === 'object';
typeof /regex/ === 'object';

// 下面的例子令人迷惑，非常危险，没有用处。避免使用它们。
typeof new Boolean(true) === 'object';
typeof new Number(1) === 'object';
typeof new String('abc') === 'object';
```

# 使用 **instanceof** 操作符

[instanceof - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof)

instanceof运算符用于测试构造函数的原型属性是否在对象的原型链中的 **任何位置** 出现。

返回值是一个布尔值。它的行为可以使用 `[Symbol.hasInstance](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance)` 进行自定义。

```jsx
var simpleStr = "This is a simple string";
simpleStr instanceof String; // 返回 false，非对象实例，因此返回 false、

var myString  = new String();
myString  instanceof String; // 返回 true
myString  instanceof Object; // 返回 true
myString instanceof Date; //返回 false
var newStr    = new String("String created with constructor");
newStr    instanceof String; // 返回 true

var myObj     = {};
myObj instanceof Object;    // 返回 true，尽管原型没有定义
({})  instanceof Object;    // 返回 true，同上
var myNonObj  = Object.create(null);
myNonObj instanceof Object; // 返回 false，一种创建非 Object 实例的对象的方法

var myDate    = new Date();
myDate instanceof Date;     // 返回 true
myDate instanceof Object;   // 返回 true
myDate instanceof String;   // 返回 false
```

**`instanceof`** 它只适用于对象和构造函数或类之间的关系，不能用于判断基本数据类型。

# Object.prototype.toString.call(value)

[Symbol.toStringTag - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag)

```jsx
console.log(Object.prototype.toString.call(42)); // [object Number]
console.log(Object.prototype.toString.call("Hello")); // [object String]
console.log(Object.prototype.toString.call(true)); // [object Boolean]
console.log(Object.prototype.toString.call([1, 2, 3])); // [object Array]
console.log(Object.prototype.toString.call({ name: "John", age: 30 })); // [object Object]
console.log(Object.prototype.toString.call(function () {})); // [object Function]
console.log(Object.prototype.toString.call(new Date())); // [object Date]
console.log(Object.prototype.toString.call(/regex/)); // [object RegExp]
console.log(Object.prototype.toString.call(new Error("Something went wrong"))); // [object Error]
console.log(Object.prototype.toString.call(Math)); // [object Math]
console.log(Object.prototype.toString.call(JSON)); // [object JSON]
console.log(Object.prototype.toString.call(null)); // [object Null]
console.log(Object.prototype.toString.call(undefined)); // [object Undefined]
console.log(Object.prototype.toString.call(window)); // [object Window] (in browser context)
console.log(Object.prototype.toString.call(global)); // [object global] (in Node.js context)
```

使用**`Object.prototype.toString.call`**方法来检测不同类型的对象时，返回的结果字符串会根据对象的类型而有所不同。

- 对于函数内部的 **`arguments`** 对象，无论是何种情况，它的返回结果都是**`[object Arguments]`**。这是因为**`arguments`**对象是一个特殊的对象，用于存储函数调用时传递的参数。
    
    ```jsx
    function foo() {
      console.log(Object.prototype.toString.call(arguments)); // [object Arguments]
      console.log(arguments[0]); // 访问第一个参数
      console.log(arguments.length); // 参数个数
    }
    
    foo(1, 2, 3);
    // 输出：
    // [object Arguments]
    // 1
    // 3
    ```
    
- 对于其他类型的对象，包括用户定义的类（除非自定义了 **`Symbol.toStringTag`** 属性），它们的返回结果都是**`[object Object]`**。这是因为在默认情况下，JavaScript 中的对象都被认为是一种通用的对象类型。
    
    **`Object.prototype.toString.call`** 方法之所以能够用来判断数据类型，是因为它返回的结果字符串包含了对象的内部**`[[Class]]`** 属性的值。
    
    > 对于内置类型和原生对象来说，**`[[Class]]`**属性的值通常与 **`Symbol.toStringTag`** 属性的值相对应。它们在某种程度上可以被视为相同的概念。
    > 
    
    我们也可以自定义 **`Symbol.toStringTag`** 属性 从而影响结果
    
    ```jsx
    const myDate = new Date();
    Object.prototype.toString.call(myDate); // [object Date]
    
    myDate[Symbol.toStringTag] = "myDate";
    Object.prototype.toString.call(myDate); // [object myDate]
    
    Date.prototype[Symbol.toStringTag] = "prototype polluted";
    Object.prototype.toString.call(new Date()); // [object prototype polluted]
    
    const obj = {
        get [Symbol.toStringTag]() {
        return 'Validator';
      }
    }
    
    console.log(Object.prototype.toString.call(obj));
    ```
    

# 总结

`typeof`  - 无法判断除了 `function` 以外的其余引用数据类型如 对象、数组、正则、new Date()等、但是其相对准确、它返回的结果是 JavaScript 语言规范中定义的，具有固定的行为。

`instanceof` - 用于测试构造函数的原型属性是否在对象的原型链中的 **任何位置** 、因此其不适合用于针对类型的判断、误差较大

`Object.prototype.toString.call(value)` - 相比`typeof` 、`Object.prototype.toString.call(value)` 能够准确判断 对象、数组、正则、new Date() 等数据类型。其结果可以通过修改 `[Symbol.toStringTag]` 属性影响