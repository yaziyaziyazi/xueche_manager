<template>
	<view class="uni-container">
		<uni-forms ref="form" :value="formData" validateTrigger="bind">
			<uni-forms-item name="name" label="姓名" required>
				<uni-easyinput placeholder="学员姓名" v-model="formData.name" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="mobile" label="手机号码" required>
				<uni-easyinput placeholder="手机号码" v-model="formData.mobile" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="kemu" label="科目" required>
				<uni-data-checkbox v-model="value" :localdata="range"></uni-data-checkbox>
				<!-- <uni-easyinput placeholder="学生的教练" v-model="value" /> -->
			</uni-forms-item>
			<uni-forms-item label="选择日期" required>
				<dataChange :mode="1" @change="dataChange($event)"></dataChange>
			</uni-forms-item>
			<uni-forms-item name="year" label="考试年份">
				<!-- <year-choice style="width: 120px;"  @change="costPlannedAmountChange($event)"></year-choice> -->
				<uni-easyinput placeholder="考试年份" v-model="formData.year" disabled />
			</uni-forms-item>
			<uni-forms-item name="month_exam" label="考试月份" required>
				<!-- <el-select v-model="formData.month" placeholder="请选择月份">
					<el-option v-for="(item,index) in 12" :value="(index+1)+'月'" :key="index"></el-option>
				</el-select> -->
				<uni-easyinput placeholder="考试月份" v-model="formData.month" trim="both" disabled />
			</uni-forms-item>

			<uni-forms-item name="day_exam" label="考试日期" required>
				<!-- <el-select v-model="formData.day" placeholder="请选择日期">
					<el-option v-for="(item,index) in 31" :value="(index+1)+'号'" :key="index"></el-option>
				</el-select> -->
				<uni-easyinput placeholder="考试号数" v-model="formData.day" />
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
				value_day: '',
				value_month: '',
				value: '',
				range: [{
					"value": "second",
					"text": "科二"
				}, {
					"value": "third",
					"text": "科三"
				}],
				formData: {
					"name": "",
					"kemu": "",
					"mobile": "",
					"month": "",
					"day": "",
					"year": "",
					"data": null,
					"first": null,
					"second": null,
					"third": null
				},
				formOptions: {},
				rules: {
					...getValidator(["name", "kemu", "month_exam", "day_exam", "year", "mobile"])
				}
			}
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {
			dataChange(value) {

				this.formData.year = value.split('-')[0]
				if (value.split('-')[1] < 10) {
					this.formData.month = value.split('-')[1].match(/0(\S*)/)[1]+'月'
				} else {
					this.formData.month = value.split('-')[1]+'月'
				}
				if (value.split('-')[2] < 10) {
					this.formData.day = value.split('-')[2].match(/0(\S*)/)[1]+'号'
				} else {
					this.formData.day = value.split('-')[2]+'号'
				}

			},
			costPlannedAmountChange(value) {
				this.formData.year = value
			},
			submit() {
				uni.showLoading({
					mask: true
				})
				this.$refs.form.submit().then((res) => {
					this.submitForm()
				}).catch((errors) => {
					uni.hideLoading()
				})
			},

			submitForm() {
				if (this.value == 'second') {
					uniCloud.callFunction({
							name: "add_exam_second",
							data: {
								year: this.formData.year,
								name: this.formData.name,
								mobile: this.formData.mobile,
								exam: this.formData.month + this.formData.day
							}
						}).then((res) => {
							// console.log(res)
							if (res.result.updated == "0") {
								uni.showToast({
									icon: "error",
									title: "无此学员"
								})
							}
							if (res.result.updated == "1") {
								// console.log(res)
								uni.showToast({
									icon: "success",
									title: '新增成功'
								})
								setTimeout(() => uni.navigateBack(), 1000)
							}
						})

						.finally(() => {
							uni.hideLoading()
						})

				}
				if (this.value == 'third') {
					uniCloud.callFunction({
							name: "add_exam_third",
							data: {
								year: this.formData.year,
								mobile: this.formData.mobile,
								name: this.formData.name,
								exam: this.formData.month + this.formData.day
							}
						}).then((res) => {
							if (res.result.updated == "0") {
								uni.showToast({
									icon: "error",
									title: "无此学员"
								})
							}
							if (res.result.updated == "1") {
								console.log(res)
								uni.showToast({
									icon: "success",
									title: '新增成功'
								})
								setTimeout(() => uni.navigateBack(), 1000)
							}

						})

						.finally(() => {
							uni.hideLoading()
						})

				}
			}

		}
		// 使用 clientDB 提交数据

	}
</script>
