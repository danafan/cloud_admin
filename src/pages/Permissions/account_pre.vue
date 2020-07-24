<template>
	<div>
		<el-card>
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="登录用户名：">
					<el-input v-model="req.admin_name" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="联系人姓名：">
					<el-input v-model="req.realname" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="联系人手机号：">
					<el-input type="number" v-model="req.admin_phone" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="联系人邮箱：">
					<el-input v-model="req.admin_email" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="账号状态：">
					<el-select v-model="req.status" placeholder="不限">
						<el-option v-for="item in status_list" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div class="huajian">
				<el-button type="primary" size="small" icon="el-icon-upload" @click="create">创建</el-button>
				<div class="but">
					<el-button type="primary" size="small" @click="getList">搜索</el-button>
					<el-button type="primary" size="small" @click="reset">重置</el-button>
				</div>
			</div>
			<el-table :data="dataObj.data" border style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
				<el-table-column width="150" prop="admin_name" label="登录用户名" align="center">
				</el-table-column>
				<el-table-column width="150" prop="access_ids" label="角色权限" align="center">
				</el-table-column>
				<el-table-column width="150" prop="realname" label="联系人姓名" align="center">
				</el-table-column>
				<el-table-column width="150" prop="admin_phone" label="联系人手机号" align="center">
				</el-table-column>
				<el-table-column width="150" prop="admin_email" label="联系人邮箱" align="center">
				</el-table-column>
				<el-table-column width="150" label="账号状态" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.is_disabled == '1'?'已启用':'已停用'}}</span>
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="edit(scope.row.admin_id)" v-if="scope.row.is_disabled == '1'">编辑</el-button>
						<el-button type="text" size="small" @click="setting(scope.row.is_disabled,scope.row.admin_id)">{{scope.row.is_disabled == '1'?'禁用':'启用'}}</el-button>
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
	<!-- 修改信息 -->
	<el-dialog :title="updateInfoType == '1'?'创建':'编辑'" :visible.sync="updateInfo">
		<el-form size="small" style="width: 60%;margin: 0 auto">
			<el-form-item label="登录用户名" label-width="180px" required>
				<el-input v-model="updateInfoReq.admin_name"></el-input>
			</el-form-item>
			<el-form-item label="密码" label-width="180px" required>
				<el-input v-model="updateInfoReq.password"></el-input>
			</el-form-item>
			<el-form-item label="邮箱" label-width="180px" required>
				<el-input v-model="updateInfoReq.admin_email"></el-input>
			</el-form-item>
			<el-form-item label="姓名" label-width="180px" required>
				<el-input v-model="updateInfoReq.realname"></el-input>
			</el-form-item>
			<el-form-item label="手机号" label-width="180px" required>
				<el-input v-model="updateInfoReq.admin_phone"></el-input>
			</el-form-item>
			<el-form-item label="备注" label-width="180px" required>
				<el-input type="textarea"
				:rows="3" v-model="updateInfoReq.remark"></el-input>
			</el-form-item>
			<el-form-item :label="`${item.menu_name}：`" v-for="(item,index) in accessList" v-if="is_super != '1'">
				<el-checkbox-group v-model="checkedCities">
					<el-checkbox :label="child.id" :key="child.id" :value="child.id" v-for="(child,index) in item.access">{{child.access_name}}</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="updateInfo = false">取 消</el-button>
			<el-button type="primary" @click="subUpdateInfo">确 定</el-button>
		</div>
	</el-dialog>
</div>
</template>
<style lang="less" scoped>
.huajian{
	margin-bottom: 10px;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
</style>
<script>
	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				req:{
					page:1,
					pagesize:10,
					admin_name:"",
					realname:"",
					admin_phone:"",
					admin_email:"",
					status:""
				},				//请求参数
				status_list:[{
					id:"",
					name:"全部"
				},{
					id:"0",
					name:"停用"
				},{
					id:"1",
					name:"启用"
				}],					//信息状态
				dataObj:{},	
				updateInfo:false,		//默认编辑或创建不显示
				updateInfoType:'1',		//1:创建；2:编辑
				admin_id:"",			//点击的管理员ID
				updateInfoReq:{
					admin_name:"",
					admin_email:"",
					password:"",
					realname:"",
					admin_phone:"",
					remark:""
				},						//提交的用户信息
				accessList:[],			//所有的权限列表
				checkedCities:[],		//选中的权限id集合
				is_super:'',
				
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		methods:{
			//获取列表
			getList(){
				resource.adminIndex(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(this.data.msg);
					}
				})
			},
			//重置
			reset(){
				this.req = {
					page:1,
					pagesize:10,
					admin_name:"",
					realname:"",
					admin_phone:"",
					admin_email:"",
					status:""
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
			//点击创建
			create(){
				this.updateInfoType = '1';
				this.updateInfo = true;
				this.updateInfoReq = {
					admin_name:"",
					admin_email:"",
					realname:"",
					admin_phone:"",
					remark:""
				},
				this.checkedCities = [];
				//获取权限列表
				this.getAccessList();
			},
			//点击编辑
			edit(id){
				resource.adminEditGet({id:id}).then(res => {
					if(res.data.code == 1){
						this.updateInfo = true;
						this.admin_id = id;
						this.updateInfoType = '2';
						this.is_super = res.data.data.is_super;
						for(var item in this.updateInfoReq){
							for(var item1 in res.data.data){
								if(item == item1){
									this.updateInfoReq[item] = res.data.data[item1];
								}
							}
						}
						//获取权限列表
						this.getAccessList();
						this.checkedCities = res.data.data.access_ids;
					}else{
						this.$message.warning(this.data.msg);
					}
				})
			},
			//获取权限列表
			getAccessList(){
				resource.getaccesslist(this.req).then(res => {
					if(res.data.code == 1){
						this.accessList = res.data.data;
					}else{
						this.$message.warning(this.data.msg);
					}
				})
			},
			//提交创建或修改
			subUpdateInfo(){
				if(this.updateInfoReq.admin_name == ''){
					this.$message.warning('请输入登录用户名');
				}else if(this.updateInfoReq.admin_email == ''){
					this.$message.warning('请输入邮箱');
				}else if(this.updateInfoReq.password == ''){
					this.$message.warning('请输入密码');
				}else if(this.updateInfoReq.realname == ''){
					this.$message.warning('请输入姓名');
				}else if(this.updateInfoReq.admin_phone == ''){
					this.$message.warning('请输入手机号');
				}else{
					this.updateInfoReq.access_ids = this.is_super == '1'?'0':this.checkedCities.join(',');
					if(this.updateInfoType == '1'){	//创建
						resource.adminAdd(this.updateInfoReq).then(res => {
							if(res.data.code == 1){
								this.updateInfo = false;
								this.$message.success(res.data.msg);
								//获取列表
								this.getList();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}else{	//编辑
						this.updateInfoReq.id = this.admin_id;
						resource.adminEdit(this.updateInfoReq).then(res => {
							if(res.data.code == 1){
								this.updateInfo = false;
								this.$message.success(res.data.msg);
								//获取列表
								this.getList();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}
					
				}
			},
			//设置
			setting(status,id){
				this.$confirm(`确认${status == '1'?'禁用':'启用'}`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.adminStartStop({status:status == '1'?'0':'1',id:id}).then(res => {
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
			}

		}
	}
</script>













