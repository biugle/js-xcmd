const fs = require('fs');
const path = require('path');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const fsPromises = fs.promises;
const util = require('util');
const { exec } = require('child_process');
const execPromise = util.promisify(exec);

/**
 * 提取指定函数调用中的字符串参数
 * @param {string} targetPath - 文件或目录路径
 * @param {string[]} functionNames - 函数名称列表
 * @returns {string[]} 提取出的参数集合
 */
function extractParamsFromFiles(targetPath, functionNames = ['t', '$t']) {
  console.log('Reading', targetPath);
  try {
    const params = new Set();

    /**
     * 提取字符串参数（包括模板字符串）
     * @param {object} arg - AST节点参数
     */
    function extractStringArg(arg) {
      if (arg.type === 'StringLiteral') {
        params.add(arg.value);
      } else if (arg.type === 'TemplateLiteral') {
        arg.quasis.forEach((quasi) => params.add(quasi.value.raw));
      }
    }

    /**
     * 解析文件内容并提取函数调用中的参数
     * @param {string} filePath - 文件路径
     */
    function parseFile(filePath) {
      const code = fs.readFileSync(filePath, 'utf-8');
      const ast = parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript', 'decorators'],
        errorRecovery: true // 错误恢复模式 尽可能解析文件
      });

      traverse(ast, {
        CallExpression({ node }) {
          const { callee, arguments: args } = node;
          const isTargetFunction =
            (callee.type === 'Identifier' && functionNames.includes(callee.name)) ||
            (callee.type === 'MemberExpression' && functionNames.includes(callee.property.name));

          if (isTargetFunction && args.length) {
            const arg = args[0];
            if (['StringLiteral', 'TemplateLiteral', 'ConditionalExpression'].includes(arg.type)) {
              arg.type === 'ConditionalExpression'
                ? [arg.consequent, arg.alternate].forEach(extractStringArg)
                : extractStringArg(arg);
            }
          }
        }
      });
    }

    /**
     * 递归解析目录或文件
     * @param {string} target - 目标路径
     */
    function parseDirectoryOrFile(target) {
      const stats = fs.statSync(target);
      if (stats.isDirectory()) {
        fs.readdirSync(target).forEach((file) => parseDirectoryOrFile(path.join(target, file)));
      } else if (stats.isFile() && /\.(js|ts|tsx|jsx)$/.test(target)) {
        parseFile(target);
      }
    }

    parseDirectoryOrFile(targetPath);
    return [...params].filter(Boolean);
  } catch (e) {
    console.error('Error occurred:', e);
    return null;
  }
}

/**
 * 过滤暂存区的文件，获取需要的文件。
 * @param {*} diffOutput
 * @param {*} dir
 * @returns
 */
async function filterGitFiles(diffOutput, dir) {
  const files = [];
  const lines = diffOutput.split('\n').filter((file) => file && /\.(js|ts|tsx|jsx)$/.test(file));

  for (const file of lines) {
    const filePath = path.resolve(dir, file);
    try {
      const stats = await fsPromises.stat(filePath);
      if (stats.isFile() && /\.(js|ts|tsx|jsx)$/.test(file)) {
        const changedLines = await getChangedLines(filePath, dir);
        files.push({ path: filePath, changedLines });
      }
    } catch (err) {
      console.error(`无法访问文件 ${filePath}: ${err.message}`);
    }
  }

  return files;
}

/**
 * 获取文件的改动行号
 * @param {*} filePath
 * @param {*} dir
 * @returns
 */
async function getChangedLines(filePath, dir) {
  try {
    const relativePath = path.relative(dir, filePath);
    const { stdout } = await execPromise(`git diff --cached -- ${relativePath}`, { cwd: dir });
    const changedLines = new Set();
    let currentLine = 0;
    let inHunk = false;

    stdout.split('\n').forEach((line) => {
      if (line.startsWith('@@')) {
        const match = line.match(/@@ -\d+,\d+ \+(\d+),\d+ @@/);
        if (match) {
          currentLine = parseInt(match[1], 10);
          inHunk = true;
        }
      } else if (inHunk) {
        if (line.startsWith('+') && !line.startsWith('+++')) {
          changedLines.add(currentLine);
          currentLine++;
        } else if (line.startsWith(' ') || (line.startsWith('-') && !line.startsWith('---'))) {
          currentLine++;
        }
      }
    });

    // 调试：打印提取的行号和 diff 输出
    // console.log(`文件 ${filePath} 的改动行号:`, changedLines);
    return changedLines;
  } catch (err) {
    console.error(`无法获取 ${filePath} 的改动行: ${err.message}`);
    return new Set();
  }
}

/**
 * 解析文件内容并提取 t、$t 或 .t、.$t 函数调用中的参数
 * @param {string} filePath - 文件路径
 * @param {Set<number>} changedLines - 改动行号集合
 * @returns {Array<{param: string, file: string, line: number}>} 提取的参数
 */
async function parseGitFile(filePath, changedLines, functionNames = ['t', '$t']) {
  try {
    const code = await fsPromises.readFile(filePath, 'utf-8');
    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript', 'decorators-legacy'],
      sourceFilename: filePath,
      errorRecovery: true // 错误恢复模式 尽可能解析文件
    });

    const results = []; // 用于存储最终提取的字符串参数

    // 扩展改动行号范围，前后各加 5 行
    const expandedLines = new Set();
    changedLines.forEach((line) => {
      for (let i = Math.max(1, line - 5); i <= line + 5; i++) {
        expandedLines.add(i);
      }
    });

    function extractStringArg(arg) {
      if (arg.type === 'StringLiteral') {
        results.push(arg.value);
      } else if (arg.type === 'TemplateLiteral' && arg.quasis.length === 1) {
        results.push(arg.quasis[0].value.cooked);
      }
    }

    traverse(ast, {
      CallExpression({ node }) {
        const { callee, arguments: args } = node;
        const isTargetFunction =
          (callee.type === 'Identifier' && functionNames.includes(callee.name)) ||
          (callee.type === 'MemberExpression' &&
            callee.property.type === 'Identifier' &&
            functionNames.includes(callee.property.name));

        if (isTargetFunction && args.length && expandedLines.has(node.loc.start.line)) {
          const arg = args[0];
          // console.log({ arg });
          if (['StringLiteral', 'TemplateLiteral', 'ConditionalExpression'].includes(arg.type)) {
            if (arg.type === 'ConditionalExpression') {
              [arg.consequent, arg.alternate].forEach((item) => {
                if (['StringLiteral', 'TemplateLiteral'].includes(item.type)) {
                  extractStringArg(item);
                }
              });
            } else {
              extractStringArg(arg);
            }
          }
        }
      }
    });
    // console.log({ results });
    return results; // 直接返回提取的字符串参数数组
  } catch (err) {
    console.error(`解析文件 ${filePath} 失败: ${err.message}`);
    if (err.loc) {
      console.error(`错误位置: 行 ${err.loc.line}, 列 ${err.loc.column}`);
    }
    return [];
  }
}

module.exports = { extractParamsFromFiles, filterGitFiles, parseGitFile, getChangedLines };

// 示例用法
// const targetPath = process.argv[2];

// if (!targetPath) {
//   console.error('Please provide a target directory or file path');
//   process.exit(1);
// }

// const allParams = extractParamsFromFiles(targetPath);
// console.log('All params:', allParams, 'Total params count:', allParams.length);
