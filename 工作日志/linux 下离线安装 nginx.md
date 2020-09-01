# linux 下离线安装 nginx

关于一次在只能使用内网的情况下部署nginx的记录

## 一、Nginx 依赖包

模块依赖性 Nginx 需要依赖下面 3 个包

1. ssl 功能需要 openssl 库 [点击下载：https://www.openssl.org/](https://www.openssl.org/)
2. gzip 模块需要 zlib 库 [点击下载：http://www.zlib.net/](http://www.zlib.net/)
3. rewrite 模块需要 pcre 库[点击下载：http://www.pcre.org/](http://www.pcre.org/)
   依赖包安装顺序依次为：openssl、zlib、pcre, 最后安装 Nginx 包。

## 二、安装教程（源码安装）

### step 1：下载所需包

openssl-fips-2.0.16.tar.gz
zlib-1.2.11.tar.gz
pcre-8.38.tar.gz
nginx-1.18.0.tar.gz

### step 2：安装 OpenSSL

```bash
[root@localhost nginxDeploy]# tar -zxvf openssl-fips-2.0.16.tar.gz
[root@localhost nginxDeploy]# cd openssl-fips-2.0.2
[root@localhost openssl-fips-2.0.16]# ./config
[root@localhost openssl-fips-2.0.16]# make
[root@localhost openssl-fips-2.0.16]# make install
```

### step 3：安装 zlib

```bash
[root@localhost nginxDeploy]# tar -zxvf zlib-1.2.11.tar.gz
[root@localhost nginxDeploy]# cd zlib-1.2.7
[root@localhost zlib-1.2.11]# ./configure
[root@localhost zlib-1.2.11]# make
[root@localhost zlib-1.2.11]# make install
```

### step 4：安装 pcre

```bash
[root@localhost nginxDeploy]# tar -zxvf pcre-8.38.tar.gz
[root@localhost nginxDeploy]# cd pcre-8.21
[root@localhost pcre-8.38]# ./configure
[root@localhost pcre-8.38]# make
[root@localhost pcre-8.38]# make install
```

### step 5：安装 Nginx

```bash
[root@localhost wcw]# tar -zxvf  nginx-1.18.0.tar.gz
[root@localhost wcw]# cd nginx-1.12.2
[root@localhost nginx-1.12.2]# ./configure --prefix=/usr/install/nginx --with-pcre=../pcre-8.38 --with-zlib=../zlib-1.2.11 --with-openssl=../openssl-fips-2.0.16
[root@localhost nginx-1.12.2]# make
[root@localhost nginx-1.12.2]# make install
```

> 请注意："--with-xxx=" 的值是解压目录，而不是安装目录！

> --prefix=  是设置nginx的安装目录，安装后的所有资源文件都会被放在/usr/install/nginx目录中，不会分散到其他目录。

### step 6：配置并启动 Nginx

选择到nginx所在的目录，就是你安装的时候 通过`--prefix`指定的目录，我这里是`/usr/install/nginx`。

我们先简单的配置nginx，

1. 进入conf文件夹下， 使用vim打开nginx.conf将listen配置为你想要的端口，我配置为8080

```bash
[root@localhost nginx]# ls
client_body_temp  fastcgi_temp  logs        sbin       uwsgi_temp
conf              html          proxy_temp  scgi_temp
[root@localhost conf]# ls
fastcgi.conf            koi-win             scgi_params
fastcgi.conf.default    mime.types          scgi_params.default
fastcgi_params          mime.types.default  uwsgi_params
fastcgi_params.default  nginx.conf          uwsgi_params.default
koi-utf                 nginx.conf.default  win-utf
[root@localhost conf]# vim nginx.conf
```

Vim 打开 nginx.conf
```nginx
server {
  # 配置端口为8080
  listen       8080;
  server_name  localhost;
  
  #charset koi8-r;

  #access_log  logs/host.access.log  main;

  location / {
    root   html;
    index  index.html index.htm;
  }
}
```

2. 进入sbin文件夹下，运行nginx，网页打开http://127.0.0.1:8080/，会看到welcome to nginx 代表运行成功

```bash
[root@localhost nginx]# ls
client_body_temp  fastcgi_temp  logs        sbin       uwsgi_temp
conf              html          proxy_temp  scgi_temp
[root@localhost nginx]# cd sbin/
[root@localhost sbin]# ls
nginx
[root@localhost sbin]# ./nginx 
```

### error :



### error: pcre.h: No such file or directory

安装 Nginx,make 的时候总是出现 pcre.h 没有那个文件或目录，
第一次安装的 pcre 是 pcre2-10.21，这个是看错了以为最上面就是最新的没看日期，第一次出现 pcre.h 错误。
然后找了个最新的 pcre2-10.30 安装时候还是出现这个问题，不知道原因。
继续更换版本 pcre-8.38 然后编译安装成功，或许就是因为版本的原因吧！

![20171009105049652.png][1]

## 三、Nginx配置文件说明

在项目使用中，使用最多的三个核心功能是静态服务器、反向代理和负载均衡。

这三个不同的功能的使用，都跟Nginx的配置密切相关，Nginx服务器的配置信息主要集中在"nginx.conf"这个配置文件中，并且所有的可配置选项大致分为以下几个部分.

```nginx
main                                # 全局配置
...
events {                            # 工作模式配置

}
...
http {                              # http设置
    ....
    server {                        # 服务器主机配置（虚拟主机、反向代理等）
        ....
        location {                  # 路由配置（虚拟目录等）
            ....
        }
        location path {
            ....
        }
        location otherpath {
            ....
        }
    }
    server {
        ....
        location {
            ....
        }
    }
    upstream name {                  # 负载均衡配置
        ....
    }
}
```

[1]: ./images/2020-08-19-nginx.png