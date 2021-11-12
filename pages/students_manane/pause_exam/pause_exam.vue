<template>
	<view>
		<view class="uni-header">
			<text space="emsp">暂时不考学员  表八</text>
			
			<!-- <button type="default" @click="tetete">测试</button> -->
			<el-select style="width: 120px;" v-model="value_company" placeholder="请选择驾校" @change="change_company">
				<el-option v-for="(item,index) in company" :value="item" :key="index">
				</el-option>
			</el-select>
			<view class="uni-group">
				<view class="uni-title"></view>
				<view class="uni-sub-title"></view>
			</view>
			<view class="uni-group">
		
				<button class="uni-button" type="primary" size="mini" @click="navigateTo('./add_pause')">新增</button>

			</view>
		</view>
		<view class="uni-container">
			<unicloud-db v-if="bool" v-slot:default="{data, loading, error, options}" :where="sWhere"
				collection="students">
				<view v-if="error">{{error.message}}</view>
				<view v-else>
					<uni-table border stripe style="width:1000px; ">
						<uni-tr style="background-color: rgba(0,0,0,.1);">
							<uni-th style="width: 10%;" align="center"></uni-th>
							<uni-td v-for="(item,index) in max" 
							:key="index" align="center">{{item}}</uni-td>
							
						</uni-tr>
						<uni-tr>
							<uni-td align="center">科一</uni-td>
							<uni-td v-for="(item,index) in data" :key="index" v-if="item.first!=undefined&&item.first.pause=='1'" align="center">{{item.name}}</uni-td>


						</uni-tr>
						<uni-tr>
							<uni-td align="center">科二</uni-td>
							<uni-td v-for="(item,index) in data" :key="index" v-if="item.second!=undefined&&item.second.pause=='1'" align="center">{{item.name}}</uni-td>
							
						</uni-tr>
						<uni-tr>
							<uni-td align="center">科三</uni-td>
							<uni-td v-for="(item,index) in data" :key="index" v-if="item.third!=undefined&&item.third.pause=='1'" align="center">{{item.name}}</uni-td>
							
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
				num:'',
				n: '0',
				coach: [],
				company: [],
				obj: [],
				value_month: '',
				value_company: '',
				query: '',
				where: '',
				time: '',
				month: '',
				name: '',
				bool: false,
				sWhere: '',
				max:''
			}
		},
		created() {
			const value = uni.getStorageSync('city')
			this.value_city = value
			this.change_content()
			
		},
		onLoad(option) {
			console.log(option)
			if(option.index){
				console.log(option.index)
			this.value_company =	option.index 
			}
		},
		methods: {
			navigateTo(url) {
				uni.navigateTo({
					url
				})
			},
			tetete() {
				db.collection("students").get()
				.then(res=>{
					var a=0
					var b=0
					var c=0
					for(var i=0;i<res.result.data.length;i++){
						if(res.result.data[i].first!=undefined&&res.result.data[i].first.pause=='1'){
							a++
						}
						if(res.result.data[i].second!=undefined&&res.result.data[i].second.pause=='1'){
							b++
						}
						if(res.result.data[i].third!=undefined&&res.result.data[i].third.pause=='1'){
							c++
						}
					}
					
					var maxs = a>b ? a : b;
					this.max =  maxs>c ? maxs : c; 
					
				})
			},


			change_content() {
			
				db.collection("companies").where({
					'city':this.value_city
				})
					.get()
					.then((res) => {
						if(this.value_company ==''){
							this.value_company=res.result.data[0].name
						}
						
						for (var i = 0; i < res.result.data.length; i++) {
							this.company[i] = res.result.data[i].name
						}
						this.company = this.deletefunc(this.company)
						this.change_company()
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

			change_company() {
				this.tetete()
				this.bool = false
				this.sWhere = "company=='" + this.value_company+"'"
				this.$nextTick(() => {
					this.bool = true
				})
				
			},

		},
	}
</script>
<style>
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
