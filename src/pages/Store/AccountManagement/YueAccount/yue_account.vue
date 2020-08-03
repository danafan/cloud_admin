<template>
	<div>
		<el-card>
			<div class="yue_info">
				<div class="info_item">
					<div class="info_item_title">银行卡</div>
					<div class="info_row">
						<div class="row_item">
							<div class="row_item_label">可用余额（元）</div>
							<div class="row_item_val">{{storeInfo.bank_balance}}</div>
						</div>
						<div class="row_item">
							<div class="row_item_label">不可用余额（元）</div>
							<div class="row_item_val">{{storeInfo.bank_frozen_amount}}</div>
						</div>
					</div>
					<div class="buttons">
						<el-button type="primary" size="small" @click="cash(storeInfo.bank_balance,'1')">提现</el-button>
					</div>
				</div>
				<div class="info_item">
					<div class="info_item_title">支付宝</div>
					<div class="info_row">
						<div class="row_item">
							<div class="row_item_label">可用余额（元）</div>
							<div class="row_item_val">{{storeInfo.alipay_balance}}</div>
						</div>
						<div class="row_item">
							<div class="row_item_label">不可用余额（元）</div>
							<div class="row_item_val">{{storeInfo.alipay_frozen_amount}}</div>
						</div>
					</div>
					<div class="buttons">
						<el-button type="primary" size="small" @click="cash(storeInfo.alipay_balance,'2')">提现</el-button>
					</div>
				</div>
			</div>
		</el-card>
		<el-card style="margin-top: 20px">
			<div class="card_tab">
				<div class="tab_item" :class="{'active_tab':active_tab_index == '1'}" @click="checkTab('1')">充值记录</div>
				<div class="tab_item" :class="{'active_tab':active_tab_index == '2'}" @click="checkTab('2')">转账付款记录</div>
				<div class="tab_item" :class="{'active_tab':active_tab_index == '3'}" @click="checkTab('3')">转账收款记录</div>
			</div>
			<TopUp v-if="active_tab_index == '1'" :store_id="store_id"/>
			<Payment v-if="active_tab_index == '2'" :store_id="store_id"/>
			<Collection v-if="active_tab_index == '3'" :store_id="store_id"/>
		</el-card>
		<!-- 提现 -->
		<el-dialog title="提现" :visible.sync="showTransfer">
			<el-form size="small" class="from_box">
				<el-form-item label="可提现金额：" label-width="120px">
					<span>{{money}}</span>
				</el-form-item>
				<el-form-item label="提现金额：" label-width="120px">
					<el-input type="number" v-model="transferReq.withdraw_money" placeholder="请输入"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="showTransfer = false" size="small">取 消</el-button>
				<el-button type="primary" @click="subTransfer" size="small">确 认</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<style lang="less" scoped>
.yue_info{
	width: 100%;
	display: flex;
	justify-content: space-between;
	.info_item{
		width: 45%;
		display: flex;
		flex-direction: column;
		align-items: center;
		.info_item_title{
			font-size: 18px;
			color: #333333;
		}
		.info_row{
			margin-top: 20px;
			width: 100%;
			display: flex;
			justify-content: space-around;
			.row_item{
				display: flex;
				flex-direction: column;
				align-items: center;
				.row_item_label{
					font-size: 16px;
					color: #666666;
				}
				.row_item_val{
					font-size: 26px;
					color: #333333;
				}
			}
		}
		.buttons{
			margin-top: 10px;
			width: 100%;
			display: flex;
			justify-content: space-around;
			.butdf{
				width:74px;
				text-align: center;
				height:32px;
				line-height: 32px;
				border-radius:2px;
				font-size: 14px;
				color: #fff;
			}
			.top_up_but{
				background: #008DFF;
			}
			.zhuan{
				background: #FFA74B;
			}
		}
	}
}
.card_tab{
	margin-bottom: 20px;
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
.info_box{
	.info_row{
		width: 100%;
		margin-bottom: 20px;
		display: flex;
		align-items: center;
		font-size: 14px;
		.copy{	
			outline: none;
			border: none;
			margin-left: 47px;
			color:#008DFF;
		}
	}
}
.info_toast{
	margin-bottom: 20px;
	font-size: 12px;
	color:#666666;
}
.toast_box{
	margin-bottom:24px;
	padding: 8px 30px;
	border:1px solid #008DFF;
	background:rgba(238,248,255,1);
	width: 100%;
	font-size: 14px;
	color: #666666;
}
.transfer{
	margin-bottom: 20px;
	padding-right: 9px;
	padding-left: 9px;
	background:rgba(238,248,255,1);
	display: flex;
	align-items: center;
	justify-content: space-between;
	border:1px solid #008DFF;
	height:43px;
	line-height: 43px;
	font-size: 13px;
	color:#333333;
}
.from_box{
	width: 60%;
	position: relative;
	left: 50%;
	transform: translate(-50%);
}
</style>
<script>
	import TopUp from './top_up.vue'
	import Payment from './payment.vue'
	import Collection from './collection.vue'
	import resource from '../../../../api/resource.js'
	export default{
		data(){
			return{
				active_tab_index:'1',
				storeInfo:{},			//顶部信息
				showTransfer:false,		//提现弹框
				cash_type:'1',
				money:"",
				//提现的提交参数
				transferReq:{
					account_type:"1",
					withdraw_money:""
				}
			}
		},
		props:{
			store_id:{
				type:String,
				default:""
			}
		},
		created(){
			//获取顶部信息
			this.getStoreInfo();
		},
		methods:{
			//获取顶部信息
			getStoreInfo(){
				resource.storeInfo({store_id:this.store_id}).then(res => {
					if(res.data.code == 1){
						this.storeInfo = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			checkTab(type){
				this.active_tab_index = type;
			},
			//提现
			cash(money,type){
				this.showTransfer = true;
				this.money = money;
				this.transferReq.account_type = type;
				this.transferReq.withdraw_money = "";
			},
			//确认提现
			subTransfer(){
				if(this.transferReq.withdraw_money == ''){
					this.$message.warning("请输入提现金额")
				}else if(this.transferReq.withdraw_money < 0){
					this.$message.warning("提现金额不能少于0")
				}else{
					this.transferReq.store_id = this.store_id;
					resource.withdraw(this.transferReq).then(res => {
						if(res.data.code == 1){
							this.showTransfer = false;
							this.$message.success(res.data.msg);
							//获取顶部信息
							this.getStoreInfo();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
				
			}
		},
		components:{
			TopUp,
			Payment,
			Collection
		}
		
	}
</script>















