<script>
	import {
		mapGetters,
		mapActions
	} from 'vuex'
	import config from '@/admin.config.js'
	import {
		version
	} from './package.json'
	import yearChoice from './components/year-choice/year-choice'
	import monthChange from './components/monthChange/monthChange'
	import dataChange from './components/dataChange/dataChange'
	export default {
		computed: {
			...mapGetters({
				isTokenValid: 'user/isTokenValid'
			})
		},
		methods: {
			...mapActions({
				init: 'app/init'
			})
		},
		onPageNotFound(msg) {
			uni.redirectTo({
				url: config.error.url
			})
		},
		onLaunch: function() {
			if (!this.isTokenValid) {
				uni.redirectTo({
					url: config.login.url
				})
			} else {
				this.init()
			}
		},
		onShow: function() {
			 uni.$on('update',function(data){
			        console.log('监听到事件来自 update ，携带参数 msg 为：' + data.msg);
					
					
			    })

		},
		onHide: function() {
		
		}
	}
</script>

<style>
	@import '@/common/uni.css';
	@import '@/common/uni-icons.css';

	/deep/.uni-app--showleftwindow uni-page-wrapper {
		background-color: #EEF0F3;
	}

	/deep/.uni-sub-menu {
		display: none !important;
	}

	/deep/ .uni-app--showleftwindow uni-page-body {
	
		background-color:#EEF0F3 ;
	}
	.uni-header{
	 justify-content:flex-start;
	}
	.uni-header>uni-view{
		margin-left: 30px;
	} 
	.uni-header>.el-select{
		margin-left: 19px;
	}
	.table--stripe[data-v-6cd49106] .uni-table-tr:nth-child(2n + 3){
		background-color: rgba(255, 255, 255, 1);
	}
	.table--border {
	   border: 1px #9b9d9f solid !important;
	}
	.table--border{
		border: 1px #9b9d9f solid !important;
	}
</style>
