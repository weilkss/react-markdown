import React from 'react';
import ReactDOM from 'react-dom';
import Index from './Markdown/markdown'

class Example extends React.Component {
    handleEditorChange = (html, text) => {
        console.log(html)
    }
    render() {
        return <Index handleEditorChange={this.handleEditorChange} />
    }
}

ReactDOM.render(
    <Example />,
    document.getElementById('root')
)