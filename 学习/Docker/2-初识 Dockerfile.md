# 初识 Dockerfile

Dockerfile 是用于构建 Docker 镜像的文本文件。Dockerfile 中的指令可以用于指定基础镜像、安装软件包、复制文件、设置环境变量、运行命令等。通过编写 Dockerfile，可以定义一个自定义的镜像，其中包含了应用程序所需的所有组件和配置。这样，其他用户可以使用该 Dockerfile 来构建相同的镜像，并在其本地或其他环境中运行应用程序。

## dockerfile 基础指令

- `FROM` : 指定基础镜像。一切从这里开始构建
- `MAINTAINER` : 指定镜像的维护者信息 ( 姓名、邮箱 )
- `RUN` : 在镜像构建过程中执行的命令。例如安装一个软件包，或执行一些需要长时间运行的编译操作。如 `npm install`
- `ADD` : 将主机目录下的文件复制到镜像中，如果是压缩包会自动解压
- `COPY` : 将主机目录下的文件复制到镜像中，类似 `ADD` 但是不会自动解压文件，由于 ADD 指令的自动解压缩和下载功能，它的使用相对较少，并且在某些情况下可能会导致不可预期的行为。 因此，通常建议在大多数情况下使用 COPY 指令，并在需要特定功能 ( 如解压缩或下载 ) 时才使用 ADD 指令。
- `WORKDIR` : 为后续的`RUN`、`CMD`、`ENTRYPOINT` 等指令配置工作目录
- `VOLUME` : 创建一个可以从本地主机或其他容器挂载的挂载点，一般用来存放数据库和需要保持的数据等
- `EXPOSE` : 声明容器运行时的监听端口，但是不会自动在宿主主机上打开这个端口的链接，需要使用-P 或者-p 来指定
- `CMD` : 指定一个容器启动时要运行的命令，**Dockerfile 中可以有多个 CMD 指令，但只有最后一个生效**，`CMD` 可以被 docker run 之后的参数替换
- `ENTRYPOINT` : 指定一个容器启动时要运行的命令，**Dockerfile 中可以有多个 ENTRYPOINT 指令，但只有最后一个生效**，`ENTRYPOINT` 不会被 docker run 之后的参数替换，**ENTRYPOINT 指令可以追加指令。**

  ```dockerfile
  FROM ubuntu
  ENTRYPOINT ["echo", "Hello"]
  CMD ["World"]
  ```

  容器启动时将执行 `echo Hello World` 命令。

- `ONBUILD` : 当构建一个被继承 Dockerfile 时运行命令，父镜像在被子继承后父镜像的 onbuild 被触发
- `ENV` : 设置环境变量，可以在后续的指令中使用这个环境变量
