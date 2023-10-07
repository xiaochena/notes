# Docker的常用命令

帮助命令

```shell
$ docker version     	 # 显示docker的版本信息
$ docker info			 # 显示docker的系统信息、包括镜像和容器的数量
$ docker 命令 --help	# 帮助命令
```

帮助文档的地址：https://docs.docker.com/reference/

# 基础命令

```shell
$ docker i
```


## 镜像命令

`docker images` 查看所有本地的主机上的镜像

```shell
$ docker images

REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
mysql         5.7       87eca374c0ed   2 weeks ago    447MB
nginx         latest    62d49f9bab67   3 weeks ago    133MB
hello-world   latest    d1165f221234   2 months ago   13.3kB
centos        latest    300e315adb2f   5 months ago   209MB

# 数据解释
REPOSITORY 	镜像的仓库源
TAG 		镜像的标签
IMAGE ID 	镜像的id
CREATED		镜像的创建时间
SIZE		镜像的大小

# 可选项
  -a, --all             # 列出所有镜像
      --digests         # 只显示镜像的id
      ...
```

`docker search` 搜索镜像

```shell
$ docker search mysql
NAME                              DESCRIPTION                                     STARS     OFFICIAL   AUTOMATED
mysql                             MySQL is a widely used, open-source relation…   10834     [OK]
mariadb                           MariaDB Server is a high performing open sou…   4085      [OK]
mysql/mysql-server                Optimized MySQL Server Docker images. Create…   800                  [OK]
centos/mysql-57-centos7           MySQL 5.7 SQL database server                   87

# 可选项
  -f, --filter # 可选项
      --format string   Pretty-print search using a Go template
      --limit int       Max number of search results (default 25)
      --no-trunc        Don't truncate output
  --filter=START=3000 # 搜索出来的镜像就是START大于3000的
```

`docker pull` 下载镜像

```shell
# 下载镜像 docker pull 镜像名称[:tag]
$ docker pull mysql
Using default tag: latest  		# 如果不写tag，默认选择latest 最新版本
latest: Pulling from library/mysql
f7ec5a41d630: Already exists	# 分层下载、docker image的核心 联合文件系统
9444bb562699: Already exists
6a4207b96940: Already exists
181cefd361ce: Already exists
8a2090759d8a: Already exists
15f235e0d7ee: Already exists
d870539cd9db: Already exists
493aaa84617a: Pull complete
bfc0e534fc78: Pull complete
fae20d253f9d: Pull complete
9350664305b3: Pull complete
e47da95a5aab: Pull complete
Digest: sha256:04ee7141256e83797ea4a84a4d31b1f1bc10111c8d1bc1879d52729ccd19e20a
Status: Downloaded newer image for mysql:latest # 真实版本
docker.io/library/mysql:latest
```

`docker rmi -f [:id]` 删除镜像！

`docker rmi -f $(docker image -aq)`  批量删除全部镜像！

```sh
$ docker rmi -f 镜像id  # 删除指定镜像
$ docker rmi -f 镜像id 镜像id 镜像id # 删除多个容器
$ docker rmi -f $(docker image ls -aq) # 删除全部的镜像
```

## 容器命令

有镜像才可以创建容器、使用centos镜像学习

```sh
$ docker pull centos
```

`docker run `创建容器并启动

```sh
$ docker run [可选参数] image
# 参数说明
--name="Name"	# 容器名字 nginx01 nginx02,用来区分容器
-d				# 后台方式运行
-it				# 使用交互方式运行、进入容器查看内容
-p				# 1、ip:主机端口:容器端口
				# 2、主机端口:容器端口（常用）
				# 3、容器端口
-P				# 随机端口

#测试，启动并进入容器、exit退出
$ docker run -it centos /bin/bash
[root@9affb64ee299 /]# ls
bin  dev  etc  home  lib  lib64  lost+found  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
[root@9affb64ee299 /]# exit 
exit
```

`exit`退出容器会停止、使用`Ctrl +P +Q`容器不停止退出

查看运行的容器  `docker ps` 

```sh
$ docker ps # 列出正在运行的容器

# 参数
-a		# 列出所有容器、在运行的以及不在运行的
-n=?	# 显示最近创建的容器
-q		# 只显示容器的编号
```

删除容器 `docker rm`

```sh
$ docker rm 容器id					# 删除指定的容器（不能删除正在运行的容器）
$ docker rm -f $(docker ps -aq)	 	# 删除所有的容器 ,-f 强制删除
$ docker ps -a -q|xargs docker rm	# 删除所有的容器
```

启动和停止容器的操作`start`，`restart`，`stop`，`kill`

``` sh
$ docker start 容器id     # 启动容器
$ docker restart 容器id   # 重启容器
$ docker stop 容器id      # 停止当前正在运行的容器
$ docker kill 容器id      # 强制停止当前容器
```

# 常用其他命令

## 后台启动容器
```sh
docker run -d centos

# 问题 docker ps，发现 centos 停止了
# 原因：docker 容器使用后台运行，就必须要有一个前台进程，否则 docker 发现没有应用，就会自动停止
```

## 查看日志

```sh
# 运行centos并且执行一段 shell 脚本
docker run -d centos /bin/sh -c "while true;do echo xiaochena;sleep 1;done"
```
```sh
# 
docker logs -tf -n 10 0207d2c3f2df
# -tf 显示日志
# -n(--tail) [:number] 要显示日志条数
```

## 查看容器中进程信息 ps
```sh
docker top 0207d2c3f2df

# 以下信息省略一部分
UID     PID     PPID    C   STIME          
root    2711    2690    0   16:22          
root    3002    2711    0   16:26          
```

## 查看容器信息

```sh
# docker inspect [:容器id]
docker inspect 0207d2c3f2df
```

## 进入当前正在运行的容器

- 方式一

```sh
# 我们通常容器都是使用后台方式运行的 ，有时需要进入容器，修改一些配置

# 命令
docker exec -it [:容器id] /bin/bash
```

- 方式二

```sh
docker attach [:容器id]
```

### 区别
- docker exec ：进入容器后开启一个新的终端，可以在里面操作
- docker attach：进入容器正在执行的终端，不会启动新的进程

## 从容器内拷贝文件到主机上
**docker cp [:容器id]:[容器内路径] [主机路径]**
```shell
# 启动一个容器
docker run -it centos /bin/bash
# 进入 home
[root@fdd5948973c6 /]# cd home
[root@fdd5948973c6 home]# ls
# 创建一个文件
[root@fdd5948973c6 home]# touch hello.text
[root@fdd5948973c6 home]# ls
hello.text
# 推出容器
[root@fdd5948973c6 home]# exit
# 查看全部容器找到刚才在home创建了hello.text的容器的id
$ docker ps -a
CONTAINER ID   IMAGE     COMMAND
0ceb2c4849d8   centos    "/bin/bash"
# 拷贝到本机
$ docker cp 0ceb2c4849d8:/home/hello.text ./
```
上述的拷贝操作是一个手动的过程、还可以使用 `-v` 卷的技术、实现docker中文件和本机同步的能力

## commit 镜像

`docker commit` 提交容器成为一个新的副本

docker commit -m="提交的描述信息" -a="作者" 容器id[:id] 目标镜像名称[:tag]

> 目标镜像名称[:tag] 必须是英文 如果不指定，默认是latest


```shell
# 启动一个容器
docker run -it centos /bin/bash
# 进入 home
[root@fdd5948973c6 /]# cd home
[root@fdd5948973c6 home]# ls
# 创建一个文件
[root@fdd5948973c6 home]# touch hello.text
[root@fdd5948973c6 home]# ls
hello.text
# 推出容器
[root@fdd5948973c6 home]# exit
# 查看全部容器找到刚才在home创建了hello.text的容器的id
$ docker ps -a
CONTAINER ID   IMAGE     COMMAND
c18fff6a893c   centos    "/bin/bash"
# 提交镜像
$ docker commit -m="我用于测试的docker镜像" -a="xiaochen" c18fff6a893c centos_xc:1.0
sha256:6aa7014138c69c7f17bd32b9def1034ad4af2b2ffeea649d8d2f8742650abe62

$ docker images
REPOSITORY   TAG       IMAGE ID       CREATED              SIZE
centos_xc    1.0       6aa7014138c6   About a minute ago   231MB

# 启动新的镜像
$ docker run -it centos_xc:1.0 /bin/bash
[root@0622e8e4d0fe /]# cd home/
[root@0622e8e4d0fe home]# ls
hello.text
```

## 容器数据卷
**容器数据卷（Container Volumes）是用于在容器中持久存储数据的一种机制。** 它们允许容器在不受容器的生命周期限制的情况下读写数据。这对于存储应用程序数据、配置文件、日志文件等非易失性数据非常有用。

- 持久性存储：容器数据卷中存储的数据可以在容器之间共享和保留，即使容器被停止、删除或重新创建，数据仍然存在。

- 数据共享：多个容器可以访问同一个容器数据卷，这有助于实现容器之间的数据共享和协作。

- 数据卷的生命周期独立于容器：容器数据卷的生命周期不依赖于容器的生命周期。这意味着容器可以被删除，而数据卷仍然存在，可以供新容器使用。

- 数据卷类型：容器数据卷可以使用不同的后端存储技术实现，例如本地主机文件系统、网络存储（NFS、CIFS等）、云存储（如AWS EBS、Azure Disk）等。

- 数据卷挂载：在容器内，数据卷通过挂载到容器的指定路径来使用。容器可以读取和写入数据卷上的文件。

容器数据卷使得容器化应用程序更加灵活和可移植，因为它们使数据持久化和可访问，无论容器在何处运行。这对于数据库容器、应用程序配置、日志文件和共享资源等方面非常有用。

如MySQL（或任何其他数据库系统）通常**需要持久存储数据在本地**，以便数据在容器重新启动或迁移时不会丢失。

使用容器数据卷:
- 使用指定路径挂载
```shell
# 创建一个容器并且挂载一个数据卷
$ docker run -it -v /home/ceshi:/home centos /bin/bash
# docker run -it -v /主机绝对路径:/容器内路径 镜像名称[:tag] /bin/bash
[root@5e6fbaee6d6d /]# exit
exit
# 查看挂载的容器id
docker ps -a
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS                      PORTS     NAMES
5e6fbaee6d6d   centos    "/bin/bash"              35 seconds ago   Exited (0) 30 seconds ago             serene_nobel
# 查看挂载的容器详细信息
$ docker inspect 5e6fbaee6d6d
#...
    "Mounts": [
             {
                 "Type": "bind",
                 "Source": "/home/ceshi", # 挂载的主机路径
                 "Destination": "/home",  # 挂载的容器内路径
                 "Mode": "",
                 "RW": true,
                 "Propagation": "rprivate"
             }
         ],
#...
$ cd /home/ceshi/
$ touch hello.text # 权限不够的话用 sudo touch hello.text
$ ls
hel&lo.text
# 进入容器查看
$ docker start 5e6fbaee6d6d
$ docker attach 5e6fbaee6d6d
[root@5e6fbaee6d6d /]# cd home/
[root@5e6fbaee6d6d home]# ls
hello.text
[root@5e6fbaee6d6d home]#
```

- 具命挂载和匿名挂载

```shell
# 具名挂载
$ docker run -it -v cs-home:/home centos /bin/bash
$ docker volume ls
DRIVER    VOLUME NAME
local     cs-home
---------------------------------------------------
# 匿名挂载
$ docker run -it -v /home/ceshi centos /bin/bash
$ docker volume ls
DRIVER    VOLUME NAME
local     984e9dad6ba58ea35f5c827cc44d6bca538b949d887ad8777dc03e8e69269944

---------------------------------------------------
# 查看挂载的详细信息
$ docker volume inspect  cs-home
[
    {
        "CreatedAt": "2023-10-05T11:59:16Z",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/cs-home/_data", # 挂载的主机路径
        "Name": "cs-home",
        "Options": null,
        "Scope": "local"
    }
]
```
- 扩展
  通过使用 ro rw 指定挂载的权限
```shell 
# ro 只读
$ docker run -it -v cs-home:/home:ro centos /bin/bash
# rw 读写
$ docker run -it -v cs-home:/home:rw centos /bin/bash
```

## 初识Dockerfile
Dockerfile是用于构建Docker镜像的文本文件。Dockerfile中的指令可以用于指定基础镜像、安装软件包、复制文件、设置环境变量、运行命令等。通过编写Dockerfile，可以定义一个自定义的镜像，其中包含了应用程序所需的所有组件和配置。这样，其他用户可以使用该Dockerfile来构建相同的镜像，并在其本地或其他环境中运行应用程序。

```dockerfile
FROM nginx:latest

RUN echo "Hello Dockerfile" > /usr/share/nginx/html/index.html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

```shell
# 构建镜像
$ docker build -f dockerfile1 -t cs_nginx .
# 查看镜像
$ docker images
REPOSITORY   TAG       IMAGE ID       CREATED         SIZE
cs_nginx     latest    015e08fb510e   2 minutes ago   187MB
# 运行镜像
$ docker run -d -p 10086:80 cs_nginx
```
- `docker build`: 这是Docker命令，用于构建Docker镜像。
- `-f dockerfile1`: 这是用于指定要使用的Dockerfile的选项。在这种情况下，Docker将使用名为 `dockerfile1` 的文件作为构建镜像的配置文件。
- `-t cs_nginx`: 这是用于为构建的镜像指定一个标签（tag）。在这里，镜像将被标记为 `cs_nginx`，以便以后可以通过这个标签来引用它。
- `.`: 这表示Docker将在当前目录中查找Dockerfile和构建上下文。Docker将使用当前目录作为构建上下文，并将其中的文件复制到镜像中。
运行镜像后
![Docker-2023-10-05-21-06-58](/attachments/Docker-2023-10-05-21-06-58.png)

### dockerfile 指令
- FROM：指定基础镜像。一切从这里开始构建
- MAINTAINER：指定镜像创建者信息（姓名 + 邮箱）
- RUN: 在镜像构建过程中执行的命令。例如安装一个软件包，或执行一些需要长时间运行的编译操作。如 `npm install`
- ADD: 将主机目录下的文件复制到镜像中，如果是压缩包会自动解压
- WORKDIR：为后续的`RUN`、`CMD`、`ENTRYPOINT`指令配置工作目录
- VOLUME：创建一个可以从本地主机或其他容器挂载的挂载点，一般用来存放数据库和需要保持的数据等
- EXPOSE：声明容器运行时的监听端口，但是不会自动在宿主主机上打开这个端口的链接，需要使用-P或者-p来指定
- CMD: 指定一个容器启动时要运行的命令，**Dockerfile中可以有多个CMD指令，但只有最后一个生效**，CMD会被docker run之后的参数替换
- ENTRYPOINT：指定一个容器启动时要运行的命令，**Dockerfile中可以有多个ENTRYPOINT指令，但只有最后一个生效**，ENTRYPOINT不会被docker run之后的参数替换，**ENTRYPOINT 指令可以追加指令。** 
  ```
  FROM ubuntu
  ENTRYPOINT ["echo", "Hello"]
  CMD ["World"]
  ```
  容器启动时将执行 echo "Hello" "World" 命令。
- ONBUILD：当构建一个被继承Dockerfile时运行命令，父镜像在被子继承后父镜像的onbuild被触发
- COPY: 类似ADD，将主机目录下的文件复制到镜像中，但是不会自动解压文件，**由于 ADD 指令的自动解压缩和下载功能，它的使用相对较少，并且在某些情况下可能会导致不可预期的行为。** 因此，通常建议在大多数情况下使用 COPY 指令，并在需要特定功能（如解压缩或下载）时才使用 ADD 指令。
- ENV: 设置环境变量，可以在后续的指令中使用这个环境变量
 