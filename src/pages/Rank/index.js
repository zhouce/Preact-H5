import { h, Component } from 'preact';
import {observer, inject} from 'mobx-preact';
import history from 'utils/history';
import style from './style.scss';

import head from 'assets/images/head.png';
import crown from './img/crown.png';

@inject((allStores) => ({
	user: allStores.user,
	home: allStores.home,
	rank: allStores.rank,
}))
@observer
export default class Rank extends Component {
	constructor(props) {
		super(props);
		this.state = {
			rankModel: 'week'//week 周榜 total 总榜
		};
	}

	getDiffRanks = (e) => {
		const modelClick = e.currentTarget.dataset.model;
		if (modelClick !== this.state.rankModel) {
			this.props.rank.getRanks(modelClick, this.props.user.uid);
			this.setState({
				rankModel: modelClick
			})
		}
	};

	componentDidMount() {
		const {user, home, rank} = this.props;
		const {uid, platform} = user;
		if (uid) {
			if (home.userInfo.isHaveRankingList) {//开放排行榜功能
				rank.getRanks(this.state.rankModel, uid);
			} else {
				history.replace(`/?p=${platform}&u=${uid}`);
			}
		} else {
			history.replace('/');
		}
	}

	render(props, state) {
		const {rankModel} = state;
		const {topThree, rankList, ownRank} = props.rank;
		const hasTopThree = topThree.length == 3;

		return (
			<div class={`full common_bg`}>
				<div class={`full scroll-list ${style.rank_page}`}>
					<div class={`fs18 fc1 text-center ${style.page_title}`}>
						排行榜
					</div>
					<div class={`text-center ${style.rank_btn_box}`}>
						<div class={`no-highlight pointer fs16 fc1 text-center align-top ${style.rank_btn} ${style.mar_ri_8} ${rankModel === 'week' ? style.rank_btn_able : style.rank_btn_disable}`}
							 data-model="week" onTouchEnd={this.getDiffRanks}>本周榜</div>
						<div class={`no-highlight pointer fs16 fc1 text-center align-top ${style.rank_btn} ${rankModel === 'total' ? style.rank_btn_able : style.rank_btn_disable}`}
							 data-model="total" onTouchEnd={this.getDiffRanks}>总榜单</div>
					</div>
					<div class={`text-center ${style.three_wrap}`}>
						<div class={`${style.three_item}`}>
							<div class={`po-re ${style.item_head}`}>
								<img class={`${style.item_head_img}`} src={hasTopThree ? topThree[1].headImg : head}/>
								<div class={`fc1 po-ab ${style.item_num} ${style.item_num_bc1}`}>2</div>
							</div>
							<div
								class={`fs16 text16 fc1 text-over ${style.item_name}`}>{hasTopThree ? topThree[1].nickName : null}</div>
							<div
								class={`fc1 text-over ${style.item_money}`}>&yen;&nbsp;{hasTopThree ? topThree[1].award : null}</div>
						</div>
						<div class={`${style.three_item}`}>
							<div class={`po-re ${style.item_head}`}>
								<img class={`po-re ${style.item_head_img2}`}
									 src={hasTopThree ? topThree[0].headImg : head}/>
								<img class={`po-ab ${style.crown_img}`} src={crown}/>
							</div>
							<div
								class={`fs16 text16 fc1 text-over ${style.item_name}`}>{hasTopThree ? topThree[0].nickName : null}</div>
							<div
								class={`fc1 text-over ${style.item_money}`}>&yen;&nbsp;{hasTopThree ? topThree[0].award : null}</div>
						</div>
						<div class={`${style.three_item}`}>
							<div class={`po-re ${style.item_head}`}>
								<img class={`${style.item_head_img}`} src={hasTopThree ? topThree[2].headImg : head}/>
								<div class={`fc1 po-ab ${style.item_num} ${style.item_num_bc2}`}>3</div>
							</div>
							<div
								class={`fs16 text16 fc1 text-over ${style.item_name}`}>{hasTopThree ? topThree[2].nickName : null}</div>
							<div
								class={`fc1 text-over ${style.item_money}`}>&yen;&nbsp;{hasTopThree ? topThree[2].award : null}</div>
						</div>
					</div>

					{rankList.length ? rankList.map((user, i) => {
						return (
							<div key={user.uidx} class={`${style.rank_item}`}>
								<div class={`text-center fs18 fl-lf ${style.rank_text}`}>{i + 4}</div>
								<img class={`fl-lf ${style.rank_li_uimg}`} src={user.headImg ? user.headImg : head}/>
								<div class={`fs16 fc1 fl-lf text-over ${style.rank_uname}`}>{user.nickName ? user.nickName : null}</div>
								<div
									class={`text-center fl-ri fc1 text-over ${style.item_money} ${style.mar_top_17}`}>&yen;&nbsp;{user.award}</div>
							</div>
						);
					}) : null}
				</div>

				<div class={`po-ab ${style.rank_self}`}>
					<div
						class={`text-center fs18 fl-lf text-over ${style.rank_text}`}>{ownRank.award > 0 && ownRank.ranking > 0 ? ownRank.ranking : '—'}</div>
					<img class={`fl-lf ${style.rank_li_uimg}`} src={ownRank.headImg ? ownRank.headImg : head}/>
					<div class={`fs16 fc1 fl-lf text-over ${style.rank_uname}`}>{ownRank.nickName ? ownRank.nickName : null}</div>
					<div
						class={`text-center fl-ri fc1 text-over ${style.item_money} ${style.mar_top_17}`}>{ownRank.award > 0 ? <span>&yen;&nbsp;{ownRank.award}</span> : '暂未上榜'}</div>
				</div>
			</div>
		);
	}
};
