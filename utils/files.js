/*
 * @Author: HxB
 * @Date: 2022-04-25 17:49:14
 * @LastEditors: DoubleAm
 * @LastEditTime: 2024-05-16 16:48:18
 * @Description: 文件处理工具
 * @FilePath: \js-xcmd\utils\files.js
 */
const path = require('path');
const fs = require('fs');
const { rimraf } = require('rimraf');
const fsExtra = require('fs-extra');

/**
 * 判断目录是否存在，返回结果。(boolean)
 * @param {*} dirPath
 * @returns
 */
const isDirExistResult = (dirPath) => {
  return fs.existsSync(dirPath);
};

/**
 * 判断目录是否存在，不存在则创建目录。
 */
const isDirExist = (dirPath) => {
  // fs.access(dirPath, function (err) {
  //   if (err) {
  //     // 目录不存在时创建目录
  //     fs.mkdirSync(dirPath);
  //   }
  // });
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/*
 * 复制目录、子目录，及其中的文件。(注意：会强制覆盖目标目录同名文件)
 * @param src {String} 要复制的目录
 * @param target {String} 复制到目标目录
 */
const copyDir = (src, target) => {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const paths = fs.readdirSync(src);
  paths.forEach((filename) => {
    const srcPath = path.join(src, filename);
    const targetPath = path.join(target, filename);
    const stat = fs.statSync(srcPath);

    if (stat.isFile()) {
      fs.copyFileSync(srcPath, targetPath);
    } else if (stat.isDirectory()) {
      copyDir(srcPath, targetPath);
    }
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
 * @param {*} dirPath
 */
const deleteDir = (dirPath) => {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach(function (file) {
      let curPath = dirPath + '/' + file;
      if (fs.statSync(curPath).isDirectory()) {
        // recurse
        deleteDir(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
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
 * 清空目录
 * @param {*} dirPath
 */
const emptyDir = (dirPath) => {
  try {
    // fsExtra.removeSync(dirPath);
    fsExtra.emptyDirSync(dirPath);
    console.log('文件夹已成功清空');
  } catch (err) {
    console.error('清空文件夹时出错:', err);
  }
};

/**
 * rm-rf 目录或者文件
 * @param {*} dirPath 路径或者路径数组
 * @param {*} opts https://www.npmjs.com/package/rimraf
 */
const rmRf = (dirPath, opts) => {
  rimraf(dirPath, opts);
};

/**
 * 新建目录
 * @param {*} dir
 */
const addDir = (dir) => {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
      console.log('目录创建成功');
    } catch (err) {
      console.log({ 'addDir error': err });
    }
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
  try {
    fs.renameSync(oldPath, newPath);
    console.log('目录重命名成功');
  } catch (err) {
    if (err.code === 'ENOENT') {
      try {
        fs.mkdirSync(path.dirname(newPath), { recursive: true });
        fs.renameSync(oldPath, newPath);
        console.log('目录重命名成功');
      } catch (e) {
        console.log({ 'renameDir error': e });
      }
    } else {
      console.log({ 'renameDir error': err });
    }
  }
};

/**
 * 重命名文件
 * @param {*} oldPath
 * @param {*} newPath
 */
const renameFile = (oldPath, newPath) => {
  try {
    fs.renameSync(oldPath, newPath);
    console.log('文件重命名成功');
  } catch (err) {
    if (err.code === 'ENOENT') {
      try {
        fs.mkdirSync(path.dirname(newPath), { recursive: true });
        fs.renameSync(oldPath, newPath);
        console.log('文件重命名成功');
      } catch (e) {
        console.log({ 'renameFile error': e });
      }
    } else {
      console.log({ 'renameFile error': err });
    }
  }
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
 * 获取 JSON 文件内容对象
 * @param {*} filePath
 * @returns
 */
const getJSONFileObj = (filePath) => {
  try {
    const fileContent = getFileContent(filePath);
    return JSON.parse(fileContent);
  } catch (e) {
    console.log({ getJSONFileObjError: e, filePath });
    return null;
  }
};

/**
 * 修改文件内容
 * @param {*} filePath
 * @param {*} content
 */
const setFileContent = (filePath, content) => {
  fs.writeFileSync(filePath, content, 'utf-8');
};

/**
 * 获取 path
 * @param {*} filePath
 */
const getPath = (filePath) => {
  return path.join(__dirname, filePath);
};

/**
 * 获取当前目录相对 path 的完整路径
 * @param {*} filePath
 */
const getFullPath = (filePath) => {
  return path.join(process.cwd(), filePath);
};

/**
 * 处理绝对路径
 * @param {*} filePath
 */
const getResolvePath = (filePath) => {
  return path.resolve(filePath);
};

/**
 * 获取指定目录下的文件，`depth = true` 查所有。
 * @param {*} directory
 * @param {*} depth
 * @param {*} fileExtensions
 * @returns
 */
function getAllFilePath(directory, depth = 0, fileExtensions = []) {
  const files = [];

  function traverseDirectory(currentDir, currentDepth) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    entries.forEach((entry) => {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        if (depth === true || currentDepth < depth) {
          traverseDirectory(fullPath, currentDepth + 1);
        }
      } else {
        if (fileExtensions.length === 0 || fileExtensions.some((i) => path.extname(fullPath).includes(i))) {
          files.push(fullPath);
        }
      }
    });
  }

  traverseDirectory(directory, 0);

  return files;
}

module.exports = {
  rmRf,
  isDirExistResult,
  isDirExist,
  emptyDir,
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
  setFileContent,
  getJSONFileObj,
  getPath,
  getFullPath,
  getResolvePath,
  getAllFilePath
};
