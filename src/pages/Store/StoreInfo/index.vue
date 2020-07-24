<template>
	<div>
		<el-card>
			<div class="card_tab">
				<div class="tab_item" :class="{'active_tab':active_tab_index == '1'}" @click="checkTab('1')">商户信息</div>
				<div class="tab_item" :class="{'active_tab':active_tab_index == '2'}" @click="checkTab('2')">开票信息</div>
				<div class="tab_item" :class="{'active_tab':active_tab_index == '3'}" @click="checkTab('3')">签约信息</div>
				<div class="tab_item" :class="{'active_tab':active_tab_index == '4'}" @click="checkTab('4')">提醒设置</div>
			</div>
		</el-card>
		<StoreInfo style="margin-top: 24px;" v-if="active_tab_index == '1'" :store_id="store_id"/>
		<MackInvoice style="margin-top: 24px;" v-if="active_tab_index == '2'" :store_id="store_id"/>
		<SignInfo style="margin-top: 24px;" v-if="active_tab_index == '3'" :store_id="store_id"/>
		<RemindSetting style="margin-top: 24px;" v-if="active_tab_index == '4'" :store_id="store_id"/>
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
	import StoreInfo from './store_info.vue'
	import MackInvoice from './mack_invoice.vue'
	import SignInfo from './sign_info.vue'
	import RemindSetting from './remind_setting.vue'
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
			StoreInfo,
			MackInvoice,
			SignInfo,
			RemindSetting
		}
	}
</script>
















