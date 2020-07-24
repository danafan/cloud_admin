<template>
	<div>
		<el-card style="margin-top: 24px;">
			<div class="info_title">
				<div class="title_txt">开票信息</div>
				<div class="edit_box" @click="edit">
					<img class="edit_icon" src="../../../assets/edit_icon.png">
					<div class="edit_txt">编辑</div>
				</div>
			</div>
			<div class="info_row">
				<div class="row_item">企业名称：{{storeInfoObj.enterprise_name}}</div>
				<div class="row_item">纳税人识别号：{{storeInfoObj.taxpayer_id}}</div>
			</div>
			<div class="info_row">
				<div class="row_item">纳税人类型：{{storeInfoObj.taxpayer_type == '1'?'一般纳税人':'小规模纳税人'}}</div>
				<div class="row_item">单位注册地址及电话：{{storeInfoObj.address_phone}}</div>
			</div>
			<div class="info_row">
				发票类目：{{storeInfoObj.cate_ids}}
			</div>
			<div class="info_row">
				<div class="row_item">开户行及帐号：{{storeInfoObj.bank_info}}</div>
				<div class="row_item">默认发票类目：{{storeInfoObj.open_bank_account}}</div>
			</div>
			<div class="info_row">
				开票类型：{{storeInfoObj.invoice_type == '1'?'打款':'充值'}}
			</div>
		</el-card>
		<el-card style="margin-top: 24px;">
			<div class="info_title">
				<div class="title_txt">开票信息</div>
			</div>
			<div class="info_row">
				收件人姓名：{{storeInfoObj.recieve_user}}
			</div>
			<div class="info_row">
				收件人电话：{{storeInfoObj.recieve_phone}}
			</div>
			<div class="info_row">
				收件人地址：{{storeInfoObj.recieve_address}}
			</div>
		</el-card>
		<!-- 编辑 -->
		<el-dialog title="编辑" :visible.sync="showEdit">
			<div class="title">开票信息</div>
			<el-form size="small" style="width: 60%">
				<el-form-item label="企业名称：" label-width="220px" required>
					<el-input v-model="req.enterprise_name" disabled></el-input>
				</el-form-item>
				<el-form-item label="纳税人识别号：" label-width="220px" required>
					<el-input v-model="req.taxpayer_id"></el-input>
				</el-form-item>
				<el-form-item label="纳税人类型：" label-width="220px" required>
					<el-radio-group v-model="req.taxpayer_type">
						<el-radio :label="item.id" v-for="item in taxpayer_type_list">{{item.name}}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="单位注册地址及电话：" label-width="220px" required>
					<el-input v-model="req.address_phone"></el-input>
				</el-form-item>
				<el-form-item label="开户行及账号：" label-width="220px" required>
					<el-input v-model="req.bank_info"></el-input>
				</el-form-item>
				<el-form-item label="发票类目：" label-width="220px" required>
					<el-checkbox-group v-model="cateIdsList">
						<el-checkbox :label="item.invoice_cate_id" v-for="item in cate_list">{{item.cate_name}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="默认发票类目：" label-width="220px" required>
					<el-select v-model="req.default_cate_id">
						<el-option v-for="item in default_cate_list" :key="item.invoice_cate_id" :label="item.cate_name" :value="item.invoice_cate_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="开票类型：" label-width="220px" required>
					<el-radio-group v-model="req.invoice_type">
						<el-radio :label="item.id" v-for="item in invoice_type_list">{{item.name}}</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div class="title">邮寄地址</div>
			<el-form size="small" style="width: 90%">
				<el-form-item label="收件人姓名：" label-width="220px" required>
					<el-input v-model="req.recieve_user"></el-input>
				</el-form-item>
				<el-form-item label="收件人电话：" label-width="220px" required>
					<el-input v-model="req.recieve_phone"></el-input>
				</el-form-item>
				<el-form-item label="收件人地址：" label-width="220px" required>
					<el-input v-model="req.recieve_address"></el-input>
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
				req:{},
				cate_list:[],
				default_cate_list:[],
				invoice_type_list:[],
				taxpayer_type_list:[],
				cateIdsList:[],	//发票类目选中的列表
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
				resource.storeGetinvoice({store_id:this.store_id}).then(res => {
					if(res.data.code == 1){
						this.storeInfoObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击编辑
			edit(){
				resource.addEditInvoiceGet({store_id:this.store_id}).then(res => {
					if(res.data.code == 1){
						this.showEdit = true;
						let resData = res.data.data;
						this.req = resData.info;
						let arr = resData.info.cate_ids.split(',');
						arr.map(item => {
							this.cateIdsList.push(parseInt(item))
						})
						this.cate_list = resData.cate_list;
						this.default_cate_list = resData.default_cate_list;
						this.invoice_type_list = resData.invoice_type_list;
						this.taxpayer_type_list = resData.taxpayer_type_list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//提交修改
			submit(){
				if(this.req.taxpayer_id == ''){
					this.$message.warning("请输入纳税人识别号");
				}else if(this.req.address_phone == ''){
					this.$message.warning("请输入单位注册地址及电话");
				}else if(this.req.bank_info == ''){
					this.$message.warning("请输入开户行及帐号");
				}else if(this.cateIdsList.length == 0){
					this.$message.warning("请选择发票类目");
				}else if(this.req.recieve_user == ''){
					this.$message.warning("请输入收件人姓名");
				}else if(this.req.recieve_phone == ''){
					this.$message.warning("请输入收件人电话");
				}else if(this.req.recieve_address == ''){
					this.$message.warning("请输入收件人地址");
				}else{
					this.req.cate_ids = this.cateIdsList.join(',');
					var cate_ids_name_list =  [];
					this.cateIdsList.map(item => {
						this.cate_list.map(item1 => {
							if(item == item1.invoice_cate_id){
								cate_ids_name_list.push(item1.cate_name)
							}
						})
					})
					this.req.cate_ids_name = cate_ids_name_list.join(',');
					resource.addEditInvoicePost(this.req).then(res => {
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

























