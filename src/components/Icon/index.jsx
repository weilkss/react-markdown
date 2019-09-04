// Icon
import React from 'react'
import './font.less'

class Icon extends React.Component {
	render() {
		return (
			<span className={'rmel-' + this.props.type} ></span>
		)
	}
}
export default Icon