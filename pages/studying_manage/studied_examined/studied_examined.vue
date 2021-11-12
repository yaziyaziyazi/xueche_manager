<template>
	<view>
		<view class="uni-header">
			<text space="emsp">月度公司某教练在学科二 科三人员  表六</text>
			
			<el-select style="width: 120px;" v-model="value_company" placeholder="请选择驾校" @change="change_company">
				<unicloud-db v-slot:default="{data, loading, error, options}" collection="companies"  @load="handleLoad"  :where="`city == '${value_city}'`">
					<view v-if="error">{{error.message}}</view>
					<view v-else>
						<el-option v-for="(item,index) in data" :value="item.name" :key="index">
						</el-option>
					</view>
				</unicloud-db>
			</el-select>
			<el-select style="width: 120px;" v-model="value_coach" placeholder="请选择教练" @change="change_coach">
				<unicloud-db v-if="bool2"  v-slot:default="{data, loading, error, options}" collection="coachs" field="name" @load="get"
					:where="`company=='${value_company}'`">
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
			</view>
		</view>
		<view class="uni-container">
			<unicloud-db v-if="bool" v-slot:default="{data, loading, error, options}" :where="swhere"
				collection="students">
				<view v-if="error">{{error.message}}</view>
				<view v-else>
					
					<uni-table border stripe style="width: 1000px;">
						<uni-tr>
							<uni-th align="center" style="width: 20%;">姓名</uni-th>
							<uni-th align="center" style="width: 20%;">科二已学学时</uni-th>
							<uni-th align="center" style="width: 20%;">科二已考次数</uni-th>
							<uni-th align="center" style="width: 20%;">科三已学学时</uni-th>
							<uni-th align="center" style="width: 20%;">科三已考次数</uni-th>
						</uni-tr>

						<uni-tr v-for="(item,index) in data" :key="index">

							<uni-td align="center">{{item.name}}</uni-td>

							<uni-td align="center">
							<text v-if="item.second">{{item.second.studied}}</text>
							</uni-td>
							<uni-td align="center">
							<text v-if="item.second">{{item.second.examined}}</text>
							</uni-td>
							<uni-td align="center">
							<text v-if="item.third">{{item.third.studied}}</text>
							</uni-td>
							<uni-td align="center">
							<text v-if="item.third">{{item.third.examined}}</text>
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
				value_city: '',
				query: '',
				bool2:'',
				where: '',
				time: '',
				month: '',
				name: '',
				bool: false
			}
		},
		computed: {

		},
		onLoad(option) {
			console.log(option)
			if(option.index){
				console.log(option.index)
			this.value_coach =	option.index  +'教练'
			}
		},
		created() {
			var myDate = new Date;
			this.value_month=myDate.getMonth()+1+"月"
			const value = uni.getStorageSync('city')
			this.value_city = value
		},
		methods: {
			get(data, ended, pagination){
				if(data[0]){
					if(this.value_coach ==''){
						this.value_coach=data[0].name+'教练'
					}
					
					this.change_coach()
				}
					
			},
			handleLoad(data, ended, pagination) {
				this.value_company=data[0].name
				 this.bool2=true
			},

			change_coach() {
				this.bool = false

				
				// if ( this.coach != "") {
					this.coach = this.value_coach.match(/(\S*)教练/)[1]
					this.swhere = "coach=='" + this.coach + "'"
					this.$nextTick(() => {
						this.bool = true
					})
				// }

			},
			change_company() {
				this.bool = false
				this.value_coach = ''
				
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
