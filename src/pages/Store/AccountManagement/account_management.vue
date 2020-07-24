<template>
	<div>
		<el-card>
			<div class="card_tab">
				<div class="tab_item" :class="{'active_tab':active_tab_index == '1'}" @click="checkTab('1')">余额账户</div>
				<div class="tab_item" :class="{'active_tab':active_tab_index == '2'}" @click="checkTab('2')">服务费账户</div>
			</div>
		</el-card>
		<YueAccount style="margin-top: 24px;" v-if="active_tab_index == '1'" :store_id="store_id"/>
		<ServiceMoney style="margin-top: 24px;" v-if="active_tab_index == '2'" :store_id="store_id"/>
	</div>
</template>
<style lang="less" scoped>
.card_tab{
	border-bottom: 1px solid #E8E8E8;
	height: 54px;
	width: 100%;
	display: flex;
	align-items: center;
	.tab_item{
		margin-right: 70px;
		font-size: 16px;
		color: #666666;
	}
	.active_tab{
		border-bottom:2px solid #008DFF;
		height: 54px;
		line-height: 54px;
		color: #008DFF;
	}
}
</style>
<script>
	import YueAccount from './YueAccount/yue_account.vue'
	import ServiceMoney from './service_money.vue'
	export default{
		data(){
			return{
				active_tab_index:'1',
				store_id:""
			}
		},
		created(){
			this.store_id = this.$route.query.store_id;
		},
		methods:{
			checkTab(type){
				this.active_tab_index = type;
			}
		},
		components:{
			YueAccount,ServiceMoney
		}
	}
</script>
















