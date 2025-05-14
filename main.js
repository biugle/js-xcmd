/*
 * @Author: HxB
 * @Date: 2022-04-28 13:54:21
 * @LastEditors: DoubleAm
 * @LastEditTime: 2025-05-14 18:25:23
 * @Description: 导出一些方法，或许后面可以用到。
 * @FilePath: /js-xcmd/main.js
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
const { node2es6, sortJSON, mergeObj, versionUpgrade, isValidJson, jsonToExcel } = require('./utils/tools');
const { extractParamsFromFiles, filterGitFiles, parseGitFile, getChangedLines } = require('./utils/ast');
const { FILTER_KEYS } = require('./utils/data');
const { renderTemplate } = require('./utils/template');
const { downloadTpl } = require('./utils/tpl');

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
  versionUpgrade,
  isValidJson,
  jsonToExcel,
  extractParamsFromFiles,
  filterGitFiles,
  parseGitFile,
  getChangedLines,
  FILTER_KEYS,
  renderTemplate,
  downloadTpl
};
