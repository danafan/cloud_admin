<template>
	<div>
		<el-card>
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="发票类目：">
					<el-input v-model="req.cate_name" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="状态：">
					<el-select v-model="req.status" placeholder="不限" clearable>
						<el-option v-for="item in order_status" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div class="but">
				<el-button type="primary" size="small" @click="getList">搜索</el-button>
				<el-button type="primary" size="small" @click="reset">重置</el-button>
				<el-button type="primary" size="small" @click="createIn">新建</el-button>
			</div>
			<el-table :data="dataObj.data" border style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
				<el-table-column width="180" prop="cate_name" label="发票类目" align="center">
				</el-table-column>
				<el-table-column show-overflow-tooltip prop="remarks" label="说明" align="center">
				</el-table-column>
				<el-table-column width="150" prop="remarks" label="状态" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.status == 1?'启用中':'已停用'}}</span>
					</template>
				</el-table-column>
				<el-table-column width="150" label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="setting(scope.row.status,scope.row.invoice_cate_id)">{{scope.row.status == 1?'停用':'启用'}}</el-button>
						<el-button v-if="scope.row.status == 1" type="text" size="small" @click="getUpdateInfo(scope.row.invoice_cate_id,scope.row.cate_name,scope.row.remarks)">编辑</el-button>
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
	<el-dialog :title="`${type == '1'?'新建':'编辑'}`" :visible.sync="updateMoney">
		<el-form size="small" style="width: 60%;margin: 0 auto">
			<el-form-item label="发票类目：" required>
				<el-input v-model="updateMoneyReq.cate_name" placeholder="请输入"></el-input>
			</el-form-item>
			<el-form-item label="备注：">
				<el-input v-model="updateMoneyReq.remarks" :maxlength="50" type="textarea" :row='3' placeholder="请输入"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="updateMoney = false">取 消</el-button>
			<el-button type="primary" @click="subUpdateInfo">确 定</el-button>
		</div>
	</el-dialog>
</div>
</template>
<style lang="less" scoped>

</style>
<script>
	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				req:{
					page:1,
					pagesize:10,
					cate_name:"",
					status:"1",
				},				//请求参数
				order_status:[{
					id:"0",
					name:"停用"
				},{
					id:"1",
					name:"启用"
				}],					//订单状态
				dataObj:{},	
				type:'1',				//1：新建；2:编辑
				updateMoney:false,		//默认修改金额不显示
				updateMoneyReq:{
					cate_name:"",
					remarks:""
				},						//修改打款金额
				order_id:""
				
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		methods:{
			//获取列表
			getList(){
				resource.invoiceCategoryList(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//重置
			reset(){
				this.req = {
					page:1,
					pagesize:10,
					cate_name:"",
					status:"1",
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
			//操作起停用
			setting(status,id){
				this.$confirm(`确认${status == 1?'停用':'启用'}`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.startStop({invoice_cate_id:id,type:status == 1?0:1}).then(res => {
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
			//新建
			createIn(){
				this.type = '1';
				this.updateMoney = true;
				this.updateMoneyReq.cate_name = "";
				this.updateMoneyReq.remarks = "";
			},
			//修改信息
			getUpdateInfo(id,name,remarks){
				this.type = '2';
				this.updateMoney = true;
				this.order_id = id;
				this.updateMoneyReq.cate_name = name;
				this.updateMoneyReq.remarks = remarks;
			},
			//提交
			subUpdateInfo(){
				let req = this.updateMoneyReq;
				if(req.cate_name == ''){	
					this.$message.warning("请输入类目名称");
				}else{
					if(this.type == '1'){
						resource.createInvoice(this.updateMoneyReq).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.updateMoney = false;
								//获取列表
								this.getList();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}else if(this.type == '2'){
						req.invoice_cate_id = this.order_id;
						resource.editInvoiceCategory(req).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.updateMoney = false;
								//获取列表
								this.getList();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}
					
				}
			}
		}
	}
</script>














v x  ]