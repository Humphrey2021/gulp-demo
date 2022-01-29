# gulp-demo
一个关于使用`gulp`完成自动化构建的小案例

## 基础项目结构
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
        |-- assets          // 资源文件夹
        |   |-- fonts       // 字体文件
        |   |   |-- pages.eot
        |   |   |-- pages.svg
        |   |   |-- pages.ttf
        |   |   |-- pages.woff
        |   |-- images      // 图片资源
        |   |   |-- brands.svg
        |   |   |-- logo.png
        |   |-- scripts     // js
        |   |   |-- main.js
        |   |-- styles      // 样式文件
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

## 设计思路

根据项目的结构来看，整个项目有以下几部分组成
1. html文件，内部使用了模版语法
2. 样式文件，使用了sass
3. js文件，使用了es6语法
4. 静态资源，图片，字体
5. 其他资源，public目录文件

我们要实现的功能有
1. 将项目可以运行起来，浏览器访问用来本地调试
2. 可以将项目进行打包

在`gulp`中，可以通过`src`方法创建一个读取流，通过`dest`方法创建一个将对象写入到文件系统的流。`pipe`方法可以将多个任务连接到一起

由此，我们其实要做的事情就很明确了

1. 首先我们要针对不同类型的文件，去做不同的处理

    - html文件，由于内部使用了模版语法，我们可以使用`gulp-swig`这个模块去处理
    ```js
    const page = () => {
        return src('src/*.html', { base: 'src' })
            .pipe(plugins.swig({ data, defaults: { cache: false } })) // 防止模板缓存导致页面不能及时更新
            .pipe(dest('temp'))
            .pipe(bs.reload({ stream: true })) // 更改页面后浏览器更新
    }
    ```
    - 处理图片
    ```js
    const image = () => {
        return src('src/assets/images/**', { base: 'src' })
            .pipe(plugins.imagemin())
            .pipe(dest('dist'))
    }
    ```
    - 等等，具体看`gulpfile.js`文件

2. 生成本地服务，启动本地调试
    - 首先需要安装启动服务插件
    启动服务插件，使用`browser-sync`模块
    - 创建开发服务器，使用`browserSync`的`create()`方法
    - 使用`browserSync`的`init()`方法，去初始化一些配置
    ```js
    files: 'dist/**', // 监听dist文件夹下所有文件内容是否发生改变，但由于构建任务后添加了 .pipe(bs.reload({ stream: true }))， 所以就不需要这一行代码了。可以实现同样的效果
    ```
    - 使用`gulp`的`watch`模块去监听文件改变，发生改变时，就对其重新构建一下

3. 生成打包文件，这里需要对文件进行压缩了
    - 在流中添加压缩操作，再生成到对应的目录中

以上其实就已经实现了我们的需求

这时我们可以在这个基础上对代码进行优化

1. 因为我们使用了很多插件，每使用一次，就需要`require()`一次，这里我们可以只用`gulp-load-plugins`模块，去自动引入所有的插件，当然，对应的插件安装还是要安装的。

2. 虽然我们实现了功能，但是每次打包或者启动本地调试预览，需要执行大量的任务，这时我们可以考虑将任务进行合并，随后只用运行一次命令就可以实现对应功能。那么这里我们可以使用`gulp`的`parallel,和series`来完成多个不同任务的嵌套组合，`parallel`是并行处理，`series`是串行处理，根据实际情况去选择或组合使用。

3. 将对应的任务添加到`package.json`的`scripts`里，即可再次简化命令。
