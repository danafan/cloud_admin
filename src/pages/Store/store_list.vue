<template>
	<div>
		<el-card>
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="商户名称：">
					<el-input v-model="req.store_name" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="企业名称：">
					<el-input v-model="req.enterprise_name" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="客户经理：">
					<el-input v-model="req.username" placeholder="请输入"></el-input>
				</el-form-item>
			</el-form>
			<div class="but">
				<el-button type="primary" size="small" @click="getList">搜索</el-button>
				<el-button type="primary" size="small" @click="reset">重置</el-button>
			</div>
			<el-button style="margin-bottom: 10px" type="primary" size="small" @click="create_store" v-if="dataObj.is_supper == 1 || (dataObj.is_supper == 0 && dataObj.button_list.add == 1)">创建商户</el-button>
			<el-table :data="dataObj.data" border style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
				<el-table-column width="150" prop="store_name" label="商户名称" align="center">
				</el-table-column>
				<el-table-column width="150" prop="enterprise_name" label="企业名称" align="center">
				</el-table-column>
				<el-table-column width="150" prop="bank_balance" label="银行卡余额（元）" align="center">
				</el-table-column>
				<el-table-column width="150" prop="alipay_balance" label="支付宝余额（元）" align="center">
				</el-table-column>
				<el-table-column width="150" prop="service_balance" label="服务费账户（元）" align="center">
				</el-table-column>
				<el-table-column width="150" prop="store_sn" label="商户ID" align="center">
				</el-table-column>
				<el-table-column width="150" prop="contacts_name" label="联系人姓名" align="center">
				</el-table-column>
				<el-table-column width="150" prop="contacts_phone" label="联系人手机号" align="center">
				</el-table-column>
				<el-table-column width="240" prop="open_bank_account" label="对公账号" align="center">
				</el-table-column>
				<el-table-column width="150" prop="account_manager_name" label="客户经理" align="center">
				</el-table-column>
				<el-table-column width="150" label="商户信息" align="center">
					<template slot-scope="scope">
						{{scope.row.status == '2'?'信息未完善':'信息已完善'}}
					</template>
				</el-table-column>
				<el-table-column width="200" fixed="right" label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="look(scope.row.store_id)" v-if="scope.row.status == '1' && (dataObj.is_supper == 1 || (dataObj.is_supper == 0 && dataObj.button_list.detail == 1))">查看账户</el-button>
						<el-button type="text" size="small" @click="editStore(scope.row.store_id)" v-if="(scope.row.status == '1' || scope.row.status == '2') && (dataObj.is_supper == 1 || (dataObj.is_supper == 0 && dataObj.button_list.edit == 1))">{{scope.row.status == '2'?'去完善':'修改'}}
						</el-button>
						<el-button type="text" size="small" @click="setting(scope.row.status,scope.row.store_id)" v-if="scope.row.status == 0 || scope.row.status == 1 && (dataObj.is_supper == 1 || (dataObj.is_supper == 0 && dataObj.button_list.startstop == 1))">{{scope.row.status == 1?'停用':'启用'}}</el-button>
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
	<!-- 创建商户 -->
	<el-dialog title="创建" :visible.sync="showEdit">
		<div class="box">
			<div style="width: 50%">
				<div class="title">基本信息</div>
				<el-form size="small" style="width: 100%">
					<el-form-item label="企业名称" label-width="220px" required>
						<el-input v-model="addObj.enterprise_name"></el-input>
					</el-form-item>
					<el-form-item label="社会统一信用代码：" label-width="220px" required>
						<el-input v-model="addObj.business_license_sn"></el-input>
					</el-form-item>
					<el-form-item label="商户名称：" label-width="220px" required>
						<el-input v-model="addObj.store_name"></el-input>
					</el-form-item>
					<el-form-item label="地区：" label-width="220px" required>
						<div style="display: flex">
							<el-select v-model="addObj.area_province_id" @change="changeProvince">
								<el-option v-for="item in province_list" :key="item.id" :label="item.name" :value="item.id">
								</el-option>
							</el-select>
							<el-select v-model="addObj.area_city_id" @change="changeCity">
								<el-option v-for="item in city_list" :key="item.id" :label="item.name" :value="item.id">
								</el-option>
							</el-select>

						</div>

					</el-form-item>
					<el-form-item label="营业执照影印件：" label-width="220px" required>
						<div class="showimg" v-if="addObj.business_license_img != ''" @mouseenter="isDel = true" @mouseleave="isDel = false">
							<img class="img" :src="domain + addObj.business_license_img">
							<div class="modal" v-if="isDel == true">
								<img src="../../assets/deleteImg.png" @click="deteleImg">
							</div>
						</div>
						<upload-file @callbackFn="callbackFn" v-else></upload-file>
					</el-form-item>
					<el-form-item label="综合服务主体：" label-width="220px" required>
						<el-select v-model="addObj.service_subject_id">
							<el-option v-for="item in service_list" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<div class="title">联系信息</div>
				<el-form size="small" style="width: 100%">
					<el-form-item label="联系人姓名：" label-width="220px" required>
						<el-input v-model="addObj.contacts_name"></el-input>
					</el-form-item>
					<el-form-item label="联系人手机号：" type="number" label-width="220px" required>
						<el-input v-model="addObj.contacts_phone"></el-input>
					</el-form-item>
					<el-form-item label="联系人邮箱：" label-width="220px" required>
						<el-input v-model="addObj.contacts_email"></el-input>
					</el-form-item>
					<el-form-item label="联系地址：" label-width="220px" required>
						<el-input v-model="addObj.contacts_address"></el-input>
					</el-form-item>
				</el-form>
			</div>
			<div style="width: 50%">
				<div class="title">管理员账号</div>
				<el-form size="small" style="width: 100%">
					<el-form-item label="企业登录用户名：" label-width="220px" required>
						<el-input v-model="addObj.store_admin_phone"></el-input>
					</el-form-item>
					<el-form-item label="邮箱：" label-width="220px" required>
						<el-input v-model="addObj.store_admin_email"></el-input>
					</el-form-item>
					<el-form-item label="姓名：" label-width="220px" required>
						<el-input v-model="addObj.store_admin_name"></el-input>
					</el-form-item>
				</el-form>
				<div class="title">收款账户</div>
				<el-form size="small" style="width: 100%">
					<el-form-item label="收款银行：" label-width="220px" required>
						<el-radio-group v-model="addObj.bank_flag">
							<el-radio :label="1">农行</el-radio>
							<el-radio :label="0">非农行</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="开户名：" type="text" label-width="220px" required>
						<el-input v-model="addObj.open_company_name"></el-input>
					</el-form-item>
					<el-form-item label="专属账户：" type="number" label-width="220px" required>
						<el-input v-model="addObj.bank_no"></el-input>
					</el-form-item>
				</el-form>
				<div class="title">结算信息</div>
				<el-form size="small" style="width: 100%">
					<el-form-item label="对公账号：" type="number" label-width="220px" required>
						<el-input v-model="addObj.open_bank_account"></el-input>
					</el-form-item>
				</el-form>
				<div class="title">客户支持</div>
				<el-form size="small" style="width: 100%">
					<el-form-item label="客户经理：" label-width="220px" required>
						<el-select v-model="addObj.account_manager_id">
							<el-option v-for="item in admin_list" :key="item.admin_id" :label="item.store_admin_name" :value="item.admin_id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="手机号：" type="number" label-width="220px" required>
						<el-input v-model="addObj.account_manager_phone"></el-input>
					</el-form-item>
					<el-form-item label="邮箱：" label-width="220px" required>
						<el-input v-model="addObj.account_manager_email"></el-input>
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
					pagesize:10,
					store_name:"",
					enterprise_name:"",
					username:""
				},				//请求参数
				dataObj:{},	
				showEdit:false,			//默认创建弹框不显示
				addObj:{},
				province_list:[],		//省列表
				city_list:[],			//市列表
				admin_list:[],			//客户经理列表
				service_list:[],		//综合服务主体列表
				showEdit:false,
				isDel:false,
				domain:""
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		methods:{
			//获取列表
			getList(){
				resource.storeList(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//查看账户
			look(id){
				this.$router.push('/account_management?store_id=' + id);
			},
			//编辑
			editStore(id){
				this.$router.push('/store_index?store_id=' + id);
			},
			//操作起停用
			setting(status,id){
				this.$confirm(`确认${status == 1?'停用':'启用'}`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.storestartstop({store_id:id,type:status == 1?0:1}).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							//获取列表
							this.getList();
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
			//重置
			reset(){
				this.req = {
					page:1,
					pagesize:10,
					store_name:"",
					enterprise_name:"",
					username:""
				}
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
			//创建
			create_store(){
				resource.editStoreInfoGet({store_id:this.store_id}).then(res => {
					if(res.data.code == 1){
						this.showEdit = true;
						let resData = res.data.data;
						this.addObj = resData.info;
						this.addObj.bank_flag = 1;
						this.admin_list = resData.admin_list;
						this.service_list = resData.service_list;
						this.domain = resData.info.domain;
						//获取地址
						this.getarea({type:'0',id:this.addObj.area_province_id});

					}else{
						this.$message.warning(res.data.msg);
					}
				})
				
			},
			changeProvince(v){
				this.addObj.area_city_id = "";
				//获取地址
				this.getarea({type:'1',id:v})
			},
			changeCity(v){
				this.city_list.map(item => {
					if(item.id == v){
						this.addObj.area_code = item.code;
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
						this.addObj.business_license_img = res.data.data.urls;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//删除文件
			deteleImg(){
				resource.delImage({url:this.addObj.business_license_img}).then(res => {
					if(res.data.code == 1){
						this.domain = "";
						this.addObj.business_license_img = "";
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//提交
			submit(){
				if(this.addObj.enterprise_name == ''){
					this.$message.warning("请输入企业名称");
				}else if(this.addObj.business_license_sn == ''){
					this.$message.warning("请输入社会统一信用代码");
				}else if(this.addObj.store_name == ''){
					this.$message.warning("请输入商户名称");
				}else if(this.addObj.area_province_id == ''){
					this.$message.warning("请选择省");
				}else if(this.addObj.area_city_id == ''){
					this.$message.warning("请选择市");
				}else if(this.addObj.business_license_img == ''){
					this.$message.warning("请上传营业执照影印件");
				}else if(this.addObj.service_subject_id == ''){
					this.$message.warning("请选择综合服务主体");
				}else if(this.addObj.contacts_name == ''){
					this.$message.warning("请输入联系人姓名");
				}else if(this.addObj.contacts_phone == ''){
					this.$message.warning("请输入联系人手机号");
				}else if(this.addObj.contacts_email == ''){
					this.$message.warning("请输入联系人邮箱");
				}else if(this.addObj.contacts_address == ''){
					this.$message.warning("请输入联系地址");
				}else if(this.addObj.store_admin_phone == ''){
					this.$message.warning("请输入企业登录用户名");
				}else if(this.addObj.store_admin_email == ''){
					this.$message.warning("请输入邮箱");
				}else if(this.addObj.store_admin_name == ''){
					this.$message.warning("请输入姓名");
				}else if(this.addObj.open_company_name == ''){
					this.$message.warning("请输入开户名");
				}else if(this.addObj.bank_no == ''){
					this.$message.warning("请输入专属账户");
				}else if(this.addObj.open_bank_account == ''){
					this.$message.warning("请输入对公账号");
				}else if(this.addObj.account_manager_id == ''){
					this.$message.warning("请选择客户经理");
				}else if(this.addObj.account_manager_phone == ''){
					this.$message.warning("请输入手机号");
				}else if(this.addObj.account_manager_email == ''){
					this.$message.warning("请输入邮箱");
				}else{
					resource.addstoreinfo(this.addObj).then(res => {
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
		},
		components:{
			uploadFile
		}
	}
</script>














v x  ]