const { src, dest, parallel, series, watch } = require('gulp')
// const sass = require('gulp-sass')
// tips: 只引入了一个 gulp-sass
// 这时候如果运行是会报错的
// 我们需要再安装一个sass，后面拼上(require('sass'))
// 这样就解决了报错的问题
const sass = require('gulp-sass')(require('sass'))
// const babel = require('gulp-babel')
// const swig = require('gulp-swig')
// const imagemin = require('gulp-imagemin')
// 清除文件插件
const del = require('del')
// 启动服务插件
const browserSync = require('browser-sync')
// 自动引入所有插件
const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins()

// 创建开发服务器
const bs = browserSync.create()

const data = {
    menus: [
        {
            name: 'Home',
            icon: 'aperture',
            link: 'index.html'
        },
        {
            name: 'Features',
            link: 'features.html'
        },
        {
            name: 'About',
            link: 'about.html'
        },
        {
            name: 'Contact',
            link: '#',
            children: [
                {
                    name: 'CSDN',
                    link: 'https://blog.csdn.net/weixin_46652769'
                },
                {
                    name: 'github',
                    link: 'https://github.com/Humphrey2021'
                },
                {
                    name: 'divider'
                },
                {
                    name: 'About',
                    link: 'https://github.com/Humphrey2021'
                }
            ]
        }
    ],
    pkg: require('./package.json'),
    date: new Date()
}
// 清除dist文件
const clean = () => {
    return del(['dist', 'temp'])
}

// 处理样式
const style = () => {
    return src('src/assets/styles/*.scss', { base: 'src' })
        .pipe(sass())
        .pipe(dest('temp'))
        .pipe(bs.reload({ stream: true })) // 更改页面后浏览器更新
}

// 处理js文件
const script = () => {
    return src('src/assets/scripts/*.js', { base: 'src' })
        // .pipe(babel({ presets: ['@babel-preset-env'] }))
        // 写法换了啊  @babel-preset-env ==> @babel/env
        .pipe(plugins.babel({ presets: ['@babel/env'] }))
        .pipe(dest('temp'))
        .pipe(bs.reload({ stream: true })) // 更改页面后浏览器更新
}

// 处理模版文件
const page = () => {
    return src('src/*.html', { base: 'src' })
        .pipe(plugins.swig({ data, defaults: { cache: false } })) // 防止模板缓存导致页面不能及时更新
        .pipe(dest('temp'))
        .pipe(bs.reload({ stream: true })) // 更改页面后浏览器更新
}

// 图片压缩
const image = () => {
    return src('src/assets/images/**', { base: 'src' })
        .pipe(plugins.imagemin())
        .pipe(dest('dist'))
}

// 字体文件
const font = () => {
    return src('src/assets/fonts/**', { base: 'src' })
        .pipe(plugins.imagemin())
        .pipe(dest('dist'))
}

// 额外文件处理
const extra = () => {
    return src('public/**', { base: 'public' })
        .pipe(dest('dist'))
}

const serve = () => {
    watch('src/assets/styles/*.scss', style)
    watch('src/assets/scripts/*.js', script)
    watch('src/*.html', page)
    // watch('src/assets/images/**', image)
    // watch('src/assets/fonts/**', font)
    // watch('public/**', extra)
    // 监听，这些页面发生变化时，会自动更新，但是未改变的时候不用去管
    watch([
        'src/assets/images/**',
        'src/assets/fonts/**',
        'public/**'
    ], bs.reload)
    bs.init({
        notify: false,
        port: 8080,
        open: true, // 是否自动打开浏览器
        // files: 'dist/**', // 添加之后 .pipe(bs.reload({ stream: true }))， 就不需要这一行代码了
        server: {
            baseDir: ['temp', 'src', 'public'],
            routes: {
                '/node_modules': 'node_modules'
            }
        }
    })
}

const useref = () => {
    return src('temp/*.html', { base: 'temp' })
        .pipe(plugins.useref({ searchPath: ['temp', '.'] }))
        // html js css
        .pipe(plugins.if(/\.js$/, plugins.uglify()))
        .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
        .pipe(plugins.if(/\.html$/, plugins.htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true
        })))
        .pipe(dest('dist'))
}

// 同时处理以上任务
// 处理src内文件转换工作
const compile = parallel(style, script, page)
// 上线时执行的任务
const build = series(clean, parallel(series(compile, useref), image, font, extra))

const develop = series(compile, serve)

module.exports = {
    clean,
    build,
    develop
}
