import React from 'react';
import ReactDOM from 'react-dom';
import ReactMarkdown from './Markdown/markdown.jsx'

class Example extends React.Component {
    handleEditorChange = (html, text) => {
        console.log(html)
    }
    render() {
        // 七牛云列子
       const config ={
            height:300,
            token:'aS1fve6zuRVODg89_JG1VMPxqIat8g3GnyeswzfB:dCe9Zj-F4dzuZD3ehEtw7bc1Eao=:eyJzY29wZSI6Inh3YjAwNyIsImRlYWRsaW5lIjoxNTg0NjczNTAwfQ==',
            domian:'http://q6x8pj73c.bkt.clouddn.com/',
            uploadUrl:'https://upload-z2.qiniup.com',
        }
        return <ReactMarkdown config={config} handleEditorChange={this.handleEditorChange} />
    }
}

ReactDOM.render(
    <Example />,
    document.getElementById('root')
)