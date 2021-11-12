<template>
	<view class="uni-container">
		<uni-forms ref="form" :value="formData" validateTrigger="bind">
			<uni-forms-item name="name" label="姓名">
				<uni-easyinput placeholder="用户姓名" v-model="formData.name" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="card" label="身份证">
				<uni-easyinput placeholder="学员的身份证" v-model="formData.card" />
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
			<uni-forms-item name="mobile" label="手机号码">
				<uni-easyinput placeholder="手机号码" v-model="formData.mobile" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="company" label="驾校">
				<uni-easyinput disabled placeholder="学员的所属驾校" v-model="formData.company" />
			</uni-forms-item>
			<uni-forms-item name="year" label="报名年份">
				<year-choice style="width: 120px;" @change="costPlannedAmountChange($event)"></year-choice>
				<!-- <uni-easyinput  placeholder="学员报名的年份" v-model="formData.year" /> -->
			</uni-forms-item>
			<uni-forms-item name="month" label="报名月份">
				<el-select style="width: 120px;" v-model="formData.month" placeholder="请选择月份">
					<el-option v-for="(item,index) in 12" :value="(index+1)" :key="index"></el-option>
				</el-select>
				<!-- <uni-easyinput  placeholder="学员报名的月份" v-model="formData.month" /> -->
			</uni-forms-item>
			<uni-forms-item name="day" label="报名日期">
				<el-select style="width: 120px;" v-model="formData.day" placeholder="请选择日期">
					<el-option v-for="(item,index) in 31" :value="(index+1)" :key="index"></el-option>
				</el-select>
				<!-- <uni-easyinput  placeholder="学员报名的日期" v-model="formData.day" /> -->
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
					"year": "",
					"month": "",
					"day": "",
					"company": "",
					"data": null,
					"first": null,
					"second": null,
					"third": null
				},
				formOptions: {},
				rules: {
					...getValidator(["name", "card", "coach", "mobile", "company", "year", "month", "day"])
				}
			}
		},
		onLoad: function(e) {
			// console.log(e.coach); 
			this.formData.coach = e.coach
			this.get_company()
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {
			costPlannedAmountChange(value) {
				this.formData.year = value

			},
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
					this.submitForm()
				}).catch((errors) => {
					console.log(errors)
					uni.hideLoading()
				})
			},

			submitForm() {
				// 使用 clientDB 提交数据
				db.collection(dbCollectionName)
					.add({
						name: this.formData.name,
						coach: this.formData.coach,
						card: this.formData.card,
						company: this.formData.company,
						mobile: this.formData.mobile,
						application_time: {
							year: this.formData.year,
							month: this.formData.month,
							day: this.formData.day
						}
					}).then((res) => {
						uni.showToast({
							title: '新增成功'
						})
						// this.getOpenerEventChannel().emit('refreshData')
						setTimeout(() => uni.navigateBack(), 1000)
						// setTimeout(() => uni.navigateBack(), 500)
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
