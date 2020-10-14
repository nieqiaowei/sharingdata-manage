<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>数据传输DEMO</span>
				<el-button style="float: right; padding: 3px 0" type="text" @click="runEdit">执行</el-button>
				
			</div>
			<div>
				<el-form ref="form" :model="form" label-width="120px">
					<el-form-item label="业务代码">
						<el-row :gutter="23">
							<el-col :span="22">
								<el-input v-model="form.service" placeholder="请输入内容" clearable></el-input>
							</el-col>
							<el-col :span="1"></el-col>
						</el-row>
					</el-form-item>
					<el-form-item label="操作类型">
						<el-row :gutter="23">
							<el-col :span="22">
								<el-select v-model="form.type" placeholder="请选择">
									<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-col>
							<el-col :span="1"></el-col>
						</el-row>
					</el-form-item>
					<el-form-item label="发送消息体">
						<el-row :gutter="23">
							<el-col :span="22">
								<el-input v-model="form.dataBody" type="textarea" :autosize="{ minRows: 12, maxRows: 8}" placeholder="请输入内容"></el-input>
							</el-col>
							<el-col :span="1"></el-col>
						</el-row>
					</el-form-item>
					<el-form-item label="返回数据集">
						<el-row :gutter="23">
							<el-col :span="22">
								<el-input v-model="responseBody" type="textarea" :autosize="{ minRows: 12, maxRows: 8}" placeholder="请输入内容"></el-input>
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
				form: {},
				options: [{
					value: 'select',
					label: '查询'
				}, {
					value: 'update',
					label: '更新'
				}, {
					value: 'delete',
					label: '删除'
				}, {
					value: 'insert',
					label: '新增'
				}],
				responseBody: ''
			};
		},
		created() {},
		methods: {
			// 获取 easy-mock 的模拟数据
			runEdit() {

				let self = this;
				self.responseBody = "";
				let webRoot = window.ZHCJAppConfig.webURL;
				let url = webRoot + window.ZHCJAppConfig.API.layerinfo;
				self.form["loginName"] = localStorage.getItem('ms_username');
				let params = self.form;
				getHttpGet(url, (params)).then(res => {
					let tmpRes = res;
					self.responseBody = JSON.stringify(tmpRes);
					self.$message.success(`执行成功！`);
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
