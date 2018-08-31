import { h, Component } from 'preact';
import { Router } from 'preact-router';
import {Provider} from 'mobx-preact';
import store from 'store/index';
import AsyncRoute from 'preact-async-route';
import history from 'utils/history';

import Home from '../pages/Home';
import Error from '../pages/Error';

export default class App extends Component {
	render() {
		return (
			<div id="app">
				<Provider {...store}>
					<Router history={history}>
						<Home path="/" />
						<AsyncRoute
							path="/intro"
							getComponent={() => import('../pages/Intro').then(module => module.default)}
						/>
						<AsyncRoute
							path="/rank"
							getComponent={() => import('../pages/Rank').then(module => module.default)}
						/>
						<AsyncRoute
							path="/wallet"
							getComponent={() => import('../pages/Wallet').then(module => module.default)}
						/>
						<AsyncRoute
							path="/answer"
							getComponent={() => import('../pages/Answer').then(module => module.default)}
						/>
						<Error type="404" default />
					</Router>
				</Provider>
			</div>
		);
	}
}
