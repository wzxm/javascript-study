#!/usr/bin/env node

/*
 * @Description: 简单版脚手架
 * @Author: wangzhe
 * @Email: wangzhe@weeget.cn
 * @Date: 2020-11-28 17:15:17
 * @LastEditTime: 2020-11-28 17:32:08
 * @LastEditors: wangzhe
 */
const fs = require('fs');
const path = require('path');

const inquirer = require('inquirer');
const ejs = require('ejs');

inquirer.prompt([
  {
    type: 'input',
    name: 'name',
    message: 'Project name?'
  }
]).then(anwsers => {
  // 模版目录
  const tempDir = path.join(__dirname, '../templates');
  // 目标目录
  const destDir = process.cwd();

  fs.readdir(tempDir, (err, files) => {
    if(err) throw err;

    files.forEach(file => {
      // 通过模版引擎渲染文件
      ejs.renderFile(path.join(tempDir, file), anwsers, (err, result) => {
        if(err) throw err;
        fs.writeFileSync(path.join(`${destDir}/dist`, file), result);
      })
    })
  })
})