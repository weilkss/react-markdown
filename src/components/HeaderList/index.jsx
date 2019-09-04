import React from 'react'
import './index.less'

class HeaderList extends React.Component {
	handleHeader(header) {
		const { onSelectHeader } = this.props
		typeof onSelectHeader === 'function' && onSelectHeader(header)
	}
	render() {
		const maps = [1, 2, 3, 4, 5, 6];
		return (
			<ul className="header-list">
				{
					maps.map(i => <li key={i} className="list-item"><h1 onClick={this.handleHeader.bind(this, 'h' + i)}>{"H" + i}</h1></li>)
				}
			</ul>
		)
	}
}
export default HeaderList