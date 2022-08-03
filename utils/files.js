/*
 * @Author: HxB
 * @Date: 2022-04-25 17:49:14
 * @LastEditors: DoubleAm
 * @LastEditTime: 2022-08-03 18:47:26
 * @Description: 文件处理工具
 * @FilePath: \js-xcmd\utils\files.js
 */
const path = require('path');
const fs = require('fs');

/**
 * 判断目录是否存在，返回结果。(boolean)
 * @param {*} path
 * @returns
 */
const isDirExistResult = (path) => {
  return fs.existsSync(path);
};

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
 * 复制目录、子目录，及其中的文件。(注意：会强制覆盖目标目录同名文件)
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
  if (fs.existsSync(target)) {
    console.log('目标文件已存在');
    return;
  }
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
 * 删除文件夹
 * @param {*} path
 */
const deleteDir = (path) => {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file) {
      var curPath = path + '/' + file;
      if (fs.statSync(curPath).isDirectory()) {
        // recurse
        deleteDir(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  } else {
    console.log('目录不存在');
  }
};

/**
 * 删除文件
 * @param {*} filePath
 */
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  } else {
    console.log('文件不存在');
  }
};

/**
 * 新建目录
 * @param {*} dir
 */
const addDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  } else {
    console.log('目录已存在');
  }
};

/**
 * 新建文件
 * @param {*} filePath
 * @param {*} content
 */
const addFile = (filePath, content = '') => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
  } else {
    console.log('文件已存在');
  }
};

/**
 * 重命名目录
 * @param {*} oldPath
 * @param {*} newPath
 */
const renameDir = (oldPath, newPath) => {
  fs.renameSync(oldPath, newPath);
};

/**
 * 重命名文件
 * @param {*} oldPath
 * @param {*} newPath
 */
const renameFile = (oldPath, newPath) => {
  fs.renameSync(oldPath, newPath);
};

/**
 * 获取文件名
 * @param {*} filePath
 * @returns
 */
const getFileName = (filePath) => {
  return path.basename(filePath);
};

/**
 * 获取文件大小
 * @param {*} filePath
 * @returns
 */
const getFileSize = (filePath) => {
  return fs.statSync(filePath).size;
};

/**
 * 获取文件后缀名
 * @param {*} filePath
 * @returns
 */
const getFileExt = (filePath) => {
  return path.extname(filePath);
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
  isDirExistResult,
  isDirExist,
  copyDir,
  copyFile,
  deleteDir,
  deleteFile,
  addDir,
  addFile,
  renameDir,
  renameFile,
  getFileName,
  getFileSize,
  getFileExt,
  getFileContent,
  setFileContent
};
