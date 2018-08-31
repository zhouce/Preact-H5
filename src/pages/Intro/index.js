import { h, Component } from 'preact';
import {observer} from 'mobx-preact';
import style from './style.scss';

import rule1 from './img/rule1.png';
// import rule2 from './img/rule2.png';
// import rule3 from './img/rule3.png';
// import rule4 from './img/rule4.png';
import faq from './img/faq.png';

@observer
export default class Intro extends Component {
	render() {
		return (
			<div class={`full scroll-list`}>
				<div class={`fs18 text-center ${style.page_title}`}>
					规则说明
				</div>
				<div class={style.rule_wrap}>
					<div class={`over-hidden ${style.rule_item}`}>
						<img class={`fl-lf ${style.rule_img}`} src={rule1}/>
						<div class={`fl-ri ${style.rule_box}`}>
							<div class={`text16 break-word fs16 ${style.rule_title}`}>some text</div>
							<div class={`fc4 break-word ${style.item_text}`} dangerouslySetInnerHTML={{__html: 'some text'}}></div>
						</div>
					</div>

				</div>
				<div class={style.intro_pad}>
					<div class={`fs18 text-center ${style.intro_title2}`}>
						常见问题
					</div>
				</div>
				<div class={style.faq_wrap}>
					<div class={`over-hidden ${style.faq_item}`}>
						<img class={`fl-lf ${style.faq_img}`} src={faq}/>
						<div class={`fl-ri ${style.faq_box}`}>
							<div class={`fs16 break-word ${style.faq_title}`}>什么是xxx？</div>
							<div class={`fc4 break-word ${style.item_text}`} dangerouslySetInnerHTML={{__html: 'xxx。'}}></div>
						</div>
					</div>
					<div class={`over-hidden ${style.faq_item}`}>
						<img class={`fl-lf ${style.faq_img}`} src={faq}/>
						<div class={`fl-ri ${style.faq_box}`}>
							<div class={`fs16 break-word ${style.faq_title}`}>用户每天有几次答题机会？</div>
							<div class={`fc4 break-word ${style.item_text}`} dangerouslySetInnerHTML={{__html: 'xx。'}}></div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
