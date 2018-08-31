import { h, Component } from 'preact';
import {observer, inject} from 'mobx-preact';
import style from './style.scss';
import history from 'utils/history';

import head from 'assets/images/head.png';
import money from './img/money.png';
import appQR from './img/app-qr.png';

@inject((allStores) => ({
	home: allStores.home
}))
@observer
export default class Wallet extends Component {
	componentDidMount() {
		if (typeof this.props.home.userInfo.nickName == "undefined") {
			history.replace('/');
		}
	}

	render(props) {
		const {userInfo} = props.home;
		return (
			<div class={`full ${style.wallet_page}`}>
				<div class={`po-ab ${style.wallet_head}`}></div>
				<div class={`po-re bc1 ${style.wallet_card_wrap}`}>
					<div class={`po-ab bc1 ${style.wallet_card_box}`}>
						<img class={`po-ab ${style.money_img}`} src={money}/>
						<div class={`po-ab text-center ${style.wallet_user_info}`}>
							<img class={`${style.user_head}`} src={userInfo.headImg ? userInfo.headImg : head}/>
							<div class='break-word'>{userInfo.nickName}</div>
						</div>

						<div class={`po-re ${style.wallet_info}`}>
							<div>账号余额：</div>
							<div class={`text-over fw ${style.wallet_money}`}>&yen;{userInfo.wallet}</div>
							<div class={`${style.all_money_title}`}>总收入：</div>
							<div class='fc5'>&yen;:{userInfo.totalMoney}</div>
						</div>
					</div>
				</div>

				<div class={`text-center ${style.app_qr_wrap}`}>
					<img class={`${style.app_qr_img}`} src={appQR}/>
					<div class={`${style.app_qr_tip}`}>扫描二维码或在各大应用商店下载XXapp<br/>在答题活动页面提现</div>
				</div>
			</div>
		);
	}
}
