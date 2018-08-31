import {h, Component} from 'preact';
import {observer, inject} from 'mobx-preact';
import style from './style.scss';
import Popup from 'components/popup';
import history from 'utils/history';
import {trimBoth} from 'utils/Trim';
const wx = require('weixin-js-sdk');

import title from './img/title.png';
import ask from './img/ask.png';
import head from 'assets/images/head.png';
import sure from './img/sure.png';
import taskImg from './img/task.png';
import cat from './img/cat.png';

@inject((allStores) => ({
	user: allStores.user,
	home: allStores.home
}))
@observer
export default class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showInvitePopup: false,
			inviteError: null,
			showTaskPopup: false,
			showNoRankTip: false
		};
		this.firstX = 0;//记录touch起始位置
		this.firstY = 0;
	}

	pushTo = (e) => {
		const changedTouches = e.changedTouches[0];
		if (Math.abs(changedTouches.pageX - this.firstX) < 6 && Math.abs(changedTouches.pageY - this.firstY) < 6) {//认为是点击
			const {p, u} = this.props;
			if (p && u) {
				if (p !== 'mini' &&  typeof miaoKan !== 'undefined') {
					miaoKan.toAppWallet();
				} else {
					const url = e.currentTarget.dataset.url;
					history.push(url);
				}
			}
		}
		this.initFirstXY();
	};

	pushToRank = (e) => {
		const changedTouches = e.changedTouches[0];
		if (Math.abs(changedTouches.pageX - this.firstX) < 6 && Math.abs(changedTouches.pageY - this.firstY) < 6) {//认为是点击
			const {home, u} = this.props;
			if (u) {
				if (home.userInfo.isHaveRankingList) {//已开放榜单
					history.push('/rank');
				} else {
					this.setState({
						showNoRankTip: true
					});
				}
			}
		}
		this.initFirstXY();
	};

	toIntro = () => {
		history.push('/intro');
	};

	startAnswer = (e) => {//根据平台及当天次数、任务完成度做限制
		const changedTouches = e.changedTouches[0];
		if (Math.abs(changedTouches.pageX - this.firstX) < 6 && Math.abs(changedTouches.pageY - this.firstY) < 6) {//认为是点击
			const {home, p, u} = this.props;
			if (p && u) {
				const {answerNum, userInfo} = home;
				if (answerNum === 0) {
					history.push('/answer');
				} else if (answerNum === 1 && p !== 'mini') {//app端第二次
					if (userInfo.isCompleteTask) {//已完成全部任务
						history.push('/answer');
					} else {
						this.setState({
							showTaskPopup: true
						});
					}
				}
			}
		}
		this.initFirstXY();
	};

	closeInvitePopup = () => {
		this.setState({
			inviteError: null,
			showInvitePopup: false
		});
		this.codeInput.value = null;
	};

	closeTaskPopup = () => {
		this.setState({
			showTaskPopup: false
		});
	};

	closeNoRankTip = () => {
		this.setState({
			showNoRankTip: false
		});
	};

	shareClick = () => {
		const {p} = this.props;
		if (p !== 'mini' &&  typeof miaoKan !== 'undefined') {
			miaoKan.shareApp();
		} else if (p == 'mini') {
			wx.miniProgram.navigateTo({url: '/pages/invite/invite'})
		}
	};

	afterUseCode = (data) => {
		if (data.errorcode == '00000:ok') {
			const {home, u} = this.props;
			this.closeInvitePopup();
			home.getUserInfo(u);
		} else {
			this.setState({
				inviteError: data.message
			});
		}
	};

	useInviteCode = () => {
		const code = trimBoth(this.codeInput.value);
		if (code) {
			const {home, u} = this.props;
			home.postInviteCode(u, code, this.afterUseCode);
		} else {
			this.closeInvitePopup();
		}
	};

	clickCodeBtn = (e) => {
		const changedTouches = e.changedTouches[0];
		if (Math.abs(changedTouches.pageX - this.firstX) < 6 && Math.abs(changedTouches.pageY - this.firstY) < 6) {//认为是点击
			const {userInfo} = this.props.home;
			if (userInfo.isuseInvitationcode) {//已输入过邀请码
				this.shareClick();
			} else {
				this.setState({
					showInvitePopup: true
				});
			}
		}
		this.initFirstXY();
	};

	componentDidMount() {
		const {user, home, p, u} = this.props;
		if (p && u) {
			home.getAnswerNum(u);
			home.getUserInfo(u);
			user.setUserInfo(p, u);
		}
	}

	initFirstXY = () => {
		this.firstX = 0;
		this.firstY = 0;
	};

	touchStart = (e) => {
		const touch = e.touches[0];
		this.firstX = touch.pageX;
		this.firstY = touch.pageY;
	};

	render(props, state) {
		const {home, p} = props;
		const {userInfo, answerNum, taskList} = home;
		const {showInvitePopup, showTaskPopup, inviteError, showNoRankTip} = state;
		const canStart = answerNum === 0 || (answerNum === 1 && p !== 'mini');
		return (
			<div class='full common_bg'>
				<div class={`text-center ${style.title_box}`}>
					<img class={style.title} src={title}/>
				</div>
				<div class={`text-center fc1 ${style.title_tip}`}>答对1道题，可最高获得100元</div>
				<div class={`po-re text-center ${style.start_btn_box}`}>
					<div class={`no-highlight pointer i-blc fs20 text-over ${canStart ? style.start_btn : style.dis_start_btn} ${style.home_btn}`} onTouchStart={this.touchStart} onTouchEnd={this.startAnswer}>{canStart ? '开始答题' : '今日答题次数已用完'}</div>
					<div class={`no-highlight pointer po-ab clear ${style.rule_box}`} onTouchEnd={this.toIntro}>
						<div class='fl-ri fs12 fc1'>玩法了解</div>
						<img class={`fl-ri ${style.ask_img}`} src={ask}/>
					</div>
				</div>
				<div class={`pd-18`}>
					<div class={`text-center radius8 bc1 po-re ${style.content_box}`}>
						<img class={`po-ab ${style.avatar}`} src={userInfo.headImg ? userInfo.headImg : head}/>
						<div class={`border1 fs18 fc2 ${style.nickname}`}>{userInfo.nickName ? userInfo.nickName : null}</div>
						<div class='over-hidden border1 clear'>
							<div class={`no-highlight pointer fl-lf border2 ${style.info_box}`} onTouchStart={this.touchStart} onTouchEnd={this.pushTo} data-url="/wallet">
								<div class={`text16 fs16 fc3 ${style.info_title}`}>奖金余额</div>
								<div class='break-word fw fs20 fc2'>&yen;&nbsp;{userInfo.wallet}</div>
							</div>
							<div class={`no-highlight pointer fl-lf ${style.info_box} ${style.info_box2}`} onTouchStart={this.touchStart} onTouchEnd={this.pushToRank}>
								<div class={`text16 fs16 fc3 ${style.info_title}`}>排名</div>
								<div class='break-word fw fs20 fc2'>{userInfo.wallet > 0 && userInfo.ranking > 0 ? userInfo.ranking : '——'}</div>
							</div>
						</div>
						<div class={`border1 ${style.code_btn_box}`}>
							<div class={`no-highlight pointer i-blc bc2 align-top fc1 fs20 text-over ${style.code_btn} ${style.home_btn}`} onTouchStart={this.touchStart} onTouchEnd={this.clickCodeBtn}>
								{userInfo.isuseInvitationcode ? '分享给好友' : '填写邀请码'}
							</div>
						</div>
						<div class={`clear ${style.invite_box}`}>
							<div class={`fl-lf text16 fs16 fc3 ${style.invite_text}`}>复活卡</div>
							<div class={`fl-lf fs12 fc1 ${style.revive_card}`}>{userInfo.resurgencecard > 999 ? '999+' : userInfo.resurgencecard}</div>
							<div onTouchEnd={this.shareClick} class={`no-highlight pointer fl-ri fs12 ${style.invite_btn}`}>邀请好友获得复活卡</div>
						</div>
					</div>
				</div>

				<Popup isShow={showNoRankTip} maskClickHide={this.closeNoRankTip}
					   popupBoxStyle={`text-center popup-box ${style.no_rank_box}`}>
					<div class={`fc3 fs18 ${style.no_rank_title}`}>暂无用户上榜</div>
					<div class={`no-highlight pointer bc2 fc1 ${style.confirm_btn}`} onTouchEnd={this.closeNoRankTip}>确定</div>
				</Popup>
				<Popup isShow={showInvitePopup} maskClickHide={this.closeInvitePopup}
					   popupBoxStyle={`text-center popup-box ${style.invite_popup_box}`}>
					<div class={`fs18 fc5 ${style.invite_popup_title}`}>输入好友邀请码，各得一张复活卡</div>
					<div class={`i-blc ${style.invite_input_box}`}>
						<input ref={o => this.codeInput = o} class={`fs20 fl-lf ${style.invite_input}`} type="text" placeholder="填写邀请码"/>
						<img class={`no-highlight pointer fl-ri ${style.invite_sure_img}`} src={sure} onTouchEnd={this.useInviteCode}/>
					</div>
					<div class={`i-blc fs12 ${style.invite_error}`}>{inviteError}</div>
				</Popup>
				<Popup isShow={showTaskPopup} maskClickHide={this.closeTaskPopup}
					   popupBoxStyle={`popup-box ${style.task_popup_box}`}>
					<div class={style.task_pad}>
						<div class={`text-center ${style.task_popup_title}`}>
							<div class={`fs12 fc3`}>很抱歉，今日答题次数已用完</div>
							<img className={style.cat_img} src={cat}/>
							<div class={`fs18 fc5`}>完成今日任务获得额外机会</div>
						</div>
					</div>
					<div class={style.task_pad2}>
						{taskList && taskList.length ? taskList.map((task, i) => {
							return (
								<div key={task.taskName} class={i == taskList.length - 1 ? '' : style.mar_bot_20}>
									<img class={`align-mid ${style.task_img}`} src={taskImg}/>
									<div class={`align-mid fc4 i-blc break-word ${style.task_name}`}>{task.taskName}</div>
									<div class={`align-mid fc4 i-blc ${style.task_progress}`}>已完成&nbsp;&nbsp;<span class='fc6'>{`${task.completeNumber}/${task.totalNumber}`}</span>
									</div>
								</div>
							);
						}) : null}
					</div>
					<div class='text-center'>
						<div class={`no-highlight pointer bc2 align-top fs18 fc1 i-blc ${style.task_btn}`} onTouchEnd={this.closeTaskPopup}>确定</div>
					</div>
				</Popup>
			</div>
		);
	}
}
