import {h, Component} from 'preact';
import {observer, inject} from 'mobx-preact';
import history from 'utils/history';
import style from './style.scss';
import Popup from 'components/popup';
const wx = require('weixin-js-sdk');

// import cStop from './img/click-stop.png';
// import cPlay from './img/click-play.png';
import fail from './img/fail.png';
import revive from './img/revive.png';
import win from './img/win.png';
import close from './img/close.png';
import wait from './img/wait.png';

/**
 * 保留的注释代码为自写视频控制组件,有可能改回先保留
 */

@inject((allStores) => ({
	user: allStores.user,
	home: allStores.home,
	answer: allStores.answer
}))
@observer
export default class Answer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			topicNowIndex: 0,//当前题目index
			// vDuration: '00:00',//视频总时间
			// vCurrent: '00:00',//当前播放时间
			// vBuffer: '0',//缓存进度
			// vPlayed: '0',//播放进度
			// isPlaying: false,//是否正在播放
			isEnd: false,//是否播放结束
			bonus: null,//获得的奖金
			isSuccessPop: false,//是否显示闯关成功popup
			answerTime: 10,//当前答题剩余时间
			selectAId: null,//当前选中的答案id
			isRevivePop: false,//当前选中的答案id
			isFailPop: false,//是否闯关失败popup
			reviveSuccess: false//最后一题是否通过复活卡成功
		};
		this.hasRevive = false;//本次答题是否已使用复活卡
		// this.buffered = 0;//记录上一次已缓存的时间
		this.lastTopicIndex = null;//记录上一次题目index
		this.isWeixin = navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger";
		this.firstX = 0;//记录touch起始位置
		this.firstY = 0;
	}

	playVideo = () => {
		if (typeof WeixinJSBridge !== "undefined") {
			WeixinJSBridge.invoke('getNetworkType', {},
				(e) => {
					WeixinJSBridge.log(e.err_msg);
					this.vPlayer.play();
				});
		} else {
			this.vPlayer.play();
		}
	};

	autoPlayVideo = () => {
		const {platform} = this.props.user;
		if (platform == 'mini' || this.isWeixin) {
			if (typeof WeixinJSBridge === "undefined") {
				if (document.addEventListener) {
					document.addEventListener('WeixinJSBridgeReady', this.playVideo, false);
				} else if (document.attachEvent) {
					document.attachEvent('WeixinJSBridgeReady', this.playVideo);
					document.attachEvent('onWeixinJSBridgeReady', this.playVideo);
				}
			} else {
				this.playVideo();
			}
		} else {
			this.vPlayer.play();
		}
	};

	componentDidMount() {
		const {user, answer, home} = this.props;
		const {uid, platform} = user;
		if (uid) {
			const {answerNum, userInfo} = home;
			if (answerNum === 0) {
				answer.addAnswerNum(uid, platform);
			} else if (answerNum === 1 && platform !== 'mini') {//app端第二次
				if (userInfo.isCompleteTask) {//已完成全部任务
					answer.addAnswerNum(uid, platform);
				} else {
					history.replace(`/?p=${platform}&u=${uid}`);
				}
			} else {
				history.replace(`/?p=${platform}&u=${uid}`);
			}
		} else {
			history.replace('/');
		}
	}

	componentDidUpdate() {
		const {topicNowIndex} = this.state;
		if (this.lastTopicIndex !== topicNowIndex) {
			this.lastTopicIndex = topicNowIndex;
			const {topics} = this.props.answer;
			this.vPlayer.src = topics[topicNowIndex].videoUrl;
			this.vPlayer.load();
			this.setState({
				isEnd: false
				// vCurrent: '00:00',
				// vBuffer: '0',
				// vPlayed: '0',
				// isPlaying: false,
			});
			this.autoPlayVideo();
		}
	}

	goHome = () => {//返回首页
		const {uid, platform} = this.props.user;
		history.replace(`/?p=${platform}&u=${uid}`);
	};

	closeSuccessPopup = () => {
		this.setState({
			isSuccessPop: false
		});
		this.goHome();
	};

	// sTOm = (s) => {//视频时间秒转为分
	// 	const m = parseInt(s / 60);
	// 	const mstr = m < 10 ? '0' + m : m;
	// 	const S = parseInt(s - m * 60);
	// 	const Sstr = S < 10 ? '0' + S : S;
	// 	return mstr + ':' + Sstr;
	// };
	//
	// getPercent = (a, b) => {//获取进度百分比
	// 	return Math.floor((a / b) * 10000) / 100 + '%';
	// };

	// setPlaying = () => {
	// 	if (!this.state.isEnd) {
	// 		this.setState((state) => {
	// 			state.isPlaying ? this.vPlayer.pause() : this.vPlayer.play();
	// 			return {
	// 				isPlaying: !state.isPlaying
	// 			};
	// 		});
	// 	}
	// };

	// videoDurationChange = () => {
	// 	this.setState({
	// 		vDuration: this.sTOm(this.vPlayer.duration)
	// 	});
	// };
	//
	// videoProgress = () => {
	// 	const buffered = this.vPlayer.buffered;
	// 	if (buffered.length && this.buffered !== buffered.end(0)) {
	// 		this.buffered = buffered.end(0);
	// 		this.setState({
	// 			vBuffer: this.getPercent(this.buffered, this.vPlayer.duration)
	// 		});
	// 	}
	// };

	videoEnd = () => {
		this.vPlayer.pause();
		// this.playTimeInterval && clearInterval(this.playTimeInterval);
		if (!this.state.isEnd) {
			this.setState({
				isEnd: true
				// vCurrent: this.state.vDuration,
				// vBuffer: '100%',
				// vPlayed: '100%'
			});
			this.reduceAnsTime && clearInterval(this.reduceAnsTime);
			this.reduceAnsTime = setInterval(() => {
				this.setState((state) => {
					const times = state.answerTime - 1;
					if (times == 0) {
						clearInterval(this.reduceAnsTime);
						this.canRevive();//验证是否能用复活卡
						return {
							selectAId: 'timeout',
							answerTime: times
						};
					} else {
						return {
							answerTime: times
						};
					}
				});
			}, 1000);
		}
	};

	// videoPause = () => {
	// 	this.playTimeInterval && clearInterval(this.playTimeInterval);
	// 	this.setState({
	// 		isPlaying: false
	// 	});
	// };
	//
	// videoPlay = () => {
	// 	this.setState({
	// 		isPlaying: true
	// 	});
	// 	this.videoProgress();
	// 	this.playTimeInterval = setInterval(() => {
	// 		this.setState({
	// 			vPlayed: this.getPercent(this.vPlayer.currentTime, this.vPlayer.duration),
	// 			vCurrent: this.sTOm(this.vPlayer.currentTime)
	// 		});
	// 	}, 500)
	// };

	setShowFailPop = (value) => {
		this.setState({
			isFailPop: value
		});
	};

	setShowSuccessPop = (bonus) => {
		this.setState({
			bonus: bonus,
			isSuccessPop: true
		});
	};

	useReviveCard = (isLast, num) => {
		if (num) {
			if (isLast) {//闯关成功
				this.setState({
					reviveSuccess: true
				});
				this.props.answer.getBonus(this.props.user.uid, this.setShowSuccessPop);
			} else {//已自动使用复活卡
				this.hasRevive = true;
				this.setState({
					isRevivePop: true
				});
				this.closeRevivePopTimer = setTimeout(() => {
					this.closeRevivePop();
				}, 3000);
			}
		} else {//无复活卡
			this.setShowFailPop(true);
		}
	};

	canRevive = () => {
		if (this.hasRevive) {//已使用过复活卡
			this.setShowFailPop(true);
		} else {
			const {user, answer} = this.props;
			const isLast = this.state.topicNowIndex == answer.topics.length - 1;
			answer.getReviveCard(user.uid, (num) => this.useReviveCard(isLast, num));
		}
	};

	doNextTopic = () => {
		const {answer} = this.props;
		answer.getAnswers(answer.topics[this.state.topicNowIndex + 1].id);
		this.setState((state) => {
			return {
				answerTime: 10,
				selectAId: null,
				topicNowIndex: state.topicNowIndex + 1
			};
		});
	};

	initFirstXY = () => {
		this.firstX = 0;
		this.firstY = 0;
	};

	touchStart = (e) => {
		const touch = e.touches[0];
		this.firstX = touch.pageX;
		this.firstY = touch.pageY;
	};

	answerClick = (e) => {
		const changedTouches = e.changedTouches[0];
		if (Math.abs(changedTouches.pageX - this.firstX) < 6 && Math.abs(changedTouches.pageY - this.firstY) < 6) {//认为是点击
			const {answerTime, selectAId} = this.state;
			if (answerTime != 0 && !selectAId) {
				const aid = e.currentTarget.dataset.aid;
				this.setState({
					selectAId: aid
				});
				const {answer, user} = this.props;
				const {topicNowIndex} = this.state;
				const topicNow = answer.topics[topicNowIndex];
				this.reduceAnsTime && clearInterval(this.reduceAnsTime);
				if (aid == answer.rightId) {
					if (topicNowIndex == answer.topics.length - 1) {//已是最后一题则闯关成功
						answer.getBonus(user.uid, this.setShowSuccessPop);
					} else {//有下一题进入下一题
						setTimeout(() => {
							this.doNextTopic();
						}, 3000);
					}
					answer.statRightWrong(true, user.uid, topicNow.id);
				} else {
					this.canRevive();
					answer.statRightWrong(false, user.uid, topicNow.id);
				}
			}
		}
		this.initFirstXY();
	};

	closeRevivePop = () => {
		this.setState({
			isRevivePop: false
		});
		this.doNextTopic();
	};

	confirmRevive = () => {
		clearTimeout(this.closeRevivePopTimer);
		this.closeRevivePop();
	};

	confirmFail = () => {
		this.setShowFailPop(false);
		this.goHome();
	};

	shareClick = () => {
		const {platform} = this.props.user;
		this.closeSuccessPopup();
		if (platform !== 'mini' &&  typeof miaoKan !== 'undefined') {
			miaoKan.shareMoneyToApp(`${this.state.bonus}`);
		} else if (platform == 'mini') {
			wx.miniProgram.navigateTo({url: `/pages/invite/invite?money=${this.state.bonus}`})
		}
	};

	componentWillUnmount() {
		this.vPlayer && this.vPlayer.pause();
		this.reduceAnsTime && clearInterval(this.reduceAnsTime);
		this.props.answer.initData();
	}

	render(props, state) {
		const {topicNowIndex, isEnd, isSuccessPop, selectAId, isFailPop, isRevivePop, answerTime, bonus, reviveSuccess} = state;
		const {answer} = props;
		const {topics, answers} = answer;
		const topicNow = topics.length ? topics[topicNowIndex] : null;

		return (
			<div class={`full ${style.answer_page}`}>
				<div class='po-re'>
					{topicNow ?
						<video ref={o => this.vPlayer = o} class={`${style.video_player}`} src={topicNow.videoUrl}
							   onEnded={this.videoEnd} controls={true} x5-playsinline webkit-playsinline playsinline>
							抱歉，当前环境不支持播放。
						</video> : null}

					{/*<div class={`fs12 fc1 po-ab over-hidden ${style.video_control}`}>*/}
						{/*<img onTouchEnd={this.setPlaying} class={`no-highlight fl-lf ${style.vplay_img}`}*/}
							 {/*src={isPlaying ? cStop : cPlay}/>*/}
						{/*<div class={`fl-lf ${style.v_time} ${style.v_play_time}`}>{vCurrent}</div>*/}
						{/*<div class={`fl-lf po-re ${style.vall_length}`}>*/}
							{/*<div class={`po-ab ${style.vbuffer_length}`} style={{width: vBuffer}}></div>*/}
							{/*<div class={`po-ab ${style.vplay_length}`} style={{width: vPlayed}}></div>*/}
						{/*</div>*/}
						{/*<div class={`fl-lf ${style.v_time} ${style.v_all_time}`}>{vDuration}</div>*/}
					{/*</div>*/}
				</div>

				<div class={`${style.qus_wrap}`}>
					<div class={`text-center bc1 ${style.see_video} ${isEnd ? 'hide' : ''}`}>
						<img class={`${style.rabit_img}`} src={wait}/>
						<div class={`fw ${style.see_video_text}`}>&nbsp;&nbsp;看完视频开始答题!</div>
					</div>
					<div class={`bc1 ${style.qus_box} ${isEnd ? '' : 'hide'}`}>
						<div class='text-center'>
							<div class={`fw ${style.qis_time} ${style.ff_num}`}>{answerTime}</div>
						</div>
						<div
							class={`fc5 fs20 break-word ${style.qis_title}`}>{topicNow ? `${topicNowIndex + 1}.${topicNow.topic}` : null}</div>

						<div class='fs18'>
							{answers.length ? answers.map((a) => {
								return (
									<div key={a.id}
										 class={`no-highlight pointer ${style.ans_wrap} ${selectAId ? (a.isRight ? `${style.ans_sel} ${style.ans_sel_right}` : (selectAId == a.id ? `${style.ans_sel} ${style.ans_sel_error}` : style.ans_not_sel)) : style.ans_not_sel}`}
										 onTouchStart={this.touchStart} onTouchEnd={this.answerClick} data-aid={`${a.id}`}>
										<div class={`break-word ${style.ans_box}`}>{a.answer}</div>
									</div>
								);
							}) : null}
						</div>
					</div>
				</div>

				<Popup isShow={isFailPop} popupBoxStyle={`po-ab text-center ${style.answer_popup_box}`}>
					<img class={`${style.fail_img}`} src={fail}/>
					<div class={`break-word fc1 ${style.tip_text}`}>{answerTime == 0 ? '很抱歉，你超时了' : '很抱歉，你答错了'}</div>
					<div class={`no-highlight pointer fc1 fs18 ${style.confirm_btn}`} onTouchEnd={this.confirmFail}>确定</div>
				</Popup>
				<Popup isShow={isRevivePop} popupBoxStyle={`po-ab text-center ${style.answer_popup_box}`}>
					<img class={`${style.revive_img}`} src={revive}/>
					<div class={`break-word fc1 ${style.tip_text}`}>已自动为您使用复活卡</div>
					<div class={`no-highlight pointer fc1 fs18 ${style.confirm_btn}`} onTouchEnd={this.confirmRevive}>确定</div>
				</Popup>
				<Popup isShow={isSuccessPop} popupBoxStyle={`text-center popup-box ${style.success_popup_box}`}>
					<img class={`${style.win_img}`} src={win}/>
					<div class={`fw ${style.success_title}`}>闯关成功</div>
					{reviveSuccess ? <div class='fc6'>已自动为您使用复活卡</div> : null}
					<div class={`break-word fs18 ${style.success_text}`}>恭喜您获得&nbsp;&nbsp;<span
						class='fc6'>&yen;&nbsp;</span><span
						class={`fc6 ${style.success_money} ${style.ff_num}`}>{bonus}</span>&nbsp;&nbsp;现金奖励
					</div>
					<div class={`no-highlight pointer fc1 fs18 ${style.success_share_btn}`} onTouchEnd={this.shareClick}>分享给好友</div>
					<div class={`no-highlight pointer po-ab ${style.close_box}`} onTouchEnd={this.closeSuccessPopup}>
						<img class={`${style.close_img}`} src={close}/>
					</div>
				</Popup>
			</div>
		);
	}
};
