# puppeteer-screenshot-api
一个基于puppeteer的网页截图服务，输出需要截图的网址，返回网页的截图
## 使用方法
基于docker运行该截图服务

在项目目录`puppeteer-screenshot-api/`下:

1.构建镜像：`docker build -t puppeteer-screenshot-api .`

2.运行镜像：`docker run -d --name puppeteer-screenshot-api -p 3001:3001 puppeteer-screenshot-api`

3.其他相关命令

停止：`docker stop puppeteer-screenshot-api`

删除：`docker rm puppeteer-screenshot-api`

## 访问方式
访问链接：http://47.108.xxx.xxx:3001/screenshot?url=目标url

如果需要设置截图范围，可自行调整index.js中的代码

## 注意事项
第一次构建镜像很慢是正常的，因为下载东西有点多，可以睡前下载

## 打赏
<img src="https://github.com/user-attachments/assets/51a12660-2676-4f95-bee8-9999b08b13d1" style="width: 370px; height: auto; border: 1px solid #eee;" />
