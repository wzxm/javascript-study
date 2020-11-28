// 实现这个项目的构建任务
// "clean": "gulp clean",
// "lint": "gulp lint",
// "serve": "gulp serve",
// "build": "gulp build",
// "start": "gulp start",
// "deploy": "gulp deploy --production"

const { src, dest, series, parallel, watch } = require('gulp');

const del = require('del');
const browserSync = require('browser-sync');

const loadPlugins = require('gulp-load-plugins');

const plugins = loadPlugins();
const bs = browserSync.create();


const data = {
  menu: [
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

const conf = {
  base: 'src',
  dist: 'dist',
  temp: '.temp',
  public: 'public',
  path: {
    "styles": "assets/styles/*.scss",
    "scripts": "assets/scripts/*.js",
    "pages": "*.html",
    "images": "assets/images/**",
    "fonts": "assets/fonts/**",
  }
}

const clean = () => {
  return del[dist, temp]
}

const style = () => {
  return src(conf.path.styles, { cwd: conf.base, base: conf.base })
    .pipe(plugins.sass({ outputStyle: "expanded" }))
    .pipe(dest(conf.temp))
    .pipe(bs.reload({ stream: true }))
}

const script = () => {
  return src(conf.path.scripts, { cwd: conf.base, base: conf.base })
    .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
    .pipe(dest(conf.temp))
    .pipe(bs.reload({ stream: true }))
}

const page = () => {
  return src(conf.path.pages, { cwd: conf.base, base: conf.base })
    .pipe(plugins.swig({ data, defaults: { cache: false } }))
    .pipe(dest(conf.temp))
    .pipe(bs.reload({ stream: true }))
}

const image = () => {
  return src(conf.path.images, { cwd: conf.base, base: conf.base })
    .pipe(plugins.imagemin())
    .pipe(dest(conf.dist))
}

const font = () => {
  return src(conf.path.fonts, { cwd: conf.base, base: conf.base })
    .pipe(plugins.imagemin())
    .pipe(dest(conf.dist))
}

const extra = () => {
  return src('**', { base: conf.public })
    .pipe(dest(conf.dist))
}

const useref = () => {
  return src(conf.path.pages, { cwd: conf.temp, base: conf.temp })
    .pipe(plugins.useref({ searchPath: [conf.temp, '.'] }))
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(plugins.if(/\.html$/, plugins.htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true
    })))
    .pipe(dest(conf.dist))
}

const serve = () => {
  watch(conf.path.styles, {cwd: conf.base}, style)
  watch(conf.path.scripts, {cwd: conf.base}, script)
  watch(conf.path.pages, {cwd: conf.base}, page)
  // watch('src/assets/images/**', image)
  // watch('src/assets/fonts/**', font)
  // watch('public/**', extra)

  // 文件变化，自动 reload 服务
  watch([ conf.path.images, conf.path.fonts ], {cwd: conf.base}, bs.reload);
  watch(["**"], {cwd: conf.public}, bs.reload);

  bs.init({
    notify: false,
    port: 2080,
    // open: false,
    // files: 'dist/**',
    server: {
      baseDir: [conf.temp, conf.base, conf.public],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  })
}

const lint = () => {
  return src(conf.path.styles, { cwd: conf.base, base: conf.base })
    .pipe(plugis.eslint())
    .pipe(plugins.eslint.failAfterError())
}

const compile = parallel(style, script, page);

// 上线之前执行的任务
const build = series(
  clean, 
  parallel(
    series(compile, useref),
    image, 
    font, 
    extra
  )
)

const start = series(compile, series)

module.exports = {
  clean,
  lint,
  serve,
  build,
  start
}