<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-input v-model="query.name" placeholder="数据存储名称" class="handle-input mr10" clearable></el-input>
				<el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
				<el-button type="success" icon="el-icon-lx-roundadd" @click="handleEdit(-1,null)">添加数据存储</el-button>
			</div>
			<el-table :data="tableData" class="table" ref="multipleTable" header-cell-class-name="table-header">
				
				<el-table-column prop="name" label="名称"></el-table-column>
				<el-table-column prop="username" label="用户名"></el-table-column>
				<el-table-column prop="password" label="密码"></el-table-column>
				<el-table-column prop="host" label="地址"></el-table-column>
				<el-table-column prop="port" label="端口"></el-table-column>
				<el-table-column prop="database" label="数据库"></el-table-column>
				<el-table-column prop="sourcetypeid" label="数据类型"></el-table-column>
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

		<el-dialog title="编辑" :visible.sync="addVisible" width="30%">
			<el-card class="box-card">
			<el-form ref="form" :model="form" label-width="120px">
				<el-input v-model="form.id" style="display: none;"></el-input>
				<el-form-item label="数据库类型">
					<el-row :gutter="23">
						<el-select v-model="form.sourcetypeid" placeholder="请选择" >
							<el-option v-for="item in sourcetypes" :key="item.name" :label="item.name" :value="item.id"></el-option>
						</el-select>
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
								<el-input v-model="form.name" placeholder="请输入内容" :disabled="true"></el-input>
							</template>
						</el-col>
						<el-col :span="1">
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="地址">
					<el-row :gutter="23">
						<el-col :span="22">
							<el-input v-model="form.host" placeholder="请输入内容"></el-input>
						</el-col>
						<el-col :span="1">
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="端口">
					<el-row :gutter="23">
						<el-col :span="22">
							<el-input v-model="form.port" placeholder="请输入内容"></el-input>
						</el-col>
						<el-col :span="1">
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="数据库">
					<el-row :gutter="23">
						<el-col :span="22">
							<el-input v-model="form.database" placeholder="请输入内容"></el-input>
						</el-col>
						<el-col :span="1">
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="用户名">
					<el-row :gutter="23">
						<el-col :span="22">
							<el-input v-model="form.username" placeholder="请输入内容"></el-input>
						</el-col>
						<el-col :span="1">
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="密码">
					<el-row :gutter="23">
						<el-col :span="22">
							<el-input v-model="form.password" placeholder="请输入内容"></el-input>
						</el-col>
						<el-col :span="1">
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="连接地址">
					<el-row :gutter="23">
						<el-col :span="22">
							<el-input v-model="form.remotejdbc_url" placeholder="请输入内容"></el-input>
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
					pageIndex: 1,
					pageSize: 10
				},
				pageTotal: 0,
				sourcetypes:[],
				tableData: [],
				form: {},
				addVisible: false

			};
		},
		created() {
			this.getData();
			this.getsourcetypeData();
		},
		methods: {
			// 获取 easy-mock 的模拟数据
			getData() {
				let self = this;
				let webRoot = window.ZHCJAppConfig.webURL;
				let url = webRoot + window.ZHCJAppConfig.API.datasourceinfos;
				//请求服务
				let params = {};
				params = {
					name: self.$data.query.name,
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
			getsourcetypeData() {
				//请求服务
				
				
				let self = this;
				let webRoot = window.ZHCJAppConfig.webURL;
				let url = webRoot + window.ZHCJAppConfig.API.sourcetypeinfos;
				//请求服务
				let params = {};
				params = {
					loginName: localStorage.getItem('ms_username')
				}
				
				getHttpGet(url, (params)).then(res => {
					let tmpRes = res;
					if (tmpRes.code == 200) {
						self.sourcetypes = tmpRes.data;
					} else if (tmpRes.code === 404) {
						self.sourcetypes = [];
					}
				}).catch(function(error) {
					self.$message.warning('亲，网络出现异常');
					console.log(error);
				});
			},
			// 触发搜索按钮
			handleSearch() {
				//this.$set(this.query.login_name, 'pageIndex', 1);
				this.$data.query.pageIndex = 1;
				this.getData();
			},
			handleEdit(index, row) {
				if (index == -1) {
					//新增
					let add = {
						id: '',
						name: '',
						username: '',
						password: '',
						host: '',
						port: '',
						database: '',
						sourcetypeid: '',
						createtime: '',
						remotejdbc_url: ''
						
					};
					this.form = add;
					this.addVisible = true;
				} else {
					this.form = row;
					this.addVisible = true;
				}
			},
			saveEdit() {
				this.editVisible = false;
				//修改数据请求
				
				let self = this;
				let webRoot = window.ZHCJAppConfig.webURL;
				let url = webRoot + window.ZHCJAppConfig.API.savedatasourceinfo;
				//请求服务
				let params = self.form;
				params["loginName"]  = localStorage.getItem('ms_username');
				
				getHttpGet(url, (params)).then(res => {
					let tmpRes = res;
					if (tmpRes.code == 200) {
						self.getData();
						self.$message.success(`保存成功`);
						self.addVisible = false;
					} else {
						self.$message.error('请求数据异常！' + tmpRes.code);
					}
				}).catch(function(error) {
					self.$message.warning('亲，网络出现异常');
					console.log(error);
				});
				self.$set(self.query, 'pageIndex', 1);
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
					let url = webRoot + window.ZHCJAppConfig.API.deldatasourceinfo;
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
				this.$data.query.pageIndex = val;
				this.getData();
			},
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
