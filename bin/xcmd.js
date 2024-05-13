#! /usr/bin/env node
// 是执行这个文件时使用 node 方式执行
/*
 * @Author: HxB
 * @Date: 2022-04-25 16:27:06
 * @LastEditors: DoubleAm
 * @LastEditTime: 2024-05-13 17:11:47
 * @Description: 命令处理文件
 * @FilePath: \js-xcmd\bin\xcmd.js
 */

const program = require('commander');
const download = require('download-git-repo');
const pkg = require('../package.json');
const {
  copyDir,
  copyFile,
  getFileContent,
  setFileContent,
  deleteDir,
  deleteFile,
  addDir,
  addFile,
  renameDir,
  renameFile,
  rmRf,
  emptyDir,
  getFullPath
} = require('../utils/files');
const { cmd } = require('../utils/cmd');
const { node2es6, sortJSON } = require('../utils/tools');
const nodeCmd = require('node-cmd');

// http://patorjk.com/software/taag/
const logo = () => {
  /*  
  
   ___       _______   ________  ___  ___  _______      
  |\  \     |\  ___ \ |\   __  \|\  \|\  \|\  ___ \     
  \ \  \    \ \   __/|\ \  \|\  \ \  \\\  \ \   __/|    
   \ \  \    \ \  \_|/_\ \  \\\  \ \   __  \ \  \_|/__  
    \ \  \____\ \  \_|\ \ \  \\\  \ \  \ \  \ \  \_|\ \ 
     \ \_______\ \_______\ \_______\ \__\ \__\ \_______\
      \|_______|\|_______|\|_______|\|__|\|__|\|_______|
  
  */
};

const logLogo = (strFoo) => {
  let l = new String(strFoo);
  l = l.substring(l.indexOf('/*') + 3, l.lastIndexOf('*/'));
  return l;
};

const getTimeCode = () => {
  let dateObj = new Date();
  return `${Math.round(Math.random() * 100)
    .toString()
    .padEnd(2, '0')}${dateObj.getSeconds().toString().padStart(2, '0')}${dateObj
    .getMinutes()
    .toString()
    .padStart(2, '0')}${dateObj.getHours().toString().padStart(2, '0')}${dateObj
    .getDate()
    .toString()
    .padStart(2, '0')}${String(dateObj.getMonth() + 1).padStart(2, '0')}${dateObj.getFullYear()}`;
};

program.version(pkg.version, '-v, --version');

program
  .option('create-react-view [dir]', 'create react-view cli')
  .command('create-react-view [dir]')
  .description('创建 react-view 模板')
  .action((dir) => {
    console.log('----------Clone Template----------');
    console.log(logLogo(logo));
    download('github:pandaoh/react-view', !dir ? 'react-view' : dir, function (err) {
      console.log(err ? err : '----------Successful----------');
    });
  });

program
  .option('create-vue-admin [dir]', 'create vue-admin cli')
  .command('create-vue-admin [dir]')
  .description('创建 vue-admin 模板')
  .action((dir) => {
    console.log('----------Clone Template----------');
    console.log(logLogo(logo));
    download('github:pandaoh/vue-admin', !dir ? 'vue-admin' : dir, function (err) {
      console.log(err ? err : '----------Successful----------');
    });
  });

program
  .option('create-micro-web [dir]', 'create micro-web cli')
  .command('create-micro-web [dir]')
  .description('创建 react-micro-web 模板')
  .action((dir) => {
    console.log('----------Clone Template----------');
    console.log(logLogo(logo));
    download('github:pandaoh/react_micro_web', !dir ? 'react_micro_web' : dir, function (err) {
      console.log(err ? err : '----------Successful----------');
    });
  });

program
  .option('create-web-base [dir] [branch]', 'create web-base cli')
  .command('create-web-base [dir] [branch]')
  .description('获取 web-base 通用开发模板-推荐~')
  .action((dir, branch) => {
    console.log('----------Clone Template----------');
    console.log(logLogo(logo));
    const branchs = {
      main: 'main',
      modules: 'modules',
      'c-modules': 'client-modules',
      'c-main': 'client-main',
      cross: 'simple-cross-platform'
    };
    download(
      'github:biugle/web_base' + (branch ? `#${branchs[branch] ?? branch ?? 'main'}` : ''),
      !dir ? 'web_base' : dir,
      function (err) {
        console.log(err ? err : '----------Successful----------');
      }
    );
  });

// xcmd copy-file ./package.json ./target/package.json
program
  .option('copy-file <fileSrc> <fileTarget>', 'copy file')
  .command('copy-file <fileSrc> <fileTarget>')
  .description('复制文件')
  .action((fileSrc, fileTarget) => {
    console.log('----------Copying----------');
    console.log({ fileSrc, fileTarget });
    copyFile(fileSrc, fileTarget);
    console.log('----------Successful----------');
  });

program
  .option('copy-dir <dirSrc> <dirTarget>', 'copy dir')
  .command('copy-dir <dirSrc> <dirTarget>')
  .description('复制目录')
  .action((dirSrc, dirTarget) => {
    console.log('----------Copying----------');
    console.log({ dirSrc, dirTarget });
    copyDir(dirSrc, dirTarget);
    console.log('----------Successful----------');
  });

program
  .option('delete-dir <dir>', 'delete dir')
  .command('delete-dir <dir>')
  .description('删除目录')
  .action((dir) => {
    console.log('----------Deleting----------');
    console.log({ dir });
    deleteDir(dir);
    console.log('----------Successful----------');
  });

program
  .option('empty-dir <dir>', 'empty dir')
  .command('empty-dir <dir>')
  .description('清空目录')
  .action((dir) => {
    console.log('----------Emptying----------');
    console.log({ dir });
    emptyDir(dir);
    console.log('----------Successful----------');
  });

program
  .option('rm-rf <path>', 'rm rf')
  .command('rm-rf <path>')
  .description('彻底删除目录/文件')
  // .option('rmrf <path>', 'rmrf')
  // .command('rmrf <path>')
  .action((path) => {
    console.log('----------RimRaf----------');
    console.log({ path });
    rmRf(path);
    console.log('----------Successful----------');
  });

program
  .option('delete-file <file>', 'delete file')
  .command('delete-file <file>')
  .description('删除文件')
  .action((file) => {
    console.log('----------Deleting----------');
    console.log({ file });
    deleteFile(file);
    console.log('----------Successful----------');
  });

program
  .option('add-dir <dir>', 'add dir')
  .command('add-dir <dir>')
  .description('添加目录')
  .action((dir) => {
    console.log('----------Adding----------');
    console.log({ dir });
    addDir(dir);
    console.log('----------Successful----------');
  });

program
  .option('add-file <file> [content]', 'add file')
  .command('add-file <file> [content]')
  .description('添加文件')
  .action((file, content = '') => {
    console.log('----------Adding----------');
    console.log({ file, content });
    addFile(file, content);
    console.log('----------Successful----------');
  });

program
  .option('rename-dir <dirSrc> <dirTarget>', 'rename dir')
  .command('rename-dir <dirSrc> <dirTarget>')
  .description('重命名目录/移动目录')
  .action((dirSrc, dirTarget) => {
    console.log('----------Renaming----------');
    console.log({ dirSrc, dirTarget });
    renameDir(dirSrc, dirTarget);
    console.log('----------Successful----------');
  });

program
  .option('rename-file <fileSrc> <fileTarget>', 'rename file')
  .command('rename-file <fileSrc> <fileTarget>')
  .description('重命名文件')
  .action((fileSrc, fileTarget) => {
    console.log('----------Renaming----------');
    console.log({ fileSrc, fileTarget });
    renameFile(fileSrc, fileTarget);
    console.log('----------Successful----------');
  });

// xcmd replace-file-content  .\README.md "npm i js-xcmd -g" "test"
program
  .option('replace-file-content <fileSrc> <content> <contentTarget>', 'replace file content')
  .command('replace-file-content <fileSrc> <content> <contentTarget>')
  .description('替换文件内容')
  .action((fileSrc, content, contentTarget) => {
    contentTarget = contentTarget.replace('[space]', ' ');
    contentTarget = contentTarget.replace('[none]', '');
    contentTarget = contentTarget.replace('[backslash]', '\\');
    contentTarget = contentTarget.replace('[forward]', '/');
    contentTarget = contentTarget.replace('[vLine]', '|');
    contentTarget = contentTarget.replace('[and]', '&');
    contentTarget = contentTarget.replace('[percent]', '%');
    contentTarget = contentTarget.replace('[leftABracket]', '<');
    contentTarget = contentTarget.replace('[rightABracket]', '>');
    console.log('----------Replacing----------');
    console.table({ fileSrc, content, contentTarget });
    let srcFileContent = getFileContent(fileSrc);
    // setFileContent(fileSrc, srcFileContent.replace(content, contentTarget));
    setFileContent(fileSrc, srcFileContent.replace(new RegExp(content, 'g'), contentTarget));
    console.log('----------Successful----------');
  });

program
  .option('update-time [filePath]', 'update package.json time [filePath]')
  .command('update-time [filePath]')
  .description('更新 json 中的 time 字段')
  // .option('time [filePath]', 'update package.json time [filePath]')
  // .command('time [filePath]')
  .action((filePath) => {
    try {
      console.log(new Date().toLocaleString());
    } catch (e) {
      console.log('IOS', e);
    }
    console.log('----------Updating----------');
    const packageFilePath = filePath || './package.json';
    const packageData = getFileContent(packageFilePath);
    const packageJson = JSON.parse(packageData);

    packageJson.time = getTimeCode();
    console.log({ time: packageJson.time });
    setFileContent(packageFilePath, JSON.stringify(packageJson, '', 2));

    console.log('----------Successful----------');
  });

program
  .option('clean [target]', 'clean node_modules [default: ./node_modules]')
  .command('clean [target]')
  .description('清理某个目录下的 node_modules 目录')
  .action((target = './') => {
    console.log('----------Cleaning----------');
    let rimrafCmd = `rimraf ${target}/node_modules`;
    console.log(rimrafCmd);
    nodeCmd.run(rimrafCmd, (err, data, stderr) => {
      if (err) return console.log(`%c出错啦！${data}`, 'color:red;');
      console.log(data);
      console.log('----------Successful----------');
    });
  });

program
  .option('npm-clean', 'npm-clean')
  .command('npm-clean')
  .description('清理 npm 缓存')
  .action(() => {
    console.log('----------Npm-CacheClean-Start----------');
    const cmdStr = 'npm cache clean --force';
    console.log({ cmdStr });
    nodeCmd.run(cmdStr, (err, data, stderr) => {
      if (err) return console.log(`%c出错啦！${data}`, 'color:red;');
      console.log(data);
      console.log('----------Npm-CacheClean-End----------');
    });
  });

program
  .option('yarn-clean', 'yarn-clean')
  .command('yarn-clean')
  .description('清理 yarn 缓存')
  .action(() => {
    console.log('----------Yarn-CacheClean-Start----------');
    const cmdStr = 'yarn cache clean --force';
    console.log({ cmdStr });
    nodeCmd.run(cmdStr, (err, data, stderr) => {
      if (err) return console.log(`%c出错啦！${data}`, 'color:red;');
      console.log(data);
      console.log('----------Yarn-CacheClean-End----------');
    });
  });

program
  .option('i', 'npm i --ignore-scripts')
  .command('i')
  .description('执行 npm i --ignore-scripts')
  .action(() => {
    console.log('----------Npm-Install-IgnoreScripts-Start----------');
    const cmdStr = 'npm i --ignore-scripts';
    console.log({ cmdStr });
    nodeCmd.run(cmdStr, (err, data, stderr) => {
      if (err) return console.log(`%c出错啦！${data}`, 'color:red;');
      console.log(data);
      console.log('----------Npm-Install-IgnoreScripts-End----------');
    });
  });

program
  .option('eslint', 'eslint ./ --fix --ext .ts,.tsx,.js,.jsx,.vue')
  .command('eslint')
  .description('执行 eslint 修复')
  .action(() => {
    console.log('----------Eslint-Start----------');
    const cmdStr = 'eslint ./ --fix --ext .ts,.tsx,.js,.jsx,.vue';
    console.log({ cmdStr });
    nodeCmd.run(cmdStr, (err, data, stderr) => {
      if (err) return console.log(`%c出错啦！${data}`, 'color:red;');
      console.log(data);
      console.log('----------Eslint-End----------');
    });
  });

program
  .option('prettier', 'prettier --write ./**/*.{ts,tsx,js,jsx,vue,html,css,scss,less}')
  .command('prettier')
  .description('执行 prettier 格式化')
  .action(() => {
    console.log('----------Prettier-Start----------');
    const cmdStr = 'prettier --write ./**/*.{ts,tsx,js,jsx,vue,html,css,scss,less}';
    console.log({ cmdStr });
    nodeCmd.run(cmdStr, (err, data, stderr) => {
      if (err) return console.log(`%c出错啦！${data}`, 'color:red;');
      console.log(data);
      console.log('----------Prettier-End----------');
    });
  });

program
  .option('list [global]', 'list [global]')
  .command('list [global]')
  .description('查看安装的 npm 插件列表')
  // .option('ls [global]', 'ls [global]')
  // .command('ls [global]')
  .action((global) => {
    let cmdStr = '';
    if (global) {
      console.log('----------Npm-List-Global-Start----------');
      cmdStr = 'npm list -g --depth 0';
    } else {
      console.log('----------Npm-List-Start----------');
      cmdStr = 'npm list --depth 0';
    }
    console.log({ cmdStr });
    nodeCmd.run(cmdStr, (err, data, stderr) => {
      if (err) return console.log(`%c出错啦！${data}`, 'color:red;');
      console.log(data);
      console.log('----------Npm-List-End----------');
    });
  });

program
  .option('lsn', 'lsn')
  .command('lsn')
  .description('查看 nvm 可用 node 版本列表')
  .action(() => {
    let cmdStr = 'nvm list available';
    console.log({ cmdStr });
    nodeCmd.run(cmdStr, (err, data, stderr) => {
      if (err) return console.log(`%c出错啦！${data}`, 'color:red;');
      console.log(data);
      console.log('----------Successful----------');
    });
  });

program
  .option('ig [all]', 'ig [all]')
  .command('ig [all]')
  .description('全局安装必要的 npm 开发插件')
  .action((all) => {
    let cmdStr = '';
    if (!all) {
      cmdStr = 'npm i nrm pnpm js-xcmd nodemon pm2 yarn rimraf -g';
    } else {
      cmdStr =
        'npm i nrm pnpm js-xcmd nodemon pm2 yarn rimraf protobufjs protobufjs-cli create-react-app @vue/cli @angular/cli cordova cnpm -g -force';
    }
    console.log({ cmdStr });
    nodeCmd.run(cmdStr, (err, data, stderr) => {
      console.log(stderr);
      if (err) return console.log(`%c出错啦！${data}`, 'color:red;');
      console.log(data);
      console.log('----------Successful----------');
    });
  });

program
  .option('dev [src]', 'dev [src]')
  .command('dev [src]')
  .description('帮助执行 pnpm --filter ${src} dev')
  .action((src) => {
    let cmdStr = '';
    if (src) {
      src = src.replace(/[\'\"\‘\’\“\”]/g, '');
      console.log(`----------${src}-Dev----------`);
      cmdStr = `pnpm --filter ${src} dev`;
    } else {
      console.log('----------Npm-Run-Dev----------');
      cmdStr = 'npm run dev';
    }
    console.log({ cmdStr });
    nodeCmd.run(cmdStr, (err, data, stderr) => {
      if (err) return console.log(`%c出错啦！${data}`, 'color:red;');
      console.log(data);
      console.log('----------Successful-OKK!----------');
    });
  });

program
  .option('start [src]', 'start [src]')
  .command('start [src]')
  .description('帮助执行 pnpm --filter ${src} start')
  .action((src) => {
    let cmdStr = '';
    if (src) {
      src = src.replace(/[\'\"\‘\’\“\”]/g, '');
      console.log(`----------${src}-Start----------`);
      cmdStr = `pnpm --filter ${src} start`;
    } else {
      console.log('----------Npm-Run-Start----------');
      cmdStr = 'npm run start';
    }
    console.log({ cmdStr });
    nodeCmd.run(cmdStr, (err, data, stderr) => {
      if (err) return console.log(`%c出错啦！${data}`, 'color:red;');
      console.log(data);
      console.log('----------Successful-OKK!----------');
    });
  });

program
  .option('build [src]', 'build [src]')
  .command('build [src]')
  .description('帮助执行 pnpm --filter ${src} build')
  .action((src) => {
    let cmdStr = '';
    if (src) {
      src = src.replace(/[\'\"\‘\’\“\”]/g, '');
      console.log(`----------${src}-Build----------`);
      cmdStr = `pnpm --filter ${src} build`;
    } else {
      console.log('----------Npm-Run-Build----------');
      cmdStr = 'npm run build';
    }
    console.log({ cmdStr });
    nodeCmd.run(cmdStr, (err, data, stderr) => {
      if (err) return console.log(`%c出错啦！${data}`, 'color:red;');
      console.log(data);
      console.log('----------Successful-OKK!----------');
    });
  });

// xcmd run "git status"
program
  .option('run <cmdStr>', 'run cmd')
  .command('run <cmdStr>')
  .description('执行某个命令')
  .action((cmdStr) => {
    console.log('----------Executing ----------');
    cmd(cmdStr)
      .then((data) => {
        console.log(data);
        console.log('----------Successful----------');
      })
      .catch((err) => {
        console.log('----------Error----------');
        console.log(err);
      });
  });

program
  .option('node2es6 <filePath> <outputPath>', 'node2es6 <filePath> <outputPath>')
  .command('node2es6 <filePath> <outputPath>')
  .description('将 CommonJS 文件转换为 ES6 模块')
  .action((filePath, outputPath) => {
    filePath = getFullPath(filePath); // 获取当前运行目录
    const obj = require(filePath);
    const result = node2es6(obj);
    setFileContent(outputPath, result);
  });

program
  .option('sort-json <jsonPath> [outputPath]', 'sort-json <jsonPath> [outputPath]')
  .command('sort-json <jsonPath> [outputPath]')
  .description('将指定 json 文件排序去重并输出')
  .action((jsonPath, outputPath) => {
    outputPath = outputPath ? outputPath : jsonPath;
    const jsonString = getFileContent(jsonPath);
    const obj = JSON.parse(jsonString);
    const result = sortJSON(obj);
    setFileContent(outputPath, result);
  });

program.parse(process.argv);
