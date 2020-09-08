<template>
	<div>
		<el-card>
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="姓名：">
					<el-input v-model="req.name" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="证件号：">
					<el-input v-model="req.id_card_no" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="预签约手机号：">
					<el-input v-model="req.phone" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="创建时间：">
					<el-date-picker
					v-model="create_date"
					type="datetimerange"
					value-format="yyyy-MM-dd HH:mm:ss"
					range-separator="至"
					start-placeholder="开始时间"
					end-placeholder="结束时间"
					:default-time="['00:00:00', '23:59:59']">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="更新时间：">
				<el-date-picker
				v-model="update_date"
				type="datetimerange"
				value-format="yyyy-MM-dd HH:mm:ss"
				range-separator="至"
				start-placeholder="开始时间"
				end-placeholder="结束时间"
				:default-time="['00:00:00', '23:59:59']">
			</el-date-picker>
		</el-form-item>
	</el-form>
	<div class="but">
		<el-button type="primary" size="small" @click="getList">搜索</el-button>
		<el-button type="primary" size="small" @click="reset">重置</el-button>
	</div>
	<el-table :data="dataObj.data" border style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
		<el-table-column width="180" fixed prop="created_time" label="创建时间" align="center">
		</el-table-column>
		<el-table-column width="180" prop="updated_time" label="更新时间" align="center">
		</el-table-column>
		<el-table-column width="150" label="签约信息" align="center">
			<template slot-scope="scope">
				<div v-for="item in scope.row.sign_info">
					{{item.service_subject_name}}（{{item.sign_status_desc}}）
					<el-button type="text" size="small" @click="termination(scope.row.user_id,item.service_subject_id)" v-if="item.sign_status == 2 && (dataObj.is_supper == 1 || (dataObj.is_supper == 0 && dataObj.button_list.cancelcontract == 1))">解约</el-button>
				</div>
			</template>
		</el-table-column>
		<el-table-column width="150" prop="name" label="用户姓名" align="center">
		</el-table-column>
		<el-table-column width="200" prop="id_card_no" label="证件号码" align="center">
		</el-table-column>
		<el-table-column width="150" prop="phone" label="预签约手机号" align="center">
		</el-table-column>
		<el-table-column width="150" prop="overseas_user" label="是否是海外或港澳台用户" align="center">
		</el-table-column>
		<el-table-column width="180" prop="sign_overdue_time" label="到期时间" align="center">
		</el-table-column>
		<el-table-column fixed="right" label="操作" align="center">
			<template slot-scope="scope">
				<el-button type="text" size="small" @click="getDetail(scope.row.user_id)" v-if="dataObj.is_supper == 1 || (dataObj.is_supper == 0 && dataObj.button_list.detail == 1)">查看</el-button>
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
<!-- 用户信息 -->
<el-dialog title="用户信息" :visible.sync="showUserInfo">
	<el-tabs v-model="activeName" @tab-click="handleClick">
		<el-tab-pane label="用户信息" name="first">
			<div class="userInfoBox">
				<div class="infoItem">
					<div class="itemText">用户姓名：{{userInfo.name}}</div>
					<div class="itemText">预签约手机号：{{userInfo.phone}}</div>
					<div class="itemText">身份证正面：</div>
					<img :src="userInfo.id_card_front" class="user_card" v-if="userInfo.id_card_no != ''">
					<div class="itemText">是否是海外或港澳台用户：{{userInfo.overseas_user}}</div>
				</div>
				<div class="infoItem">
					<div class="itemText">证件号码：{{userInfo.id_card_no}}</div>
					<div class="itemText">银行卡号：{{userInfo.bank_card_no}}</div>
					<div class="itemText">身份证反面：</div>
					<img :src="userInfo.id_card_back" class="user_card" v-if="userInfo.id_card_no != ''">
					<div class="itemText">收款总额（元）：{{userInfo.receive_money}}</div>
					<div class="itemText">
						签约信息：
						<div>
							<div class="sign_item" v-for="item in userInfo.sign_info">
								<div>{{item.service_subject_name}}</div>
								<div>（{{item.sign_status_desc}}）</div>
								<div class="sign_but" v-if="item.sign_status == 2" @click="lookDetail(item.id)">
									查看
								</div>
							</div>
							
						</div>
						
					</div>
				</div>
			</div>
		</el-tab-pane>
		<el-tab-pane label="收款记录" name="second">
			<el-table :data="receiveRecord.data" border style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
				<el-table-column width="150" prop="finished_time" label="打款时间" align="center">
				</el-table-column>
				<el-table-column width="300" prop="enterprise_name" label="打款公司" align="center">
				</el-table-column>
				<el-table-column width="150" prop="receive_money" label="打款金额（元）" align="center">
				</el-table-column>
			</el-table>
			<div class="page">
				<el-pagination
				@size-change="handleSizeChanges"
				@current-change="handleCurrentChanges"
				:current-page="pages"
				:pager-count="11"
				:page-sizes="[5, 10, 15, 20]"
				layout="total, sizes, prev, pager, next, jumper"
				:total="receiveRecord.total"
				>
			</el-pagination>
		</div>
	</el-tab-pane>
</el-tabs>
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
.down_box{
	border:1px solid #D9D9D9;
	padding-left: 20px;
	padding-right: 20px;
	height: 32px;
	display: flex;
	align-items: center;
	.down_icon{
		margin-right: 12px;
		width: 18px;
		height: 18px;
	}
	.down_txt{
		font-size: 14px;
		color: #666666;
	}
}
.showimg{
	position: relative;
	width: 200px;
	height: 200px;
	.img{
		border:1px solid #D9D9D9;
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
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
.upload_toast{
	color: #999999;
	font-size: 14px;
}
.shuo{
	font-size: 14px;
	color: #333333;
}
.userInfoBox{
	width: 100%;
	display: flex;
	justify-content: space-around;
	.infoItem{
		font-size: 14px;
		color:#666666;
		.user_card{
			width:275px;
			height:173px;
		}
		.itemText{
			display: flex;
			margin-bottom: 20px;
			.sign_item{
				margin-bottom: 10px;
				display: flex;
				align-items: center;
			}
			.sign_but{
				border:1px solid #D9D9D9;
				width: 150px;
				height: 32px;
				display: flex;
				align-items: center;
				justify-content: space-around;
				.down_icon{
					width: 18px;
					height: 18px;
				}
			}
		}
	}
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
					name:"",
					id_card_no:"",
					phone:"",
					created_time_start:"",
					created_time_end:"",
					updated_time_start:"",
					updated_time_end:""
				},				//请求参数
				create_date:[],	//创建时间
				update_date:[],	//更新时间
				dataObj:{},	
				showUserInfo:false,		//默认不显示用户信息
				user_id:"",				//点击的用户id
				activeName:"first",		//默认显示第一个用户信息
				userInfo:{},			//用户信息
				pages:1,				//收款记录页码
				pages_size:10,			//收款记录每页条数
				receiveRecord:{},		//收款记录
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		watch:{
			//创建时间
			create_date:function(n){
				this.req.created_time_start = n && n.length> 0?n[0]:"";
				this.req.created_time_end = n && n.length> 0?n[1]:"";
			},
			//更新时间
			update_date:function(n){
				this.req.updated_time_start = n && n.length> 0?n[0]:"";
				this.req.updated_time_end = n && n.length> 0?n[1]:"";
			}
		},
		methods:{
			//获取列表
			getList(){
				resource.userList(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			lookDetail(id){
				resource.getcontract({id:id,user_id:this.user_id}).then(res => {
					if(res.data.code == 1){
						let url = res.data.data;
						window.open(url)
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//重置
			reset(){
				this.create_date = [];
				this.update_date = [];
				this.req = {
					page:1,
					pagesize:10,
					name:"",
					id_card_no:"",
					phone:"",
					created_time_start:"",
					created_time_end:"",
					updated_time_start:"",
					updated_time_end:""
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
			//分页
			handleSizeChanges(val) {
				this.pages_size = val;
				//获取列表
				this.getReceiverecord();
			},
			handleCurrentChanges(val) {
				this.pages = val;
				//获取列表
				this.getReceiverecord();
			},
			//解约
			termination(user_id,service_subject_id){
				this.$confirm('确认解约?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.relievesign({user_id:user_id,service_subject_id:service_subject_id}).then(res => {
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
			//查看
			getDetail(user_id){
				this.user_id = user_id;
				this.showUserInfo = true;
				//用户信息
				this.getInfo();
				//收款记录
				this.getReceiverecord()
			},
			//切换详情导航
			handleClick(){

			},
			//用户信息
			getInfo(){
				resource.getInfo({user_id:this.user_id}).then(res => {
					if(res.data.code == 1){
						this.userInfo = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//收款记录
			getReceiverecord(){
				resource.receiveRecord({user_id:this.user_id}).then(res => {
					if(res.data.code == 1){
						this.receiveRecord = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
			

		}
	}
</script>













