<template>
	<div>
		<el-card style="margin-top: 24px;">
			<div class="info_title">
				<div class="title_txt">基本信息</div>
				<div class="edit_box" @click="edit">
					<img class="edit_icon" src="../../../assets/edit_icon.png">
					<div class="edit_txt">编辑</div>
				</div>
			</div>
			<div class="info_row">
				<div class="row_item">综合服务主体：{{storeInfoObj.service_subject_name}}</div>
				<div class="row_item">服务状态：{{storeInfoObj.status == '1'?'服务中':'停止服务'}}</div>
			</div>
			<div class="info_row">
				C端签约模式：微信端
			</div>
		</el-card>
		<el-card style="margin-top: 24px;">
			<div class="info_title">
				<div class="title_txt">计费模式</div>
			</div>
			<div class="info_row">
				商户服务费费率：{{storeInfoObj.default_rate}}
			</div>
			<div class="info_row">
				{{storeInfoObj.money1}}（含）～ {{storeInfoObj.money2}}，商户服务费费率：{{storeInfoObj.rate1}}
			</div>
			<div class="info_row">
				{{storeInfoObj.money2}}（含）～ {{storeInfoObj.money3}}，商户服务费费率：{{storeInfoObj.rate2}}
			</div>
			<div class="info_row">
				超过{{storeInfoObj.money3}}（含），商户服务费费率：{{storeInfoObj.rate3}}
			</div>
		</el-card>
		<el-card style="margin-top: 24px;">
			<div class="info_title">
				<div class="title_txt">限额信息</div>
			</div>
			<div class="info_row">
				全网单人月累计金额限制（元）：{{storeInfoObj.person_month_limit}}
			</div>
		</el-card>
		<el-card style="margin-top: 24px;">
			<div class="info_title">
				<div class="title_txt">合同信息</div>
			</div>
			<div class="info_row">
				<div class="row_item">合同编号：{{storeInfoObj.contract_id}}</div>
				<div class="row_item">合同名称：{{storeInfoObj.contract_name}}</div>
			</div>
			<div class="info_row">
				合同有效期：{{storeInfoObj.contract_start_time}} ~ {{storeInfoObj.contract_end_time}}
			</div>
		</el-card>
		<el-card style="margin-top: 24px;">
			<div class="info_title">
				<div class="title_txt">禁止名单</div>
			</div>
			<div class="info_row" v-for="item in storeInfoObj.black_list">
				<div class="row_item">姓名：{{item.username}}</div>
				<div class="row_item">身份证号：{{item.identity_card}}</div>
			</div>
		</el-card>
		<!-- 编辑 -->
		<el-dialog title="编辑" :visible.sync="showEdit">
			<div class="title">基本信息</div>
			<el-form size="small" style="width: 60%">
				<el-form-item label="综合服务主体：" label-width="220px" required>
					<el-input v-model="req.service_subject_name" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="C端签约模式：" label-width="220px" required>
					<el-select v-model="req.signing_mode">
						<el-option v-for="item in sign_list" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div class="title">合同信息</div>
			<el-form size="small" style="width: 60%">
				<el-form-item label="合同编号：" label-width="220px" required>
					<el-input v-model="req.contract_id"></el-input>
				</el-form-item>
				<el-form-item label="合同名称：" label-width="220px" required>
					<el-input v-model="req.contract_name"></el-input>
				</el-form-item>
				<el-form-item label="合同有效期：" label-width="220px" required>
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
		<div class="title">计费模式</div>
		<el-form size="small" style="width: 90%">
			<el-form-item label="商户服务费费率：" label-width="220px" required>
				<el-input type="number" v-model="req.default_rate">
					<template slot="append">%</template>
				</el-input>
				<div style="display: flex;margin-bottom: 20px;margin-top: 20px;">
					<el-input type="number" v-model="req.money1">
						<template slot="append">元</template>
					</el-input><div style="width: 200px;">（含）～</div> <el-input type="number" v-model="req.money2">
						<template slot="append">元</template>
					</el-input><div style="width: 100px;">收取</div><el-input type="number" v-model="req.rate1">
						<template slot="append">%</template>
					</el-input>
				</div>
				<div style="display: flex;margin-bottom: 20px;">
					<el-input type="number" v-model="req.money2">
						<template slot="append">元</template>
					</el-input><div style="width: 200px;">（含）～ </div><el-input type="number" v-model="req.money3">
						<template slot="append">元</template>
					</el-input><div style="width: 100px;">收取</div><el-input type="number" v-model="req.rate2">
						<template slot="append">%</template>
					</el-input>
				</div>
				<div style="display: flex;margin-bottom: 20px;">
					<div style="width: 100px;">超过</div>
					<el-input type="number" v-model="req.money3">
						<template slot="append">元</template>
					</el-input>
					<div style="width: 260px;">（含），收取</div>
					<el-input type="number" v-model="req.rate3">
						<template slot="append">元</template>
					</el-input>
				</div>
			</el-form-item>
		</el-form>
		<div class="title">禁止名单</div>
		<el-form size="small" style="width: 90%">
			<div style="display: flex" v-for="(item,index) in black_list">
				<el-form-item label="姓名：" label-width="220px">
					<el-input v-model="item.username" size="small"></el-input>
				</el-form-item>
				<el-form-item label="身份证号：" label-width="220px">
					<el-input v-model="item.identity_card" size="small"></el-input>
				</el-form-item>
				<div class="add" v-if="index == black_list.length - 1" @click="add(index)">添加</div>
				<div class="delete" @click="deleteBlack(index)">删除</div>
			</div>
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
.add,.delete{
	margin-left: 10px;
	width: 50px;
	font-size: 14px;
}
.add{
	color:#008DFF;
}
.delete{
	color:#E02020;
}
</style>
<script>
	import resource from '../../../api/resource.js'
	export default{
		data(){
			return{
				storeInfoObj:{},
				showEdit:false,
				req:{
					signing_mode:"",
					contract_id:"",
					contract_name:"",
					contract_start_time:"",
					contract_end_time:"",
					default_rate:"",
					money1: "",
					money2: "",
					money3: "",
					rate1: "",
					rate2: "",
					rate3: "",
				},
				store_name:"",
				sign_list:[],					//c端签约模式
				black_list:[],					//禁止名单
				date:[],						//合同有效期
			}
		},
		created(){
			//获取信息
			this.getStoreInfo();
		},
		watch:{
			//合同有效期
			date:function(n){
				this.req.contract_start_time = n && n.length> 0?n[0]:"";
				this.req.contract_end_time = n && n.length> 0?n[1]:"";
			}
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
				resource.getsub({store_id:this.store_id}).then(res => {
					if(res.data.code == 1){
						this.storeInfoObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击编辑
			edit(){
				resource.addEditSubGet({store_id:this.store_id}).then(res => {
					if(res.data.code == 1){
						this.showEdit = true;
						let resData = res.data.data;
						this.req = resData.info;
						this.sign_list = resData.sign_list;
						this.black_list = resData.black_list;
						if(this.black_list.length == 0){
							let obj = {
								username:"",
								identity_card:""
							}
							this.black_list.push(obj)
						}
						if(resData.info.contract_start_time && resData.info.contract_end_time){
							this.date.push(resData.info.contract_start_time);
							this.date.push(resData.info.contract_end_time);
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			// 删除
			deleteBlack(index){
				this.black_list.splice(index,1);
			},
			// 添加
			add(index){
				if(this.black_list[index].username == '' || this.black_list[index].identity_card == ''){
					this.$message.warning("请完善当前条目!");
				}else{
					let obj = {
						username:"",
						identity_card:""
					}
					this.black_list.push(obj);
				}
			},
			//提交修改
			submit(){
				if(!this.req.signing_mode || this.req.signing_mode == ''){
					this.$message.warning("请选择c端签约模式");
				}else if(!this.req.contract_id || this.req.contract_id == ''){
					this.$message.warning("请输入合同编号");
				}else if(!this.req.contract_name || this.req.contract_name == ''){
					this.$message.warning("请输入合同名称");
				}else if(!this.date || this.date.length == 0){
					this.$message.warning("请输入合同有效期");
				}else if(!this.judgmentMoney.test(this.req.default_rate) || !this.judgmentMoney.test(this.req.money1) || !this.judgmentMoney.test(this.req.money2) || !this.judgmentMoney.test(this.req.money3) || !this.judgmentMoney.test(this.req.rate1) || !this.judgmentMoney.test(this.req.rate2) || !this.judgmentMoney.test(this.req.rate3)){
					this.$message.warning("请输入正确的费率格式");
				}else{
					this.req.store_id = this.store_id;
					if(this.black_list[0].username != '' && this.black_list[0].identity_card != ''){
						this.req.black_list = JSON.stringify(this.black_list);
					}
					resource.addEditSubPost(this.req).then(res => {
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

























