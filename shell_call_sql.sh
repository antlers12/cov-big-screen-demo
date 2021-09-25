#!/bin/bash
mysql -uroot -p123456 -e "create database cov;"
mysql -uroot -p123456 -e "use  cov; create table details(
    id int auto_increment primary key,
    update_time datetime null,
    province varchar(15) null,
    city varchar(15) null,
    confirm int null,
    confirm_add int null,
    heal int null,
    dead int null)
    charset = utf8mb4;"
mysql -uroot -p123456 -e "use  cov; create table history(
    ds datetime not null primary key,
    confirm int null,
    confirm_add int null,
    suspect int null,
    suspect_add int null,
    heal int null,
    heal_add int null,
    dead int null,
    dead_add int null)
    charset = utf8mb4;"