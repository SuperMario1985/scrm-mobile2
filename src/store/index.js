import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import {Toast} from "vant";

Vue.use(Vuex)

export default new Vuex.Store({
	state    : {
		wxInterval            : {},
		wx                    : {},
		groupName             : '',
		group_id              : '',
		radarName             : '',
		isRadar               : 0,
		chooseMsgArr          : '',
		chooseMsgArray        : {},
		chooseMsgH5OrFileArr  : [],
		chooseMsgH5OrFileArray: [],
		chooseMsgType         : '',
		inputValue            : '',
		commonUrl             : 'https://hd-scrm.wemero.cn',//公共的链接
		h5Url                 : 'http://m-scrm.wemero.cn',// h5地址
		externalId            : '',  // 外部联系人userid
		chatId                : '',  // 客户群的群ID
		hasTags               : [],//客户已有标签
		token                 : '',//客户标识
		corpid                : '',//客户企业微信
		hasTagsId             : [],//选择标签页选择的标签id
		authKey               : 'AUTH_KEY', //验证key
		context               : '',
		momentImage           : [],
		is_show_copyright     : 1,//是否展示底部技术支持，0不展示，1展示
		copyright_url         : '',//底部技术支持图片链接
	},
	mutations: {
		setMomentImage (state, momentImage) {
			state.momentImage = momentImage
		},
		setContext (state, context) {
			state.context = context
		},
		setWx (state, wx) {
			state.wx = wx
		},
		setGroupId (state, group_id) {
			state.group_id = group_id
		},
		setGroupName (state, groupName) {
			state.groupName = groupName
		},
		setIsRadar (state, isRadar) {
			state.isRadar = isRadar
		},
		setRadarName (state, radarName) {
			state.radarName = radarName
		},
		setChooseMsgArr (state, chooseMsgArr) {
			state.chooseMsgArr = chooseMsgArr
		},
		setChooseMsgArray (state, chooseMsgArray) {
			state.chooseMsgArray = chooseMsgArray
		},
		setChooseMsgH5OrFileArr (state, chooseMsgH5OrFileArr) {
			state.chooseMsgH5OrFileArr = chooseMsgH5OrFileArr
		},
		setChooseMsgH5OrFileArray (state, chooseMsgH5OrFileArray) {
			state.chooseMsgH5OrFileArray = chooseMsgH5OrFileArray
		},
		setChooseMsgType (state, chooseMsgType) {
			state.chooseMsgType = chooseMsgType
		},
		setInputValue (state, inputValue) {
			state.inputValue = inputValue
		},
		setExternalId (state, externalId) {
			state.externalId = externalId
			localStorage.setItem('externalId', externalId)
		},
		setChatId (state, chatId) {
			state.chatId = chatId
			localStorage.setItem('chatId', chatId)
		},
		setAccessToken (state, token) {
			state.token = token
			localStorage.setItem('token', token)
		},
		setCorpId (state, corpId) {
			state.corpid = corpId
			localStorage.setItem('corpid', corpId)
		},
		setHasTags (state, hasTags) {
			state.hasTags = hasTags
		},
		setHasTagsId (state, hasTagsId) {
			state.hasTagsId = hasTagsId
			localStorage.setItem('hasTagsId', hasTagsId)
		},
		setShowCopyright (state, is_show_copyright) {
			state.is_show_copyright = is_show_copyright
			localStorage.setItem('is_show_copyright', is_show_copyright)
		},
		setCopyrightUrl (state, copyright_url) {
			state.copyright_url = copyright_url
			localStorage.setItem('copyright_url', copyright_url)
		},
	},
	actions  : {
		setWx (context, callback) {
			// let isWx = navigator.userAgent.toLocaleLowerCase().indexOf('micromessenger') !== -1 && navigator.userAgent.toLocaleLowerCase().indexOf('wxwork') === -1
			let wxInterval = {};
			let userPlatform = ''
			// let wxType = wx
			uni.getSystemInfo({
				success: (res) => {
					userPlatform = res.platform
					localStorage.setItem('userPlatform', userPlatform)
				}
			});
			console.log('userPlatform', userPlatform)
			const needAgentConfig = localStorage.getItem('needAgentConfig')
			if (needAgentConfig !== 'true') {
				wxInterval = setInterval(function () {
					// if (isWx || userPlatform == 'android' || userPlatform == 'other') {
					// 	wxType = jWeixin
					// }
					if (typeof jWeixin !== "undefined" && typeof jWeixin.config !== 'undefined') {
						clearInterval(wxInterval);
						context.commit('setWx', jWeixin);

						if (typeof callback === 'function') {
							callback()
						}
						// else {
						// 		uni.showToast({
						// 			title   : 'config failed:' + typeof wxType + '-' + typeof wxType.config,
						// 			image   : '/static/fail.png',
						// 			duration: 2000
						// 		})
						// 	}
					} else if (typeof wx !== "undefined" && typeof wx.config !== 'undefined') {
						clearInterval(wxInterval);
						context.commit('setWx', wx);

						if (typeof callback === 'function') {
							callback()
						}
					}
				}, 100);
			} else {
				wxInterval = setInterval(function () {
					// if (isWx || userPlatform == 'android' || userPlatform == 'other') {
					// 	wxType = jWeixin
					// }
					if (typeof jWeixin !== "undefined" && typeof jWeixin.config !== 'undefined' && typeof jWeixin.agentConfig !== 'undefined') {
						clearInterval(wxInterval);
						context.commit('setWx', jWeixin);

						if (typeof callback === 'function') {
							callback()
						}
						// else {
						// 		uni.showToast({
						// 			title   : 'config failed:' + typeof wxType + '-' + typeof wxType.config,
						// 			image   : '/static/fail.png',
						// 			duration: 2000
						// 		})
						// 	}
					} else if (typeof wx !== "undefined" && typeof wx.config !== 'undefined' && typeof wx.agentConfig !== 'undefined') {
						clearInterval(wxInterval);
						context.commit('setWx', wx);

						if (typeof callback === 'function') {
							callback()
						}
					}
				}, 100);
			}
		},
		setCorpId (context, newCorpId) {
			let currentCorpId = localStorage.getItem('corpid')

			if (!currentCorpId) {
				context.commit('setCorpId', newCorpId)
			} else {
				if (currentCorpId != newCorpId) {
					let keyIndex = 0
					const localLength = localStorage.length
					for (let i = 0; i < localLength; i++) {
						let localKey = localStorage.key(keyIndex);
						if (localKey !== 'session_id') {
							localStorage.removeItem(localKey);
						} else {
							keyIndex++
						}
					}

					window.location.reload()
				}
			}
		},
		async refreshToken (context) {
			const {data: res} = await axios.post('login/refresh-token', {
				uid   : localStorage.getItem("uid"),
				sub_id: localStorage.getItem("sub_id")
			})

			if (res.error == 0) {
				context.commit('setAccessToken', res.data.access_token)
			} else {
				let keyIndex = 0
				const localLength = localStorage.length
				for (let i = 0; i < localLength; i++) {
					let localKey = localStorage.key(keyIndex);
					if (localKey !== 'session_id') {
						localStorage.removeItem(localKey);
					} else {
						keyIndex++
					}
				}
			}
		}
	},
	modules  : {}
})
