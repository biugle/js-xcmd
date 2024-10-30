/*
 * @Author: HxB
 * @Date: 2024-05-11 17:59:32
 * @LastEditors: DoubleAm
 * @LastEditTime: 2024-10-30 14:53:20
 * @Description: 转化 commonjs 为 es6 modules
 * @FilePath: \js-xcmd\utils\tools.js
 */
const XLSX = require('xlsx');

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

const isValidJson = (json) => {
  try {
    JSON.parse(json);
    return true;
  } catch (error) {
    return false;
  }
};

const jsonToExcel = (projectCode, jsonData) => {
  const workbook = XLSX.utils.book_new();
  const sheetName = 'Sheet1';
  const worksheetData = [];

  for (const key in jsonData) {
    const rowData = {
      '项目编码 / Project Code': projectCode,
      '模块编码 / Module Code': 'ALL',
      '模块名称 / Module Name': 'ALL',
      '模块英文名称 / Module Name (En)': 'ALL',
      '文案编码 / Text Key': `${projectCode}.ALL.${key}`,
      '国家 / Country': 'ALL',
      '翻译（中文） / Translation (ZH)': jsonData[key],
      '翻译（英文） / Translation (EN)': '',
      '翻译（阿拉伯语） / Translation (AR)': '',
      '翻译（西班牙语） / Translation (ES)': '',
      '翻译（葡萄牙语） / Translation (PT)': '',
      '翻译（土耳其语） / Translation (TR)': '',
      '翻译（意大利语） / Translation (IT)': ''
    };
    worksheetData.push(rowData);
  }
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);

  // 设置表头高度
  // worksheet['!rows'] = [{ hpx: 50 }];

  // 设置列宽
  worksheet['!cols'] = [
    { wpx: 100 }, // 项目编码 / Project Code
    { wpx: 100 }, // 模块编码 / Module Code
    { wpx: 100 }, // 模块名称 / Module Name
    { wpx: 100 }, // 模块英文名称 / Module Name (En)
    { wpx: 300 }, // 文案编码 / Text Key
    { wpx: 100 }, // 国家 / Country
    { wpx: 200 }, // 翻译（中文） / Translation (ZH)
    { wpx: 200 }, // 翻译（英文） / Translation (EN)
    { wpx: 200 }, // 翻译（阿拉伯语） / Translation (AR)
    { wpx: 200 }, // 翻译（西班牙语） / Translation (ES)
    { wpx: 200 }, // 翻译（葡萄牙语） / Translation (PT)
    { wpx: 200 }, // 翻译（土耳其语） / Translation (TR)
    { wpx: 200 } // 翻译（意大利语） / Translation (IT)
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const excelFilePath = `output_${projectCode}_V${Date.now()}.xlsx`;
  XLSX.writeFile(workbook, excelFilePath);
  console.log(`Excel 文件已生成: ${excelFilePath}`);
};

module.exports = {
  node2es6,
  sortJSON,
  mergeObj,
  versionUpgrade,
  isValidJson,
  jsonToExcel
};
