/*
 * @Author: HxB
 * @Date: 2022-04-28 13:54:21
 * @LastEditors: DoubleAm
 * @LastEditTime: 2024-06-26 09:48:50
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
  getJSONFileObj,
  getPath,
  getFullPath,
  getResolvePath,
  getAllFilePath
} = require('./utils/files');
const { cmd } = require('./utils/cmd');
const { node2es6, sortJSON, mergeObj, versionUpgrade } = require('./utils/tools');

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
  getAllFilePath,
  cmd,
  node2es6,
  sortJSON,
  mergeObj,
  versionUpgrade
};
