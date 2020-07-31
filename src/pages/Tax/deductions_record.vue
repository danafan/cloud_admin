<template>
	<div>
		<el-card>
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="税款属期：">
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
			<el-form-item label="商户名称：">
				<el-input v-model="req.store_name" placeholder="请输入"></el-input>
			</el-form-item>
		</el-form>
		<div class="but">
			<el-button type="primary" size="small" @click="getList">搜索</el-button>
			<el-button type="primary" size="small" @click="reset">重置</el-button>
			<el-button type="primary" size="small" @click="getStorelist">上传文件</el-button>
		</div>
		<el-table :data="dataObj.data" border style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column width="150" prop="store_name" label="商户名称" align="center">
			</el-table-column>
			<el-table-column width="150" prop="tax_day" label="所属期" align="center">
			</el-table-column>
			<el-table-column width="150" prop="service_subject_name" label="综合服务主体" align="center">
			</el-table-column>
			<el-table-column width="150" prop="store_name" label="扣缴明细名称" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.service_subject_name + '_' + scope.row.store_name}}_个人所得税扣款明细表</span>
				</template>
			</el-table-column>
			<el-table-column width="150" prop="email" label="接收扣缴明细解压密码邮箱" align="center">
			</el-table-column>
			<el-table-column width="150" label="下载状态" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.status == '0'?'未下载':'已下载'}}</span>
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
<el-dialog title="上传文件" :visible.sync="isDetail">
	<el-form size="small" style="width: 100%">
		<el-form-item label="商户名称：" label-width="220px" required>
			<el-select v-model="reqObj.store_id">
				<el-option v-for="item in store_list" :key="item.store_id" :label="item.store_name" :value="item.store_id">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="所属期：" label-width="220px" required>
			<el-date-picker
			v-model="reqObj.tax_day"
			type="date"
			value-format="yyyy-MM-dd"
			placeholder="选择日期">
		</el-date-picker>
	</el-form-item>
	<el-form-item label="上传签约用户文件：" label-width="220px" required>
		<div class="showimg" v-if="fileName != ''" @mouseenter="isDel = true" @mouseleave="isDel = false">
			<div class="img">{{fileName}}</div>
			<div class="modal" v-if="isDel == true">
				<img src="../../assets/deleteImg.png" @click="detele">
			</div>
		</div>
		<upload-file @callbackFn="callbackFn" v-else></upload-file>
	</el-form-item>
</el-form>
<div slot="footer" class="dialog-footer">
	<el-button @click="isDetail = false">取 消</el-button>
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
		font-size: 12px;
		padding-right: 20px;
		padding-left: 20px;
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
					start_time:"",
					end_time:"",
					store_name:"",
				},				//请求参数
				date:[],	//订单创建时间
				dataObj:{},	
				isDetail:false,		//默认详情不显示
				reqObj:{
					store_id:"",
					tax_day:"",
					file:null
				},
				isDel:false,
				fileName:"",
				store_list:[],		//商户列表
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		watch:{
			//订单创建时间
			date:function(n){
				this.req.start_time = n.length> 0?n[0]:"";
				this.req.end_time = n.length> 0?n[1]:"";
			}
		},
		methods:{
			//获取列表
			getList(){
				resource.persionaltax(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//上传文件
			getStorelist(){
				resource.ajaxstorelist().then(res => {
					if(res.data.code == 1){
						this.store_list = res.data.data;
						this.isDetail = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//重置
			reset(){
				this.date = [];
				this.req = {
					page:1,
					pagesize:10,
					start_time:"",
					end_time:"",
					store_name:"",
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
			//上传文件
			callbackFn(obj){
				this.fileName = obj.name;
				this.reqObj.file = obj;
			},
			//删除文件
			detele(){
				this.fileName = "";
				this.reqObj.file = null;
			},
			//提交上传
			submit(){
				if(this.reqObj.store_id == ''){
					this.$message.warning('请选择商户');
				}else if(this.reqObj.tax_day == ''){
					this.$message.warning('请选择所属期');
				}else if(!this.reqObj.file){
					this.$message.warning('请上传签约用户文件');
				}else{
					resource.uploadtax(this.reqObj).then(res => {
						if(res.data.code == 1){
							this.isDetail = false;
							//获取列表
							this.getList();
							this.$message.success(res.data.msg);
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