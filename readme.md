---------------------version 1.0----------------------------------
## 功能
1. 下载对应html文件
2. 注册，登录，登出，修改密码
3. 管理员页面：1.管理上传项目：打开，发布项目，删除项目 2.管理已发布项目：打开，删除项目
4. 为管理员添加登录页面
5. 考虑添加删除的评论，同步到用户上传界面

## 实现：
1.使用django作后端
2.前端使用bootstrap框架
3.暂时使用django自带SQLite3数据库

## 文件结构

- ├── db.sqlite3            #数据库

  ├── environment.md  

  ├── manage.py

  ├── admin_page    #管理员页面

  ├── mysite

  ├── mysite_nginx.conf

  ├── physics              #index页面

  ├── projectFile

  ├── static                 #静态页面, js

  └── templates        #动态页面, html页面

环境布置
# 环境配置说明

## 安装Nginx

- 配置EPFL源(已配置)
```
$ sudo yum install -y epel-release
$ sudo yum -y update
```

- 安裝Nginx
```
$ sudo yum install -y nginx
```

- 开启80和443端口(暂时未开启防火墙)
```
$ sudo firewall-cmd --permanent --zone=public --add-service=http
$ sudo firewall-cmd --permanent --zone=public --add-service=https
$ sudo firewall-cmd --reload
```

## 安装uwsgi
```
$ pip3 install uwsgi
```

## 安装django及依赖包
```
$ pip3 install -r requirements.txt 
```

## 更新SQLite3
```
$ wget https://www.sqlite.org/2014/sqlite-autoconf-3080300.tar.gz
$ tar -xzvf sqlite-autoconf-3080300.tar.gz
$ cd sqlite-autoconf-3080300
$ ./configure
$ make && make install
# 不删除旧版 sqlite，将其重命名 sqlite37，如有需要可通过 sqlite37 进入
$ mv /usr/bin/sqlite3 /usr/bin/sqlite37
$ ln -s /usr/local/bin/sqlite3 /usr/bin/sqlite3
$ echo "/usr/local/lib" > /etc/ld.so.conf.d/sqlite3.conf
$ ldconfig
```

## 配置uwsgi
在uwsgi_conf下新建uwsgi.ini
```
[uwsgi]
# 项目所在的根目录
chdir=/home/project/mysite/
# 指定项目的application,区别于启动命令--wsgi-filemysite/wsgi.py
module=mysite.wsgi:application
#the local unix socket file than commnuincate to Nginx
# 指定sock的文件路径，这个sock文件会在nginx的uwsgi_pass配置，用来nginx与uwsgi通信       
# 支持ip+port模式以及socket file模式
#socket=%(chdir)/uwsgi_conf/uwsgi.sock
socket=%(chdir)/uwsgi_conf/uwsgi.sock
# 进程个数       
processes = 2
# 每个进程worker数
workers=5
procname-prefix-spaced=mywebapp                # uwsgi的进程名称前缀
py-autoreload=1                              # py文件修改，自动加载

# 启动uwsgi的用户名和用户组
uid=root
gid=root

# 启用主进程
master=true
# 自动移除unix Socket和pid文件当服务停止的时候
vacuum=true

# 序列化接受的内容，如果可能的话
thunder-lock=true
# 启用线程
enable-threads=true
# 设置一个超时，用于中断那些超过服务器请求上限的额外请求
harakiri=30
# 设置缓冲
post-buffering=4096

# 设置日志目录
daemonize=%(chdir)/uwsgi_conf/uwsgi.log
# uWSGI进程号存放
pidfile=%(chdir)/uwsgi_conf/uwsgi.pid
```

- 启动、停止uwsgi
```
$ uwsgi --ini uwsgi.ini
$ uwsgi --stop uwsgi.pid
```

## 配置Nginx
- 位置etc/nginx/conf.d/physics.conf
```
upstream physics_app{
    # 监听地址与本地uWSGI进程通信
    # 可以使用socket file
    server unix:/home/project/mysite/uwsgi_conf/uwsgi.sock;
}

server {
    listen 9090;
    server_name 1.15.82.120;
    access_log /var/log/nginx/access.log;
    charset utd-8;

    gzip_types text/plain application/x-javascript text/css text/javascript application/x-httpd-php application/json text/json image/jpeg image/gif image/png application/octet-stream;
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;

    location / {
        # nginx转发动态请求到uWSGI
        include uwsgi_params;
        uwsgi_connect_timeout 20;
        uwsgi_pass unix:/home/project/mysite/uwsgi_conf/uwsgi.sock;
    }
    
    # 如果写成/static/,nginx无法找到项目静态文件路径
    location /static {
        alias /home/project/mysite/collect_static;
    }
    
    # 如果写成/media/,nginx无法找到项目媒体文件路径
    location /media {
        alias /home/project/mysite/media;
    }

}
```

## 收集静态文件
```
$ python manage.py collectstatic
```
将会将static文件收集到STATIC_ROOT中