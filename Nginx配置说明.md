## Nginx配置说明

- sudo apt-get install nginx

- https://uwsgi-docs-zh.readthedocs.io/zh_CN/latest/tutorials/Django_and_nginx.html

- 需要管理员权限

- ~/nginx.conf修改配置

- 启动nginx $ /usr/bin/nginx

- 关闭nginx $ /usr/bin/nginx -s stop

- 创建 mysite_nginx.conf

  ```
  # mysite_nginx.conf
  
  # the upstream component nginx needs to connect to
  upstream django {
      # server unix:///path/to/your/mysite/mysite.sock; # for a file socket
      server 127.0.0.1:8001; # for a web port socket (we'll use this first)
  }
  
  # configuration of the server
  server {
      # the port your site will be served on
      listen      8000;
      # the domain name it will serve for
      server_name .example.com; # substitute your machine's IP address or FQDN
      charset     utf-8;
  
      # max upload size
      client_max_body_size 75M;   # adjust to taste
  
      # Django media
      location /media  {
          alias /path/to/your/mysite/media;  # your Django project's media files - amend as required
      }
  
      location /static {
          alias /path/to/your/mysite/static; # your Django project's static files - amend as required
      }
  
      # Finally, send all non-media requests to the Django server.
      location / {
          uwsgi_pass  django;
          include     /path/to/your/mysite/uwsgi_params; # the uwsgi_params file you installed
      }
  }
  ```

- 进行连接

  ```shell
  ln -s ~/path/to/your/mysite/mysite_nginx.conf /etc/nginx/sites-enabled/
  ```

- 