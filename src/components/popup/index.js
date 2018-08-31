import { h, Component } from 'preact';
import style from './style.scss';

export default class Popup extends Component {
	maskClick = () => {
		if (this.props.maskClickHide) {
			this.props.maskClickHide();
		}
	};

	stopBubble = (e) => {
		if (e && e.stopPropagation) {
			e.stopPropagation();
		} else {
			window.event.cancelBubble = true;
		}
	};

	render(props) {
		const {isShow, popupBoxStyle, children} = props;
		return isShow ? (
			<div class={`no-highlight ${style.popup_wrap}`} onTouchEnd={this.maskClick}>
				<div class={`no-highlight ${popupBoxStyle}`} onTouchEnd={this.stopBubble}>
					{children}
				</div>
			</div>
		) : null;
	}
}
