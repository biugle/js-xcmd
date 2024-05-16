# js-xcmd

## Install

```bash
npm i js-xcmd -g
```

## Use

```bash
xcmd -h # 查看帮助说明

# 代码使用
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
  setFileContent,
  getFileContent,
  getJSONFileObj,
  getPath,
  getFullPath,
  getResolvePath,
  getAllFilePath,
  cmd,
  node2es6,
  sortJSON
} = require('js-xcmd');
```

## Test Package.json.bin.xxx

```bash
npm link
npm run bind
npm unlink
npm run unbind

npm run i:local
```

## Others

* [Issue](https://github.com/biugle/js-xcmd/issues)
* [Pull Request](https://github.com/biugle/js-xcmd/pulls)
* [hxbpandaoh@163.com](mailto:hxbpandaoh@163.com)