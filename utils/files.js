/*
 * @Author: HxB
 * @Date: 2022-04-25 17:49:14
 * @LastEditors: DoubleAm
 * @LastEditTime: 2022-04-28 13:53:16
 * @Description: 文件处理工具
 * @FilePath: \js-xcmd\utils\files.js
 */
const path = require('path');
const fs = require('fs');

/**
 * 判断目录是否存在，不存在则创建目录。
 */
const isDirExist = (path) => {
  // fs.access(path, function (err) {
  //   if (err) {
  //     // 目录不存在时创建目录
  //     fs.mkdirSync(path);
  //   }
  // });
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
};

/*
 * 复制目录、子目录，及其中的文件。
 * @param src {String} 要复制的目录
 * @param target {String} 复制到目标目录
 */
const copyDir = (err, src, target) => {
  if (err) {
    console.log({ 'copyDir error': err });
    return;
  }

  fs.readdir(src, function (err, paths) {
    if (err) {
      console.log({ 'copyDir error': err });
      return;
    }

    paths.forEach(function (path) {
      let _src = src + '/' + path;
      let _target = target + '/' + path;
      fs.stat(_src, function (err, stat) {
        if (err) {
          console.log({ 'copyDir error': err });
          return;
        }

        // 判断是文件还是目录
        if (stat.isFile()) {
          fs.writeFileSync(_target, fs.readFileSync(_src));
        } else if (stat.isDirectory()) {
          // 当是目录是，递归复制。
          isDirExist(_target);
          copyDir(null, _src, _target);
        }
      });
    });
  });
};

/**
 * 复制文件
 * @param {*} src
 * @param {*} target
 */
const copyFile = (src, target) => {
  try {
    fs.writeFileSync(target, fs.readFileSync(src));
  } catch (e) {
    console.log({ 'copyFile error': e });
    try {
      fs.createReadStream(src).pipe(fs.createWriteStream(target)); // 大文件复制
    } catch (err) {
      console.log({ 'copyBigFile error': err });
    }
  }
};

/**
 * 获取文件内容
 * @param {*} content
 */
const getFileContent = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  return content;
};

/**
 * 修改文件内容
 * @param {*} filePath
 * @param {*} content
 */
const setFileContent = (filePath, content) => {
  fs.writeFileSync(filePath, content, 'utf-8');
};

module.exports = {
  isDirExist,
  copyDir,
  copyFile,
  getFileContent,
  setFileContent
};
