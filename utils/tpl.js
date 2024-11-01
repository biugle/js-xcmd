const download = require('download-git-repo');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const readline = require('readline');

/**
 * 下载模板仓库并替换其中的占位符
 * @param {string} repo - Git 仓库地址
 * @param {string} dest - 下载目录
 * @param {object} replacements - 用户输入的替换内容
 */
function downloadAndReplace(repo, dest, replacements) {
  download(repo, dest, (err) => {
    if (err) return console.error('模板下载失败:', err);
    console.log(`模板已下载到 ${dest}`);

    // 获取下载目录中的所有文件路径并替换其中的占位符
    const files = glob.sync(`${dest}/**/*`, { nodir: true });
    files.forEach((file) => applyReplacements(file, replacements));

    console.log('模板替换已完成');
  });
}

/**
 * 直接使用正则表达式替换文件中的占位符 [[[ ]]]
 * @param {string} filePath - 文件路径
 * @param {object} replacements - 要替换的值
 */
function applyReplacements(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 遍历 replacements 对象，将 [[[key]]] 替换为对应的值
  Object.keys(replacements).forEach((key) => {
    const regex = new RegExp(`\\[\\[\\[${key}\\]\\]\\]`, 'g');
    content = content.replace(regex, replacements[key]);
  });

  fs.writeFileSync(filePath, content, 'utf8');
}

/**
 * 提示用户输入以填充模板中的占位符
 * @param {Array<string>} questions - 要收集的键名数组
 */
function promptUserInputs(questions) {
  if (!Array.isArray(questions) || questions.length === 0) {
    console.error('请提供一个有效的占位符名称数组');
    return Promise.resolve({});
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const answers = {};
  let index = 0;

  return new Promise((resolve) => {
    const askQuestion = () => {
      if (index === questions.length) {
        rl.close();
        resolve(answers);
      } else {
        const question = questions[index];
        rl.question(`请输入 ${question} :\n`, (answer) => {
          answers[question] = answer;
          index++;
          askQuestion();
        });
      }
    };

    askQuestion();
  });
}

/**
 * 主函数，用于运行模板下载和替换
 * @param {string} gitRepo - Git 仓库地址
 * @param {string} downloadPath - 下载目录路径
 * @param {Array<string>} options - 要收集的替换项
 */
async function downloadTpl(gitRepo, downloadPath, options) {
  if (typeof gitRepo !== 'string' || typeof downloadPath !== 'string') {
    console.error('请提供有效的 Git 仓库地址和下载路径');
    return;
  }

  const answers = await promptUserInputs(options);
  if (!answers.PageCode) {
    console.error('请提供 PageCode');
    return;
  }
  downloadPath = downloadPath || `./${answers.PageCode}`;
  const dest = path.resolve(downloadPath);
  console.log({ answers, downloadPath });
  downloadAndReplace(gitRepo, dest, answers);
}

module.exports = { downloadTpl };
