import { h, Component } from 'preact';
import {observer} from 'mobx-preact';
import style from './style.scss';

import rule1 from './img/rule1.png';
import rule2 from './img/rule2.png';
import rule3 from './img/rule3.png';
import rule4 from './img/rule4.png';
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
							<div class={`text16 break-word fs16 ${style.rule_title}`}>回答问题，要准要快</div>
							<div class={`fc4 break-word ${style.item_text}`} dangerouslySetInnerHTML={{__html: '点选你认为正确的答案，你必须在10s内审题和作答，选完不可修改。'}}></div>
						</div>
					</div>

					<div class={`over-hidden ${style.rule_item}`}>
						<img class={`fl-lf ${style.rule_img}`} src={rule2}/>
						<div class={`fl-ri ${style.rule_box}`}>
							<div class={`text16 break-word fs16 ${style.rule_title}`}>超时或答错，就会出局</div>
							<div class={`fc4 break-word ${style.item_text}`} dangerouslySetInnerHTML={{__html: '如果你点选了错误答案，或超时未作答，将被淘汰出局，将无法获得当期的奖金。'}}></div>
						</div>
					</div>
					<div class={`over-hidden ${style.rule_item}`}>
						<img class={`fl-lf ${style.rule_img}`} src={rule3}/>
						<div class={`fl-ri ${style.rule_box}`}>
							<div class={`text16 break-word fs16 ${style.rule_title}`}>答对，即冲顶成功</div>
							<div class={`fc4 break-word ${style.item_text}`} dangerouslySetInnerHTML={{__html: '答对1道题目，你将最高获得100元的现金奖励。'}}></div>
						</div>
					</div>
					<div class={`over-hidden ${style.rule_item}`}>
						<img class={`fl-lf ${style.rule_img}`} src={rule4}/>
						<div class={`fl-ri ${style.rule_box}`}>
							<div class={`text16 break-word fs16 ${style.rule_title}`}>提现到支付宝</div>
							<div class={`fc4 break-word ${style.item_text}`} dangerouslySetInnerHTML={{__html: '1个支付宝只能为1个账号提现，支付宝账号第1次为该账号成功提现，则自动绑定该账号。'}}></div>
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
							<div class={`fs16 break-word ${style.faq_title}`}>什么是《百万好莱坞》？</div>
							<div class={`fc4 break-word ${style.item_text}`} dangerouslySetInnerHTML={{__html: '百万好莱坞是一款益智类公平竞答游戏，你只需通过参与互动答题，挑战成功就可以赢走奖金。'}}></div>
						</div>
					</div>
					<div class={`over-hidden ${style.faq_item}`}>
						<img class={`fl-lf ${style.faq_img}`} src={faq}/>
						<div class={`fl-ri ${style.faq_box}`}>
							<div class={`fs16 break-word ${style.faq_title}`}>用户每天有几次答题机会？</div>
							<div class={`fc4 break-word ${style.item_text}`} dangerouslySetInnerHTML={{__html: '每个人在小程序端有1次参与机会，在喵看app客户端有2次机会。'}}></div>
						</div>
					</div>
					<div class={`over-hidden ${style.faq_item}`}>
						<img class={`fl-lf ${style.faq_img}`} src={faq}/>
						<div class={`fl-ri ${style.faq_box}`}>
							<div class={`fs16 break-word ${style.faq_title}`}>奖金是真的钱吗？</div>
							<div class={`fc4 break-word ${style.item_text}`} dangerouslySetInnerHTML={{__html: '《百万好莱坞》提供的奖金是真实的人民币，且用户获得奖金后“提现”到支付宝，不会扣取手续费。'}}></div>
						</div>
					</div>
					<div class={`over-hidden ${style.faq_item}`}>
						<img class={`fl-lf ${style.faq_img}`} src={faq}/>
						<div class={`fl-ri ${style.faq_box}`}>
							<div class={`fs16 break-word ${style.faq_title}`}>Apple是《百万好莱坞》赞助商吗？</div>
							<div class={`fc4 break-word ${style.item_text}`} dangerouslySetInnerHTML={{__html: '本APP的所有活动，与设备生产商Apple无关。Apple不是《百万好莱坞》的赞助商。'}}></div>
						</div>
					</div>
					<div class={`over-hidden ${style.faq_item}`}>
						<img class={`fl-lf ${style.faq_img}`} src={faq}/>
						<div class={`fl-ri ${style.faq_box}`}>
							<div class={`fs16 break-word ${style.faq_title}`}>复活卡的使用规则是怎样的？</div>
							<div class={`fc4 break-word ${style.item_text}`} dangerouslySetInnerHTML={{__html: '你可以通过邀请好友参与答题来获取额外生命。<br>如果你回答错误，我们将消耗一个额外生命值，为你自动复活，每轮只能复活一次。'}}></div>
						</div>
					</div>
					<div class={`over-hidden ${style.faq_item}`}>
						<img class={`fl-lf ${style.faq_img}`} src={faq}/>
						<div class={`fl-ri ${style.faq_box}`}>
							<div class={`fs16 break-word ${style.faq_title}`}>如果题目正确答案出现有误，处理原则是怎么样的？</div>
							<div class={`fc4 break-word ${style.item_text}`} dangerouslySetInnerHTML={{__html: '我们对影响的用户表示遗憾，不过我们不会对用户进行经济补偿，因为用户自身财产并没有损失。我们希望用户能将重点聚焦在知识本身，而不是奖金。'}}></div>
						</div>
					</div>
					<div class={`over-hidden ${style.faq_item}`}>
						<img class={`fl-lf ${style.faq_img}`} src={faq}/>
						<div class={`fl-ri ${style.faq_box}`}>
							<div class={`fs16 break-word ${style.faq_title}`}>提现需多久才能到账？</div>
							<div class={`fc4 break-word ${style.item_text}`} dangerouslySetInnerHTML={{__html: '通常情况下，在你提交申请后的7个工作日到账，双休日、法定节假日顺延处理。有违竞答题公平原则的提现会触发账号封锁。'}}></div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
