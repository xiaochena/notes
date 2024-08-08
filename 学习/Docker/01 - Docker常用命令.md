# Docker 的常用命令

## 帮助命令

```shell
docker version       # 显示docker的版本信息
docker info    # 显示docker的系统信息、包括镜像和容器的数量
docker 命令 --help # 帮助命令
```

## 镜像命令

### docker images - 查看镜像

查看所有本地的主机上的镜像

```shell
$ docker images

REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
mysql         5.7       87eca374c0ed   2 weeks ago    447MB
nginx         latest    62d49f9bab67   3 weeks ago    133MB
hello-world   latest    d1165f221234   2 months ago   13.3kB
centos        latest    300e315adb2f   5 months ago   209MB

# 数据解释
REPOSITORY  镜像的仓库源
TAG   镜像的标签
IMAGE ID  镜像的id
CREATED  镜像的创建时间
SIZE  镜像的大小

# 可选项
  -a, --all             # 列出所有镜像
      --digests         # 只显示镜像的id
      ...
```

### docker search - 搜索镜像

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

### docker pull - 拉取镜像

```shell
# 下载镜像 docker pull 镜像名称[:tag]
$ docker pull mysql
Using default tag: latest    # 如果不写tag，默认选择latest 最新版本
latest: Pulling from library/mysql
f7ec5a41d630: Already exists # 分层下载、docker image的核心 联合文件系统
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

### docker rmi -f [:id] - 删除镜像

```sh
docker rmi -f 镜像id  # 删除指定镜像
docker rmi -f 镜像id 镜像id 镜像id # 删除多个容器
docker rmi -f $(docker image ls -aq) # 删除全部的镜像
```

## 容器命令

有镜像才可以创建容器、使用 centos 镜像学习

```sh
docker pull centos
```

### docker run - 创建容器并启动

```sh
$ docker run [可选参数] image
# 参数说明
--name="Name" # 容器名字 nginx01 nginx02,用来区分容器
-d    # 后台方式运行
-it    # 使用交互方式运行、进入容器查看内容
-p    # 1、ip:主机端口:容器端口
    # 2、主机端口:容器端口（常用）
    # 3、容器端口
-P    # 随机端口

#测试，启动并进入容器、exit退出
$ docker run -it centos /bin/bash
[root@9affb64ee299 /]# ls
bin  dev  etc  home  lib  lib64  lost+found  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
[root@9affb64ee299 /]# exit
exit
```

`exit`退出容器会停止、使用`Ctrl +P +Q`容器不停止退出

### docker ps - 查看运行的容器

```sh
$ docker ps # 列出正在运行的容器

# 参数
-a  # 列出所有容器、在运行的以及不在运行的
-n=? # 显示最近创建的容器
-q  # 只显示容器的编号
```

### 退出容器

```shell
exit # 退出并停止容器
```

快捷键：`Ctrl + P + Q ` ，退出容器但不停止

### docker rm - 删除容器

```sh
docker rm 容器id     # 删除指定的容器（不能删除正在运行的容器）
docker rm -f $(docker ps -aq)   # 删除所有的容器 ,-f 强制删除
docker ps -a -q|xargs docker rm # 删除所有的容器
```

启动和停止容器的操作`start`，`restart`，`stop`，`kill`

```sh
docker start 容器id     # 启动容器
docker restart 容器id   # 重启容器
docker stop 容器id      # 停止当前正在运行的容器
docker kill 容器id      # 强制停止当前容器
```

## 常用其他命令

### docker logs 查看日志

```sh
# 运行 centos并且执行一段 shell 脚本 模拟日志打印
docker run -d centos /bin/sh -c "while true;do echo xiaochena;sleep 1;done"
```

查看日志

```sh
#
docker logs -tf -n 10 0207d2c3f2df
# -tf 显示日志
# -n(--tail) [:number] 要显示的日志条数
```

### docker top - 查看容器中进程信息

```sh
docker top 0207d2c3f2df

# 以下信息省略一部分
UID     PID     PPID    C   STIME
root    2711    2690    0   16:22
root    3002    2711    0   16:26
```

### docker inspect - 查看容器信息

```sh
# docker inspect [:容器id]
docker inspect 0207d2c3f2df
```

### docker exec & docker attach 进入当前正在运行的容器

我们通常容器都是使用后台方式运行的 ，有时需要进入容器，修改一些配置

- 方式一

```sh
docker exec -it [容器id] /bin/bash
```

- 方式二

```sh
docker attach [容器id]
```

区别

- docker exec ：进入容器后开启一个新的终端，可以在里面操作
- docker attach：进入容器正在执行的终端，不会启动新的进程

### docker cp - 拷贝容器内文件到主机上

```shell
docker cp [容器 id]:[容器内路径] [主机路径]
```

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

上述的拷贝操作是一个手动的过程、还可以使用 `-v` 卷的技术、实现 docker 中文件和本机同步的能力

## commit 镜像

`docker commit` 提交容器成为一个新的副本

```shell
docker commit -m = ["提交的描述信息"] -a=["作者"] [容器 id] [目标镜像名称]
```

> 目标镜像名称[:tag] 必须是英文 如果不指定，默认是 latest

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
