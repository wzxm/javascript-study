// 实现这个项目的构建任务
// "clean": "gulp clean",
// "lint": "gulp lint",
// "serve": "gulp serve",
// "build": "gulp build",
// "start": "gulp start",
// "deploy": "gulp deploy --production"

const { src, dest } = require('gulp');

const conf = {
  base: 'src',
  dist: 'dist',
  path: {
    "styles": "/assets/styles/*.scss"
  }
}

const style = () => {
  return src(conf.path.styles, { base: conf.base })
    .pipe(dest(conf.dist))
}

module.exports = {
  style
}