import React from 'react';
import ReactDOM from 'react-dom';
import Index from './Markdown/index'

// example
const config = {
    height: 500,                                                // 默认高度
    uploadUrl: 'http://127.0.0.1:8081/api/upload/file'          // 上传图片服务器地址
}

class Example extends React.Component {
    handleEditorChange = (html, text) => {
        console.log(html)
    }
    render() {
        return <Index config={config} handleEditorChange={this.handleEditorChange} />
    }
}

ReactDOM.render(
    <Example />,
    document.getElementById('root')
)