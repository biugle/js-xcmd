#! /usr/bin/env node
// 是执行这个文件时使用 node 方式执行
/*
 * @Author: HxB
 * @Date: 2022-04-25 16:27:06
 * @LastEditors: DoubleAm
 * @LastEditTime: 2023-06-15 14:34:01
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
  renameFile
} = require('../utils/files');
const nodeCmd = require('node-cmd');
const { cmd } = require('../utils/cmd');

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
  .action((fileSrc, fileTarget) => {
    console.log('----------Copying----------');
    console.log({ fileSrc, fileTarget });
    copyFile(fileSrc, fileTarget);
    console.log('----------Successful----------');
  });

program
  .option('copy-dir <dirSrc> <dirTarget>', 'copy dir')
  .command('copy-dir <dirSrc> <dirTarget>')
  .action((dirSrc, dirTarget) => {
    console.log('----------Copying----------');
    console.log({ dirSrc, dirTarget });
    copyDir(null, dirSrc, dirTarget);
    console.log('----------Successful----------');
  });

program
  .option('delete-dir <dir>', 'delete dir')
  .command('delete-dir <dir>')
  .action((dir) => {
    console.log('----------Deleting----------');
    console.log({ dir });
    deleteDir(dir);
    console.log('----------Successful----------');
  });

program
  .option('delete-file <file>', 'delete file')
  .command('delete-file <file>')
  .action((file) => {
    console.log('----------Deleting----------');
    console.log({ file });
    deleteFile(file);
    console.log('----------Successful----------');
  });

program
  .option('add-dir <dir>', 'add dir')
  .command('add-dir <dir>')
  .action((dir) => {
    console.log('----------Adding----------');
    console.log({ dir });
    addDir(dir);
    console.log('----------Successful----------');
  });

program
  .option('add-file <file> [content]', 'add file')
  .command('add-file <file> [content]')
  .action((file, content = '') => {
    console.log('----------Adding----------');
    console.log({ file, content });
    addFile(file, content);
    console.log('----------Successful----------');
  });

program
  .option('rename-dir <dirSrc> <dirTarget>', 'rename dir')
  .command('rename-dir <dirSrc> <dirTarget>')
  .action((dirSrc, dirTarget) => {
    console.log('----------Renaming----------');
    console.log({ dirSrc, dirTarget });
    renameDir(dirSrc, dirTarget);
    console.log('----------Successful----------');
  });

program
  .option('rename-file <fileSrc> <fileTarget>', 'rename file')
  .command('rename-file <fileSrc> <fileTarget>')
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
  .option('update-time', 'update package.json time')
  .command('update-time')
  .action(() => {
    console.log('----------Updating----------');
    let pkgVal = JSON.parse(getFileContent('./package.json'));
    // console.log(pkgVal);
    pkgVal['time'] = getTimeCode();
    console.log(pkgVal['time']);
    setFileContent('./package.json', JSON.stringify(pkgVal, '', 2));
    console.log('----------Successful----------');
  });

program
  .option('clean [target]', 'clean node_modules [default: ./node_modules]')
  .command('clean [target]')
  .action((target = './') => {
    console.log('----------Cleaning----------');
    let rimrafCmd = `rimraf ${target}/node_modules`;
    console.log(rimrafCmd);
    nodeCmd.run(rimrafCmd, (err, data, stderr) => {
      if (err) return console.log(`%c出错啦！${data}`, 'color:red;');

      console.log('----------Successful----------');
    });
  });

// xcmd run "git status"
program
  .option('run <cmdStr>', 'run cmd')
  .command('run <cmdStr>')
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

program.parse(process.argv);
