<template>
	<view>
		<div class="block">
			<el-date-picker v-model="value" type="date" placeholder="选择日期"   @change="dataChange"  format="yyyy 年 MM 月 dd 日"
				value-format="yyyy-MM-dd" :picker-options="pickerOptions0">
			</el-date-picker>
		</div>
	</view>
</template>

<script>
	export default {
		name: "dataChange",
		props: {
			mode: {
				type: Number,
				required: false,
				default: 0
			},
			trim:{
				type:Boolean,
				required:false,
				default:false
			}
		},
		data() {
			return {
				value: '',

			};
		},
		computed: {
			pickerOptions0() {
				if (this.mode == 1) {
					return {
						disabledDate: time => (time.getTime() <( Date.now() - 8.64e7)),
					};
				}
				if (this.mode == 2) {
					return {
						disabledDate: time => (time.getTime() >( Date.now() - 8.64e6)),
					};
				}
				if (this.mode == 3) {
					return {
						disabledDate: time => (time.getTime() < Date.now()),
					};
				}
				if (this.mode == 4) {
					return {
						disabledDate: time => (time.getTime() > Date.now()),
					};
				}
				if (this.mode == 5) {
					let curDate = (new Date()).getTime();
					let three = 90 * 24 * 3600 * 1000;
					let threeMonths = curDate - three;
					return {
						disabledDate: time => (time.getTime() > Date.now() || time.getTime() < threeMonths),
					};
				}
			},
		},
		methods: {
			dataChange(value) {
				this.value = value
				this.$emit('change', this.value);
			},
		}
	}
</script>

<style>

</style>
