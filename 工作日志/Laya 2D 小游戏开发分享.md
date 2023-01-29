# 初识 Laya

## 首先是 Ide 中的目录结构

![01.初识Laya__2022-05-26-15-57-18](/attachments/01.初识Laya__2022-05-26-15-57-18.png)

- Scenes：对应文件中`laya` 目录下的 `pages`。用来存放 IDE 中的场景、动画、预设等配置文件。
- Assets: 资源、对应文件中`laya` 目录下的 `assets`。用来存放 UI 场景中所需的组件图片、音频文件等资源。
- comp: 默认的一些皮肤资源
- Script：脚本、对应文件中的 `src` 目录。用来存放脚本文件
- Basics：放着 IDE 自带的常用组件。分别为 2D 基础组件、Graphics 矢量组件、UI 常用组件几大类

## 文件夹结构

![01.初识Laya__2022-05-26-16-19-51](/attachments/01.初识Laya__2022-05-26-16-19-51.png)

### 1.`.laya` 项目配置目录

存放的是项目在开发运行中的一些配置信息如`compile.js`、`launch.json`、`publish.js`

- **compile.js**：是 gulp 自定义编译流程的脚本文件，如果开发者对 gulp 比较熟悉的可以修改，否则不要动这里。
- **launch.json**：保存了项目调试的一些配置信息,分别是 LayaAirIDE 的调试配置和 chrome 浏览器调试配置。不要轻易去改动，改错后会影响项目的调试。
- **publish.js**：是 gulp 针对项目发布的脚本文件，开发者不要动这里。

**其它说明**：还有一些配置文件如 web 版、微信、百度等小游戏，默认没有，但是发布的时候也会保存到.laya 目录。如 `wxgame.json` 是微信小游戏发布配置文件， `bdgame.json` 是百度小游戏发布配置文件。

### 2.`bin`：项目的输出目录

`bin` 目录存放的是当前项目的输出文件。默认 layaAir 调试或者 chrome 调试的时候，就是运行的该目录下的文件。

> 同时编译为各个平台的代码时、的资源文件会从这里复制。

### 3.`laya`：UI 项目目录

用于存放 LayaAirIDE 当前的 UI 项目。

- **assets 目录：** 用来存放 UI 场景中所需的组件图片、音频文件等资源。
- **pages 目录：** 用来存放 IDE 中的场景、动画、预设等配置文件。
- **.laya 文件：** 是 LayaAirIDE 的 UI 项目配置文件。

### 4.`libs`：项目库目录

目录下是 layaAir 引擎 LayaAir.d.ts 文件和 wx.d.ts。用来代码提示

### 5.`src`：项目的源代码目录

- **script：** 项目中的用到的源代码文件（TS 语言项目是.ts 文件），默认都存放在 src 目录下。
- **ui：** 属于 IDE 自动生成的，开发者不要改动这里，改了也会被下次导出替换。所以该目录中不要存放自己的代码，也不要修改已有代码。

### 6. 发布目录

发布目录默认是不存在的，需要点击发布按钮，发布项目后才会生成对应的版本目录

### 7. 项目名.laya

是 LayaAirIDE 项目的工程配置文件，文件内记录了当前项目的项目名称、使用的类库版本号

# 创建场景

laya 的场景是 UI、动画等内容创作的核心工作区域、我们可以在场景编辑器中选择和摆放控件，组合容器

## 创建场景

![02.创建场景__2022-05-26-17-41-36](/attachments/02.创建场景__2022-05-26-17-41-36.png)
![02.创建场景__2022-05-26-17-42-38](/attachments/02.创建场景__2022-05-26-17-42-38.png)

> 其中导出类型 默认为文件模式

## 导出类型

- 文件模式：将场景数据分成多个 json 在使用时才去加载，减少了用户初次进入游戏的等待时间但不自动生成场景类，因此也是打包后最小的模式。
- 分离模式：和文件模式类似、区别在于他会生成场景类。方便使用
- 内嵌模式：场景数据放在 bundle.js 里，一次全部加载、占用了宝贵的初始包资源。
- 加载模式：和白鹭的 `default.thm.json` 一样，将所有场景数据都放在里面一次性加载。场景数据不多时，可以考虑使用，毕竟只加载一次，减少了多场景多 json 的请求。

选择 分离模式、在减少用户初次进入游戏的等待时间的同时、能够生成场景类、方便开放使用。

# runTime 脚本与 script 脚本

在 LayaAirIDE 中资源面板下所有的组件均有 runtime 的属性、相同组件可使用同一 runtime 类来实现相同的功能

组件的 runtime 逻辑类如果不继承组件自身、在继承的对象中没有该组件的属性时，这个属性则会失效。

runTime 脚本继承页面，场景或组件类，实现逻辑。

- 相比 script 脚本方式，继承式页面类，可以直接使用页面定义的属性比如 this.tipLbll，this.scoreLbl，具有代码提示效果
- 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用 `runtime` 继承式写法，如果是独立小模块，功能单一，建议用 script 脚本方法

# Code

## 一、创建 runtime 与 script 脚本

1、创建 runtime

GameUi

```ts
import { ui } from "../ui/layaMaxUI";

export default class GameUi extends ui.HomeUI {
  constructor() {
    super();
  }

  onEnable(): void {
    this.star.on(Laya.Event.CLICK, this, this.onStarClick);
  }
  onStarClick(): void {
    console.log("star click");
  }
}
```

因为我们的场景类型选择了`分离模式`、因此会生成场景类。才可以在场景中使用 runtime，因为 runtime 需要继承于场景类、相比 script 脚本方式，继承式页面类，可以直接使用页面定义的属性（通过 IDE 内 var 属性定义）、适合游戏界面初始化 UI 初始化、需要频繁访问页面内多个元素，使用 runtime 继承式写法

与之相对应的是 `script 脚本`

2、script 脚本

script 脚本 生命周期

![分享__2022-06-13-17-24-23](/attachments/分享__2022-06-13-17-24-23.png)
GameControl

```ts
export default class GameControl extends Laya.Script {
  /** @prop {name:start, tips:"开始按钮", type:Node}*/
  public start: Laya.Node;
  // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0

  constructor() {
    super();
  }

  onAwake(): void {
    this.start.on(Laya.Event.CLICK, this, this.onStartClick);
  }

  onStartClick(): void {
    console.log("star click GameControl");
  }

  onDisable(): void {}
}
```

场景中的 script 脚本类一般用于控制游戏的执行逻辑。脚本类可以通过特殊注释来扩展当前组件的属性。


## 二、掉落敌机和射击子弹

> 刚体 `RigidBody`、碰撞体 `Collider`

`RigidBody` 刚体是指在运动中和受到力的作用后，形状和大小不变，而且内部各点的相对位置不变的物体。是力学中为了体现物体特性的一种科学抽象概念。

刚体类型(type) RigidBody 分为：静力学类型 `static`、动力学类型 `dynamic`、运动学类型 `kinematic`，默认为 `dynamic`。

- `static`：静力学，始终静止不动，无论施加怎样的力都不会移动， 不受重力影响，速度为零且不可设置 (可用于大地、地板等)。
- `dynamic`：动力学，会根据受到的力进行移动， 会受到重力的影响，可设置速度。(贴近正常生活中的物体)。
- `kinematic`：运动学，不会根据受到的力进行移动，不受重力影响，可设置速度。(如、匀速的子弹)。

`Collider`:碰撞体顾名思义，是用来检测碰撞的形状体组件。没有碰撞体只有刚体，则无法产生碰撞效果。
五种碰撞体都继承于碰撞体基类 ColliderBase 分别是：矩形碰撞体 `BoxCollider`，圆形碰撞体 `CircleCollider`，链形碰撞体 `ChainCollider` 、多边形碰撞体 `PolygonCollider`

其中 `PolygonCollider` 最少由 3 个点的封闭三角形组成，最多只能是 8 个点（超出会报错），**并且只能是凸多边形**。
![分享__2022-06-08-15-53-59](/attachments/分享__2022-06-08-15-53-59.png)

## 三、prefab 预设的使用

美术定义一系列标准的字体颜色，字号，在各个 UI 中应用，有一天美术突然说要更改默认的字体颜色，字号，苦逼的 UI 制作者就需要把所有界面都修改一次，这样会非常麻烦。
而对于一些需要频繁出现且数量不一定的物体、我们也需要有一个办法做到一劳永逸。那就是预设

GameControl.ts

```ts
export default class GameControl extends Laya.Script {
  /** @prop {name:enemy,tips:"预制体 敌机",type:Prefab}*/
  enemy: Laya.Prefab;
  /** @prop {name:enemyPoint,tips:"创建敌机的起点",type:Node}*/
  enemyPoint: Laya.Image;
  // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0

  /**记录上一个敌机的创建时间*/
  private _time: number = 0;

  constructor() {
    super();
  }

  onUpdate(): void {
    //每间隔一段时间创建一个敌机
    const now = Date.now();
    if (now - this._time > 400) {
      this._time = now;
      this.createEnemy();
    }
  }

  createEnemy(): void {
    // 使用对象池创建盒子
    const box: Laya.Sprite = Laya.Pool.getItemByCreateFun(
      "enemy",
      this.enemy.create,
      this.enemy
    );
    box.pos(Math.random() * (Laya.stage.width - 100), -100);
    this.enemyPoint.addChild(box);
  }
}
```

Enemy.ts

```ts
export default class Enemy extends Laya.Script {
  constructor() {
    super();
  }

  onTriggerEnter(other: any, self: any, contact: any): void {
    //如果被地板碰到，则移除
    if (other.label === "ground") {
      this.owner.removeSelf();
    }
  }

  onDisable(): void {
    //被移除时，回收到对象池，方便下次复用，减少对象创建开销
    Laya.Pool.recover("enemy", this.owner);
  }
}
```

我们可以发现、飞机之间也在互相碰撞、但是这其实不是我们希望看到的。有两种方式可以避免，一、通过 RigidBody 的 `group`属性设置碰撞分组、二、直接通过 Collider 的 `isSensor` 设置为传感器。传感器能够触发碰撞事件，但是不会产生碰撞反应。

