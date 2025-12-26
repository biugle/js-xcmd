const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const readline = require('readline');
const axios = require('axios');
const unzipper = require('unzipper');
const { renderTemplate } = require('./template');

/**
 * 下载文件
 * @param {string} url - 文件的 URL
 * @param {string} dest - 下载后保存的路径
 */
async function downloadFile(url, dest) {
  const response = await axios.get(url, { responseType: 'stream' });
  if (response.status !== 200) {
    throw new Error(`下载失败，状态码: ${response.status}`);
  }

  const writer = fs.createWriteStream(dest); // 使用 fs 创建写入流
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

/**
 * 解压 ZIP 文件
 * @param {string} zipPath - ZIP 文件路径
 * @param {string} extractPath - 解压目录
 * @param {string} name - 只解压 zip 包中包含的指定目录
 * @param {boolean} preserveStructure - 是否保留原目录结构
 *
 * 示例用法:
 * // 解压整个ZIP文件
 * await unzipFile('path/to/file.zip', 'extract/path');
 *
 * // 只解压名为 'src' 的目录
 * await unzipFile('path/to/file.zip', 'extract/path', 'xxx/base_page');
 *
 * // 解压特定子目录 (解压后会保留子目录结构)
 * await unzipFile('path/to/file.zip', 'extract/path', 'xxx/base_page', true);
 */
async function unzipFile(zipPath, extractPath, name = '', preserveStructure = false) {
  console.log('开始解压模板...', { zipPath, name, extractPath, preserveStructure });
  if (name && typeof name === 'string') {
    return new Promise((resolve, reject) => {
      fs.createReadStream(zipPath)
        .pipe(unzipper.Parse())
        .on('entry', function (entry) {
          let fileName = entry.path.replace(/\\/g, '/');
          const type = entry.type;
          const normalizedName = name.replace(/\\/g, '/');
          const normalizedDir = normalizedName.endsWith('/') ? normalizedName : normalizedName + '/';
          const normalizedPath = fileName.startsWith('/') ? fileName.substring(1) : fileName;
          const normalizedNamePath = normalizedName.startsWith('/') ? normalizedName.substring(1) : normalizedName;
          // 判断是否需要解压
          const shouldExtract =
            normalizedPath.startsWith(normalizedNamePath) || normalizedPath.startsWith(normalizedDir);

          if (shouldExtract) {
            // 处理路径：保留结构或扁平化
            let relativePath;
            if (normalizedPath.startsWith(normalizedNamePath)) {
              if (preserveStructure) {
                // 保留结构：保留 name 之后的路径
                relativePath = normalizedPath.substring(normalizedNamePath.length);
                relativePath = relativePath.replace(/^\/+/, '');
                relativePath = path.join(normalizedNamePath, relativePath);
              } else {
                // 扁平化：只保留 name 之后的路径
                relativePath = normalizedPath.substring(normalizedNamePath.length);
                relativePath = relativePath.replace(/^\/+/, '');
              }
            } else {
              relativePath = fileName;
            }
            const entryPath = path.join(extractPath, relativePath);
            if (type === 'Directory') {
              try {
                if (relativePath) {
                  fs.mkdirSync(entryPath, { recursive: true });
                }
                entry.autodrain();
              } catch (err) {
                console.error(`创建目录失败 ${entryPath}:`, err.message);
                reject(err);
              }
            } else {
              const dir = path.dirname(entryPath);
              try {
                if (dir !== extractPath) {
                  fs.mkdirSync(dir, { recursive: true });
                }
                entry.pipe(fs.createWriteStream(entryPath));
              } catch (err) {
                console.error(`创建目录失败 ${dir}:`, err.message);
                reject(err);
              }
            }
          } else {
            entry.autodrain();
          }
        })
        .on('close', resolve)
        .on('error', (err) => {
          console.error('解压过程中发生错误:', err.message);
          reject(err);
        });
    });
  } else {
    // 解压整个 zip
    return new Promise((resolve, reject) => {
      fs.createReadStream(zipPath)
        .pipe(unzipper.Extract({ path: extractPath }))
        .on('close', resolve)
        .on('error', reject);
    });
  }
}

/**
 * 替换文件中的占位符
 * @param {string} filePath - 文件路径
 * @param {object} replacements - 要替换的值
 */
function applyReplacements(filePath, replacements) {
  try {
    let content = fs.readFileSync(filePath, 'utf8'); // 以 utf8 编码读取文件
    const newContent = renderTemplate(content, replacements); // 使用替换值渲染新内容
    fs.writeFileSync(filePath, newContent, 'utf8'); // 写入新内容
    console.log(`文件 ${filePath} 替换成功`);
  } catch (error) {
    console.error(`处理文件 ${filePath} 时出错:`, error);
  }
}

/**
 * 递归遍历目录，处理所有文件
 * @param {string} dirPath - 目录路径
 * @param {object} replacements - 要替换的值
 */
async function traverseDirectory(dirPath, replacements) {
  const files = await fsPromises.readdir(dirPath); // 使用 Promise API 读取目录
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    if ((await fsPromises.stat(filePath)).isDirectory()) {
      await traverseDirectory(filePath, replacements); // 递归调用
    } else {
      applyReplacements(filePath, replacements); // 处理文件
    }
  }
}

/**
 * 提示用户输入以填充模板中的占位符
 * @param {Array<string>} questions - 要收集的键名数组
 */
function promptUserInputs(questions) {
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
 * 主函数，用于下载和替换模板
 * @param {string} zipUrl - ZIP 文件 URL
 * @param {string} downloadPath - 下载目录路径
 * @param {Array<string>} options - 要收集的替换项
 * @param {string} name - 模板名称
 */
async function downloadTpl(zipUrl, downloadPath, options, name) {
  let zipFilePath;

  try {
    const answers = await promptUserInputs(options);
    if (!answers.PageCode) {
      console.error('请提供 PageCode');
      return;
    }

    downloadPath = downloadPath || `./${answers.PageCode}`;
    const dest = path.resolve(
      downloadPath?.includes(answers.PageCode) ? downloadPath : path.join(downloadPath, answers.PageCode)
    );
    zipFilePath = path.join(dest, `template-${Date.now()}.zip`);

    await fsPromises.mkdir(dest, { recursive: true }); // 使用 Promise API 创建目录

    await downloadFile(zipUrl, zipFilePath);
    console.log(`模板已下载到 ${zipFilePath}`);

    await unzipFile(zipFilePath, dest, name);
    console.log('模板解压完成');

    await traverseDirectory(dest, answers); // 递归遍历目录
    console.log('模板替换已完成');
  } catch (error) {
    console.error('操作失败:', error);
  } finally {
    if (zipFilePath && (await fsPromises.stat(zipFilePath).catch(() => false))) {
      await fsPromises.unlink(zipFilePath); // 使用 Promise API 清理 ZIP 文件
    }
  }
}

module.exports = { downloadTpl, unzipFile };

// 调用示例
// downloadTpl('http://cdn.biugle.cn/umi_page.zip', '', ['PageCode', 'Author']);
