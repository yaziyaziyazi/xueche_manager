<template>
	<view>
		<view class="uni-header">
			<text space="emsp">学员约车 表十</text>
			<unicloud-db v-slot:default="{data, loading, error, options}" collection="companies" @load="handleLoad"
				:where="`city == '${value_city}'`">
				<view v-if="error">{{error.message}}</view>
				<view v-else>
					<el-select style="width: 120px;" v-model="value_company" placeholder="请选择驾校"
						@change="change_company">
						<el-option v-for="(item,index) in data" :value="item.name" :key="index">
						</el-option>
					</el-select>
				</view>
			</unicloud-db>
			<el-select style="width: 120px;" v-model="value_coach" placeholder="请选择教练" @change="change_coach">
				<unicloud-db v-if="bool2" v-slot:default="{data, loading, error, options}" collection="coachs"
					field="name" @load="get" :where="`company=='${value_company}'`">

					<view v-if="error">{{error.message}}</view>
					<view v-else>
						<el-option v-for="(item,index) in data" :value="item.name+'教练'" :key="index"></el-option>
					</view>
				</unicloud-db>
			</el-select>
			<year-choice style="width: 120px;" @change="costPlannedAmountChange($event)"></year-choice>
			<el-select style="width: 120px;" v-model="value_month" placeholder="请选择月份" @change="change_month">
				<el-option v-for="(item,index) in 12" :value="(index+1)+'月'" :key="index"></el-option>
			</el-select>

			<view class="uni-group">
				<view class="uni-title"></view>
				<view class="uni-sub-title"></view>
			</view>

		</view>
		<view class="uni-container">

			<uni-table v-if="bool" border stripe @selection-change="selectionChange" style="width: 1300px;">

				<uni-tr v-for="n in 4" :key="n">
					<uni-th align="center" class="sticky time" v-if="n<2">时间</uni-th>
					<!--  -->
					<uni-th align="center" class="sticky morning" v-else-if="n<3">上午8-12点</uni-th>
					<uni-th align="center" class="sticky afternoon" v-else-if="n<4">下午3-6点</uni-th>
					<uni-th align="center" class="sticky evening" v-else>晚上7-9点</uni-th>

					<uni-table emptyText="" border stripe>
						<uni-tr v-if="n<2" class="date">
							<uni-th align="center" v-for="index in 31" :key="index" class="" style="font-size: 15px;">
								<text>{{index}}号</text>
							</uni-th>
						</uni-tr>

						<uni-tr v-for="(item,index) in 4" :key="index" v-if="n>1" class="name">

							<uni-th align="center" :class="'control'+index" v-for="index in 31" :key="index"
								style="font-size: 15px;height:50px;">
								<text :ref="n+'+'+index"></text>
							</uni-th>
						</uni-tr>

					</uni-table>
				</uni-tr>
			</uni-table>

		</view>
	</view>


</template>

<script>
	import {
		enumConverter
	} from '../../js_sdk/validator/students.js';

	const db = uniCloud.database()
	// 表查询配置
	const dbOrderBy = '' // 排序字段
	const dbSearchFields = [] // 模糊搜索字段，支持模糊搜索的字段列表
	// 分页配置
	const pageSize = 20
	const pageCurrent = 1

	export default {
		data() {
			return {
				value_company: '',
				value_month: '',
				value_coach: '',
				value_city:'',
				query: '',
				where: '',
				look: '',
				day: '',
				time: '',
				coach: '',
				bool2: '',
				month: '',
				year: '',
				value_year: '',
				name: '',
				bool: true,
				selectedIndexs: [],
				options: {
					pageSize,
					pageCurrent,
					...enumConverter
				},
				imageStyles: {
					width: 64,
					height: 64
				}
			}
		},
		computed: {

		},
		created() {
			const value = uni.getStorageSync('city')
			this.value_city = value
			var myDate = new Date;
			this.value_month = myDate.getMonth() + 1 + "月"
		},
		onLoad(option) {
			console.log(option)
			if(option.index){
				console.log(option.index)
			this.value_company =	option.index 
			}
		},
		methods: {
			get(data, ended, pagination) {

				if (data[0]) {
					
					this.value_coach = data[0].name + '教练'
					this.change_coach()
				}

			},
			handleLoad(data, ended, pagination) {
				if(this.value_company ==''){
					this.value_company=data[0].name
				}
				
				this.bool2 = true
			},
			costPlannedAmountChange(value) {
				// console.log(value)
				this.bool = false
				this.value_year = value
				this.$nextTick(() => {
					this.bool = true
				})
				this.students()
			},

			change_month() {

				this.bool = false
				this.$nextTick(() => {
					this.bool = true
				})
				this.students()
			},
			change_coach() {
				this.bool = false
				this.$nextTick(() => {
					this.bool = true
				})
				this.students()
			},
			insert() {
				// console.log(this.$refs[this.look][0].$el.innerHTML)
				for (var i = 0; i < this.$refs[this.look].length; i++) {
					if (this.$refs[this.look][i].$el.innerHTML == "<span></span>") {
						this.$refs[this.look][i].$el.innerHTML = this.name
						return
					}
				}

			},
			change_company() {
				this.bool = false
				this.value_coach = ''
				this.$nextTick(() => {
					this.bool = true
				})
				this.students()
			},
			students() {
				const db = uniCloud.database();
				db.collection("car_appointment,students")
					.where('name.company=="' + this.value_company + '"')
					.field('data,name.name,name.coach')
					.get()
					.then(res => {

						// console.log(res.result.data);

						console.log(res.result.data);

						for (var i = 0; i < res.result.data.length; i++) {
							this.name = res.result.data[i].name[0].name
							this.coach = res.result.data[i].name[0].coach + '教练'
							this.day = res.result.data[i].data.day
							this.time = res.result.data[i].data.time
							// console.log(this.day,this.time)
							this.year = res.result.data[i].data.year
							this.month = res.result.data[i].data.month + '月'
							if (this.coach == this.value_coach) {
								if (this.year == this.value_year) {
									if (this.month == this.value_month) {

										if (this.time == "上午") {
											this.time = 2
										} else if (this.time == "中午") {
											this.time = 3
										} else {
											this.time = 4
										}

										this.look = this.time + '+' + this.day
										// console.log(this.look)
										this.insert()
									}
								}

							}
						}
					}).catch(err => {
						console.error(err)
					})

			},
			getWhere() {
				const query = this.query.trim()
				if (!query) {
					return ''
				}
				const queryRe = new RegExp(query, 'i')
				return dbSearchFields.map(name => queryRe + '.test(' + name + ')').join(' || ')
			},
			search() {
				const newWhere = this.getWhere()
				const isSameWhere = newWhere === this.where
				this.where = newWhere
				if (isSameWhere) { // 相同条件时，手动强制刷新
					this.loadData()
				}
			},
			loadData(clear = true) {
				this.$refs.udb.loadData({
					clear
				})
			},

			navigateTo(url, clear) {
				// clear 表示刷新列表时是否清除页码，true 表示刷新并回到列表第 1 页，默认为 true
				uni.navigateTo({
					url,
					events: {
						refreshData: () => {
							this.loadData(clear)
						}
					}
				})
			},
		},
	}
</script>
<style scoped>
	/deep/ .date .uni-table-th-content {
		width: 110px;
	}

	/deep/ .name .uni-table-th-content {
		width: 110px;
	}

	/deep/.uni-table-loading[data-v-6cd49106]{
		display: none;
	}
	.control1 ,.control2 ,.control3,.control4,.control5,.control6,.control7,.control8,.control9
	,.control10,.control11,.control12,.control13,.control14,.control15,.control16,.control17,.control18
	,.control19,.control20,.control21,.control22,.control23,.control24,.control25,.control26,.control27,.control28
	,.control29,.control30,.control31{
		box-sizing: border-box !important;
		width: 140.04px !important;
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
