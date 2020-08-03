<template>
	<div>
		<el-card>
			<div class="info_title">
				<div class="title_txt">基本信息</div>
				<div class="edit_box" @click="edit">
					<img class="edit_icon" src="../../../assets/edit_icon.png">
					<div class="edit_txt">编辑</div>
				</div>
			</div>
			<div class="info_row">
				<div class="row_item">企业名称：{{storeInfoObj.enterprise_name}}</div>
				<div class="row_item">营业执照注册号：{{storeInfoObj.business_license_sn}}</div>
			</div>
			<div class="info_row">
				<div class="row_item">商户名称：{{storeInfoObj.store_name}}</div>
				<div class="row_item">商户ID：{{storeInfoObj.store_sn}}</div>
			</div>
			<div class="info_row">
				<div class="row_item">
					<div>反馈材料</div>
					<img style="width: 200px;height: 200px" :src="storeInfoObj.business_license_img">
				</div>
				<div class="row_item">地区：{{storeInfoObj.area}}</div>
			</div>
			<div class="info_row">
				<div class="row_item">综合服务主体：{{storeInfoObj.service_subject_name}}</div>
			</div>
		</el-card>
		<el-card style="margin-top: 24px;">
			<div class="info_title">
				<div class="title_txt">管理员账号</div>
			</div>
			<div class="info_row">
				<div class="row_item">登录用户名：{{storeInfoObj.admin_info.store_admin_phone}}</div>
				<div class="row_item">邮箱：{{storeInfoObj.admin_info.store_admin_email}}</div>
			</div>
			<div class="info_row">
				<div class="row_item">姓名：{{storeInfoObj.admin_info.store_admin_name}}</div>
				<div class="row_item">手机号：{{storeInfoObj.admin_info.store_admin_phone}}</div>
			</div>
		</el-card>
		<el-card style="margin-top: 24px;">
			<div class="info_title">
				<div class="title_txt">联系信息</div>
			</div>
			<div class="info_row">
				<div class="row_item">联系人姓名：{{storeInfoObj.contacts_name}}</div>
				<div class="row_item">联系人手机号：{{storeInfoObj.contacts_phone}}</div>
			</div>
			<div class="info_row">
				<div class="row_item">联系人邮箱：{{storeInfoObj.contacts_email}}</div>
				<div class="row_item">联系地址：{{storeInfoObj.contacts_address}}</div>
			</div>
		</el-card>
		<el-card style="margin-top: 24px;">
			<div class="info_title">
				<div class="title_txt">结算信息</div>
			</div>
			<div class="info_row">
				<div class="row_item">开户名称：{{storeInfoObj.enterprise_name}}</div>
				<div class="row_item">对公账号：{{storeInfoObj.open_bank_account}}</div>
			</div>
			<div class="info_row">
				开户银行：{{storeInfoObj.open_bank_name}}
			</div>
		</el-card>
		<el-card style="margin-top: 24px;">
			<div class="info_title">
				<div class="title_txt">客户支持</div>
			</div>
			<div class="info_row">
				<div class="row_item">客户经理：{{storeInfoObj.account_manager_name}}</div>
				<div class="row_item">手机号：{{storeInfoObj.account_manager_phone}}</div>
			</div>
			<div class="info_row">
				邮箱：{{storeInfoObj.account_manager_email}}
			</div>
		</el-card>
		<el-card style="margin-top: 24px;">
			<div class="info_title">
				<div class="title_txt">收款账号</div>
			</div>
			<div class="info_row">
				账户名称：{{storeInfoObj.service_subject_name}}
			</div>
			<div class="info_row">
				开户银行：{{storeInfoObj.bank_name}}
			</div>
			<div class="info_row">
				专属账户：{{storeInfoObj.bank_no}}
			</div>
		</el-card>
		<!-- 编辑 -->
		<el-dialog title="编辑" :visible.sync="showEdit">
			<div class="box">
				<div style="width: 50%">
					<div class="title">基本信息</div>
					<el-form size="small" style="width: 100%">
						<el-form-item label="企业名称" label-width="220px" required>
							<el-input v-model="req.enterprise_name"></el-input>
						</el-form-item>
						<el-form-item label="社会统一信用代码：" label-width="220px" required>
							<el-input v-model="req.business_license_sn"></el-input>
						</el-form-item>
						<el-form-item label="商户名称：" label-width="220px" required>
							<el-input v-model="req.store_name"></el-input>
						</el-form-item>
						<el-form-item label="地区：" label-width="220px" required>
							<div style="display: flex">
								<el-select v-model="req.area_province_id" @change="changeProvince">
									<el-option v-for="item in province_list" :key="item.id" :label="item.name" :value="item.id">
									</el-option>
								</el-select>
								<el-select v-model="req.area_city_id" @change="changeCity">
									<el-option v-for="item in city_list" :key="item.id" :label="item.name" :value="item.id">
									</el-option>
								</el-select>
							</div>
							
						</el-form-item>
						<el-form-item label="营业执照影印件：" label-width="220px" required>
							<div class="showimg" v-if="req.business_license_img != ''" @mouseenter="isDel = true" @mouseleave="isDel = false">
								<img class="img" :src="domain + req.business_license_img">
								<div class="modal" v-if="isDel == true">
									<img src="../../../assets/deleteImg.png" @click="deteleImg">
								</div>
							</div>
							<upload-file @callbackFn="callbackFn" v-else></upload-file>
						</el-form-item>
						<el-form-item label="综合服务主体：" label-width="220px" required>
							<el-select v-model="req.service_subject_id">
								<el-option v-for="item in service_list" :key="item.id" :label="item.name" :value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
					</el-form>
					<div class="title">联系信息</div>
					<el-form size="small" style="width: 100%">
						<el-form-item label="联系人姓名：" label-width="220px" required>
							<el-input v-model="req.contacts_name"></el-input>
						</el-form-item>
						<el-form-item label="联系人手机号：" label-width="220px" required>
							<el-input v-model="req.contacts_phone"></el-input>
						</el-form-item>
						<el-form-item label="联系人邮箱：" label-width="220px" required>
							<el-input v-model="req.contacts_email"></el-input>
						</el-form-item>
						<el-form-item label="联系地址：" label-width="220px" required>
							<el-input v-model="req.contacts_address"></el-input>
						</el-form-item>
					</el-form>
				</div>
				<div style="width: 50%">
					<div class="title">管理员账号</div>
					<el-form size="small" style="width: 100%">
						<el-form-item label="企业登录用户名：" label-width="220px" required>
							<el-input v-model="req.store_admin_phone"></el-input>
						</el-form-item>
						<el-form-item label="邮箱：" label-width="220px" required>
							<el-input v-model="req.store_admin_email"></el-input>
						</el-form-item>
						<el-form-item label="姓名：" label-width="220px" required>
							<el-input v-model="req.store_admin_name"></el-input>
						</el-form-item>
						<el-form-item label="手机号：" label-width="220px" required>
							<el-input v-model="req.store_admin_phone"></el-input>
						</el-form-item>
					</el-form>
					<div class="title">收款账户</div>
					<el-form size="small" style="width: 100%">
						<el-form-item label="开户银行：" label-width="220px" required>
							<el-select v-model="req.bank_id">
								<el-option v-for="item in bank_list" :key="item.bank_id" :label="item.bank_name" :value="item.bank_id">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="专属账户：" label-width="220px" required>
							<el-input v-model="req.bank_no"></el-input>
						</el-form-item>
					</el-form>
					<div class="title">结算信息</div>
					<el-form size="small" style="width: 100%">
						<el-form-item label="对公账号：" label-width="220px" required>
							<el-input v-model="req.open_bank_account"></el-input>
						</el-form-item>
						<el-form-item label="开户银行：" label-width="220px" required>
							<el-input v-model="req.open_bank_name"></el-input>
						</el-form-item>
					</el-form>
					<div class="title">客户支持</div>
					<el-form size="small" style="width: 100%">
						<el-form-item label="客户经理：" label-width="220px" required>
							<el-select v-model="req.account_manager_id">
								<el-option v-for="item in admin_list" :key="item.admin_id" :label="item.store_admin_name" :value="item.admin_id">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="手机号：" label-width="220px" required>
							<el-input v-model="req.account_manager_phone"></el-input>
						</el-form-item>
						<el-form-item label="邮箱：" label-width="220px" required>
							<el-input v-model="req.account_manager_email"></el-input>
						</el-form-item>
					</el-form>
				</div>
			</div>
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
	import resource from '../../../api/resource.js'
	import uploadFile from '../../../components/upload.vue'
	export default{
		data(){
			return{
				storeInfoObj:{
					admin_info:{}
				},
				req:{},
				province_list:[],		//省列表
				city_list:[],			//市列表
				bank_list:[],			//收款账户列表
				admin_list:[],			//客户经理列表
				service_list:[],		//综合服务主体列表
				showEdit:false,
				isDel:false,
				domain:""
			}
		},
		created(){
			//获取信息
			this.getStoreInfo();
			//获取地址
			this.getarea({type:'0',id:'0'});
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
				resource.storeInfo({store_id:this.store_id}).then(res => {
					if(res.data.code == 1){
						this.storeInfoObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击编辑
			edit(){
				resource.editStoreInfoGet({store_id:this.store_id}).then(res => {
					if(res.data.code == 1){
						this.showEdit = true;
						let resData = res.data.data;
						this.req = resData.info;
						this.bank_list = resData.bank_list;
						this.admin_list = resData.admin_list;
						this.service_list = resData.service_list;
						this.domain = resData.info.domain;
						//获取地址
						this.getarea({type:'1',id:this.req.area_province_id});

					}else{
						this.$message.warning(res.data.msg);
					}
				})
				
			},
			changeProvince(v){
				this.req.area_city_id = "";
				//获取地址
				this.getarea({type:'1',id:v})
			},
			changeCity(v){
				this.city_list.map(item => {
					if(item.id == v){
						this.req.area_code = item.code;
					}
				})
			},
			//获取地址
			getarea(req){
				resource.getarea({id:req.id}).then(res => {
					if(req.type == '0'){
						this.province_list = res.data.data;
					}else if(req.type == '1'){
						this.city_list = res.data.data;
					}
				})
			},
			//上传文件
			callbackFn(obj){
				resource.uploadImage({image:obj}).then(res => {
					if(res.data.code == 1){
						this.domain = res.data.data.domain;
						this.req.business_license_img = res.data.data.urls;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//删除文件
			deteleImg(){
				resource.delImage({url:this.req.business_license_img}).then(res => {
					if(res.data.code == 1){
						this.domain = "";
						this.req.business_license_img = "";
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//提交修改
			submit(){
				if(this.req.enterprise_name == ''){
					this.$message.warning("请输入企业名称");
				}else if(this.req.business_license_sn == ''){
					this.$message.warning("请输入社会统一信用代码");
				}else if(this.req.store_name == ''){
					this.$message.warning("请输入商户名称");
				}else if(this.req.business_license_img == ''){
					this.$message.warning("请上传营业执照影印件");
				}else if(this.req.contacts_name == ''){
					this.$message.warning("请输入联系人姓名");
				}else if(this.req.contacts_phone == ''){
					this.$message.warning("请输入联系人手机号");
				}else if(this.req.contacts_email == ''){
					this.$message.warning("请输入联系人邮箱");
				}else if(this.req.contacts_address == ''){
					this.$message.warning("请输入联系地址");
				}else if(this.req.store_admin_phone == ''){
					this.$message.warning("请输入企业登录用户名");
				}else if(this.req.store_admin_email == ''){
					this.$message.warning("请输入邮箱");
				}else if(this.req.store_admin_name == ''){
					this.$message.warning("请输入姓名");
				}else if(this.req.store_admin_phone == ''){
					this.$message.warning("请输入手机号");
				}else if(this.req.bank_no == ''){
					this.$message.warning("请输入专属账户");
				}else if(this.req.open_bank_account == ''){
					this.$message.warning("请输入对公账号");
				}else if(this.req.open_bank_name == ''){
					this.$message.warning("请输入开户银行");
				}else if(this.req.account_manager_phone == ''){
					this.$message.warning("请输入手机号");
				}else if(this.req.account_manager_email == ''){
					this.$message.warning("请输入邮箱");
				}else{
					resource.editStoreInfoPost(this.req).then(res => {
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
		},
		components:{
			uploadFile
		}
	}
</script>

























