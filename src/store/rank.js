import {observable, action, runInAction} from 'mobx';
import axios from 'utils/axios';

class Store {
	@observable
	topThree = [];
	@observable
	rankList = [];
	@observable
	ownRank = {};


	@action
	getRanks = async (model, uid) => {
		try {
			const response = await axios.get(`/Work/${model ==='week' ? 'GetWeekList' : 'GetTotalList'}?uidx=${uid}&aes=false`);
			const data = response.data;
			if (data.errorcode == '00000:ok') {
				const result = data.result;
				runInAction(() => {
					this.topThree = result.splice(0, 3);
					this.rankList = result;
					this.ownRank = data.userRankingResult[0];
				});
			}
		} catch (error) {
			runInAction(() => {
				this.topThree = [];
				this.rankList = [];
				this.ownRank = {};
			});
		}
	};
}

export default new Store();