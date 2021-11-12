<template>
	<view class="uni-container">
		<uni-forms ref="form" :value="formData" validateTrigger="bind">
			<uni-forms-item name="name" label="姓名" required>
				<uni-easyinput placeholder="教练的姓名" v-model="formData.name" />
			</uni-forms-item>
			<uni-forms-item name="company" label="驾校" required>
				<el-select style="width: 120px;" v-model="formData.company" placeholder="请选择驾校">
					<unicloud-db v-slot:default="{data, loading, error, options}" collection="companies" field="name">
						<view v-if="error">{{error.message}}</view>
						<view v-else>
							<el-option v-for="(item,index) in data" :value="item.name" :key="index"></el-option>
						</view>
					</unicloud-db>
				</el-select>
			</uni-forms-item>
			
			<uni-forms-item name="phone" label="手机号码" required>
				<uni-easyinput placeholder="手机号码" v-model="formData.phone" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="number" label="编号" required>
				<uni-easyinput placeholder="教练的编号" v-model="formData.number" />
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
	} from '../../../js_sdk/validator/coachs.js';

	const db = uniCloud.database();
	const dbCmd = db.command;
	const dbCollectionName = 'coachs';

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
					"student": "",
					"company": "",
					"phone": "",
					"number": ""
					
				},
				formOptions: {},
				rules: {
					...getValidator(["name", "student", "company", "phone", "number"
					])
				}
			}
		},
		onLoad: function(e){
		    console.log(e.company); 
		    this.formData.company=e.company
			// this.get_company()
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {
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
				// 使用 clientDB 提交数据
				db.collection(dbCollectionName).add(value).then((res) => {
					uni.showToast({
						title: '新增成功'
					})
					this.getOpenerEventChannel().emit('refreshData')
					setTimeout(() => uni.navigateTo({
						url:'./all_coach'
					}), 500)
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
