<template>
	<div>
		<el-card style="margin-top: 24px;">
			<div class="info_title">
				<div class="title_txt">资金提醒设置</div>
				<div class="edit_box" @click="edit">
					<img class="edit_icon" src="../../../assets/edit_icon.png">
					<div class="edit_txt">编辑</div>
				</div>
			</div>
			<div class="info_row">
				充值到账提醒：{{storeInfoObj.recharge_notice_type == '1'?'短信通知':storeInfoObj.recharge_notice_type == '2'?'邮件通知':'短信和邮件通知'}}
			</div>
			<div class="info_row">
				商户余额提醒：{{storeInfoObj.balance_notice_type == '1'?'短信通知':storeInfoObj.recharge_notice_type == '2'?'邮件通知':'短信和邮件通知'}}
			</div>
			<div class="info_row">
				银行卡余额提醒阈值（元）：{{storeInfoObj.bank_limit}}
			</div>
			<div class="info_row">
				支付宝余额提醒阈值（元）：{{storeInfoObj.alipay_limt}}
			</div>
			<div class="info_row">
				微信支付余额提醒阈值（元）：{{storeInfoObj.wx_limt}}
			</div>
		</el-card>
		<el-card style="margin-top: 24px;">
			<div class="info_title">
				<div class="title_txt">接收提醒设置</div>
			</div>
			<div class="info_row">
				充值到账提醒：{{storeInfoObj.recharge_notice_type_name}}
			</div>
			<div class="info_row">
				账户余额不足提醒：{{storeInfoObj.balance_notice_type_name}}
			</div>
			<div class="info_row">
				预警及提醒类邮件：{{storeInfoObj.warning_notice_email}}
			</div>
			<div class="info_row">
				账单类提醒邮件：{{storeInfoObj.bill_notice_email}}
			</div>
			<div class="info_row">
				报税信息类提醒邮件：{{storeInfoObj.tax_notice_email}}
			</div>
		</el-card>
		<!-- 编辑 -->
		<el-dialog title="编辑" :visible.sync="showEdit">
			<div class="title">资金提醒设置</div>
			<el-form size="small" style="width: 60%;margin: 0 auto">
				<el-form-item label="充值到账提醒：" label-width="220px" required>
					<el-radio-group v-model="editObj.recharge_notice_type">
						<el-radio :label="1">短信</el-radio>
						<el-radio :label="2">邮件</el-radio>
						<el-radio :label="0">短信和邮件</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="账户余额提醒：" label-width="220px" required>
					<el-radio-group v-model="editObj.balance_notice_type">
						<el-radio :label="1">短信</el-radio>
						<el-radio :label="2">邮件</el-radio>
						<el-radio :label="0">短信和邮件</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="银行卡余额提醒阈值（元）：" label-width="220px" required>
					<el-input type="number" v-model="editObj.bank_limit">
						<template slot="append">元</template>
					</el-input>
				</el-form-item>
				<el-form-item label="支付宝余额提醒阈值（元）：" label-width="220px" required>
					<el-input type="number" v-model="editObj.alipay_limt">
						<template slot="append">元</template>
					</el-input>
				</el-form-item>
				<el-form-item label="微信余额提醒阈值（元）：" label-width="220px" required>
					<el-input type="number" v-model="editObj.wx_limt">
						<template slot="append">元</template>
					</el-input>
				</el-form-item>
			</el-form>
			<div class="title">接收提醒设置</div>
			<el-form size="small" style="width: 60%;margin: 0 auto">
				<el-form-item label="充值到账提醒：" label-width="220px" required>
					<el-input v-model="editObj.recharge_phone"></el-input>
				</el-form-item>
				<el-form-item label="账户余额不足提醒：" label-width="220px" required>
					<el-input v-model="editObj.balance_phone"></el-input>
				</el-form-item>
				<el-form-item label="预警及提醒类邮件：" label-width="220px" required>
					<el-input v-model="editObj.warning_notice_email"></el-input>
				</el-form-item>
				<el-form-item label="账单提醒类邮件：" label-width="220px" required>
					<el-input v-model="editObj.bill_notice_email"></el-input>
				</el-form-item>
				<el-form-item label="报税信息类提醒邮件：" label-width="220px" required>
					<el-input v-model="editObj.tax_notice_email"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="showEdit = false">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<style lang="less" scoped>
.info_title{
	width: 100%;
	display: flex;
	justify-content: space-between;
	padding-bottom: 20px;
	border-bottom: 1px solid #E8E8E8;
	.title_txt{
		font-size: 16px;
		color: #333333;
		font-weight:500;
	}
	.edit_box{
		display: flex;
		align-items: center;
		.edit_icon{
			margin-right: 5px;
			width:14px;
			height:14px;
		}
		.edit_txt{
			font-size: 14px;
			color: #333333;
		}
	}
}
.info_row{
	display: flex;
	margin-top: 18px;
	font-size: 14px;
	color: #666666;
	.row_item{
		width: 50%;
		display: flex;
	}
}
.title{
	margin-bottom: 20px;
	width: 100%;
	text-align: center;
	font-size: 16px;
	color:#333333;
	font-weight:500;
}
</style>
<script>
	import resource from '../../../api/resource.js'
	export default{
		data(){
			return{
				storeInfoObj:{},
				showEdit:false,
				editObj:{
					recharge_notice_type:1,
					balance_notice_type:1,
					bank_limit:"",
					alipay_limt:"",
					wx_limt:"",
					recharge_phone:"",
					balance_phone:"",
					warning_notice_email:"",
					bill_notice_email:"",
					tax_notice_email:""
				},			//修改提交参数
			}
		},
		created(){
			//获取信息
			this.getStoreInfo();
		},
		props:{
			store_id:{
				type:String,
				default:""
			}
		},
		methods:{
			//获取顶部信息
			getStoreInfo(){
				resource.getremind({store_id:this.store_id}).then(res => {
					if(res.data.code == 1){
						this.storeInfoObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击编辑
			edit(){
				resource.addEditRemindGet({store_id:this.store_id}).then(res => {
					if(res.data.code == 1){
						this.showEdit = true;
						for (var key1 in this.editObj) {
							for (var key2 in res.data.data.info) {
								if(key1 == key2){
									this.editObj[key1] = res.data.data.info[key2]
								}
							}
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//提交修改
			submit(){
				if(this.editObj.bank_limit == ''){
					this.$message.warning("银行卡余额提醒阈值不能为空");
				}else if(this.editObj.alipay_limt == ''){
					this.$message.warning("支付宝余额提醒阈值不能为空");
				}else if(this.editObj.wx_limt == ''){
					this.$message.warning("微信余额提醒阈值不能为空");
				}else if(this.editObj.recharge_phone == ''){
					this.$message.warning("充值到账提醒手机号不能为空");
				}else if(this.editObj.balance_phone == ''){
					this.$message.warning("账户余额不足提醒手机号不能为空");
				}else if(this.editObj.warning_notice_email == ''){
					this.$message.warning("预警及提醒类邮件不能为空");
				}else if(this.editObj.bill_notice_email == ''){
					this.$message.warning("账单提醒类邮件不能为空");
				}else if(this.editObj.tax_notice_email == ''){
					this.$message.warning("报税信息类提醒邮件不能为空");
				}else{
					this.editObj.store_id = this.store_id
					resource.addEditRemindPost(this.editObj).then(res => {
						if(res.data.code == 1){
							this.showEdit = false;
							this.$message.success(res.data.msg);
							//获取顶部信息
							this.getStoreInfo();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			}
		}
	}
</script>

























