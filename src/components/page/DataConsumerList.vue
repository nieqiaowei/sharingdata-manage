<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-input v-model="query.name" placeholder="数据消费名称" class="handle-input mr10" clearable></el-input>
				<el-input v-model="query.code" placeholder="数据消费代码" class="handle-input mr10" clearable></el-input>
				<el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
				<el-button type="success" icon="el-icon-lx-roundadd" @click="handleEdit(-1,null)">添加消费任务</el-button>
				<el-button type="warning" icon="el-icon-lx-roundadd" @click="handleviewEdit(-1,null)">发布视图数据</el-button>
			</div>
			<el-table :data="tableData" class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column type="expand">
					<template slot-scope="props">
						<table style="width: 100%">
							<tr>
								<td>接口地址</td>
							</tr>
							<tr>
								<td>{{ props.row.systemProPerties.sysaddress }}</td>
							</tr>
							<tr>
								<td>接口参数消息体</td>
							</tr>
							<tr>
								<td>{{ props.row.systemProPerties.data}}</td>
							</tr>
							<tr>
								<td>操作类型</td>
							</tr>
							<tr>
								<td>{{ props.row.systemProPerties.type }}</td>
							</tr>
							<tr>
								<td>查询参数</td>
							</tr>
							<tr>
								<td>{{ props.row.selectParameter }}</td>
							</tr>
						</table>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="名称"></el-table-column>
				<el-table-column prop="code" label="业务代码"></el-table-column>
				<el-table-column prop="datasourcename" label="数据源名称"></el-table-column>
				<el-table-column prop="createtime" label="修改时间"></el-table-column>
				<el-table-column label="操作" width="180" align="center">
					<template slot-scope="scope">
						<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex" :page-size="query.pageSize"
				 :total="pageTotal" @current-change="handlePageChange"></el-pagination>
			</div>
		</div>
		
		
		
		<el-dialog title="编辑数据表数据" :visible.sync="addVisible" width="70%">
			<el-card class="box-card">
			<el-form ref="form" :model="form" label-width="120px">
				<el-input v-model="form.id" style="display: none;"></el-input>
				<el-form-item label="数据源名称">
					<el-row :gutter="23">
						<el-col :span="22">
						<el-select v-model="form.datasourceid" placeholder="请选择" @change="changedatasource">
							<el-option v-for="item in datasources" :key="item.name" :label="item.name" :value="item.id"></el-option>
						</el-select>
						</el-col>
						<el-col :span="1">
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="名称">
					<el-row :gutter="23">
						<el-col :span="22">
							<template v-if="form.id == ''">
								<el-input v-model="form.name" placeholder="请输入内容" clearable></el-input>
							</template>
							<template v-else>
								<el-input v-model="form.name" placeholder="请输入内容" clearable></el-input>
							</template>
						</el-col>
						<el-col :span="1">
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="数据表">
					<el-row :gutter="23">
						<el-col :span="22">
							<el-select v-model="form.tableName" placeholder="请选择" @change="changedatacloumn">
								<el-option v-for="item in tables" :key="item.tableName" :label="item.tableName" :value="item.tableName"></el-option>
							</el-select>
						</el-col>
						<el-col :span="1">
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="业务代码">
					<el-row :gutter="23">
						<el-col :span="22">
							<el-input v-model="form.code" placeholder="请输入内容"></el-input>
						</el-col>
						<el-col :span="1">
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="生成SQL">
					<el-row :gutter="23">
						<el-col :span="22">
							 <el-button type="primary" @click="createSql" >生成</el-button>
						</el-col>
						<el-col :span="1">
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="统计SQL">
					<el-row :gutter="23">
						<el-col :span="22">
							<el-input
							  type="textarea"
							  placeholder="请输入内容"
							  v-model="form.countSql"
							  show-word-limit
							>
							</el-input>
						</el-col>
						<el-col :span="1">
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="查询SQL">
					<el-row :gutter="23">
						<el-col :span="22">
							<el-input
							  type="textarea"
							  placeholder="请输入内容"
							  v-model="form.selectSql"
							  show-word-limit
							>
							</el-input>
						</el-col>
						<el-col :span="1">
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="提取参数">
					<el-row :gutter="23">
						<el-col :span="22">
							 <el-button type="primary" @click="createparameter">提取</el-button>
						</el-col>
						<el-col :span="1">
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="查询参数">
					<el-row :gutter="23">
						<el-col :span="22">
							<el-input
							  type="textarea"
							  placeholder="请输入内容"
							  v-model="form.selectParameter"
							  show-word-limit
							>
							</el-input>
						</el-col>
						<el-col :span="1">
						</el-col>
					</el-row>
				</el-form-item>
			</el-form>
			</el-card>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveEdit">确 定</el-button>
			</span>
			<el-table :data="cloumns" class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="column_name" label="字段名称"></el-table-column>
				<el-table-column prop="data_type" label="字段类型"></el-table-column>
			</el-table>
		</el-dialog>
		
		<el-dialog title="编辑视图数据发布" :visible.sync="addViewVisible" width="70%">
			<el-card class="box-card">
			<el-form ref="formView" :model="formView" label-width="120px">
				<el-input v-model="formView.id" style="display: none;"></el-input>
				<el-form-item label="数据源名称">
					<el-row :gutter="23">
						<el-col :span="22">
						<el-select v-model="formView.datasourceid" placeholder="请选择">
							<el-option v-for="item in datasources" :key="item.name" :label="item.name" :value="item.id"></el-option>
						</el-select>
						</el-col>
						<el-col :span="1">
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="名称">
					<el-row :gutter="23">
						<el-col :span="22">
							<template v-if="formView.id == ''">
								<el-input v-model="formView.name" placeholder="请输入内容" clearable></el-input>
							</template>
							<template v-else>
								<el-input v-model="formView.name" placeholder="请输入内容" clearable></el-input>
							</template>
						</el-col>
						<el-col :span="1">
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="业务代码">
					<el-row :gutter="23">
						<el-col :span="22">
							<el-input v-model="formView.code" placeholder="请输入内容"></el-input>
						</el-col>
						<el-col :span="1">
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="查询SQL">
					<el-row :gutter="23">
						<el-col :span="22">
							<el-input
							  type="textarea"
							  placeholder="请输入内容"
							  v-model="formView.selectSql"
							  show-word-limit
							>
							</el-input>
						</el-col>
						<el-col :span="1">
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="提取参数">
					<el-row :gutter="23">
						<el-col :span="22">
							 <el-button type="primary" @click="createViewparameter">提取</el-button>
						</el-col>
						<el-col :span="1">
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="传输参数">
					<el-row :gutter="23">
						<el-col :span="22">
							<el-input
							  type="textarea"
							  placeholder="请输入内容"
							  v-model="formView.selectParameter"
							  show-word-limit
							>
							</el-input>
						</el-col>
						<el-col :span="1">
						</el-col>
					</el-row>
				</el-form-item>
			</el-form>
			</el-card>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addViewVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveViewEdit">确 定</el-button>
			</span>
		</el-dialog>

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
				query: {
					name: '',
					code: '',
					tableName: '',
					type: '1',
					pageIndex: 1,
					pageSize: 10
				},
				pageTotal: 0,
				datasources:[],
				tables: [],
				cloumns: [],
				tableData: [],
				form: {
					id:'',
					datasourceid:'',
					name:'',
					tableName:'',
					code:'',
					countSql:'',
					selectSql:'',
					countParameter: '',
					selectParameter: '',
					type: '1'
				},
				formView: {
					id:'',
					datasourceid:'',
					name:'',
					code:'',
					selectSql:'',
					selectParameter: '',
					type: '1'
				},
				addVisible: false,
				addViewVisible: false

			};
		},
		created() {
			this.getData();
			this.getdatasourceinfos();
		},
		methods: {
			// 获取 easy-mock 的模拟数据
			getData() {
				//请求服务
				
				let self = this;
				let webRoot = window.ZHCJAppConfig.webURL;
				let url = webRoot + window.ZHCJAppConfig.API.dataproducerinfos;
				//请求服务
				let params = {};
				params = {
					name: self.$data.query.name,
					code: self.$data.query.code,
					tableName: self.$data.query.tableName,
					type: self.$data.query.type,
					pageIndex: self.$data.query.pageIndex,
					pageSize: self.$data.query.pageSize,
					loginName: localStorage.getItem('ms_username')
				}
				
				getHttpGet(url, (params)).then(res => {
					let tmpRes = res;
					if (tmpRes.code == 200) {
						self.tableData = tmpRes.data;
						self.pageTotal = tmpRes.total || 10;
					} else if (tmpRes.code === 404) {
						self.tableData = [];
						self.pageTotal = tmpRes.total || 10;
					}
				}).catch(function(error) {
					self.$message.warning('亲，网络出现异常');
					console.log(error);
				});
			},
			getdatasourceinfos() {
				//请求服务
				let self = this;
				let webRoot = window.ZHCJAppConfig.webURL;
				let url = webRoot + window.ZHCJAppConfig.API.datasourceinfos;
				//请求服务
				let params = {};
				params = {
					loginName: localStorage.getItem('ms_username')
				}
				getHttpGet(url, (params)).then(res => {
					let tmpRes = res;
					if (tmpRes.code == 200) {
						self.datasources = tmpRes.data;
					} else if (tmpRes.code === 404) {
						self.datasources = [];
					}
				}).catch(function(error) {
					self.$message.warning('亲，网络出现异常');
					console.log(error);
				});
			},
			changedatasource() {
				let self = this;
				let webRoot = window.ZHCJAppConfig.webURL;
				let url = webRoot + window.ZHCJAppConfig.API.datasourcetablesinfo;
				//请求服务
				let params = {};
				params = {
					id: self.form.datasourceid,
					loginName: localStorage.getItem('ms_username')
				}
				getHttpGet(url, (params)).then(res => {
					let tmpRes = res;
					if (tmpRes.code == 200) {
						self.tables = tmpRes.data;
					} else if (tmpRes.code === 404) {
						self.tables = [];
					}
				}).catch(function(error) {
					self.$message.warning('亲，网络出现异常');
					console.log(error);
				});
			},
			changedatacloumn() {
				let self = this;
				let webRoot = window.ZHCJAppConfig.webURL;
				let url = webRoot + window.ZHCJAppConfig.API.datasourcecloumninfo;
				//请求服务
				self.form.code = self.form.tableName;
				let params = {};
				params = {
					id: self.form.datasourceid,
					tableName: self.form.tableName,
					loginName: localStorage.getItem('ms_username')
				}
				getHttpGet(url, (params)).then(res => {
					let tmpRes = res;
					if (tmpRes.code == 200) {
						self.cloumns = tmpRes.data;
					} else if (tmpRes.code === 404) {
						self.cloumns = [];
					}
				}).catch(function(error) {
					self.$message.warning('亲，网络出现异常');
					console.log(error);
				});
			},
			// 触发搜索按钮
			handleSearch() {
				//this.$set(this.query.login_name, 'pageIndex', 1);
				this.getData();
			},
			handleEdit(index, row) {
				//传递参数
				if (index == -1) {
					//新增
					let add = {
					id:'',
					datasourceid:'',
					name:'',
					tableName:'',
					code:'',
					countSql:'',
					selectSql:'',
					countParameter: '',
					selectParameter: '',
					type: this.$data.query.type
				};
					this.form = add;
					this.addVisible = true;
					this.addViewVisible = false;
				} else {
					this.form = row;
					if(this.form.tableName == ''){
						this.handleviewEdit(index, row);
					}else{
						this.changedatasource();
						this.changedatacloumn();
						this.addVisible = true;
						this.addViewVisible = false;
					}
				}
			},
			handleviewEdit(index, row){
				//发布视图数据
				if (index == -1) {
					let add = {
						id:'',
						datasourceid:'',
						name:'',
						code:'',
						selectSql:'',
						selectParameter: '',
						type: this.$data.query.type
					};
					this.formView = add;
					this.addVisible = false;
					this.addViewVisible = true;
				}else{
					this.formView = row;
					this.changedatasource();
					this.addVisible = false;
					this.addViewVisible = true;
				}
			},
			saveEdit() {
				//修改数据请求
				let self = this;
				let webRoot = window.ZHCJAppConfig.webURL;
				let url = webRoot + window.ZHCJAppConfig.API.saveproducerinfo;
				//请求服务
				let params = self.form;
				params["loginName"]  = localStorage.getItem('ms_username');
				getHttpGet(url, (params)).then(res => {
					let tmpRes = res;
					if (tmpRes.code == 200) {
						self.getData();
						self.$message.success(`保存成功`);
						self.addVisible = false;
						self.$set(self.query, 'pageIndex', 1);
					} else {
						self.$message.error('请求数据异常！' + tmpRes.code);
					}
				}).catch(function(error) {
					self.$message.warning('亲，网络出现异常');
					console.log(error);
				});
			},
			saveViewEdit(){
				let self = this;
				let webRoot = window.ZHCJAppConfig.webURL;
				let url = webRoot + window.ZHCJAppConfig.API.saveproducerinfo;
				//请求服务
				let params = self.formView;
				params["loginName"]  = localStorage.getItem('ms_username');
				getHttpGet(url, (params)).then(res => {
					let tmpRes = res;
					if (tmpRes.code == 200) {
						self.getData();
						self.$message.success(`保存成功`);
						self.addViewVisible = false;
						self.$set(self.query, 'pageIndex', 1);
					} else {
						self.$message.error('请求数据异常！' + tmpRes.code);
					}
				}).catch(function(error) {
					self.$message.warning('亲，网络出现异常');
					console.log(error);
				});
			},
			handleDelete(index, row) {
				// 二次确认删除
				this.$confirm('确定要删除吗？', '提示', {
						type: 'warning'
					})
					.then(() => {
						this.deleteInfo(row.id);

					})
					.catch(() => {});
			},
			deleteInfo(id) {
				if (id != null) {
					let self = this;
					let webRoot = window.ZHCJAppConfig.webURL;
					let url = webRoot + window.ZHCJAppConfig.API.delproducerinfo;
					//请求服务
					let params = {
						id: id
					};
					params["loginName"]  = localStorage.getItem('ms_username');
					getHttpGet(url, (params)).then(res => {
						let tmpRes = res;
						if (tmpRes.code == 200) {
							self.getData();
							self.$message.success(`删除成功`);
							self.addVisible = false;
							self.$set(self.query, 'pageIndex', 1);
						} else {
							self.$message.error('请求数据异常！' + tmpRes.code);
						}
					}).catch(function(error) {
						self.$message.warning('亲，网络出现异常');
						console.log(error);
					});
				} else {
					this.$message.error('未获取到用户id信息');
				}
			},
			// 分页导航
			handlePageChange(val) {
				this.$set(this.query, 'pageIndex', val);
				this.getData();
			},
			createSql(){
				//修改数据请求
				let self = this;
				let webRoot = window.ZHCJAppConfig.webURL;
				let url = webRoot + window.ZHCJAppConfig.API.datasourcesqlinfo;
				//请求服务
				let params = {
					id: self.form.datasourceid,
					tableName: self.form.tableName,
				};
				params["loginName"]  = localStorage.getItem('ms_username');
				getHttpGet(url, (params)).then(res => {
					let tmpRes = res;
					if (tmpRes.code == 200) {
						self.form.countSql = tmpRes.data.countSql;
						self.form.selectSql = tmpRes.data.selectSql;
						self.form.insertSql = tmpRes.data.insertSql;
						self.form.updateSql = tmpRes.data.updateSql;
						self.form.deleteSql = tmpRes.data.deleteSql;
					} else {
						self.$message.error('请求数据异常！' + tmpRes.code);
					}
				}).catch(function(error) {
					self.$message.warning('亲，网络出现异常');
					console.log(error);
				});
			},
			createparameter(){
				//修改数据请求
				
				let self = this;
				let webRoot = window.ZHCJAppConfig.webURL;
				let url = webRoot + window.ZHCJAppConfig.API.datasourceparameterinfo;
				//请求服务
				let params = {
					countSql: self.form.countSql,
					selectSql: self.form.selectSql
				};
				params["loginName"]  = localStorage.getItem('ms_username');
				getHttpGet(url, (params)).then(res => {
					let tmpRes = res;
					if (tmpRes.code == 200) {
						self.form.countParameter = tmpRes.data.countParameter;
						self.form.selectParameter = tmpRes.data.selectParameter;
					} else {
						self.$message.error('请求数据异常！' + tmpRes.code);
					}
				}).catch(function(error) {
					self.$message.warning('亲，网络出现异常');
					console.log(error);
				});
			},
			createViewparameter(){
				//提取参数，适用于查询单表
				let self = this;
				let webRoot = window.ZHCJAppConfig.webURL;
				let url = webRoot + window.ZHCJAppConfig.API.datasourceparameterinfo;
				//请求服务
				let params = {
					selectSql: self.formView.selectSql
				};
				params["loginName"]  = localStorage.getItem('ms_username');
				getHttpGet(url, (params)).then(res => {
					let tmpRes = res;
					if (tmpRes.code == 200) {
						self.formView.selectParameter = tmpRes.data.selectParameter;
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
