const fs = require('fs');
const path = require('path');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;

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
      const ast = parse(code, { sourceType: 'module', plugins: ['jsx', 'typescript', 'decorators'] });

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
module.exports = { extractParamsFromFiles };

// 示例用法
// const targetPath = process.argv[2];

// if (!targetPath) {
//   console.error('Please provide a target directory or file path');
//   process.exit(1);
// }

// const allParams = extractParamsFromFiles(targetPath);
// console.log('All params:', allParams, 'Total params count:', allParams.length);
