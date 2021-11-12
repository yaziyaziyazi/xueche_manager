<template>
	<view class="uni-container">
		<uni-forms ref="form" :value="formData" validateTrigger="bind">
			<uni-forms-item name="name" label="驾校名称">
				<uni-easyinput placeholder="驾校名称，不允许重复" v-model="formData.name" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="number" label="编号">
				<uni-easyinput placeholder="驾校的编号" v-model="formData.number" />
			</uni-forms-item>
			<uni-forms-item name="city" label="城市">
				<uni-easyinput disabled placeholder="驾校的所在城市" v-model="formData.city" />
				<uni-data-picker  style="margin-top: 20px;" placeholder="请选择地址" popup-title="请选择城市" 
				collection="opendb-city-china" field="code as value, name as text"
			 orderby="value asc" :step-searh="true" self-field="code" parent-field="parent_code"
			 @change="onchange" @nodeclick="onnodeclick">
			</uni-data-picker>
			</uni-forms-item>
			

			<view class="uni-button-group">
				<button type="primary" class="uni-button" style="width: 100px;" @click="submit">提交</button>
				<navigator open-type="navigateBack" style="margin-left: 15px;">
					<button class="uni-button" style="width: 100px;">返回</button>
				</navigator>
			</view>
		</uni-forms>
	</view>
</template>

<script>
	import {
		validator
	} from '../../../js_sdk/validator/companies.js';

	const db = uniCloud.database();
	const dbCmd = db.command;
	const dbCollectionName = 'companies';

	function getValidator(fields) {
		let reuslt = {}
		for (let key in validator) {
			if (fields.includes(key)) {
				reuslt[key] = validator[key]
			}
		}
		return reuslt
	}

	export default {
		data() {
			return {
				formData: {
					"name": "",
					"number": "",
					"city": ""
				},
				formOptions: {},
				rules: {
					...getValidator(["name", "number", "city"])
				}
			}
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {
			onchange(e) {
			        // const value =
					console.log( e.detail.value[1].text)
					this.formData.city= e.detail.value[1].text.match(/(\S*)市/)[1]
					// var text = document.getElementsByClassName("selected-list")[0].childNodes
					// console.log(text)
					// text.innerHTML = '<p>hello</p>'
			      },
			      onnodeclick(node) {
					  // console.log(node)
				  },
			
			submit() {
				uni.showLoading({
					mask: true
				})
				this.$refs.form.submit().then((res) => {
					this.submitForm(res)
				}).catch((errors) => {
					uni.hideLoading()
				})
			},

			submitForm(value) {
				// console.log(value)
				// 使用 clientDB 提交数据
				db.collection(dbCollectionName).add(value).then((res) => {
					uni.showToast({
						title: '新增成功'
					})
					this.getOpenerEventChannel().emit('refreshData')
					setTimeout(() => uni.navigateBack(), 500)
				}).catch((err) => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				}).finally(() => {
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style scoped>
	
	/deep/.picker-view{
		
	}
</style>