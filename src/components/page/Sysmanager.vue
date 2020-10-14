<template>
	<div>
		<el-card class="box-card">
			 <div slot="header" class="clearfix">
			    <span>系统信息</span>
			    <el-button style="float: right; padding: 3px 0" type="text" @click="saveEdit">修改</el-button>
			  </div>
			  <div>
				  <el-form ref="form" :model="form" label-width="120px">
				  	<el-input v-model="form.systemid" style="display: none;"></el-input>
				  	<el-form-item label="系统名称">
				  		<el-row :gutter="23">
				  			<el-col :span="22">
				  				<el-input v-model="form.sysname" placeholder="请输入内容" ></el-input>
				  			</el-col>
				  			<el-col :span="1"></el-col>
				  		</el-row>
				  	</el-form-item>
				  	<el-form-item label="系统地址">
				  		<el-row :gutter="23">
				  			<el-col :span="22">
				  				<el-input v-model="form.sysaddress" placeholder="请输入内容" clearable></el-input>
				  			</el-col>
				  			<el-col :span="1"></el-col>
				  		</el-row>
				  	</el-form-item>
				  	<el-form-item label="支持的操作类型">
				  		<el-row :gutter="23">
				  			<el-col :span="22">
				  				<el-input v-model="form.type" placeholder="请输入内容" :disabled="true"></el-input>
				  			</el-col>
				  			<el-col :span="1"></el-col>
				  		</el-row>
				  	</el-form-item>
				  	<el-form-item label="消息体名称">
				  		<el-row :gutter="23">
				  			<el-col :span="22">
				  				<el-input v-model="form.data" placeholder="请输入内容" :disabled="true"></el-input>
				  			</el-col>
				  			<el-col :span="1"></el-col>
				  		</el-row>
				  	</el-form-item>
				  	<el-form-item label="证书码">
				  		<el-row :gutter="23">
				  			<el-col :span="22">
				  				<el-input v-model="form.license" type="textarea" placeholder="请输入内容" clearable></el-input>
				  			</el-col>
				  			<el-col :span="1"></el-col>
				  		</el-row>
				  	</el-form-item>
				  	<el-form-item label="公钥">
				  		<el-row :gutter="23">
				  			<el-col :span="22">
				  				<el-input v-model="form.public_key" type="textarea" placeholder="请输入内容" :disabled="true"></el-input>
				  			</el-col>
				  			<el-col :span="1"></el-col>
				  		</el-row>
				  	</el-form-item>
				  	<el-form-item label="私钥">
				  		<el-row :gutter="23">
				  			<el-col :span="22">
				  				<el-input v-model="form.private_key" type="textarea" :autosize="{ minRows: 2, maxRows: 8}" placeholder="请输入内容" :disabled="true"></el-input>
				  			</el-col>
				  			<el-col :span="1"></el-col>
				  		</el-row>
				  	</el-form-item>
					<el-form-item label="系统到期时间">
						<el-row :gutter="23">
							<el-col :span="22">
								<el-input v-model="form.overtime"  placeholder="请输入内容" :disabled="true"></el-input>
							</el-col>
							<el-col :span="1"></el-col>
						</el-row>
					</el-form-item>
				  </el-form>
			  </div>
		
		
		</el-card>
	</div>
</template>

<script>
	import {
		getHttpGet,
		getHttpPost,
		getHttpDelete
	} from '../../api/index';
	export default {
		name: 'basetable',
		data() {
			return {
				form: {}
			};
		},
		created() {
			this.getData();
		},
		methods: {
			// 获取 easy-mock 的模拟数据
			getData() {
				let self = this;
				let webRoot = window.ZHCJAppConfig.webURL;
				let url = webRoot + window.ZHCJAppConfig.API.sysinfo;

				//请求服务
				let params = {};
				params = {
					loginName: localStorage.getItem('ms_username')
				}
				getHttpGet(url, (params)).then(res => {
					let tmpRes = res;
					if (tmpRes.code == 200) {
						self.form = tmpRes.data;
					} else {
						self.$message.warning('系统已过期！'+tmpRes.code);
					}
				}).catch(function(error) {
					self.$message.warning('亲，网络出现异常');
					console.log(error);
				});
			},
			saveEdit() {

				let self = this;
				let webRoot = window.ZHCJAppConfig.webURL;
				let url = webRoot + window.ZHCJAppConfig.API.syssaveinfo;
				self.form["loginName"] = localStorage.getItem('ms_username');
				let params = self.form;
				getHttpGet(url, (params)).then(res => {
					let tmpRes = res;
					if (tmpRes.code == 200) {
						self.getData();
						self.$message.success(`保存成功`);
					} else {
						self.$message.error('请求数据异常！' + tmpRes.code);
					}
				}).catch(function(error) {
					self.$message.warning('亲，网络出现异常');
					console.log(error);
				});
			}
		}
	};
</script>

<style scoped>
	.handle-box {
		margin-bottom: 20px;
	}

	.handle-select {
		width: 120px;
	}

	.handle-input {
		width: 300px;
		display: inline-block;
	}

	.table {
		width: 100%;
		font-size: 14px;
	}

	.red {
		color: #ff0000;
	}

	.mr10 {
		margin-right: 10px;
	}

	.table-td-thumb {
		display: block;
		margin: auto;
		width: 40px;
		height: 40px;
	}
</style>
