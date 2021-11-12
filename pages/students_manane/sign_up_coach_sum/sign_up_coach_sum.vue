<template>
	<view>
		<view class="uni-header">
			<text space="emsp">月度各部报名人数 表四</text>
			<text></text>
			<text></text>
			<year-choice style="width: 120px;" @change="costPlannedAmountChange($event)"></year-choice>
			<el-select style="width: 120px;" v-model="value_month" placeholder="请选择月份" @change="change_month">
				<el-option v-for="(item,index) in 12" :value="(index+1)+'月'" :key="index"></el-option>
			</el-select>
			<el-select style="width: 120px;display: none;" v-model="value_city" placeholder="请选择城市"
				@change="change_city">
				<el-option v-for="(item,index) in city" :value="item" :key="index">
				</el-option>
			</el-select>
			<el-select style="width: 120px;" v-model="value_company" placeholder="请选择驾校" @change="change_company">
				<unicloud-db v-slot:default="{data, loading, error, options}" collection="companies"
					:where="`city == '${value_city}'`" @load="handleLoad">
					<view v-if="error">{{error.message}}</view>
					<view v-else>
						<el-option v-for="(item,index) in data" :value="item.name" :key="index">
						</el-option>
					</view>
				</unicloud-db>
			</el-select>
			<el-select style="width: 120px;" v-model="value_coach" placeholder="请选择教练" @change="change_coach">
				<unicloud-db v-if="bool2" v-slot:default="{data, loading, error, options}" collection="coachs"
					field="name" @load="get" :where="`company=='${value_company}'`">
					<view v-if="error">{{error.message}}</view>
					<view v-else>
						<el-option v-for="(item,index) in data" :value="item.name+'教练'" :key="index"></el-option>
					</view>
				</unicloud-db>
			</el-select>
			<view class="uni-group">
				<view class="uni-title"></view>
				<view class="uni-sub-title"></view>
			</view>
			<view class="uni-group">
				<button class="uni-button" type="primary" size="mini"
					@click="navigateTo('./add_students?coach='+coach)">新增</button>

			</view>
		</view>
		<view class="uni-container">
			<unicloud-db v-if="bool" v-slot:default="{data, loading, error, options}" :where="swhere"
				collection="students">
				<view v-if="error">{{error.message}}</view>
				<view v-else>

					<uni-table border stripe style="width: 1000px; b">
						<uni-tr>
							<uni-th align="center" style="width: 20%;">姓名</uni-th>
							<uni-th align="center" style="width: 25%;">电话</uni-th>
							<uni-th align="center" style="width: 25%;">身份证</uni-th>
							<uni-th align="center" style="width: 30%;">操作</uni-th>
						</uni-tr>

						<uni-tr v-for="(item,index) in data" :key="index">

							<uni-td align="center">{{item.name}}</uni-td>

							<uni-td align="center">{{item.mobile}}</uni-td>
							<uni-td align="center">{{item.card}}</uni-td>
							<uni-td align="center" class="juzhong">
								<button type="primary" size="mini"
									@click="navigateTo('./edit_student?id='+item._id)">编辑</button>
								<button type="default" size="mini" style="font-size: 14px"
									@click="set_pause(item)">设为库存学员</button>
							</uni-td>
						</uni-tr>
					</uni-table>
				</view>
			</unicloud-db>

		</view>
	</view>


</template>

<script>
	import {
		enumConverter
	} from '../../../js_sdk/validator/students.js';

	const db = uniCloud.database()


	export default {
		data() {
			return {
				years: [],
				n: '0',
				swhere: '',
				coach: '',
				company: [],
				year: '',
				value_month: '',
				value_company: '',
				value_coach: '',
				value_year: '',
				query: '',
				where: '',
				value_city: '',
				city: [],
				time: '',
				month: '',
				bool2: false,
				name: '',
				bool: false
			}
		},
		computed: {

		},
		onLoad(option) {
			console.log(option)
			if (option.index) {
				console.log(option.index)
				this.value_coach = option.index + '教练'
			}
		},
		created() {
			var myDate = new Date;
			this.value_month = myDate.getMonth() + 1 + "月"
			const value = uni.getStorageSync('city')
			this.value_city = value
			this.change_content()
		},
		methods: {
			change_content() {

				db.collection("companies")
					.get()
					.then((res) => {

						for (var i = 0; i < res.result.data.length; i++) {
							this.city[i] = res.result.data[i].city
						}
						this.city = this.deletefunc(this.city)
						// console.log(this.city)
					})
			},
			deletefunc(totalList) {
				var temp = [] //一个新的临时数组
				for (var i = 0; i < totalList.length; i++) {
					if (temp.indexOf(totalList[i]) == -1) {
						temp.push(totalList[i])
					}
				}
				return temp
			},
			get(data, ended, pagination) {
				if (data[0]) {
					if (this.value_coach == '') {
						this.value_coach = data[0].name + '教练'
					}

					this.change_coach()
				}

			},
			handleLoad(data, ended, pagination) {
				this.value_company = data[0].name
				this.bool2 = true
			},
			costPlannedAmountChange(value) {

				this.bool = false
				this.value_year = value
				this.change_month()
			},
			set_pause(item) {
				if (item.first == undefined || item.first.enable != '1') {
					db.collection("students").where({
						_id: item._id
					}).update({
						first: {
							pause: '1'
						}
					}).then(res => {
						// console.log(res.result.updated=="1")
						if (res.result.updated == "1") {
							uni.showToast({
								icon: "success",
								title: "设置成功"
							})
						}
						if (res.result.updated == "0") {
							uni.showToast({
								icon: "error",
								title: "请勿重复设置"
							})
						}
					})
				}
				if (item.second != undefined && item.second.enable != '1') {
					db.collection("students").where({
						_id: item._id
					}).update({
						second: {
							pause: '1'
						}
					}).then(res => {
						// console.log(res)
						if (res.result.updated == "1") {
							uni.showToast({
								icon: "success",
								title: "设置成功"
							})
						}
						if (res.result.updated == "0") {
							uni.showToast({
								icon: "error",
								title: "请勿重复设置"
							})
						}
					})
				}
				if (item.third != undefined && item.third.enable != '1') {
					db.collection("students").where({
						_id: item._id
					}).update({
						third: {
							pause: '1'
						}
					}).then(res => {

						if (res.result.updated == "1") {
							uni.showToast({
								icon: "success",
								title: "设置成功"
							})
						}
						if (res.result.updated == "0") {
							uni.showToast({
								icon: "error",
								title: "请勿重复设置"
							})
						}
					})
				}
			},

			navigateTo(url) {
				uni.navigateTo({
					url
				})
			},

			change_month() {
				this.bool = false
				this.month = this.value_month.match(/(\S*)月/)[1]
				this.swhere = "coach=='" + this.coach + "' && application_time.year == " + this.value_year +
					" && application_time.month==" + this.month
				if (this.value_year != "" && this.coach != "") {
					this.$nextTick(() => {
						this.bool = true
					})
				}

			},
			change_coach() {
				this.bool = false

				if (this.value_year != "" && this.month != "" && this.value_coach != '') {
					this.coach = this.value_coach.match(/(\S*)教练/)[1]
					this.swhere = "coach=='" + this.coach + "' && application_time.year == " + this.value_year +
						" && application_time.month==" + this.month
					this.$nextTick(() => {
						this.bool = true
					})
				}

			},
			change_company() {
				this.bool = false
				this.value_coach = ''
				this.change_coach()
			},
			change_city() {

			},

		},
	}
</script>
<style>
	.juzhong {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.time {
		background-color: #e3e3e3;
	}

	.morning {
		background-color: #ebeff6;
		/* z-index: 9; */
	}

	.afternoon {
		background-color: #e5ffe4;
	}

	.evening {
		background-color: #fffeed;
	}

	.top {
		position: -webkit-sticky;
		position: sticky;
		top: 0;
		z-index: 2;
	}

	.sticky {

		position: -webkit-sticky;
		position: sticky;
		left: 0;
		z-index: 1;
	}

	.el-dropdown {
		vertical-align: top;
	}

	.el-dropdown+.el-dropdown {
		margin-left: 15px;
	}

	.el-icon-arrow-down {
		font-size: 12px;
	}

</style>
