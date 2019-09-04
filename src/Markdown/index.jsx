import React from 'react';
import axios from 'axios'
import MdEditor from './markdown';
import MarkdownIt from 'markdown-it';
import emoji from 'markdown-it-emoji'
import subscript from 'markdown-it-sub'
import superscript from 'markdown-it-sup'
import footnote from 'markdown-it-footnote'
import deflist from 'markdown-it-deflist'
import abbreviation from 'markdown-it-abbr'
import insert from 'markdown-it-ins'
import mark from 'markdown-it-mark'
import tasklists from 'markdown-it-task-lists'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-light.css'

export default class ReactMarkdown extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            uploadImg: ""
        }
        this.mdParser = new MarkdownIt({
            html: true,
            linkify: true,
            typographer: true,
            highlight: function (str, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(lang, str).value
                    } catch (__) { }
                }
                return ''
            }
        })
            .use(emoji)
            .use(subscript)
            .use(superscript)
            .use(footnote)
            .use(deflist)
            .use(abbreviation)
            .use(insert)
            .use(mark)
            .use(tasklists, { enabled: this.taskLists })
    }
    handleEditorChange = ({ html, text }) => this.props.handleEditorChange && this.props.handleEditorChange(html, text)
    handleImageUpload = (file, callback) => {
        const formData = new FormData()
        formData.append('file', file)
        axios.post(this.props.config.uploadUrl, formData, { 'Content-Type': 'multipart/form-data' }).then(res => {
            callback(res.data.data)
            this.setState({
                uploadImg: res.data.data
            })
        })
    }
    render() {
        return <div className="demo-wrap">
            <div className="editor-wrap" style={{ marginTop: '30px' }}>
                <MdEditor
                    ref={node => this.mdEditor = node}
                    value=''
                    style={{ height: (this.props.config.height || 500) + 'px', width: '100%' }}
                    renderHTML={text => this.mdParser.render(text)}
                    onChange={this.handleEditorChange}
                    onImageUpload={this.handleImageUpload}
                    config={{
                        view: {
                            menu: true,
                            md: true,
                            html: true
                        },
                        table: {
                            maxRow: 5,
                            maxCol: 6
                        },
                        imageUrl: this.state.uploadImg,
                    }}
                />
            </div>
        </div>
    }
}