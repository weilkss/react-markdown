# xwb-react-markdown

#### react 集合 Markdown 编辑器

- 一款轻量的基于 React 的 Markdown 编辑器, 压缩后代码只有 72KB
- 支持 TypeScript
- 支持自定义 Markdown 解析器
- 界面可配置, 如只显示编辑区或预览区
- 支持常用的 markdown 编辑功能，如加粗，斜体等等...
- 支持图片上传(自定义服务器地址，基于 axios)
- 支持编辑区和预览区同步滚动

### Install

```shell
npm install xwb-react-markdown -save
```

### show-how

- 网页演示 [xwb-react-markdown](https://htmlpreview.github.io/?https://github.com/xwb007/xwb-react-markdown/blob/master/example/index.html)

### git clone

```shell
> git clone https://github.com/xwb007/xwb-react-markdown.git
> npm i
> npm run dev
```

### config

| attribute | value              | type   |
| --------- | ------------------ | ------ |
| height    | height default 500 | number |
| uploadUrl | uploadUrl          | string |

### example

```js
// example
class Example extends React.Component {
  handleEditorChange = (html, text) => {
    console.log(html);
  };
  render() {
    return <Index handleEditorChange={this.handleEditorChange} />;
  }
}
```

```js
// attr example
const config = {
    height:600,
    uploadUrl:'http://0.0.0.0/upload'
}
render() {
    return <Index config={config} handleEditorChange={this.handleEditorChange} />;
}
```
