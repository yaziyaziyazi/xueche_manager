<template>
	<view class="uni-container">
		<uni-forms ref="form" :value="formData" validateTrigger="bind">
			<!-- 			<uni-forms-item label="学员">
				<el-select style="width: 120px;" v-model="student_name" placeholder="请选择学员">
					<unicloud-db v-slot:default="{data, loading, error, options}" collection="students" field="name">
						<view v-if="error">{{error.message}}</view>
						<view v-else>
							<el-option v-for="(item,index) in data" :value="item.name" :key="index"></el-option>
						</view>
					</unicloud-db>
				</el-select>
			</uni-forms-item> -->
			<uni-forms-item name="name" label="姓名" required>
				<uni-easyinput placeholder="学员姓名" v-model="formData.name" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="mobile" label="手机号码" required>
				<uni-easyinput placeholder="手机号码" v-model="formData.mobile" trim="both" />
			</uni-forms-item>
			<uni-forms-item label="科目">
				<el-select style="width: 120px;" v-model="kemu" placeholder="请选择科目" @change="choice">
					<el-option v-for="(item,index) in 3" :value="'科目'+item" :key="index"></el-option>
				</el-select>
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
	const db = uniCloud.database();
	const dbCmd = db.command;
	const dbCollectionName = 'students';

	import {
		validator
	} from '../../../js_sdk/validator/students.js';

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
				kemu: '',
				student_name: "",
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
					...getValidator(["name", "kemu", "month_exam", "day_exam", "year","mobile"])
				}
			}
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {
			choice() {

			},

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
				if (this.kemu == "科目1") {
					db.collection(dbCollectionName).where({
							name: this.formData.name,
							mobile:this.formData.mobile
						})
						.update({
							first: {
								pause: "1"
							}
						}).then((res) => {
							if (res.result.updated == "1") {
								uni.showToast({
									title: '新增成功'
								})
								setTimeout(() => uni.navigateBack(), 1000)
							}
							if (res.result.updated == "0") {
								uni.showToast({
									title: '新增失败',
									icon: "error"
								})
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
				if (this.kemu == "科目2") {
					db.collection(dbCollectionName).where({
							name: this.formData.name,
							mobile:this.formData.mobile
						})
						.update({
							second: {
								pause: "1"
							}
						}).then((res) => {
							if (res.result.updated == "1") {
								uni.showToast({
									title: '新增成功'
								})
								setTimeout(() => uni.navigateBack(), 1000)
							}
							if (res.result.updated == "0") {
								uni.showToast({
									title: '新增失败',
									icon: "error"
								})
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
				if (this.kemu == "科目3") {
					db.collection(dbCollectionName).where({
							name: this.formData.name,
							mobile:this.formData.mobile
						})
						.update({
							third: {
								pause: "1"
							}
						}).then((res) => {
							if (res.result.updated == "1") {
								uni.showToast({
									title: '新增成功'
								})
								setTimeout(() => uni.navigateBack(), 1000)
							}
							if (res.result.updated == "0") {
								uni.showToast({
									title: '新增失败',
									icon: "error"
								})
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
	}
</script>
