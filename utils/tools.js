/*
 * @Author: HxB
 * @Date: 2024-05-11 17:59:32
 * @LastEditors: DoubleAm
 * @LastEditTime: 2024-06-26 09:42:31
 * @Description: 转化 commonjs 为 es6 modules
 * @FilePath: \js-xcmd\utils\tools.js
 */

const node2es6 = (transferObj) => {
  console.log('---转换 Dev 开始---');

  let es6ModuleContent = '\n/* eslint-disable */\n// @ts-nocheck\n';

  Object.keys(transferObj).forEach((i) => {
    const val = transferObj[i];
    const type = typeof val;
    if (val === undefined) {
      return;
    }
    console.log(`(${type}) export const ${i}`);
    es6ModuleContent += `\nexport const ${i} = ${
      type === 'function' ? val.toString() : JSON.stringify(val, null, 2)
    };\n`;
  });

  console.log('---转换 Dev 完成---');

  return es6ModuleContent;
};

const sortJSON = (obj) => {
  console.log('---JSON 排序开始---');

  // 去重并获取对象的键数组
  const keys = Object.keys(obj);

  // 按键的首字符进行排序
  const sortedKeys = keys.sort((a, b) => a[0].localeCompare(b[0]));

  // 构建分类和排序后的对象
  const sortedAndGroupedObject = sortedKeys.reduce((result, key) => {
    const firstChar = key[0];
    if (!result[firstChar]) {
      result[firstChar] = [];
    }
    result[firstChar].push(key);
    return result;
  }, {});

  // 在每个分类中按键的长度进行排序
  for (const group in sortedAndGroupedObject) {
    sortedAndGroupedObject[group].sort((a, b) => a.localeCompare(b)).sort((a, b) => a.length - b.length);
  }

  // 拼接分类后的键数组
  const finalKeys = Object.values(sortedAndGroupedObject).flat();

  // 构建排序后的对象
  const sortedObject = finalKeys.reduce((result, key) => {
    result[key] = obj[key];
    return result;
  }, {});

  // 转换为 JSON 字符串
  const sortedJsonString = JSON.stringify(sortedObject, null, 2);

  console.log('---JSON 排序完成---');

  return sortedJsonString;
};

const mergeObj = (...args) => {
  return Object.assign({}, ...[...args].map((i) => (i ? i : {})));
};

/**
 * 版本号升级算法
 * @example
 * versionUpgrade('0.0.1'); /// '0.0.2'
 * versionUpgrade('0.0.0.9'); /// '0.0.0.10'
 * versionUpgrade('0.0.0.9', 9); /// '0.0.1.0'
 * versionUpgrade('0.0.9.9', 9); /// '0.1.0.0'
 * @param version 版本号
 * @param maxVersionCode 最大版本号
 * @returns
 */
const versionUpgrade = (version, maxVersionCode = 99) => {
  if (maxVersionCode == 0) {
    maxVersionCode = 99;
  }
  let tempVersionArr = version.split('.').map((v) => Number(v));
  const nan = tempVersionArr.some((v) => isNaN(v));
  if (nan) {
    return version;
  }
  tempVersionArr = tempVersionArr.reverse();
  let check = true;
  tempVersionArr.forEach((v, i) => {
    if (check) {
      if (v >= maxVersionCode) {
        tempVersionArr[i] = 0;
      } else {
        check = false;
        tempVersionArr[i] = tempVersionArr[i] + 1;
      }
    }
  });
  return tempVersionArr.reverse().join('.');
};

module.exports = {
  node2es6,
  sortJSON,
  mergeObj,
  versionUpgrade
};
