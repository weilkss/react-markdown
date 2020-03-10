# xwb-react-markdown

#### react 集合 Markdown 编辑器

- 一款轻量的基于 React 的 Markdown 编辑器, 压缩后代码只有 72KB
- 支持 TypeScript
- 支持自定义 Markdown 解析器
- 界面可配置, 如只显示编辑区或预览区
- 支持常用的 markdown 编辑功能，如加粗，斜体等等...
- 支持图片上传(自定义服务器地址，基于 axios)
- 支持七牛云图片上传，文件直传，暂时不支持断点续传
- 支持编辑区和预览区同步滚动

### Install

```shell
npm install xwb-react-markdown --save
```

### show-how

- 网页演示 [xwb-react-markdown](https://htmlpreview.github.io/?https://github.com/xwb007/xwb-react-markdown/blob/master/example/index.html)

### git clone

```shell
> git clone https://github.com/xwb007/xwb-react-markdown.git
> npm install
> npm run dev
```

### config

| attribute | value              | type   |
| --------- | ------------------ | ------ |
| value    | 默认值 default null | string |
| height    | height default 300 | number |
| domian    | 七牛云的资源域名 default null  | string |
| token     | 七牛云 token default null      | string |
| uploadUrl | uploadUrl default null       | string |

### example

```js
// example
class Example extends React.Component {
  handleEditorChange = (html, text) => {
    console.log(html);
  };
  render() {
    return <ReactMarkdown handleEditorChange={this.handleEditorChange} />;
  }
}
```

```js
// attr example
// 当上传地址为空时，默认则时把图片转成base64
// 如果使用七牛云上传 则需要自己去获取token 且token和domian不能为空
// domian为你七牛云的资源域名
const config = {
    value:'',
    height: 300,
    domian: "",
    token: "",
    uploadUrl: 'http://0.0.0.0/upload' // 你自己的服务器地址
}
render() {
    return <ReactMarkdown config={config} handleEditorChange={this.handleEditorChange} />;
}
```
