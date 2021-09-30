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

访问地址：http://127.0.0.1:80

## 定时执行脚本

可以写一个shell脚本

```
#!/bin/bash
python3 ./spider.py
sleep 10
python3 app.py
```

编辑 `/etc/crontab` 文件

```
vim /etc/crontab

* * /2 * * root /root/cov-big-screen-demo/time.sh
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
