<template>
	<div>
		<el-card>
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="日期：">
					<el-date-picker
					v-model="date"
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
			<el-button type="primary" size="small" @click="create" v-if="dataObj.is_supper == 1 || (dataObj.is_supper == 0 && dataObj.button_list.add == 1)">创建</el-button>
		</div>
		<el-table :data="dataObj.data" border style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column width="300" prop="created_time" label="日期" align="center">
			</el-table-column>
			<el-table-column prop="title" label="标题" align="center">
			</el-table-column>
			<el-table-column width="150" label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="getLetters(scope.row.notice_id)" v-if="dataObj.is_supper == 1 || (dataObj.is_supper == 0 && dataObj.button_list.detail == 1)">查看</el-button>
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
<!-- 查看 -->
<el-dialog
:title="detailObj.title"
:visible.sync="showDetail"
width="30%">
<span>{{detailObj.content}}</span>
<span slot="footer" class="dialog-footer">
	<el-button @click="showDetail = false">取 消</el-button>
	<el-button type="primary" @click="showDetail = false">确 定</el-button>
</span>
</el-dialog>
<!-- 创建 -->
<el-dialog title="创建函件" :visible.sync="showCreate">
	<el-form size="small" style="width: 100%">
		<el-form-item label="函件标题：" label-width="220px" required>
			<el-input v-model="createReq.title" placeholder="请输入内容"></el-input>
		</el-form-item>
		<el-form-item label="函件内容：" label-width="220px" required>
			<el-input type="textarea" v-model="createReq.content" :row="3" placeholder="请输入内容"></el-input>
		</el-form-item>
	</el-form>
	<div slot="footer" class="dialog-footer">
		<el-button @click="showCreate = false">取 消</el-button>
		<el-button type="primary" @click="submit">确 定</el-button>
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
					created_time_start:"",
					created_time_end:"",	
				},				//请求参数
				date:[],	//时间
				dataObj:{},	
				showDetail:false,
				detailObj:{},
				showCreate:false,
				createReq:{
					title:"",
					content:""
				}
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		watch:{
			//时间
			date:function(n){
				this.req.created_time_start = n && n.length> 0?n[0]:"";
				this.req.created_time_end = n && n.length> 0?n[1]:"";
			}
		},
		methods:{
			//获取列表
			getList(){
				resource.letterslist(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//函件详情
			getLetters(id){
				resource.getletters({notice_id:id}).then(res => {
					if(res.data.code == 1){
						this.showDetail = true;
						this.detailObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//创建函件
			create(){
				this.showCreate = true;
				this.createReq = {
					title:"",
					content:""
				}
			},
			//重置
			reset(){
				this.date = [];
				this.req = {
					page:1,
					pagesize:10,
					created_time_start:"",
					created_time_end:"",
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
				if(this.createReq.title == ''){
					this.$message.warning('请输入函件标题');
				}else if(this.createReq.content == ''){
					this.$message.warning('请输入函件内容');
				}else{
					resource.createlLetters(this.createReq).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.showCreate = false;
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
</script>














v x  ]