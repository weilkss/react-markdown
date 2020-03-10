import * as React from 'react';

declare namespace ReactMarkdownEditorLite {
	export interface MdEditorProps {
		config?: {
			height?: number;
			uploadUrl: string;
			domian: string;
			token: string;
		}
		handleEditorChange?: (data: {
			text: string;
			html: string;
		}) => void;
	}
	class MdEditor extends React.Component<MdEditorProps, any> {
	}
}

import MdEditor = ReactMarkdownEditorLite.MdEditor;

export default MdEditor;
