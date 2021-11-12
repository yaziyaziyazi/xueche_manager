<template>
	<view class="login-box">
		<view class="uni-header no-padding" >
			<view class="uni-title" style="font-size: 20px;
		font-weight: 900;">系统登录</view>
		</view>
		<view class="uni-container">
			<uni-forms ref="form" v-model="formData" :rules="rules" @submit="submit" >
				<uni-forms-item name="username" label="账号" label-width="0">
					<input ref="usernameInput" @confirm="submitForm" class="uni-input-border" type="text"
						placeholder="账户" v-model="formData.username" />
				</uni-forms-item>
				<uni-forms-item class="icon-container" name="password"  label="密码" label-width="0"
					>
					<input ref="passwordInput" @confirm="submitForm" class="uni-input-border" :password="showPassword"
						placeholder="密码" v-model="formData.password" />
					<text class="uni-icon-password-eye pointer" :class="[!showPassword ? 'uni-eye-active' : '']"
						@click="changePassword">&#xe568;</text>
				</uni-forms-item>
				<uni-forms-item v-if="needCaptcha" left-icon="uni-icons-person-filled" class="icon-container"
					name="captcha" labelWidth="35">
					<input ref="captchaInput" @confirm="submitForm" class="uni-input-border" type="text"
						placeholder="验证码" v-model="formData.captcha" />
					<view class="admin-captcha-img pointer" @click="createCaptcha">
						<i v-if="captchaLoading" class="uni-loading"></i>
						<img v-else :src="captchaBase64" width="100%" height="100%"></img>
					</view>
				</uni-forms-item>
				<view class="uni-button-group">
					<button class="uni-button uni-button-full" type="primary" :loading="loading" :disabled="loading"
						@click="submitForm">登录</button>
				</view>
			</uni-forms>
		</view>
		<!-- <button type="default" @click="test">测试测试</button> -->
	</view>
</template>

<script>
	import {
		mapMutations,
		mapActions
	} from 'vuex'
	import config from '@/admin.config.js'
	import {
		getDeviceUUID
	} from '@/js_sdk/uni-admin/util.js'

	const captchaOptions = {
		deviceId: getDeviceUUID(),
		scene: 'login'
	}

	export default {
		data() {
			return {
				...config.navBar,
				indexPage: config.index.url,
				showPassword: true,
				loading: false,
				formData: {
					username: '',
					password: '',
					captcha: '',
				},
				city_ip: '',
				captchaLoading: false,
				needCaptcha: false,
				captchaBase64: '',
				rules: {
					// 对name字段进行必填验证
					username: {
						rules: [{
								required: true,
								errorMessage: '请输入账户',
							},
							{
								minLength: 1,
								maxLength: 30,
								errorMessage: '账户长度在{minLength}到{maxLength}个字符',
							}
						]
					},
					// 对email字段进行必填验证
					password: {
						rules: [{
								required: true,
								errorMessage: '请输入正确的密码',
							},
							{
								minLength: 6,
								errorMessage: '密码长度大于{minLength}个字符',
							}
						]
					},
					// 对email字段进行必填验证
					captcha: {
						rules: [{
							required: true,
							errorMessage: '请输入验证码',
						}]
					}
				}
			}
		},
		mounted() {
			// #ifdef H5
			this.focus()
			// #endif
			const self = this
			uni.getStorage({
				key: "lastUsername",
				success: function(res) {
					self.formData.username = res.data
				}
			})
			// this.getNeedCaptcha()
		},
		onLoad(){
			
		},
		created() {
			this.city_set()
		},
		methods: {
			test() {
				console.log(this.value1,this.value2,this.value3)
			},
			...mapActions({
				init: 'app/init'
			}),
			...mapMutations({
				setToken(commit, tokenInfo) {
					commit('user/SET_TOKEN', tokenInfo)
				}
			}),
			submit(event) {
				if (this.loading) {
					return
				}
				const {
					errors,
					value
				} = event.detail
				if (errors) {
					return
				}
				// #ifdef H5
				this.$refs.usernameInput.$refs.input.blur()
				this.$refs.passwordInput.$refs.input.blur()
				this.$refs.captchaInput && this.$refs.captchaInput.$refs.input.blur()
				// #endif
				this.loading = true
				this.$request('login', {
					...value,
					captchaOptions
				}, {
					functionName: 'uni-id-cf',
					showModal: false
				}).then(res => {
					// console.log(res.userInfo.last_login_ip)
					this.setToken({
						token: res.token,
						tokenExpired: res.tokenExpired
					})
					uni.setStorage({
						key: 'last_login_ip',
						data: res.userInfo.last_login_ip
					});
					return this.init().then(() => {

						uni.showToast({
							title: '登录成功',
							icon: 'none'
						})
						uni.setStorage({
							key: 'lastUsername',
							data: value.username
						});

						uni.redirectTo({
							url: this.indexPage
						})
					})
				}).catch(err => {
					console.log(4444, err);
					if (err.needCaptcha) {
						this.formData.captcha = ''
						this.createCaptcha()
						this.needCaptcha = true
					}
					const that = this
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false,
						success: function() {
							if (err.code === 10101 && that.$refs.usernameInput) {
								that.$refs.usernameInput.$refs.input.focus()
							}
							if (err.code === 10102 && that.$refs.passwordInput) {
								that.$refs.passwordInput.$refs.input.focus()
							}
							if (err.code === 10002 && that.$refs.captchaInput) {
								that.$refs.captchaInput.$refs.input.focus()
							}
						}
					})
				}).finally(err => {
					this.loading = false
				})

			},

			createCaptcha() {
				this.captchaLoading = true
				this.$request('createCaptcha', captchaOptions, {
					functionName: 'uni-id-cf'
				}).then(res => {
					if (res.code === 0) {
						this.captchaBase64 = res.captchaBase64
					}
				}).catch(err => {}).finally(err => {
					this.captchaLoading = false
				})
			},

			confirmForm(name, value) {
				// this.binddata(name, value)
				this.submitForm()
			},
			city_set() {
				this.$jsonp(`https://apis.map.qq.com/ws/location/v1/ip`, {
					key: 'GWJBZ-NUWCI-HOUGB-5GIS3-TV7LJ-7EBH4', // 你的key
					output: 'jsonp'
				}).then(res => {
					try {
						// console.log("1111111111111")
						// console.log( res.result.ad_info.city.match(/(\S*)市/)[1])
						// console.log(res)
						uni.setStorageSync('city', res.result.ad_info.city.match(/(\S*)市/)[1]);
					} catch (e) {
						console.log(e)
					}
				}).catch(err => {
					console.log(err)
				})
			},
			submitForm() {
				this.$refs.form.submit()
				// this.city_get()
			},
			// city_get() {
			// 	try {
			// 		const value = uni.getStorageSync('last_login_ip');
			// 		if (value) {
			// 			this.city_ip = value
			// 		}
			// 	} catch (e) {
			// 		console.log(e)
			// 	}
			// 	this.$jsonp(`https://apis.map.qq.com/ws/location/v1/ip`, {
			// 		ip: this.city_ip,
			// 		key: 'GWJBZ-NUWCI-HOUGB-5GIS3-TV7LJ-7EBH4', // 你的key
			// 		output: 'jsonp'
			// 	}).then(res => {
					
			// 		try {
			// 			uni.setStorageSync('city',res.result.ad_info.city.match(/(\S*)市/)[1])
			// 		} catch (e) {
			// 			console.log(e)
			// 		}
			// 		// console.log(res)
			// 	}).catch(err => {

			// 		console.log(err)
			// 	})


			// },
			initAdmin() {
				uni.redirectTo({
					url: '/pages/demo/init/init'
				})
			},
			changePassword: function() {
				this.showPassword = !this.showPassword;
			},
			// #ifdef H5
			focus: function() {
				this.$refs.usernameInput.$refs.input.focus()
			},
			// #endif
		}
	}
</script>

<style scoped>
	/deep/.uni-input-placeholder{
		color: #333333;
		/* font-size: larger; */
	}
	/deep/.uni-input-input{
		color: #EBEEF5;
	}
	/deep/.label-text{
		font-size: 18px !important;
		font-weight: 900 !important;
		color: #2C405A  !important;
	}
	.uni-header{
		height: 50px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	page {
		background-image: url(../../static/OIP-C.png);
		width: 100%;
		height: 100%;
		background-repeat: no-repeat; /*不平埔*/
		background-position:50% 50% ; /*居中*/
		background-size:100%; /*背景图片大小*/
		display: flex;
		justify-content: center;
		background-color: #fff;
		
	}

	.login-box {
		position: relative;
		max-width: 350px;
		flex: 1;
		padding: 140px 35px 0;
		margin: 0 auto;
		overflow: hidden;

	}


	.underline:hover {
		text-decoration: underline;
	}

	.uni-tips {
		display: flex;
		justify-content: flex-end;
		margin-top: 15px;
	}

	.uni-tips-text {
		cursor: pointer;
		text-decoration: underline;
		font-size: 13px;
		color: #007AFF;
		opacity: 0.8;
	}

	.no-padding {
		padding: 0;
	}

	.admin-logo {
		display: flex;
		justify-content: center;
		margin-bottom: 30px;
	}

	.admin-logo image {
		height: 40px;
	}

	.admin-captcha-img {
		position: absolute;
		top: 1px;
		right: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #fff;
		width: 100px;
		height: 33px;
		border: 1px #E5E5E5 solid;
		border-radius: 0 5px 5px 0;
		background-color: #f9f9f9;
	}

	.admin-captcha-img img {
		border-radius: 5px;
	}

	.uni-loading:before {
		background: rgba(0, 0, 0, 0) url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=") no-repeat
	}

	.uni-loading {
		margin: 0 auto;
		width: 20px;
		height: 20px;
		display: inline-block;
		vertical-align: middle;
		-webkit-animation: uni-loading 1s steps(12) infinite;
		animation: uni-loading 1s steps(12) infinite;
		background-size: 100%
	}

	@-webkit-keyframes uni-loading {
		0% {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg)
		}

		to {
			-webkit-transform: rotate(1turn);
			transform: rotate(1turn)
		}
	}

	@keyframes uni-loading {
		0% {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg)
		}

		to {
			-webkit-transform: rotate(1turn);
			transform: rotate(1turn)
		}
	}
</style>
