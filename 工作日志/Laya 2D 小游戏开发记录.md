# Laya 2D 小游戏开发记录

## 项目主要目录文件介绍

### 文件目录

```javascript
|--.laya
|--|--compile.js
|--|--launch.json
|--|--publish.js
|--bin
|--laya	
|--|--assets
|--|--pages![Laya 2D 小游戏开发记录-2023-10-05-11-04-59](/attachments/Laya%202D%20小游戏开发记录-2023-10-05-11-04-59.png)
|--|--.laya
|--libs	
|--src	
|--ProjectName.laya
|--tsconfig.json
```
### .laya文件夹

`.laya` 文件夹下存放的是项目在开发运行中的一些配置信息，

- **compile.js:** 是gulp自定义编译流程的脚本文件，如果开发者对gulp比较熟悉的可以修改，否则不要动这里。

- **launch.json:** 文件保存了项目调试的一些配置信息,分别是LayaAirIDE的调试配置和chrome浏览器调试配置。不要轻易去改动，改错后会影响项目的调试。

- **publish.js:** 是gulp针对项目发布的脚本文件，开发者不要动这里。

### bin文件夹 

该目录用于存放项目中输出的js 、HTML、游戏资源等项目运行文件，以及小游戏项目文件（如果创建项目时勾选了小游戏快速调试选项时）。

默认layaAir调试或者chrome调试的时候，就是运行的该目录下的文件。

###  laya（UI项目目录）

`laya`目录用于存放LayaAirIDE当前的UI项目。

- **assets:**用来存放UI场景中所需的组件图片、音频文件等资源。
- **pages：**用来存放IDE中的场景、动画、预设等配置文件。
- **.laya：**注意这个.laya是文件而不是目录，.laya文件是LayaAirIDE的UI项目配置文件。

### libs （项目库目录）

“`libs`”目录内为项目的库目录，目录下是layaAir引擎LayaAir.d.ts文件和wx.d.ts。用来代码提示，开发者假如有三方的类库使用，相关的.d.ts文件请放到这个目录下。 例如wx.d.ts用于微信小游戏开发代码提示。如图7所示。

### src （ 项目的源代码目录）

项目中的用到的源代码文件（TS语言项目是.ts文件），默认都存放在 src 目录下。

需要特别说一下的是`ui`目录，这里属于IDE自动生成的，开发者不要改动这里，改了也会被下次导出替换。所以该目录中不要存放自己的代码，也不要修改已有代码。

其它的开发者依据实际需要自行规划目录结构即可。           

### 项目名.laya（项目配置文件）

是LayaAirIDE项目的工程配置文件，文件内记录了当前项目的项目名称、使用的类库版本号等。

### tsconfig.json

typescript使用、IDE的编译配置信息







​                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        