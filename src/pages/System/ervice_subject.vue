<template>
	<div>
		<el-card>
			<el-button type="primary" size="small" @click="create">新建</el-button>
			<el-table :data="dataObj.data" border style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
				<el-table-column width="150" prop="name" label="综合服务主体" align="center">
				</el-table-column>
				<el-table-column width="150" prop="enterprise_name" label="企业名称" align="center">
				</el-table-column>
				<el-table-column width="150" prop="operator" label="经办人姓名" align="center">
				</el-table-column>
				<el-table-column width="150" prop="operator_phone" label="经办人手机号" align="center">
				</el-table-column>
				<el-table-column width="150" prop="enterprise_no" label="统一社会信用代码" align="center">
				</el-table-column>
				<el-table-column width="150" prop="sign_protocol_name" label="协议文件" align="center">
				</el-table-column>
				<el-table-column width="150" prop="sign_enterprises" label="签约企业名称" align="center">
				</el-table-column>
				<el-table-column width="150" prop="apply_id" label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="edit(scope.row.id)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="page">
				<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="req.page"
				:pager-count="11"
				:page-sizes="[5, 10, 15, 20]"
				layout="total, sizes, prev, pager, next, jumper"
				:total="dataObj.total"
				>
			</el-pagination>
		</div>
	</el-card>
	<!-- 编辑 -->
	<el-dialog :title="type == '1'?'添加':'编辑'" :visible.sync="showEdit">
		<el-form size="small" style="width: 100%">
			<el-form-item label="综合服务主体：" label-width="220px" required>
				<el-input v-model="detailObj.name"></el-input>
			</el-form-item>
			<el-form-item label="企业名称：" label-width="220px" required>
				<el-input v-model="detailObj.enterprise_name" :disabled="type == '2'"></el-input>
			</el-form-item>
			<el-form-item label="统一社会信用代码：" label-width="220px" required>
				<el-input v-model="detailObj.enterprise_no" :disabled="type == '2'"></el-input>
			</el-form-item>
			<el-form-item label="经办人姓名：" label-width="220px" required>
				<el-input v-model="detailObj.operator" :disabled="type == '2'"></el-input>
			</el-form-item>
			<el-form-item label="经办人证件号：" label-width="220px" required>
				<el-input v-model="detailObj.operator_id_card" :disabled="type == '2'"></el-input>
			</el-form-item>
			<el-form-item label="经办人手机号：" label-width="220px" required>
				<el-input v-model="detailObj.operator_phone" :disabled="type == '2'"></el-input>
			</el-form-item>
			<el-form-item label="上传文件：" required>
				<div class="showimg" v-if="fileName != ''" @mouseenter="isDel = true" @mouseleave="isDel = false">
					<div class="img">{{fileName}}</div>
					<div class="modal" v-if="isDel == true">
						<img src="../../assets/deleteImg.png" @click="detele">
					</div>
				</div>
				<upload-file @callbackFn="callbackFn" v-else></upload-file>
			</el-form-item>
			<div class="title">发票配置</div>
			<el-form-item label="应用名称：" label-width="220px" required>
				<el-input v-model="detailObj.invoice_app_name" :disabled="type == '2'"></el-input>
			</el-form-item>
			<el-form-item label="app_key：" label-width="220px" required>
				<el-input v-model="detailObj.invoice_app_key" :disabled="type == '2'"></el-input>
			</el-form-item>
			<el-form-item label="app_secret：" label-width="220px" required>
				<el-input v-model="detailObj.invoice_app_secret" :disabled="type == '2'"></el-input>
			</el-form-item>
			<div class="title">电子合同配置</div>
			<el-form-item label="应用名称：" label-width="220px" required>
				<el-input v-model="detailObj.contract_app_name" :disabled="type == '2'"></el-input>
			</el-form-item>
			<el-form-item label="app_key：" label-width="220px" required>
				<el-input v-model="detailObj.contract_app_key" :disabled="type == '2'"></el-input>
			</el-form-item>
			<el-form-item label="app_secret：" label-width="220px" required>
				<el-input v-model="detailObj.contract_app_secret" :disabled="type == '2'"></el-input>
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
.el-carousel__item h3 {
	color: #475669;
	font-size: 18px;
	opacity: 0.75;
	line-height: 300px;
	margin: 0;
}

.el-carousel__item:nth-child(2n) {
	background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
	background-color: #d3dce6;
}
.bottom_buts{
	margin-top: 20px;
	width: 100%;
	display: flex;
	justify-content: flex-end;
}
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
.box{
	display: flex;
}
.title{
	margin-bottom: 20px;
	width: 100%;
	text-align: center;
	font-size: 16px;
	color:#333333;
	font-weight:500;
}
.showimg{
	position: relative;
	width: 200px;
	height: 200px;
	.img{
		position: absolute;
		width: 100%;
		height: 100%;
	}
	.modal{
		background: rgba(0,0,0,.6);
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		img{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			display:block;
			width: 30px;
			height: 30px;
		}
	}
}
</style>
<script>
	import resource from '../../api/resource.js'
	import uploadFile from '../../components/upload.vue'
	export default{
		data(){
			return{
				req:{
					page:1,
					pagesize:10
				},				//请求参数
				dataObj:{},	
				showEdit:false,			//编辑弹框
				detailObj:{
					name:"",
					enterprise_name:"",
					enterprise_no:"",
					operator:"",
					operator_id_card:"",
					operator_phone:"",
					invoice_app_name:"",
					invoice_app_key:"",
					invoice_app_secret:"",
					contract_app_name:"",
					contract_app_key:"",
					contract_app_secret:"",
					sign_protocol:{}
				},			//详情
				isDel:false,
				fileName:"",
				type:"1",			//1:添加；2:编辑
				id:"",
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		methods:{
			//获取列表
			getList(){
				resource.ervicesubject(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//上传文件
			callbackFn(obj){
				this.fileName = obj.name;
				this.detailObj.sign_protocol = obj;
			},
			//删除文件
			detele(){
				this.fileName = "";
				this.detailObj.sign_protocol = null;
			},
			//点击添加
			create(){
				this.detailObj = {
					name:"",
					enterprise_name:"",
					enterprise_no:"",
					operator:"",
					operator_id_card:"",
					operator_phone:"",
					invoice_app_name:"",
					invoice_app_key:"",
					invoice_app_secret:"",
					contract_app_name:"",
					contract_app_key:"",
					contract_app_secret:"",
					sign_protocol:{}
				}
				this.showEdit = true;
				this.fileName = "";
				this.type = "1";			
			},
			//点击编辑
			edit(id){
				this.id = id;
				resource.servicesubject({id:id}).then(res => {
					if(res.data.code == 1){
						this.showEdit = true;
						this.type = "2";
						this.fileName = "";
						this.detailObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//分页
			handleSizeChange(val) {
				this.req.pagesize = val;
				//获取列表
				this.getList();
			},
			handleCurrentChange(val) {
				this.req.page = val;
				//获取列表
				this.getList();
			},
			//提交
			submit(){
				if(this.type == '1'){		//添加
					if(this.detailObj.name == ''){
						this.$message.warning("请输入综合服务主体名称");
					}else if(this.detailObj.enterprise_name == ''){
						this.$message.warning("请输入企业名称");
					}else if(this.detailObj.enterprise_no == ''){
						this.$message.warning("请输入统一社会信用代码");
					}else if(this.detailObj.operator == ''){
						this.$message.warning("请输入经办人姓名");
					}else if(this.detailObj.operator_id_card == ''){
						this.$message.warning("请输入经办人身份证");
					}else if(this.detailObj.operator_phone == ''){
						this.$message.warning("请输入经办人手机号");
					}else if(this.fileName == ''){
						this.$message.warning("请上传签约协议");
					}else if(this.detailObj.invoice_app_name == ''){
						this.$message.warning("请输入发票应用名称");
					}else if(this.detailObj.invoice_app_key == ''){
						this.$message.warning("请输入发票应用app key");
					}else if(this.detailObj.invoice_app_secret == ''){
						this.$message.warning("请输入发票应用app secret");
					}else if(this.detailObj.contract_app_name == ''){
						this.$message.warning("请输入电子合同应用名称");
					}else if(this.detailObj.contract_app_key == ''){
						this.$message.warning("请输入电子合同应用app key");
					}else if(this.detailObj.contract_app_secret == ''){
						this.$message.warning("请输入电子合同应用app secret");
					}else{
						resource.servicesubjectAdd(this.detailObj).then(res => {
							if(res.data.code == 1){
								this.showEdit = false;
								this.$message.success(res.data.msg);
								//获取顶部信息
								this.getList();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}
				}else{	//编辑
					if(this.detailObj.name == ''){
						this.$message.warning("请输入综合服务主体名称");
					}else if(this.fileName == ''){
						this.$message.warning("请上传签约协议");
					}else{
						let req = {
							id:this.id,
							name:this.detailObj.name,
							sign_protocol:this.detailObj.sign_protocol
						}
						resource.servicesubjectEdit(req).then(res => {
							if(res.data.code == 1){
								this.showEdit = false;
								this.$message.success(res.data.msg);
								//获取顶部信息
								this.getList();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}
				}
				
			}
			
		},
		components:{
			uploadFile
		}
	}
</script>














v x  ]