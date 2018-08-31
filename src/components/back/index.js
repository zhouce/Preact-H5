import { h, Component } from 'preact';
import history from 'utils/history';
import style from './style.scss';
import backW from './img/back-w.png';
import backB from './img/back-b.png';

export default class Back extends Component {
	backClick = () => {
		history.go(-1);
	};

	render(props) {
		const {isShow, boxStyle, isBlack} = props;
		return isShow ? (
			<div class={`po-ab no-highlight ${style.back_box} ${boxStyle ? boxStyle : style.back_box_default}`} onTouchEnd={this.backClick}>
				<img class={`${style.back_img}`} src={isBlack ? backB : backW}/>
			</div>
		) : null;
	}
}
