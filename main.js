/*
 * @Author: HxB
 * @Date: 2022-04-28 13:54:21
 * @LastEditors: DoubleAm
 * @LastEditTime: 2022-08-03 18:48:38
 * @Description: 导出一些方法，或许后面可以用到。
 * @FilePath: \js-xcmd\main.js
 */

const {
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
} = require('./utils/files');
const { cmd } = require('./utils/cmd');

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
  setFileContent,
  cmd
};
