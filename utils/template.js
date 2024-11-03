/**
 * 使用自定义模板渲染字符串内容
 * 支持条件渲染、循环、嵌套变量、默认值以及简单占位符替换
 *
 * @param {string} content - 原始模板内容
 * @param {object} replacements - 要替换的值
 * @returns {string} - 渲染后的内容
 */
function renderTemplate(content, replacements) {
  replacements = replacements || {};
  if (!content) {
    return '';
  }

  // 内部路径解析函数
  const _resolvePath = (obj, path) => {
    return path.split('.').reduce((acc, part) => {
      if (acc && typeof acc === 'object' && part in acc) {
        return acc[part];
      }
      return undefined; // 如果路径不存在，返回 undefined
    }, obj);
  };

  // 内部方法：处理多余空行
  const _trimTpl = (str) => {
    // 用正则表达式将多个连续的空行替换为一个空行
    return str.replace(/(\n\s*\n)+/g, '\n\n'); // 将多个空行替换为一个空行
  };

  // 循环渲染 - [[*arrayVarKey $item $index]]
  content = content.replace(
    /\[\[\s*\*\s*([\w.]+)\s+(\$\w+)(?:\s+(\$\w+))?\s*\]\]([\s\S]*?)\[\[\s*\/\s*\1\s*\]\]/g,
    (match, arrayVarKey, itemVar, indexVar, innerContent) => {
      const array = _resolvePath(replacements, arrayVarKey);
      if (Array.isArray(array)) {
        return array
          .map((item, index) => {
            const context = { ...replacements, [itemVar.slice(1)]: item };
            if (indexVar) {
              context[indexVar.slice(1)] = index; // 传递索引
            }
            return renderTemplate(innerContent, context); // 递归渲染
          })
          .join(''); // 使用空字符串连接渲染结果
      }
      return ''; // 如果不是数组则返回空字符串
    }
  );

  // 存在变量的条件渲染 - [[#key]] ... [[/key]]
  content = content.replace(
    /\[\[\s*#\s*([\w.]+)\s*\]\]([\s\S]*?)\[\[\s*\/\s*\1\s*\]\]/g,
    (match, key, innerContent) => {
      return _resolvePath(replacements, key) ? innerContent : '';
    }
  );

  // 不存在变量的条件渲染 - [[^key]] ... [[/key]]
  content = content.replace(
    /\[\[\s*\^\s*([\w.]+)\s*\]\]([\s\S]*?)\[\[\s*\/\s*\1\s*\]\]/g,
    (match, key, innerContent) => {
      return !_resolvePath(replacements, key) ? innerContent : '';
    }
  );

  // 替换简单的占位符并支持默认值 - [[[key ?? defaultValue]]]
  content = content.replace(/\[\[\[\s*([\w.]+)\s*(?:\?\?\s*([^\]]+))?\s*\]\]\]/g, (match, path, defaultValue) => {
    const value = _resolvePath(replacements, path);
    return `${value !== undefined ? value : defaultValue || ''}`.trim(); // 使用 .trim() 去除前后空白
  });

  // 处理空行和首尾空白
  return _trimTpl(content);
}

const replacements = {
  Config: {
    PageTitle: 'Bex 的文章列表',
    SubTitle: '模板渲染测试',
    TestEmpty: undefined
  },
  Author: 'biugle',
  articles: [
    { title: '第一篇文章', author: { name: '张三' }, date: '2024-11-01' },
    { title: '第二篇文章', author: { name: '李四' }, date: undefined }, // 模拟未发布的日期
    { title: '第三篇文章', author: {}, date: '2024-11-02' }, // 作者信息缺失
    {} // 测试默认值与报错兼容
  ]
};
const htmlTemplate = `
<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[[[ Config.PageTitle ]]]-[[[ Config.TestEmpty ?? 1.0.0 ]]][[[ Config.TestEmpty.xxx ]]]</title>
</head>
<body>

<h1>[[[SubTitle]]]</h1>

<table border="1">
  <thead>
    <tr>
      <th>标题</th>
      <th>作者</th>
      <th>发布日期</th>
    </tr>
  </thead>
  <tbody>
    [[*articles $article $index]]
    <tr key="[[[index]]]">
      <td>
        [[[article.title  ??  空白标题]]]
      </td>
      <td>[[[ article.author.name ?? 未知作者 ]]]</td>
      <td>
        [[#article.date]]
        [[[ article.date ]]]
        [[/article.date]]
        [[^article.date]]
        日期未发布
        [[/article.date]]
      </td>
    </tr>
    [[/articles]]
  </tbody>
</table>

<footer>
  <p>版权所有-[[[ Author ]]]</p>
</footer>

</body>
</html>`;

// const renderedHtml = renderTemplate(htmlTemplate, replacements);
// console.log(renderedHtml);

module.exports = { renderTemplate };
