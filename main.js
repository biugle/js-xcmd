/*
 * @Author: HxB
 * @Date: 2022-04-28 13:54:21
 * @LastEditors: DoubleAm
 * @LastEditTime: 2022-04-28 14:17:04
 * @Description: 导出一些方法，或许后面可以用到。
 * @FilePath: \js-xcmd\main.js
 */

const { isDirExist, copyDir, copyFile, getFileContent, setFileContent } = require('./utils/files');
const { cmd } = require('./utils/cmd');

module.exports = { isDirExist, copyDir, copyFile, getFileContent, setFileContent, cmd };
