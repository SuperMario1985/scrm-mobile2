import Vue from 'vue'
import App from './App'
import store from './store'
import axios from 'axios'
import Vant, {Lazyload, Toast} from "vant"
import fishPng from './static/assets/fish.gif'
import errorPng from './static/assets/img.png'
import Test from './static/js/test.js'
import PageSize from './static/js/pageSize.js'
import LinkUrl from './static/js/linkUrl.js'
import remoteJs from './components/remote-js.vue'
import appLayout from './components/app-layout.vue'
//引入全局变量 js
import Global from "./static/js/global"
// 引入websocket js
import websocket from "./static/js/websocket"
//引入公共js
import Utils from './static/js/utils.js'
//引入复制插件
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard);
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)
// 引入RootFontSize
import RootFontSize from "./components/RootFontSize.vue"

// 全局参数配置
Vue.prototype.global = Global
// 全局参数配置
Vue.prototype.ws = websocket
//注册公共js
Vue.prototype.utils = Utils
Vue.prototype.$test = Test
Vue.prototype.$pageSize = PageSize
Vue.prototype.$linkUrl= LinkUrl
Vue.prototype.axios = axios

axios.defaults.baseURL = 'https://hd-scrm.wemero.cn/api/'

//需要授权的 API ，必须在请求头中使用 Authorization 字段提供 token 令牌
axios.interceptors.request.use(config => {
	// console.log(config)
	if (localStorage.getItem('token')) {
		config.headers.Authorization = 'Bearer ' + localStorage.getItem('token');
	}
	return config
})

axios.interceptors.response.use(function (response) {
	if (response.data.error == 14003) {
		if (localStorage.length > 0) {
			let keyIndex = 0
			const localLength = localStorage.length
			for (let i = 0; i < localLength; i++) {
				let localKey = localStorage.key(keyIndex)

				if (localKey !== 'session_id') {
					localStorage.removeItem(localKey)
				} else {
					keyIndex++
				}
			}
		}
		window.location.reload()
		return Promise.reject('')
	} else if (response.data.error == 401) {
		Promise.all([store.dispatch('refreshToken')]).then(res => {
                setTimeout(()=>{
                    // window.location.reload()
                    return Promise.reject('')
                },5000)

			})
			.catch(e => {
				return Promise.reject('')
			})
	} else {
		return response
	}
}, error => {
	if (error.response.status == 403) {
		Toast.fail({
			forbidClick: true,
			duration   : 0,
			message    : error.response.data.message
		})
		return Promise.reject('')
	}
})

/**
 * 判断是否具有权限，当没有权限时，自动清除DOM元素
 * @param {HTMLElement} el
 * @param {DirectiveBinding} binding
 * @param {VNode} vnode
 */
const hasFunction = (el, binding, vnode) => {
	let hasPermission = false;

	Promise.all([permissionJudge(binding.value)]).then(res => {
		if (!hasPermission) {
			vnode.context.$nextTick(() => {
				if (el.parentNode != null && el.parentNode.removeChild != null && typeof el.parentNode.removeChild == 'function') {
					el.parentNode.removeChild(el)
				}
			})
		}
	}).catch(e => {
	})

	function permissionJudge (value) {
		vnode.context.$nextTick(() => {
			// 此处store.state.permissionButton代表vuex中储存的权限按钮数据
			if (localStorage.getItem('permissionButton') != null && localStorage.getItem('permissionButton') != '') {
				let list = localStorage.getItem('permissionButton').split(",")
				if (list.length == 1 && list[0] === "all") {
					hasPermission = true
					return
				}

				for (let item of list) {
					if (item === value) {
						hasPermission = true
						return
					}
				}

				hasPermission = false
				return
			}
		})
	}
}
Vue.directive('has', {
	inserted (el, binding, vnode) {
		hasFunction(el, binding, vnode)
	},
	//更新DOM的时候
	componentUpdated (el, binding, vnode, oldVnode) {
		hasFunction(el, binding, vnode)
	}
});

/**
 * 自定义下载长按功能
 *
 * @param el
 * @param binding
 */
const longPress = (el, binding) => {
	let timeout = 0;
	console.log(el)
	el.addEventListener('touchstart', () => {
		console.log(123)
		timeout = setTimeout(binding, 300); // 长按时间超过800ms，则执行传入的方法
	}, false);
	el.addEventListener('touchend', () => {
		console.log(456)
		clearTimeout(timeout); // 长按时间少于800ms，不会执行传入的方法
	}, false)
}
Vue.directive('longPress', {
	inserted (el, binding, vnode) {
		longPress(el, binding,vnode.componentOptions.listeners)
	},
	//更新DOM的时候
	componentUpdated (el, binding, vnode, oldVnode) {
		longPress(el, binding.value)
	}
})
Vue.use(Vant)
Vue.use(Lazyload, {
	error  : errorPng,
	loading: fishPng
})
Vue.component('remote-js', remoteJs)
Vue.component('app-layout', appLayout);
Vue.config.productionTip = false
// 注册公共组件
Vue.component('RootFontSize', RootFontSize)

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
