/*
 * @Author: HxB
 * @Date: 2022-04-28 14:10:56
 * @LastEditors: DoubleAm
 * @LastEditTime: 2022-04-28 14:25:11
 * @Description: node cmd 一些方法
 * @FilePath: \js-xcmd\utils\cmd.js
 */
const nodeCmd = require('node-cmd');

/**
 * 执行一些 cmd 方法
 * @param {*} cmdStr
 */
const cmd = async (cmdStr) => {
  const { err, data, stderr } = nodeCmd.runSync(cmdStr);
  return new Promise((resolve, reject) => {
    err ? reject(err, stderr) : resolve(data);
  });
};

module.exports = { cmd };
