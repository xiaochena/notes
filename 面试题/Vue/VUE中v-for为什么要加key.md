# VUE 中 v-for 为什么要加 key

参考连接：[简书](https://www.jianshu.com/p/4bd5e745ce95)

说到这个问题想必要举个例子了!

![image](https://upload-images.jianshu.io/upload_images/3973616-8f9fd484aa3544b1.jpg)

##### 没有 key

```html
<div id="app">
  <div>
    <input type="text" v-model="name" />
    <button @click="add">添加</button>
  </div>
  <ul>
    <li v-for="(item, i) in list"><input type="checkbox" /> {{item.name}}</li>
  </ul>
  <script>
    // 创建 Vue 实例，得到 ViewModel
    var vm = new Vue({
      el: "#app",
      data: {
        name: "",
        newId: 3,
        list: [
          { id: 1, name: "李斯" },
          { id: 2, name: "吕不韦" },
          { id: 3, name: "嬴政" }
        ]
      },
      methods: {
        add() {
          //注意这里是unshift
          this.list.unshift({ id: ++this.newId, name: this.name });
          this.name = "";
        }
      }
    });
  </script>
</div>
```

> 当选中吕不为时，添加楠楠后选中的确是李斯，并不是我们想要的结果，我们想要的是当添加楠楠后，一种选中的是吕不为

![image](https://upload-images.jianshu.io/upload_images/3973616-ff6a298524fd39dc.jpg)

## ![image](https://upload-images.jianshu.io/upload_images/3973616-281b0c8ae857f17f.jpg?)

##### 有 key

```html
<div id="app">
  <div>
    <input type="text" v-model="name" />
    <button @click="add">添加</button>
  </div>
  <ul>
    <li v-for="(item, i) in list" :key="item.id">
      <input type="checkbox" /> {{item.name}}
    </li>
  </ul>
  <script>
    // 创建 Vue 实例，得到 ViewModel
    var vm = new Vue({
      el: "#app",
      data: {
        name: "",
        newId: 3,
        list: [
          { id: 1, name: "李斯" },
          { id: 2, name: "吕不韦" },
          { id: 3, name: "嬴政" }
        ]
      },
      methods: {
        add() {
          //注意这里是unshift
          this.list.unshift({ id: ++this.newId, name: this.name });
          this.name = "";
        }
      }
    });
  </script>
</div>
```

> 同样当选中吕不为时，添加楠楠后依旧选中的是吕不为。
> ![image](https://upload-images.jianshu.io/upload_images/3973616-c34bc534f49544a0.jpg?)

![image](https://upload-images.jianshu.io/upload_images/3973616-ef133a0c7dff8d82.jpg?)

#### 可以简单的这样理解：

加了 key(一定要具有唯一性) id 的 checkbox 跟内容进行了一个关联。是我们想达到的效果

查过相关文档，图例说明很清晰。  
vue 和 react 的虚拟 DOM 的 Diff 算法大致相同，其核心是基于两个简单的假设

首先讲一下 diff 算法的处理方法，对操作前后的 dom 树同一层的节点进行对比，一层一层对比，如下图：
![image](https://upload-images.jianshu.io/upload_images/3973616-cbe6ef9bad920f51.png?)

当某一层有很多相同的节点时，也就是列表节点时，Diff 算法的更新过程默认情况下也是遵循以上原则。

比如一下这个情况：
![image](https://upload-images.jianshu.io/upload_images/3973616-6d930e85939f0a3e.jpg)

我们希望可以在 B 和 C 之间加一个 F，Diff 算法默认执行起来是这样的：
![image](https://upload-images.jianshu.io/upload_images/3973616-c93a83cb2203fa54.jpg)

即把 C 更新成 F，D 更新成 C，E 更新成 D，最后再插入 E，是不是很没有效率？
所以我们需要使用 key 来给每个节点做一个唯一标识，Diff 算法就可以正确的识别此节点，找到正确的位置区插入新的节点。

![image](https://upload-images.jianshu.io/upload_images/3973616-25f6c171772b50b6.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/452/format/webp)

vue 中列表循环需加:key="唯一标识" 唯一标识可以是 item 里面 id index 等，因为 vue 组件高度复用增加 Key 可以标识组件的唯一性，为了更好地区别各个组件 key 的作用主要是为了==高效==的更新虚拟 DOM
