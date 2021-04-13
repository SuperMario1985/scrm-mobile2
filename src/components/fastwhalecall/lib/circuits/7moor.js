import md5 from 'js-md5'
import {get7moorConfig} from '../api'

export function m7BeginLogon (user, password) {
	let way = localStorage.getItem('userPlatform') === 'ios' ? 'Local' : 'sip'
	moorCall.moortools.m7BeginLogon(user, password, way, '0')
}

export function initM7WebPhone (user, password) {
	var loginData = {
		username: user,
		pwd     : md5(password)
	}
	let webPhone = new window.initM7WebPhone(loginData)
	webPhone.loginData = loginData
	return webPhone

}

export function dialout (phoneNum, ActionID, type = 'smallPhone') {
	let eventObject = this || {
		EvtConnected () {
		},
		EvtHangup () {
		},
		EvtDialing () {
		},
	}
	window.phone.register("EvtConnected", eventObject, "EvtConnected")
	window.phone.register("EvtHangup", eventObject, "EvtHangup")
	window.phone.register("EvtDialing", eventObject, "EvtDialing")
	window.phone.dialout(phoneNum, ActionID, type)
}

class FastWhaleMoor7 {
	constructor (fastwhale, config) {
		this.fastwhale = fastwhale
		this.config = config
	}

	//获取配置
	async getMoorCallConfig () {
		let {api_key, custom_key, exten} = this.config

		let {message} = await get7moorConfig(api_key, custom_key, exten).then(async (response) => {
			return await response.json()
		})

		return message
	}

	//初始化
	async init () {

		//初始化配置
		let moorCallConfig = await this.getMoorCallConfig()

		/*let moorCallConfig = {
			account_id: "T00000017767",
			api_host  : "https://openapis.7moor.com",
			api_secret: "2dd9d180-7189-11eb-bf34-afa21733035a",
			password  : "#GuSWOAw5oq8003",
			proxy_url : "https://pbx-bj-tx04.7moor.com",
			user      : "8003@ahxzkj",
		}*/

		this.moorCallConfig = moorCall.config = Object.assign({}, moorCallConfig)

		//设置新的错误收集
		moorCall.moortools.error = this.errorHandle.bind(this)

		m7BeginLogon(moorCallConfig.user, moorCallConfig.password)

		this.initM7WebPhone()
	}

	initM7WebPhone () {

		let webPhone = initM7WebPhone(this.moorCallConfig.user, this.moorCallConfig.password);

		['networkMonitoring', 'onMessage', 'onError'].forEach(action => {
			webPhone[action](this[action].bind(this))
		})


		this.webPhone = webPhone
	}

	//系统错误
	errorHandle (message) {
		this.fastwhale.emit('errorHandle', 'sysError' + message)
		console.log(message, 'errorHandle')
	}

	onError (message) {
		this.fastwhale.emit('onError', 'onError' + message)
		console.log(message, 'onError')
	}

	//消息
	onMessage (message) {
		console.log(message, 'onMessage')
		this.fastwhale.emit('onMessage', message)
	}

	//网络
	networkMonitoring (message) {
		this.fastwhale.emit('networkMonitoring', message)
	}

	// 监听接通电话
	EvtConnected () {
		this.onMessage('EvtConnected')
	}

	// 监听响铃
	EvtDialing () {
		this.onMessage('EvtDialing')
	}

	// 监听挂断电话
	EvtHangup () {
		this.onMessage('EvtHangup')
	}

	//拨打电话
	dialout (phoneNum, ActionID) {
		dialout.call(this, phoneNum, ActionID)
	}

	//接听电话
	outbound () {
		this.webPhone.Outbound()
	}

	//销毁
	destroy () {
		this.webPhone.destroy()
	}

	//挂断
	hangup () {
		window.phone.hangup()
	}

	//重连
	reconnect () {
		m7BeginLogon(moorCall.config.user, moorCall.config.password)
		this.webPhone.init(this.webPhone.loginData)
	}
}

export default function (fastwhale, config) {
	let moor7 = new FastWhaleMoor7(fastwhale, config)
	moor7.init()
	return moor7
}
