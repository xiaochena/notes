# npmjs 关于语义化版本控制

Last edited time: September 24, 2023 7:05 PM
tag: JavaScript, Typescript, npm, 前端工程化

[About semantic versioning | npm Docs](https://docs.npmjs.com/about-semantic-versioning)

首先我们可以查阅官方文档，`npm` 建议我们使用语义化版本规范（[Semantic Versioning spec](http://semver.org/)）

## 语义化版本规范（Semantic Versioning spec）

是一个三部分组成的版本命名规则，格式为：`major.minor.patch (主版本号.次版本号.修订号)`。

- 主版本号（Major）：当你做了向后不兼容的 API 修改
- 次版本号（Minor）：当你添加了向后兼容的新特性
- 修订号（Patch）：当你做了向后兼容的问题修复

此外，还可以加入预发布版本号与版本构建元数据如 `alpha,beta,rc（Release Candidate）`。

- alpha：这是开发初期的版本，功能可能不完整，可能存在错误。这个版本主要是给内部测试使用。
- beta：在功能基本完善的前提下，可能进行发布的版本。这个版本主要是进行测试使用，用来收集可能出现的错误。
- rc（Release Candidate）：这是候选版本，如果测试没有发现新的错误，就会变成正式版。在平常的软件开发中，RC版本主家在开发周期结束时发布。

这些标签`（alpha、beta、rc）`并不是唯一或者强制的，可以根据实际情况，选择适合的标签。

比如，一些项目可能只使用 "`beta`" 而跳过 "`alpha`"，而另一些项目可能会加入如 "`dev`"（developer，开发版）或 "`nightly`"（每晚构建版）等标签。

## **npm-dist-tag**

[npm-dist-tag | npm Docs](https://docs.npmjs.com/cli/v10/commands/npm-dist-tag/)

默认情况下 npm 会使用 latest 标签来识别一个包的当前版本，而 `npm install <pkg>`（没有任何 @<version> 或 @<tag> 的指定）会安装 `latest` 标签的版本。

发布包会将 `latest` 标记设置为已发布的版本，而对于不稳定的版本例如预发布版需要使用其他标签如 `npm publish --tag=beta`

我们还可以通过 `npm dist-tag add` 指令通过指定版本增加或者移动tag。

```bash
npm dist-tag add pkg@0.0.4-beta.1 beta
```

当我们发包时不小心将 `tag` 指向错误的情况时我们就可以使用`npm dist-tag add`指令修改 `tag` 指向：

```bash
npm dist-tag add pkg@1.0.0 latest
npm dist-tag add pkg@1.0.1-beta.0 beta
```

## **版本升级工具**

[npm-version | npm Docs](https://docs.npmjs.com/cli/v6/commands/npm-version)

npm 提供了自动升级版本号的工具：`npm version`，该工具会自动修改package.json内的版本号并且会自动记录 `git commit`， 因此使用该工具时请保持git status是clear的。

例如当 `package.json` 的当前版本为`1.0.0` 

```bash
npm version preminor
v1.1.0-0

npm version minor
v1.1.0

npm version prepatch
v1.1.1-0

npm version patch
v1.1.1

npm version prerelease --preid=beta
v1.1.2-0-beta.0

npm version premajor
v2.0.0-0

npm version major
v2.0.0
```

还可以在 npm version NEWVERSION 后面加上-m参数来指定自定义的 `commit message` 

```bash
# message中的 s% 将会被替换为版本号。
npm version patch -m "Upgrade to %s for reasons"
```

## 引用

[https://github.com/canvasT/blog/issues/2](https://github.com/canvasT/blog/issues/2)

[版本号管理策略&&使用npm管理项目版本号 | 朱嘉伟的博客](http://buzhundong.com/post/版本号管理策略-使用npm管理项目版本号.html)