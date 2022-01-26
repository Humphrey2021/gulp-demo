# gulp-demo
一个关于使用`gulp`完成自动化构建的小案例

## 搭建基础项目
```
|-- Documents
    |-- .gitignore
    |-- README.md
    |-- package.json
    |-- public              // 静态资源文件，不需要构建的
    |   |-- favicon.ico
    |-- src                 // 需要被构建的文件夹
        |-- about.html
        |-- features.html
        |-- index.html
        |-- assets
        |   |-- fonts
        |   |   |-- pages.eot
        |   |   |-- pages.svg
        |   |   |-- pages.ttf
        |   |   |-- pages.woff
        |   |-- images
        |   |   |-- brands.svg
        |   |   |-- logo.png
        |   |-- scripts
        |   |   |-- main.js
        |   |-- styles
        |       |-- _icons.scss
        |       |-- _variables.scss
        |       |-- demo.scss
        |       |-- main.scss
        |-- layouts
        |   |-- basic.html
        |-- partials
            |-- footer.html
            |-- header.html
            |-- tags.html

```

## 安装gulp
```shell
yarn add gulp
# 创建gulp入口文件
touch gulpfile.js
```
