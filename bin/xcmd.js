#! /usr/bin/env node
// 是执行这个文件时使用 node 方式执行
/*
 * @Author: HxB
 * @Date: 2022-04-25 16:27:06
 * @LastEditors: DoubleAm
 * @LastEditTime: 2022-04-28 15:00:08
 * @Description: 命令处理文件
 * @FilePath: \js-xcmd\bin\xcmd.js
 */

const program = require('commander');
const download = require('download-git-repo');
const pkg = require('../package.json');
const { copyDir, copyFile, getFileContent, setFileContent } = require('../utils/files');
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

// xcmd replace-file-content  .\README.md "npm i js-xcmd -g" "test"
program
  .option('replace-file-content <fileSrc> <content> <contentTarget>', 'replace file content')
  .command('replace-file-content <fileSrc> <content> <contentTarget>')
  .action((fileSrc, content, contentTarget) => {
    console.log('----------Replacing----------');
    console.table({ fileSrc, content, contentTarget });
    let srcFileContent = getFileContent(fileSrc);
    setFileContent(fileSrc, srcFileContent.replace(content, contentTarget));
    // setFileContent(fileSrc, srcFileContent.replace(new RegExp(content), contentTarget));
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
