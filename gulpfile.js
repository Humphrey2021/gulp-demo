const { src, dest, parallel, series } = require('gulp')
// const sass = require('gulp-sass')
// tips: 只引入了一个 gulp-sass
// 这时候如果运行是会报错的
// 我们需要再安装一个sass，后面拼上(require('sass'))
// 这样就解决了报错的问题
const sass = require('gulp-sass')(require('sass'))
// const babel = require('gulp-babel')
// const swig = require('gulp-swig')
// const imagemin = require('gulp-imagemin')
const del = require('del')
// 自动引入所有插件
const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins()

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
                    name: 'Twitter',
                    link: 'https://twitter.com/w_zce'
                },
                {
                    name: 'About',
                    link: 'https://weibo.com/zceme'
                },
                {
                    name: 'divider'
                },
                {
                    name: 'About',
                    link: 'https://github.com/zce'
                }
            ]
        }
    ],
    pkg: require('./package.json'),
    date: new Date()
}
// 清除dist文件
const clean = () => {
    return del(['dist'])
}

// 处理样式
const style = () => {
    return src('src/assets/styles/*.scss', { base: 'src' })
        .pipe(sass())
        .pipe(dest('dist'))
}

// 处理js文件
const script = () => {
    return src('src/assets/scripts/*.js', { base: 'src' })
        // .pipe(babel({ presets: ['@babel-preset-env'] }))
        // 写法换了啊  @babel-preset-env ==> @babel/env
        .pipe(plugins.babel({ presets: ['@babel/env'] }))
        .pipe(dest('dist'))
}

// 处理模版文件
const page = () => {
    return src('src/*.html', { base: 'src' })
        .pipe(plugins.swig({ data }))
        .pipe(dest('dist'))
}

// 图片转换
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

// 同时处理以上任务
const compile = parallel(style, script, page, image, font)

const build = series(clean, parallel(compile, extra))

module.exports = {
    compile,
    build
}
