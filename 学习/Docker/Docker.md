# Docker的常用命令

帮助命令

```shell
$ docker version     	 # 显示docker的版本信息
$ docker info			 # 显示docker的系统信息、包括镜像和容器的数量
$ docker 命令 --help	# 帮助命令
```

帮助文档的地址：https://docs.docker.com/reference/

## 基础命令

```shell
$ docker i
```



### 镜像命令

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
$ docker rmi -f docker rmi -f $(docker image -aq) # 删除全部的镜像
```

### 容器命令

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
$ docker rm -f $(docker ps -aq)	 	# 删除所有的容器
$ docker ps -a -q|xargs docker rm	# 删除所有的容器
```

启动和停止容器的操作`start`，`restart`，`stop`，`kill`

``` sh
$ docker start 容器id		# 启动容器
$ docker restart 容器id	# 重启容器
$ docker stop 容器id		# 停止当前正在运行的容器
$ docker kill 容器id		# 强制停止当前容器
```

### 常用其他命令

