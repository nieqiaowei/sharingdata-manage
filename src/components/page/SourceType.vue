<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-input v-model="query.name" placeholder="数据存储类型名称" class="handle-input mr10" clearable></el-input>
				<el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
				<el-button type="success" icon="el-icon-lx-roundadd" @click="handleEdit(-1,null)">添加类型</el-button>
			</div>
			<el-table :data="tableData" class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column type="expand">
					<template slot-scope="props">
						
						<table style="width: 100%">
							<tr>
								<td>查询表SQL</td>
							</tr>
							<tr>
								<td>{{ props.row.tablesSql }}</td>
							</tr>
							<tr>
								<td>查询表字段SQL</td>
							</tr>
							<tr>
								<td>{{ props.row.tableFieldSql}}</td>
							</tr>
							
						</table>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="名称"></el-table-column>
				<el-table-column prop="driver_class_name" label="驱动"></el-table-column>
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

		<el-dialog title="编辑" :visible.sync="addVisible" width="70%">
			<el-card class="box-card">
			<el-form ref="form" :model="form" label-width="120px">
				<el-input v-model="form.id" style="display: none;"></el-input>
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
				<el-form-item label="驱动">
					<el-row :gutter="23">
						<el-col :span="22">
							<el-input v-model="form.driver_class_name" placeholder="请输入内容"></el-input>
						</el-col>
						<el-col :span="1">
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="查询表SQL">
					<el-row :gutter="23">
						<el-col :span="22">
							<el-input v-model="form.tablesSql" placeholder="请输入内容"></el-input>
						</el-col>
						<el-col :span="1">
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="查询表字段SQL">
					<el-row :gutter="23">
						<el-col :span="22">
							<el-input v-model="form.tableFieldSql" placeholder="请输入内容"></el-input>
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
		sourcetypeinfos,
		savesourcetypeinfo,
		delsourcetypeinfoinfo
	} from '../../api/SourceType.js'
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
				tableData: [],
				form: {},
				addVisible: false

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
				let url = webRoot + window.ZHCJAppConfig.API.sourcetypeinfos;
				//请求服务
				let params = {};
				params = {
					name: self.$data.query.name,
					loginName: localStorage.getItem('ms_username'),
					pageIndex: self.$data.query.pageIndex,
					pageSize: self.$data.query.pageSize
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
			// 触发搜索按钮
			handleSearch() {
				//this.$set(this.query.login_name, 'pageIndex', 1);
				this.getData();
			},
			handleEdit(index, row) {
				if (index == -1) {
					//新增
					let add = {
						id: '',
						name: '',
						driver_class_name: '',
						tablesSql: '',
						tableFieldSql: ''
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
				
				let self = this;
				let webRoot = window.ZHCJAppConfig.webURL;
				let url = webRoot + window.ZHCJAppConfig.API.savesourcetypeinfo;
				//请求服务
				let params = self.form;
				params["loginName"] = localStorage.getItem('ms_username');
				
				
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
					let url = webRoot + window.ZHCJAppConfig.API.delsourcetypeinfoinfo;
					//请求服务
					let params = {};
					params = {
						id: id,
						loginName: localStorage.getItem('ms_username')
					}
					getHttpGet(url, (params)).then(res => {
						let tmpRes = res;
						if (tmpRes.code == 200) {
							self.getData();
							self.$message.success('删除成功');
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
