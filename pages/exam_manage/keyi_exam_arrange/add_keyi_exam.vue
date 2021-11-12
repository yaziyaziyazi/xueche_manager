<template>
	<view class="uni-container">
		<uni-forms ref="form" :value="formData" validateTrigger="bind">
			<uni-forms-item name="name" label="姓名" required>
				<uni-easyinput placeholder="学员姓名" v-model="formData.name" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="mobile" label="手机号码" required>
				<uni-easyinput placeholder="手机号码" v-model="formData.mobile" trim="both" />
			</uni-forms-item>
			<uni-forms-item  label="选择日期"  required>
				<dataChange :mode="1"  @change="dataChange($event)"></dataChange>
			</uni-forms-item>
							
			<uni-forms-item name="year" label="考试年份">

				<!-- <year-choice :finish="-1" :begin="1" style="width: 120px;"  @change="costPlannedAmountChange($event)"></year-choice> -->
				<uni-easyinput placeholder="学员考试的年份" v-model="formData.year" disabled />
			</uni-forms-item>
			<uni-forms-item name="month_exam" label="考试月份" required>
				<!-- <monthChange  @change="costMonth($event)" :mode_after="true" ></monthChange> -->
				<uni-easyinput placeholder="学员考试的月份" v-model="formData.month" disabled />
				<!-- <el-select v-model="formData.month" placeholder="请选择月份">
					<el-option v-for="(item,index) in 12" :value="(index+1)+'月'" :key="index"></el-option>
				</el-select> -->
			</uni-forms-item>

			<uni-forms-item name="day_exam" label="考试日期" required>
				
				<uni-easyinput placeholder="学员考试的号数" v-model="formData.day" disabled />
				<!-- <el-select v-model="formData.day" placeholder="请选择日期">
					<el-option v-for="(item,index) in 31" :value="(index+1)+'号'" :key="index"></el-option>
				</el-select> -->
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
				formData: {
					"name": "",
					"kemu": "",
					"month": "",
					"day": "",
					"year": "",
					"mobile":"",
					"data": null,
					"first": null,
					"second": null,
					"third": null
				},
				formOptions: {},
				rules: {
					...getValidator(["name", "month_exam", "day_exam", "year","mobile"])
				}
			}
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {
			dataChange(value){
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
			costMonth(value){
					console.log()
					this.formData.month = value+'月'
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
				uniCloud.callFunction({
						name: "add_keyi_exam",
						data: {
							year: this.formData.year,
							mobile:this.formData.mobile,
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
							uni.showToast({
								icon: "success",
								title: '新增成功'
							})
							setTimeout(() => uni.navigateBack(), 1000)
						}

						// 
					})
					.finally(() => {
						uni.hideLoading()
					})
			}

		}

	}
</script>
