<template>
	<div>
		<el-card>
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="商户名称：">
					<el-input v-model="req.store_name" placeholder="请输入"></el-input>
				</el-form-item>
			</el-form>
			<div class="but">
				<el-button type="primary" size="small" @click="getList">搜索</el-button>
				<el-button type="primary" size="small" @click="reset">重置</el-button>
			</div>
			<el-button style="margin-bottom: 10px" type="primary" size="small" @click="create_store">创建关联</el-button>
			<el-table :data="dataObj.data" border style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
				<el-table-column width="500" prop="name" label="关联商户" align="center">
				</el-table-column>
				<el-table-column width="500" prop="remark" label="关联说明" align="center">
				</el-table-column>
				<el-table-column fixed="right" label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="deleteAss(scope.row.relation_id)">删除</el-button>
						<el-button type="text" size="small" @click="edit(scope.row.relation_id)">编辑</el-button>
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
	<!-- 编辑或添加 -->
	<el-dialog title="关联账户" :visible.sync="showEdit">
		<el-form size="small" style="width: 100%">
			<el-form-item label="商户名称：" label-width="220px" required>
				<el-checkbox-group v-model="checkList">
					<el-checkbox :label="item.store_id" v-for="item in addObj.list" :checked="item.check_status == '1'">{{item.store_name}}</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item label="关联说明：" label-width="220px">
				<el-input
				type="textarea"
				:rows="5"
				placeholder="请输入关联说明"
				v-model="addObj.remark">
			</el-input>
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
</style>
<script>
	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				req:{
					page:1,
					pagesize:10,
					store_name:""
				},				//请求参数
				dataObj:{},	
				showEdit:false,			//默认创建弹框不显示
				addObj:{},
				type:'1',				//1:创建；2:修改
				checkList:[],			//选中的商户编号
				relation_id:"",			//点击的商户id
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		methods:{
			//获取列表
			getList(){
				resource.relationlist(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//删除
			deleteAss(id){
				this.$confirm('确认删除', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.delrelation({relation_id:id}).then(res => {
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
			//创建
			create_store(){
				this.type = '1';
				this.checkList = [];
				this.showEdit = true;
				//获取可用的商户列表或者编辑关联商户
				this.getUnrelationStore();
			},
			//编辑
			edit(id){
				this.type = '2';
				this.checkList = [];
				this.showEdit = true;
				this.relation_id = id;
				//获取可用的商户列表或者编辑关联商户
				this.getUnrelationStore();
			},
			//获取可用的商户列表或者编辑关联商户
			getUnrelationStore(){
				resource.getUnrelationStore().then(res => {
					if(res.data.code == 1){
						this.addObj = res.data.data;
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
					store_name:""
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
			//提交
			submit(){
				if(this.checkList.length < 2){
					this.$message.warning("至少选择两个商户关联");
				}else{
					var req = {
						store_ids:this.checkList.join(','),
						remark:this.addObj.remark
					}
					if(this.type == '1'){
						resource.addrelation(req).then(res => {
							if(res.data.code == 1){
								this.showEdit = false;
								this.$message.success(res.data.msg);
								//获取列表
								this.getList();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}else{
						req.relation_id = this.relation_id;
						resource.editrelation(req).then(res => {
							if(res.data.code == 1){
								this.showEdit = false;
								this.$message.success(res.data.msg);
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