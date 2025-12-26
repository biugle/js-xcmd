### 定义模板内容

支持如下语法：
- 变量占位符：`[[[ key ]]]`，支持嵌套，如 `[[[ Config.PageTitle ]]]`
- 默认值：`[[[ key ?? 默认值 ]]]`
- 条件渲染：
  - 存在变量：`[[#key]] ... [[/key]]`
  - 不存在变量：`[[^key]] ... [[/key]]`
- 循环渲染：`[[*array $item $index]] ... [[/array]]`

### 示例模板：

```html
<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <title>[[[ Config.PageTitle ]]]-[[[ Config.TestEmpty ?? 1.0.0 ]]]</title>
</head>
<body>
  <h1>[[[SubTitle]]]</h1>
  <table border="1">
    <thead>
      <tr><th>标题</th><th>作者</th><th>发布日期</th></tr>
    </thead>
    <tbody>
      [[*articles $article $index]]
      <tr>
        <td>[[[article.title ?? 空白标题]]]</td>
        <td>[[[article.author.name ?? 未知作者]]]</td>
        <td>
          [[#article.date]]
          [[[article.date]]]
          [[/article.date]]
          [[^article.date]]
          日期未发布
          [[/article.date]]
        </td>
      </tr>
      [[/articles]]
    </tbody>
  </table>
  <footer>版权所有-[[[ Author ]]]</footer>
</body>
</html>
```

### 进阶用法

- 支持对象嵌套、数组循环、条件判断、默认值等复杂场景
- 可递归嵌套模板语法

### 注意事项
- 所有模板语法均为双中括号包裹，避免与常见模板引擎冲突
- 默认值语法 `??` 右侧不支持表达式，仅支持静态文本
- 循环、条件语法建议配合对象结构使用
