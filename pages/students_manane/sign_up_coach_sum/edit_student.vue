<template>
	<view class="uni-container">
		<uni-forms ref="form" :value="formData" validateTrigger="bind">
			<uni-forms-item name="name" label="姓名">
				<uni-easyinput placeholder="用户姓名" v-model="formData.name" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="card" label="身份证">
				<uni-easyinput placeholder="学生的身份证" v-model="formData.card" />
			</uni-forms-item>
			<uni-forms-item name="coach" label="教练">
				<el-select style="width: 120px;" v-model="formData.coach" placeholder="请选择教练" @change="get_company">
					<unicloud-db v-slot:default="{data, loading, error, options}" collection="coachs" field="name">
						<view v-if="error">{{error.message}}</view>
						<view v-else>
							<el-option v-for="(item,index) in data" :value="item.name" :key="index"></el-option>
						</view>
					</unicloud-db>
				</el-select>
			</uni-forms-item>
			<!-- <uni-forms-item name="coach" label="教练">
				<uni-easyinput placeholder="学生的教练" v-model="formData.coach" />
			</uni-forms-item> -->
			<uni-forms-item name="mobile" label="手机号码">
				<uni-easyinput placeholder="手机号码" v-model="formData.mobile" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="company" label="驾校">
				<uni-easyinput disabled placeholder="学员的所属驾校" v-model="formData.company" />
			</uni-forms-item>
		<!-- 	<uni-forms-item name="company" label="驾校">
				<uni-easyinput placeholder="学生的所属驾校" v-model="formData.company" />
			</uni-forms-item> -->

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
	} from '../../../js_sdk/validator/students.js';

	const db = uniCloud.database();
	const dbCmd = db.command;
	const dbCollectionName = 'students';

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
					"card": "",
					"coach": "",
					"mobile": "",
					"company": "",
					"data": null,
					"first": null,
					"second": null,
					"third": null,
					"application_time": null
				},
				formOptions: {},
				rules: {
					...getValidator(["name", "card", "coach", "mobile", "company"
						
					])
				}
			}
		},
		onLoad(e) {
			const id = e.id
			this.formDataId = id
			this.getDetail(id)
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {
			get_company() {
				// console.log("zzzzzzzzzz")
				db.collection("coachs").where({
						name: this.formData.coach
					}).field('company').get()
					.then(res => {
						// console.log()
						this.formData.company = res.result.data[0].company
						// console.log(this.formData.company)
					})
			},
			/**
			 * 触发表单提交
			 */
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
				db.collection(dbCollectionName).doc(this.formDataId).update(value).then((res) => {
					uni.showToast({
						title: '修改成功'
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
			},

			/**
			 * 获取表单数据
			 * @param {Object} id
			 */
			getDetail(id) {
				uni.showLoading({
					mask: true
				})
				db.collection(dbCollectionName).doc(id).field(
					'name,card,coach,mobile,company,data,first,second,third,application_time').get().then((res) => {
					const data = res.result.data[0]
					if (data) {
						this.formData = data
					}
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
