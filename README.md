# xwb-react-markdown

#### react 集合 Markdown 编辑器

```shell
npm install xwb-react-markdown -save
```

### show-how

-   网页演示 [xwb-react-markdown](https://htmlpreview.github.io/?https://github.com/xwb007/xwb-react-markdown/blob/master/example/index.html)

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


// attr example
render() {
    return <Index config={config} handleEditorChange={this.handleEditorChange} />;
}
```
