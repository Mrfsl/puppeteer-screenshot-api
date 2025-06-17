# puppeteer-screenshot-api
一个基于puppeteer的网页截图服务，输出需要截图的网址，返回网页的截图
## 使用方法
### 构建服务
基于docker运行该截图服务

在项目目录`puppeteer-screenshot-api/`下:

1.构建镜像：`docker build -t puppeteer-screenshot-api .`

2.运行镜像：`docker run -d --name puppeteer-screenshot-api -p 3001:3001 puppeteer-screenshot-api`

3.其他相关命令

停止：`docker stop puppeteer-screenshot-api`

删除：`docker rm puppeteer-screenshot-api`

### v1版本注意事项
对应index-v1.js文件

### v2版本注意事项
对应index-v2.js文件
class属性的编码过程:
- 原始（页面显示的）：class="md:w-2/3 mx-2 pb-2"
- css选择器（类前加`.`，特殊字符转义）：selector = '.md\:w-2\/3.mx-2.pb-2'，但是js字符串（用于代码中表示选择器时）：".md\\:w-2\\/3.mx-2.pb-2"，因为需要对`\`进行转义变成了`\\`
- url编码：selectorCode = code(str)
- url解码：selector = decode(selectorCode)


最终需要的效果，就是正确赋值class的css选择器（js中表示版本）赋值给selecotor,下面为**默认**设置方式作为参考

`const selector = req.query.selector || '.md\\:w-2\\/3.mx-2.pb-2';`


## 访问方式
### **v1**

访问链接：http://47.108.xxx.xxx:3001/screenshot?url=目标url

### **v2**

不带选择器（默认截取全图）：http://47.108.xxx.xxx:3001/screenshot?url=目标url

带选择器：http://47.108.xxx.xxx:3001/screenshot?url=https://splatoon3.ink/salmonrun&selectorCode=.md%5C%5C%3Aw-2%5C%5C/3.mx-2.pb-2

其中，selectorCode与代码中变量一致


## 提示
第一次构建镜像很慢是正常的，因为下载东西有点多，可以睡前下载（如果设置镜像下载报错的话）



## 更新日程
2025.6.17：截图服务升级，可以传入参数selector，截取指定的区域（标签），代码：index-v2.js

## 打赏
<img src="https://github.com/user-attachments/assets/51a12660-2676-4f95-bee8-9999b08b13d1" style="width: 370px; height: auto; border: 1px solid #eee;" />
