<template>
	<view>
		<view class="uni-header">
			<text space="emsp">{{value_city}}各个驾校  表十一</text>
			
			<year-choice style="width: 120px;" @change="costPlannedAmountChange($event)"></year-choice>
			<el-select style="width: 120px;" v-model="value_month" placeholder="请选择月份" @change="change_month">
				<el-option v-for="(item,index) in 12" :value="(index+1)+'月'" :key="index"></el-option>
			</el-select>
			<el-select style="width: 120px;display: none;" v-model="value_city" placeholder="请选择城市" @change="change_city">
				<el-option v-for="(item,index) in city" :value="item" :key="index">
				</el-option>
			</el-select>
			<view class="uni-group">
				<view class="uni-title"></view>
				<view class="uni-sub-title"></view>
			</view>
			<view class="uni-group">
				<button class="uni-button" type="primary" size="mini" @click="navigateTo('./add_jiaxiao')">新增</button>

			</view>
		</view>
		<view class="uni-container">
			<unicloud-db ref="udb" v-if="bool" v-slot:default="{data, loading, error, options}" :where="`city == '${value_city}'`"
				collection="companies">
				<view v-if="error">{{error.message}}</view>
				<view v-else>
					
					<uni-table border stripe>
						<uni-tr>
							<uni-th align="center">编号</uni-th>
							<uni-th align="center">序号</uni-th>
							<uni-th align="center">驾校名称</uni-th>
							<uni-th align="center">科二在学人数</uni-th>
							<uni-th align="center">科三在学人数</uni-th>
							<uni-th align="center">科二及格率</uni-th>
							<uni-th align="center">科三及格率</uni-th>
							<uni-th align="center">操作</uni-th>
						</uni-tr>
						<uni-tr class='btn' v-for="(item,index) in data" :key="index">
							
							<uni-td align="center">{{item.number}}</uni-td>
							<uni-td align="center">{{index+1}}</uni-td>
							<uni-td align="center">{{item.name}}</uni-td>
							<uni-td align="center">{{item.keer_sum}}</uni-td>
							<uni-td align="center">{{item.kesan_sum}}</uni-td>
							
							
							<uni-td align="center" v-if="!item.keer_rate">0</uni-td>
							<uni-td align="center" v-else>{{item.keer_rate*100}}%</uni-td>
							<uni-td align="center" v-if="!item.kesan_rate">0</uni-td>
							<uni-td align="center" v-else>{{item.kesan_rate*100}}%</uni-td>
							<uni-td align="center">
								<button type="primary" style="margin-right: 20px;"
									@click="navigateTo('../all_coach/all_coach')">教练管理</button>
								<button type="warn" style="" @click="delete_company(item)">删除</button>
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
				n: '0',
				city: [],
				company: [],
				obj: [],
				value_month: '',
				value_city: '',
				where: '',
				time: '',
				coach: '',
				month: '',
				value_year: '',
				year: '',
				name: '',
				bool: false
			}
		},
		computed: {},
		onLoad() {
			const value = uni.getStorageSync('city')
			this.value_city = value
		},
		created() {
			var myDate = new Date;
			this.value_month=myDate.getMonth()+1+"月"
			this.change_content()
		},
		methods: {
			delete_company(item) {
				db.collection("students").where({
						company: item.name
					}).count()
					.then(res => {
						console.log(res);
						if(res.result.total>0){
							uni.showToast({
								icon:"error",
								title:"禁止删除，该驾校有学员"
							})
						}
						if(res.result.total==0){
							this.$refs.udb.remove(item._id, {
							  action: '', // 删除前后的动作
							  confirmTitle: '提示', // 确认框标题
							  confirmContent: '确认是否删除该驾校',  // 确认框内容
							  success: (res) => { // 删除成功后的回调
							    const { code, message } = res
								console.log(res)
							  },
							  fail: (err) => { // 删除失败后的回调
							    const { message } = err
								console.log(err)
							  },
							  complete: () => { // 完成后的回调
							  }
							})
						}
					}).catch(err => {
						console.error(err)
					})
			},
			costPlannedAmountChange(value) {
				console.log(value)
				this.bool = false
				this.value_year = value
				this.change_month()
			},
			navigateTo(url) {

				uni.navigateTo({
					url
				})
				this.$router.go(0);
				// location.reload()
			},
			show() {
				this.n = '0'
				return new Promise((resolve, reject) => {
					//你的逻辑代码
					db.collection("students").field("company")
						.get()
						.then((res) => {
							// 
							for (var i = 0; i < res.result.data.length; i++) {
								this.company[i] = res.result.data[i].company
							}
							this.company = this.deletefunc(this.company)
							// console.log(this.company)
							for (var i = 0; i < this.company.length; i++) {
								// console.log()
								uniCloud.callFunction({
									name: "company_passing_rate",
									data: {
										jiaxiao: this.company[i],
										month: this.month,
										year: this.value_year
									}
								}).then(res => {
									

									if (res.success == true) {
										this.n++
										if (this.n == this.company.length) {
											this.test()
										}
										
									}
								}).catch(err => {
									console.log(err)
								})

							}
						})
					resolve( /* 这里是需要返回的数据 */ )

				});
			},



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
			test() {
				return new Promise((resolve, reject) => {
					//你的逻辑代码
					var that = this

					// setTimeout(function() {
					that.bool = true
					// console.log("zzzzzzzzzzzzzzzz")

					// }, 1000)

					resolve( /* 这里是需要返回的数据 */ )
				});
			},
			change_month() {

				this.bool = false
				// })
				// this.$nextTick(() => {

				// console.log(this.month)
				if (this.value_year != '' && this.value_month != '') {
					this.month = this.value_month.match(/(\S*)月/)[1]
					this.show()
				}


			},

			change_city() {

			},

		},
	}
</script>
<style>
	.btn button {
		font-size: small;
		padding: 0px;
		width: 60px;
		display: inline-block;
		font-weight: 100;
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
