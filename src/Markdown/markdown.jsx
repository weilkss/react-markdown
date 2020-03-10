import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

import NavigationBar from '../components/NavigationBar'
import DropList from '../components/DropList'
import HeaderList from '../components/HeaderList'
import TableList from '../components/TableList'
import InputFile from '../components/InputFile'
import Icon from '../components/Icon'
import ToolBar from '../components/ToolBar'

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

import './index.less'

const _config = {
    theme: 'default',
    view: {
        menu: true,
        md: true,
        html: true
    },
    htmlClass: '',
    markdownClass: '',
    logger: {
        interval: 3000
    },
    synchScroll: true,
    imageUrl: '',
    imageAccept: '',
    linkUrl: '',
    table: {
        maxRow: 4,
        maxCol: 6
    }
}

const tool = {
    deepClone(obj) {
        if (!obj || typeof obj !== 'object') {
            return obj
        }
        let objArray = Array.isArray(obj) ? [] : {}
        if (obj && typeof obj === 'object') {
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    // 如果obj的属性是对象，递归操作
                    if (obj[key] && typeof obj[key] === 'object') {
                        objArray[key] = deepClone(obj[key])
                    } else {
                        objArray[key] = obj[key]
                    }
                }
            }
        }
        return objArray
    },
    isEmpty(obj) {
        // 判断字符是否为空的方法
        if (typeof obj === 'undefined' || obj === null || obj === '') {
            return true
        }
        return false
    },
    isRepeat(arr) {
        let hash = {}
        for (let i in arr) {
            if (hash[arr[i]]) {
                return true
            }
            hash[arr[i]] = true
        }
        return false
    },
    throttle(func, deltaX) {
        let lastCalledAt = new Date().getTime()
        return function () {
            if (new Date().getTime() - lastCalledAt >= deltaX) {
                func.apply(this, arguments)
                lastCalledAt = new Date().getTime()
            }
        }
    }
}


class Decorate {
    constructor(target) {
        this.target = target
    }
    name = 'selection decoration'
    target = ''
    type = ''
    option = {}
    result = ''
    getDecoratedText(type, option = {}) {
        this.type = type
        this.option = option
        return this.result = this.calcDecorateText(this.type, option)
    }
    calcDecorateText(type, option = {}) {
        switch (type) {
            case 'h1':
                return `\n# ${this.target} \n`
            case 'h2':
                return `\n## ${this.target} \n`
            case 'h3':
                return `\n### ${this.target} \n`
            case 'h4':
                return `\n#### ${this.target} \n`
            case 'h5':
                return `\n##### ${this.target} \n`
            case 'h6':
                return `\n###### ${this.target} \n`
            case 'bold':
                return `**${this.target}**`
            case 'italic':
                return `*${this.target}*`
            case 'underline':
                return `++${this.target}++`
            case 'strikethrough':
                return `~~${this.target}~~`
            case 'unorder':
                return `\n- ${this.target}\n`
            case 'order':
                return `\n1. ${this.target}\n`
            case 'quote':
                return `\n> ${this.target}\n`
            case 'hr':
                return `\n---\n`
            case 'inlinecode':
                return `\`${this.target}\``
            case 'code':
                return `\n\`\`\`\n${this.target}\n\`\`\`\n`
            case 'table':
                // return `\n| ${this.target} |  |\n| -- | -- |\n|  |  |\n`
                return this.formatTableText(this.target, option)
            case 'image':
                return `![${this.target}](${option.imageUrl || ''})`
            case 'link':
                return `[${this.target}](${option.linkUrl || ''})`
            default:
                return `${this.target}`
        }
    }
    formatTableText(target, option) {
        const { row = 2, col = 2 } = option
        let rowHeader = ['|']
        let rowData = ['|']
        let rowDivision = ['|']
        let colStr = ''
        let result = ''
        for (let i = 0; i <= col; i++) {
            rowHeader.push(` head ${i + 1} | `)
            rowDivision.push(' --- |')
            rowData.push(' text |')
        }
        for (let j = 0; j <= row; j++) {
            colStr = colStr + '\n' + rowData.join('')
        }
        result = '\n' + rowHeader.join('') + '\n' + rowDivision.join('') + colStr + '\n'
        return result
    }
}


class Logger {

    name = 'logger'

    record = []

    recycle = []

    pushRecord(val) {
        return this.record.push(val)
    }

    getRecord() {
        return this.record
    }

    getLastRecord() {
        const length = this.record.length
        return this.record[length - 1]
    }

    undo(cb) {
        const lastRecord = this.record.pop()
        this.recycle.push(lastRecord)
        typeof cb === 'function' && cb(this.getLastRecord())
    }

    redo(cb) {
        if (this.recycle.length > 0) {
            const history = this.recycle.pop()
            this.record.push(history)
            typeof cb === 'function' && cb(this.getLastRecord())
        }
    }

    cleanRedoList(cb) {
        this.recycle = []
        typeof cb === 'function' && cb()
    }
}

class HtmlRender extends React.Component {
    render() {
        return (
            <div dangerouslySetInnerHTML={{ __html: this.props.html }} className={`custom-html-style ${this.props.className || ""}`} />
        )
    }
}

class HtmlCode extends React.Component {
    render() {
        return (
            <textarea className={`html-code ${this.props.className || ""}`} value={this.props.html} onChange={() => { }}></textarea>
        )
    }
}

class MdEditor extends React.Component {

    config = {}

    logger = {}

    loggerTimerId = null

    mdjs = null

    nodeMdText = null

    nodeMdPreview = null

    nodeMdPreviewWraper = null

    uinput = null

    inputFile = null

    scale = 0

    willScrollEle = '' // 即将滚动的元素 md html

    hasContentChanged = true

    initialSelection = {
        isSelected: false,
        start: 0,
        end: 0,
        text: ''
    }

    selection = { ...this.initialSelection }

    constructor(props) {
        super(props)
        this.config = this.initConfig()

        this.state = {
            text: (this.formatString(this.props.value) || '').replace(/↵/g, '\n'),
            html: '',
            view: this.config.view,
            htmlType: 'render', // 'render' 'source'
            dropButton: {
                header: false,
                table: false
            },
            fullScreen: false,
            table: this.config.table
        }
        this.handleChange = this._handleChange.bind(this)
        this.handleInputSelect = this._handleInputSelect.bind(this)
        this.handleImageUpload = this._handleImageUpload.bind(this)
        this.handleEmpty = this._handleEmpty.bind(this)
        this.handleUndo = this._handleUndo.bind(this)
        this.handleRedo = this._handleRedo.bind(this)
        this.handleToggleFullScreen = this._handleToggleFullScreen.bind(this)
        this.handleToggleMenu = this._handleToggleMenu.bind(this)
        this.handleToggleView = this._handleToggleView.bind(this)
        this.handleMdPreview = this._handleMdPreview.bind(this)
        this.handleHtmlPreview = this._handleHtmlPreview.bind(this)
        this.handleToggleHtmlType = this._handleToggleHtmlType.bind(this)
        this.handleonKeyDown = this._handleonKeyDown.bind(this)

        this.handleInputScroll = tool.throttle((e) => {
            const { synchScroll } = this.config
            if (!synchScroll) {
                return
            }
            e.persist()
            if (this.willScrollEle === 'md') {
                this.hasContentChanged && this._setScrollValue()
                if (this.nodeMdPreviewWraper && this.nodeMdText) {
                    this.nodeMdPreviewWraper.scrollTop = this.nodeMdText.scrollTop / this.scale
                }
            }
        }, 1000 / 60)
        this.handlePreviewScroll = tool.throttle((e) => {
            const { synchScroll } = this.config
            if (!synchScroll) {
                return
            }
            e.persist()
            if (this.willScrollEle === 'html') {
                this.hasContentChanged && this._setScrollValue()
                if (this.nodeMdText && this.nodeMdPreviewWraper)
                    this.nodeMdText.scrollTop = this.nodeMdPreviewWraper.scrollTop * this.scale
            }
        }, 1000 / 60)
    }

    componentDidMount() {
        if(this.props.config.value){
            this._setMdText(this.props.config.value )
        }
        this.renderHTML(this.props.config.value || "")
            .then(html => {
                this.setState({
                    html: html
                })
            })
        this.initLogger()
    }

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.value === this.props.value) {
    //         // console.log('value not change')
    //         return
    //     }
    //     let { value } = nextProps
    //     value = this.formatString(value)
    //     value = value && value.replace(/↵/g, '\n')
    //     this.renderHTML(value)
    //         .then(html => {
    //             this.setState({
    //                 text: value,
    //                 html: html
    //             })
    //         })
    // }

    componentWillUnmount() {
        this.endLogger()
    }

    formatString(value) {
        if (typeof this.props.value !== 'string') {
            console && console.error && console.error('The type of "value" must be String!')
            return new String(value).toString()
        }
        return value
    }

    initConfig() {
        return { ..._config, ...this.props.config }
    }

    initLogger() {
        this.logger = new Logger()
        this.startLogger()
        this.logger.pushRecord(this.state.text)
    }

    startLogger() {
        if (!this.loggerTimerId) {
            this.loggerTimerId = setInterval(() => {
                const { text } = this.state
                if (this.logger.getLastRecord() !== text) {
                    this.logger.pushRecord(text)
                }
            }, this.config.logger.interval)
        }
        // 清空redo历史
        this.logger.cleanRedoList()
    }

    endLogger() {
        if (this.loggerTimerId) {
            clearInterval(this.loggerTimerId)
            this.loggerTimerId = null
        }
    }

    handleGetLogger() {
        console.log('handleGetLogger', this.logger)
    }

    _handleUndo() {
        this.logger.undo((last) => {
            this.endLogger()
            this._setMdText(last)
        })
    }

    _handleRedo() {
        this.logger.redo((last) => {
            this._setMdText(last)
        })
    }

    handleDecorate(type, option = {}) {
        const clearList = [
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'unorder',
            'order',
            'quote',
            'hr',
            'inlinecode',
            'code',
            'table',
            'image',
            'link'
        ]
        if (clearList.indexOf(type) > -1) {
            if (!this.selection.isSelected) {
                return
            }
            const content = this._getDecoratedText(type, option)
            this._setMdText(content)
            this._clearSelection()
        } else {
            const content = this._getDecoratedText(type, option)
            this._setMdText(content)
        }
    }

    _getDecoratedText(type, option) {
        const { text = '' } = this.state
        const { selection } = this
        const beforeContent = text.slice(0, selection.start)
        const afterContent = text.slice(selection.end, text.length)
        const decorate = new Decorate(selection.text)
        let decoratedText = ''
        if (type === 'image') {
            decoratedText = decorate.getDecoratedText(type, {
                target: option.target || "",
                imageUrl: option.imageUrl || this.config.imageUrl
            })
        } else if (type === 'link') {
            decoratedText = decorate.getDecoratedText(type, {
                linkUrl: this.config.linkUrl
            })
        } else {
            decoratedText = decorate.getDecoratedText(type, option)
        }
        const result = beforeContent + `${decoratedText}` + afterContent
        return result
    }

    renderHTML(markdownText) {
        if (!this.props.renderHTML) {
            console.error('renderHTML props must be required!')
            return
        }
        const res = this.props.renderHTML(markdownText)
        if (typeof res === "string") {
            return Promise.resolve(res)
        } else if (typeof res === "function") {
            return Promise.resolve(res())
        } else if (typeof res === 'object' && typeof res.then === 'function') {
            return res
        }
        return res
    }

    _handleToggleFullScreen() {
        this.setState({
            fullScreen: !this.state.fullScreen
        })
    }

    changeView(to) {
        const view = Object.assign({}, this.state.view, to)
        this.setState({
            view: view
        })
    }

    _handleToggleMenu() {
        this.changeView({
            'menu': !this.state.view.menu
        })
    }

    _handleToggleView(type) {
        if (type === 'md') {
            this.changeView({
                'md': false,
                'html': true
            })
        } else {
            this.changeView({
                'md': true,
                'html': false
            })
        }
    }

    _handleMdPreview() {
        this.changeView({
            'html': !this.state.view.html
        })
    }

    _handleHtmlPreview() {
        this.changeView({
            'md': !this.state.view.md
        })
    }

    _handleToggleHtmlType() {
        let { htmlType } = this.state
        if (htmlType === 'render') {
            htmlType = 'source'
        } else if (htmlType === 'source') {
            htmlType = 'render'
        }
        this.setState({
            htmlType: htmlType
        })
    }

    _handleEmpty() {
        if (window.confirm) {
            const result = window.confirm('Are you sure to empty markdown ?')
            if (result) {
                this.setState({
                    text: '',
                    html: ''
                })
            }
        }
    }

    _handleImageUpload() {
        const { onImageUpload } = this.props
        if (typeof onImageUpload === 'function') {
            this.inputFile && this.inputFile.click()
        } else {
            this.handleDecorate('image')
        }
    }

    onImageChanged(file) {
        const { onImageUpload } = this.props

        if (!this.props.config.uploadUrl) {
            let imgFile = new FileReader();
            imgFile.readAsDataURL(file);
            imgFile.onload =  (e) =>{
                this.handleDecorate('image', { target: file.name, imageUrl:e.currentTarget.result })
            }
        }

        onImageUpload(file, (imageUrl) => {
            this.handleDecorate('image', { target: file.name, imageUrl })
        })
    }

    _handleChange(e) {
        this.startLogger()
        const value = e.target.value
        if (!this.hasContentChanged) {
            this.hasContentChanged = true
        }
        this._setMdText(value)
    }

    _handleInputSelect(e) {
        e.persist()
        this.selection = Object.assign({}, this.selection, { isSelected: true }, this._getSelectionInfo(e))
    }

    handleScrollEle(node) {
        this.willScrollEle = node
    }

    _setScrollValue() {
        // 设置值，方便 scrollBy 操作
        const { nodeMdText = {}, nodeMdPreview = {}, nodeMdPreviewWraper = {} } = this
        this.scale = (nodeMdText.scrollHeight - nodeMdText.offsetHeight) / (nodeMdPreview.offsetHeight - nodeMdPreviewWraper.offsetHeight)
        this.hasContentChanged = false
    }

    _clearSelection() {
        this.selection = Object.assign({}, this.initialSelection)
    }

    _getSelectionInfo(e) {
        const source = e.srcElement || e.target
        const start = source.selectionStart
        const end = source.selectionEnd
        const text = (source.value || '').slice(start, end)
        const selection = { start, end, text }
        return selection
    }

    _setMdText(value = '') {
        const text = value.replace(/↵/g, '\n')
        this.setState({
            text: value
        })
        this.renderHTML(text)
            .then(html => {
                this.setState({
                    html
                })
                this.onEmit({
                    text,
                    html
                })
            })
    }

    _isKeyMatch(event, key, keyCode, withCtrl = false) {
        if (event.ctrlKey !== withCtrl) {
            return false
        }
        if (event.key) {
            return event.key === key
        } else {
            return event.keyCode === keyCode
        }
    }

    _handleonKeyDown(e) {
        if (this._isKeyMatch(e, 'z', 90, true)) {
            this._handleUndo()
            e.preventDefault()
        }
        if (this._isKeyMatch(e, 'y', 89, true)) {
            this._handleRedo()
            e.preventDefault()
        }
    }

    onEmit(output) {
        const { onChange } = this.props;
        onChange && onChange(output)
    }

    getMdValue() {
        return this.state.text
    }

    getHtmlValue() {
        return this.state.html
    }

    showDropList(type = 'header', flag) {
        const { dropButton } = this.state
        this.setState({
            dropButton: { ...dropButton, [type]: flag }
        })
    }
    render() {
        const { view, dropButton, fullScreen, table } = this.state
        const renderNavigation = () => {
            return view.menu &&
                <NavigationBar
                    left={
                        <div className="button-wrap">
                            <span className="xwb-button" title="header"
                                onMouseEnter={() => this.showDropList('header', true)}
                                onMouseLeave={() => this.showDropList('header', false)}
                            >
                                <Icon type="icon-header" />
                                <DropList
                                    show={dropButton.header}
                                    onClose={() => {
                                        this.showDropList('header', false)
                                    }}
                                    render={() => {
                                        return (
                                            <HeaderList onSelectHeader={(header) => {
                                                this.handleDecorate(header)
                                            }} />
                                        )
                                    }}
                                />
                            </span>
                            <span className="xwb-button" title="bold" onClick={() => this.handleDecorate('bold')}><Icon type="icon-bold" /></span>
                            <span className="xwb-button" title="italic" onClick={() => this.handleDecorate('italic')}><Icon type="icon-italic" /></span>
                            <span className="xwb-button" title="italic" onClick={() => this.handleDecorate('underline')}><Icon type="icon-underline" /></span>
                            <span className="xwb-button" title="strikethrough" onClick={() => this.handleDecorate('strikethrough')}><Icon type="icon-strikethrough" /></span>
                            <span className="xwb-button" title="unorder" onClick={() => this.handleDecorate('unorder')}><Icon type="icon-list-ul" /></span>
                            <span className="xwb-button" title="order" onClick={() => this.handleDecorate('order')}><Icon type="icon-list-ol" /></span>
                            <span className="xwb-button" title="quote" onClick={() => this.handleDecorate('quote')}><Icon type="icon-quote-left" /></span>
                            <span className="xwb-button" title="hr" onClick={() => this.handleDecorate('hr')}><Icon type="icon-window-minimize" /></span>
                            <span className="xwb-button" title="inline code" onClick={() => this.handleDecorate('inlinecode')}><Icon type="icon-embed" /></span>
                            <span className="xwb-button" title="code" onClick={() => this.handleDecorate('code')}><Icon type="icon-embed2" /></span>
                            <span className="xwb-button" title="table"
                                onMouseEnter={() => this.showDropList('table', true)}
                                onMouseLeave={() => this.showDropList('table', false)}
                            >
                                <Icon type="icon-table" />
                                <DropList
                                    show={dropButton.table}
                                    onClose={() => {
                                        this.showDropList('table', false)
                                    }}
                                    render={() => {
                                        return (
                                            <TableList maxRow={table.maxRow} maxCol={table.maxCol} onSetTable={(option) => {
                                                this.handleDecorate('table', option)
                                            }} />
                                        )
                                    }}
                                />
                            </span>
                            <span className="xwb-button" title="image" onClick={this.handleImageUpload} style={{ position: 'relative' }}>
                                <Icon type="icon-photo" />
                                <InputFile accept={this.config.imageAccept || ""} ref={(input) => { this.inputFile = input }} onChange={(e) => {
                                    e.persist()
                                    const file = e.target.files[0]
                                    this.onImageChanged(file)
                                    this.uinput = e.target
                                }} />
                            </span>
                            <span className="xwb-button" title="link" onClick={() => this.handleDecorate('link')}><Icon type="icon-link" /></span>

                            <span className="xwb-button" title="empty" onClick={this.handleEmpty}><Icon type="icon-trash" /></span>
                            <span className="xwb-button" title="undo" onClick={this.handleUndo}><Icon type="icon-reply" /></span>
                            <span className="xwb-button" title="redo" onClick={this.handleRedo}><Icon type="icon-share" /></span>
                        </div>
                    }
                    right={
                        <div className="button-wrap">
                            <span className="xwb-button" title="full screen" onClick={this.handleToggleFullScreen}>
                                {fullScreen ? <Icon type="icon-shrink" /> : <Icon type="icon-enlarge" />}
                            </span>
                        </div>
                    }
                />
        }
        const renderContent = () => {
            const { html, text, view, htmlType } = this.state
            const res = []
            if (view.md) {
                res.push(
                    <section className={'sec-md'} key="md">
                        <ToolBar>
                            <span className="xwb-button" title={view.menu ? 'hidden menu' : 'show menu'} onClick={this.handleToggleMenu}>
                                {view.menu ? <Icon type="icon-chevron-up" /> : <Icon type="icon-chevron-down" />}
                            </span>
                            <span className="xwb-button" title={view.html ? 'preview' : 'column'} onClick={this.handleMdPreview}>
                                {view.html ? <Icon type="icon-desktop" /> : <Icon type="icon-columns" />}
                            </span>
                            <span className="xwb-button" title={'toggle'} onClick={() => this.handleToggleView('md')}><Icon type="icon-refresh" /></span>
                        </ToolBar>
                        <textarea
                            id="textarea"
                            ref={node => this.nodeMdText = node}
                            value={text}
                            className={`input ${this.config.markdownClass || ""}`}
                            wrap="hard"
                            onChange={this.handleChange}
                            onSelect={this.handleInputSelect}
                            onScroll={this.handleInputScroll}
                            onMouseOver={() => this.handleScrollEle('md')}
                        />
                    </section>)
            }
            if (view.html) {
                res.push(
                    <section className={'sec-html'} key="html">
                        <ToolBar style={{ right: '20px' }}>
                            <span className="xwb-button" title={view.menu ? 'hidden menu' : 'show menu'} onClick={this.handleToggleMenu}>
                                {view.menu ? <Icon type="icon-chevron-up" />
                                    : <Icon type="icon-chevron-down" />
                                }
                            </span>
                            <span className="xwb-button" title={view.md ? 'preview' : 'column'} onClick={this.handleHtmlPreview}>
                                {view.md ? <Icon type="icon-desktop" />
                                    : <Icon type="icon-columns" />
                                }
                            </span>
                            <span className="xwb-button" title={'toggle'} onClick={() => this.handleToggleView('html')}><Icon type="icon-refresh" /></span>
                            <span className="xwb-button" title="HTML code" onClick={this.handleToggleHtmlType}>
                                {htmlType === 'render' ? <Icon type="icon-embed" />
                                    : <Icon type="icon-eye" />
                                }
                            </span>
                        </ToolBar>
                        {htmlType === 'render' ?
                            (<div className="html-wrap"
                                ref={node => this.nodeMdPreviewWraper = node}
                                onMouseOver={() => this.handleScrollEle('html')}
                                onScroll={this.handlePreviewScroll}>
                                <HtmlRender html={html} className={this.config.htmlClass} ref={node => this.nodeMdPreview = ReactDOM.findDOMNode(node)} />
                            </div>)
                            : (<div className={'html-code-wrap'}
                                ref={node => this.nodeMdPreviewWraper = ReactDOM.findDOMNode(node)}
                                onScroll={this.handlePreviewScroll}>
                                <HtmlCode html={html} className={this.config.htmlClass} ref={node => this.nodeMdPreview = ReactDOM.findDOMNode(node)} />
                            </div>)
                        }
                    </section>
                )
            }
            return res
        }
        return (
            <div
                className={`rc-md-editor ${fullScreen ? 'full' : ''}`}
                style={this.props.style} onKeyDown={this.handleonKeyDown}
            >
                {renderNavigation()}
                <div className="editor-container">
                    {renderContent()}
                </div>
            </div>
        )
    }
}
MdEditor.HtmlRender = HtmlRender

class ReactMarkdown extends React.Component {
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
        if (!this.props.config.uploadUrl) {
            return;
        }
        let formData = new FormData()

        if(this.props.config.token){
            let fileType = "";
            if (file.type === "image/png") {
              fileType = "png";
            } else {
              fileType = "jpg";
            }
            formData.append('token', this.props.config.token);
            formData.append("key", file.name);
        }
        formData.append('file', file)
        axios.post(this.props.config.uploadUrl, formData, { 'Content-Type': 'multipart/form-data' }).then(res => {
            let imgUrl = '';
            if(this.props.config.domian){
                imgUrl = this.props.config.domian + res.data.key
            }else{
                imgUrl = res.data.url
            }
            callback(imgUrl)
            this.setState({
                uploadImg: imgUrl
            })
        })
    }
    render() {
        return <div className="demo-wrap">
            <div className="editor-wrap">
                <MdEditor
                    ref={node => this.mdEditor = node}
                    value=''
                    style={{ height: (this.props.config.height) + 'px', width: '100%' }}
                    renderHTML={text => this.mdParser.render(text)}
                    onChange={this.handleEditorChange}
                    onImageUpload={this.handleImageUpload}
                    config={{
                        ...this.props.config,
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

ReactMarkdown.defaultProps = {
    config: {
        height: 300,
        uploadUrl: '',
        token: '',
        domian: '',
        value: ''
    }
}

export default ReactMarkdown