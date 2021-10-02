# 可视化疫情监控大屏

这是一个基于echarts和flask的可视化项目，展示了疫情下数据，这里主要是基于[东方瑞通](https://space.bilibili.com/445321758) 项目视频做一个可视化大屏学习记录。

## 说明

**利用设备：**

- 阿里云ECS服务器（Ubuntu 20.04）
- 阿里云RDS（Mysql 8.0.26）

**数据来源：**

- 腾讯实时疫情 https://news.qq.com/zt2020/page/feiyan.htm#/
- 具体数据在：https://view.inews.qq.com/g2/getOnsInfo?name=disease_h5、https://view.inews.qq.com/g2/getOnsInfo?name=disease_other
- 通过reques爬虫获取数据，保存至本地数据库

**前端页面设计：**

- 通过css设计出网页的布局和分块。echarts工作原理为用图表填充html元素块，所以需要提前为他分配好大小。
- jquery + ajax技术实现实时数据更新
- 官网下载echarts的js文件，找到需要的示例对代码进行修改

**后端部分设计：**

- utils.py 与数据库交互
- flask的基本运用：static文件夹放css和js文件，templates文件夹下放html页面

## 实验环境准备

```
sudo apt update
sudo apt install git
sudo apt install mysql-server
git clone https://github.com/antlers12/cov-big-screen-demo.git
```

## 初始化mysql数据库

> Mysql 8.0以上用户参考：https://blog.csdn.net/qq_26164609/article/details/106881079

**1、修改root用户密码为123456**

MySql 从8.0开始修改密码有了变化，在user表加了字段authentication_string，修改密码前先检authentication_string是否为空

**注意：如果不为空，先置空字段在修改密码**

```
mysql -uroot -p

mysql> use mysql; 
mysql> update user set authentication_string='' where user='root';      --将字段置为空
mysql> alter user 'root'@'localhost' identified with mysql_native_password by '123456';     
--修改密码为123456

service mysql restart	--重启一下
```

**2、使用mysql命令连接数据库测试一下**

```
mysql -uroot -p
```

**3、执行脚本，快速创建一个数据库和两张表**

```
chmod 744 shell_call_sql.sh
./shell_call_sql.sh
```

## 安装Python库

项目将要用到以下库

- Flask
- gevent
- PyMySQL
- selenium

```
pip install -r requirements.txt
```

## 初始化疫情数据

```
python3 spider.py
```

## 启动大屏

```
python3 app.py
```

访问地址：http://IP:5000

## 部署定时爬虫

使用crontab进行定时任务

```
crontab -e		# 编辑crontab
crontab -l		# 查看crontab任务列表
```

例如爬虫脚本每一个小时执行一次

```
0 */1 * * * /usr/bin/python3 /root/cov-big-screen-demo/spider.py >> /root/cov-big-screen-demo/crontab.log 2>&1
```

启动任务

```
/etc/init.d/cron start
```

## Flask部署

安装nginx

```
sudo apt install nginx
```

安装gunicorn，[Gunicorn](https://gunicorn.org/) (独角兽)是一个高效的Python WSGI Server，我们将使用它来运行 wsgi application，

```
pip install gunicorn
```

配置nginx服务器配置文件

```
vim /etc/nginx/conf.d/cov.conf
```

```
server {
    listen       80;
    server_name  127.0.0.1;
 
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

注释Nginx默认页面，防止因为配置优先级不够，造成反向代理失败

```
vim /etc/nginx/sites-available/default
```
启动gunicorn，需要在app.py所属的目录下使用

```
gunicorn -b 127.0.0.1:8080 -D app:app
```
重启一下服务器，访问80端口

```
service nginx restart
```


## 可能出现的问题

**问题：python:连接mysql出现1045或1698**

**原因：mysql 登录每次都需要用sudo造成的**

**方法：更改root用户的plugin值**

```
use mysql;
select host,user,plugin from user;
update user set plugin = 'mysql_native_password' where user = 'root';
flush privileges;
```
