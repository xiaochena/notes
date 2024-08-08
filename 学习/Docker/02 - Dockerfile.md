# 初识 Dockerfile

Dockerfile 是用于构建 Docker 镜像的文本文件。Dockerfile 中的指令可以用于指定基础镜像、安装软件包、复制文件、设置环境变量、运行命令等。通过编写 Dockerfile，可以定义一个自定义的镜像，其中包含了应用程序所需的所有组件和配置。这样，其他用户可以使用该 Dockerfile 来构建相同的镜像，并在其本地或其他环境中运行应用程序。

## 构建 nginx dockerfile

```dockerfile
FROM nginx:latest

# 复制自定义的 nginx.conf 文件到容器的 /etc/nginx 目录中
COPY ./nginx.conf /etc/nginx/nginx.conf

# 将当前目录下的 index.html 文件复制到Nginx容器的默认网站目录
COPY ./index.html /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

```shell
# 构建镜像
# docker build -f [dockerfile文件路径] -t [镜像tag]
$ docker build -f nginxDockerfile -t my-nginx-image .
# 查看镜像
$ docker images
REPOSITORY   TAG       IMAGE ID       CREATED         SIZE
my-nginx-image     latest    015e08fb510e   2 minutes ago   187MB
# 运行镜像
$ docker run -d -p 10086:80 my-nginx-image
```

- `docker build`: 这是 `Docker` 命令，用于构建 `Docker` 镜像。
- `-f nginxDockerfile`: 这是用于指定要使用的 `Dockerfile` 文件路径。默认情况下 `docker build` 会使用当前目录下的`dockerfile`文件作为构建镜像的配置文件。这里，我们指定使用当前目录下的 `nginxDockerfile` 文件作为构建镜像的配置文件。
- `-t my-nginx-image`: 这是用于为构建的镜像指定一个标签 ( tag ) 。在这里，镜像将被标记为 `my-nginx-image`，以便以后可以通过这个标签来引用它。
- `.`: 这表示 Docker 将使用当前目录作为构建上下文，如果 `Dockerfile` 中有 `COPY` 或 `ADD` 指令，它们会依赖于构建上下文中的文件。

## 运行 Docker 容器

```shell
docker run -d -p 10086:80 --name my-nginx-container my-nginx-image
```

- `-d` 表示在后台运行容器 - `daemon 模式` ( 守护进程模式 ) 。
- `-p` `10086:80` 将容器的端口 80 映射到宿主机的端口 `10086`。这样，你可以通过访问 `http:// localhost:10086` 或 `http://<宿主机 IP>:10086` 来访问 `Nginx` 服务。
- `--name my-nginx-container` 指定容器的名称为 `my-nginx-container`，你可以自行命名。
- `my-nginx-image` 是之前构建的 `Nginx` 镜像名称。

运行镜像后

![Docker-2023-10-05-21-06-58](/attachments/Docker-2023-10-05-21-06-58.png)

## dockerfile 指令

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
