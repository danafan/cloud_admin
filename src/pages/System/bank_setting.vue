<template>
	<div>
		<el-card style="margin-top: 24px;">
			<div class="info_title">
				<div class="title_txt">提现总卡</div>
				<div class="edit_box" @click="edit">
					<img class="edit_icon" src="../../assets/edit_icon.png">
					<div class="edit_txt">编辑</div>
				</div>
			</div>
			<div class="info_row">
				银行名称：{{bankIndex.master_bank_name}}
			</div>
			<div class="info_row">
				银行卡号：{{bankIndex.master_bank_no}}
			</div>
		</el-card>
		<el-card style="margin-top: 24px;">
			<div class="info_title">
				<div class="title_txt">打款卡</div>
				<div class="edit_box" @click="editBilling">
					<img class="edit_icon" src="../../assets/edit_icon.png">
					<div class="edit_txt">编辑</div>
				</div>
			</div>
			<div class="info_row" v-for="item in bankIndex.bank_list">
				<div class="row_left">银行名称：{{item.bank_name}}</div>
				<div class="row_left">银行卡号：{{item.bank_no}}</div>
				<el-button type="danger" icon="el-icon-delete" size="small" circle @click="delBank(item.bank_id)"></el-button>
			</div>
		</el-card>
		<!-- 编辑提现总卡 -->
		<el-dialog title="编辑提现总卡" :visible.sync="showEdit">
			<el-form size="small" style="width: 90%">
				<el-form-item label="银行名称：" label-width="220px">
					<div>{{masterBank.bank_name}}</div>
				</el-form-item>
				<el-form-item label="银行卡号：" label-width="220px">
					<el-input v-model="masterBank.bank_no" type="number" size="small"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="showEdit = false">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 编辑打款卡 -->
		<el-dialog title="编辑打款卡" :visible.sync="showBilling">
			<div class="toast">勾选银行将作为无对应打款银行时通用打款银行</div>
			<div class="info_row" v-for="(item,index) in payBank">
				<img class="select" src="../../assets/select_active.png" v-if="item.bank_type == 1"/>
				<img class="select" src="../../assets/select.png" v-else @click="checkBank(index)"/>
				<div class="row_left">银行名称：{{item.bank_name}}</div>
				<div class="row_left">
					<div class="bank_label">银行卡号：</div>
					<el-input type="number" size="small" v-model="item.bank_no"></el-input>
				</div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="showBilling = false">取 消</el-button>
				<el-button type="primary" @click="submitBilling">确 定</el-button>
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
	align-items: center;
	margin-top: 18px;
	font-size: 14px;
	color: #666666;
	.row_left{
		.bank_label{
			width: 120px;
		}
		display: flex;
		align-items: center;
		margin-right: 20px;
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
.add,.delete{
	margin-left: 10px;
	width: 50px;
	font-size: 14px;
}
.add{
	color:#008DFF;
}
.toast{
	font-size: 12px;
	color:red;
}
.select{
	margin-right: 20px;
	width: 20px;
	height: 20px;
}
.delete{
	color:#E02020;
}
</style>
<script>
	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				bankIndex:{},		//全部信息
				masterBank:{},		//总卡信息
				payBank:[],			//打款卡列表
				showBilling:false,	//编辑服务费计费模式弹框
				showEdit:false,		//编辑限额信息
			}
		},
		created(){
			//获取全部信息
			this.systemBankIndex();
		},
		methods:{
			//获取全部信息
			systemBankIndex(){
				resource.systemBankIndex().then(res => {
					if(res.data.code == 1){
						this.bankIndex = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//切换默认打款卡
			checkBank(index){
				this.payBank.map((item,i) => {
					if(index == i){
						item.bank_type = 1;
					}else{
						item.bank_type = 0;
					}
				})
			},
			//编辑提现总卡
			edit(){
				resource.editMasterBankGet().then(res => {
					if(res.data.code == 1){
						this.showEdit = true;
						this.masterBank = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//提交提现总卡
			submit(){
				if(this.masterBank.bank_no == ''){
					this.$message.warning("请输入提现总卡卡号");
				}else{
					resource.editMasterBankPost(this.masterBank).then(res => {
						if(res.data.code == 1){
							this.showEdit = false;
							this.$message.success(res.data.msg);
							//获取全部信息
							this.systemBankIndex();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//删除打款卡
			delBank(bank_id){
				this.$confirm('确认删除该银行卡?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.delBank({bank_id:bank_id}).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							//获取全部信息
							this.systemBankIndex();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消'
					});          
				});
			},
			//点击编辑打款卡
			editBilling(){
				resource.editPaybankGet().then(res => {
					if(res.data.code == 1){
						this.showBilling = true;
						this.payBank = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//提交修改
			submitBilling(){
				var isTrue = true;
				this.payBank.map(item => {
					if(item.bank_no == ''){
						this.$message.warning("银行卡号不能为空");
						isTrue = false;
						return;
					}
				})
				if(isTrue){
					let req = {
						bank_list:JSON.stringify(this.payBank)
					}
					resource.editPaybankPost(req).then(res => {
						if(res.data.code == 1){
							this.showBilling = false;
							this.$message.success(res.data.msg);
							//获取顶部信息
							this.systemBankIndex();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},

		}
	}
</script>

























