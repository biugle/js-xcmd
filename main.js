/*
 * @Author: HxB
 * @Date: 2022-04-28 13:54:21
 * @LastEditors: DoubleAm
 * @LastEditTime: 2024-05-11 18:48:09
 * @Description: 导出一些方法，或许后面可以用到。
 * @FilePath: \js-xcmd\main.js
 */

const {
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
  getPath,
  getFullPath
} = require('./utils/files');
const { cmd } = require('./utils/cmd');
const { node2es6, sortJSON } = require('./utils/tools');

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
  getPath,
  getFullPath,
  cmd,
  node2es6,
  sortJSON
};
