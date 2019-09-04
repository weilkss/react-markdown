# xwb-react-markdown

#### react 集合 Markdown 编辑器

```shell
npm install xwb-react-markdown -save
```

### example

-   网页演示 [xwb-react-markdown](https://htmlpreview.github.io/?https://github.com/xwb007/xwb-react-markdown/example/index.html)

### git clone

```shell
> git clone https://github.com/xwb007/xwb-react-markdown.git
> npm i
> npm run dev
```

### config

```js
// example
const config = {
    height: 500, // 默认高度
    uploadUrl: 'http://127.0.0.1:8081/api/upload/file' // 上传图片服务器地址
};

class Example extends React.Component {
    handleEditorChange = (html, text) => {
        console.log(html);
    };
    render() {
        return <Index config={config} handleEditorChange={this.handleEditorChange} />;
    }
}
```
