<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-select v-model="query.type" placeholder="用户类型" class="handle-select mr10">
					<el-option key="" label="无" value=""></el-option>
					<el-option key="1" label="管理员" value="1"></el-option>
					<el-option key="2" label="生产者" value="2"></el-option>
					<el-option key="3" label="消费者" value="3"></el-option>
				</el-select>
				<el-input v-model="query.username" placeholder="用户账号" class="handle-input mr10" clearable></el-input>
				<el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
				<el-button type="success" icon="el-icon-lx-roundadd" @click="handleEdit(-1,null)">添加消费业务</el-button>
			</div>
			<el-table :data="tableData" class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column type="expand">
					<template slot-scope="props">
						<el-form label-position="left" inline class="demo-table-expand">
							<el-form-item label="私钥:">
								<el-input v-model="props.row.private_key">
								</el-input>
							</el-form-item>
							<el-form-item label="公钥:">
								<el-input v-model="props.row.public_key">
								</el-input>
							</el-form-item>
							<el-form-item label="用户密码:">
								<span>{{ props.row.password }}</span>
							</el-form-item>
						</el-form>
					</template>
				</el-table-column>
				<el-table-column prop="username" label="用户账号"></el-table-column>
				<el-table-column prop="name" label="用户姓名"></el-table-column>
				<el-table-column prop="typeName" label="用户类型"></el-table-column>
				<el-table-column prop="createTime" label="创建时间"></el-table-column>
				<el-table-column prop="updateTime" label="更新时间"></el-table-column>
				<el-table-column prop="createName" label="操作员"></el-table-column>
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


		<!-- 新增弹出框   生产者 -->
		<el-dialog title="编辑" :visible.sync="addVisible" width="70%">
			<el-form ref="form" :model="form" label-width="100px">
				<el-input v-model="form.userid" style="display: none;"></el-input>
				<el-form-item label="用户账号">
					<el-row :gutter="23">
						<el-col :span="22">
							<template v-if="form.userid == ''">
							   <el-input v-model="form.username" placeholder="请输入内容"  clearable @blur="verificationfield"></el-input>
							</template>
							<template v-else>
							   <el-input v-model="form.username" placeholder="请输入内容" :disabled="true"></el-input>
							</template>
						</el-col>
						<el-col :span="1">
							<i :class="usernameClass"  :style="usernameColor"></i></el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="用户密码">
					<el-row :gutter="23">
						<el-col :span="22">
							<el-input v-model="form.password" placeholder="请输入内容" clearable ></el-input>
						</el-col>
						<el-col :span="1"></el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="用户姓名">
					<el-row :gutter="23">
						<el-col :span="22">
							<el-input v-model="form.name" placeholder="请输入内容" clearable ></el-input>
						</el-col>
						<el-col :span="1"></el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="用户类型">
					<el-row :gutter="23">
						<el-col :span="22">
							<template v-if="form.userid == ''">
							  <el-select v-model="form.type" placeholder="用户类型" class="handle-select mr10" @change="getUserType">
							  	<el-option key="1" label="管理员" value="1"></el-option>
							  	<el-option key="2" label="生产者" value="2"></el-option>
							  	<el-option key="3" label="消费者" value="3"></el-option>
							  </el-select>
							</template>
							<template v-else>
								<el-select v-model="form.type" placeholder="用户类型" class="handle-select mr10" @change="getUserType" :disabled="true">
									<el-option key="1" label="管理员" value="1"></el-option>
									<el-option key="2" label="生产者" value="2"></el-option>
									<el-option key="3" label="消费者" value="3"></el-option>
								</el-select>
							</template>
						</el-col>
						<el-col :span="1"></el-col>
					</el-row>
				</el-form-item>
				<!-- 根据类型出不同的表单 -->
				<!-- 消费者表单 -->
				<div id="Consumeruser" :style="ConsumeruserStyle">
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<span>消费的业务</span>
							<el-button icon="el-icon-lx-roundadd" @click="handleConsumerEdit(-1,null)" style="float: right; padding: 3px 0"
							 type="text">添加</el-button>
						</div>
						<el-table :data="Consumerusers" border class="table" ref="multipleTable" header-cell-class-name="table-header">
							<el-table-column prop="business_code" label="业务代码"></el-table-column>
							<el-table-column prop="fields" label="业务字段"></el-table-column>
							<el-table-column prop="push" label="是否推送"></el-table-column>
							<el-table-column prop="pushadress" label="推送的地址"></el-table-column>
							<el-table-column prop="pushtopic" label="推送频道"></el-table-column>
							<el-table-column prop="pushtag" label="推送tag"></el-table-column>
							<el-table-column prop="oldaddress" label="获取数据地址"></el-table-column>
							<el-table-column prop="overdueteime" label="到期时间"></el-table-column>
							<el-table-column prop="primary_key" label="主键"></el-table-column>
							<el-table-column label="操作" width="180" align="center">
								<template slot-scope="scope">
									<el-button type="text" icon="el-icon-edit" @click="handleConsumerEdit(scope.$index, scope.row)">编辑</el-button>
									<el-button type="text" icon="el-icon-delete" class="red" @click="handleConsumerDataDelete(scope.$index, scope.row)">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-card>
				</div>
				<!-- 生产者表单 -->
				<div id="Produceruser" :style="ProduceruserStyle">
					<el-card class="box-card">
						<el-form-item label="业务代码" label-width="110px">
							<el-row :gutter="23">
								<el-col :span="22">
									<template v-if="form.userid == ''">
									  <el-input v-model="producer.business_code" placeholder="请输入内容" clearable @blur="verificationfield"></el-input>
									</template>
									<template v-else>
									   <el-input v-model="producer.business_code" placeholder="请输入内容" :disabled="true"></el-input>
									</template>
								</el-col>
								<el-col :span="1">
									<i :class="business_codeClass"  :style="business_codeColor"></i></el-col>
							</el-row>
						</el-form-item>
						<el-form-item label="业务名称" label-width="110px">
							<el-row :gutter="23">
								<el-col :span="22">
									<el-input v-model="producer.business_name" placeholder="请输入内容" clearable></el-input>
								</el-col>
								<el-col :span="1"></el-col>
							</el-row>
						</el-form-item>
						<el-form-item label="数据表名称" label-width="110px">
							<el-row :gutter="23">
								<el-col :span="22">
									<template v-if="form.userid == ''">
									  <el-input v-model="producer.tableName" placeholder="请输入内容" clearable @blur="verificationfield"></el-input>
									</template>
									<template v-else>
									   <el-input v-model="producer.tableName" placeholder="请输入内容" :disabled="true"></el-input>
									</template>
								</el-col>
								<el-col :span="1"><i :class="tableNameClass"  :style="tableNameColor"></i></el-col>
							</el-row>
						</el-form-item>
						<el-form-item label="数据接收地址" label-width="110px">
							<el-row :gutter="23">
								<el-col :span="22">
									<el-input v-model="producer.address" :disabled="true"></el-input>
								</el-col>
								<el-col :span="1"></el-col>
							</el-row>
						</el-form-item>
						<el-form-item label="数据接收的格式" label-width="110px">
							<el-row :gutter="23">
								<el-col :span="22">
									<el-input v-model="producer.dataformat" :disabled="true"></el-input>
								</el-col>
								<el-col :span="1"></el-col>
							</el-row>
							
						</el-form-item>
						<!-- 表结构 -->
						<el-card class="box-card">
							<div slot="header" class="clearfix">
								<span>设计表</span>
								<template v-if="form.userid == ''">
								  <el-button icon="el-icon-lx-roundadd" @click="handlefieldEdit(-1,null)" style="float: right; padding: 3px 0"
								   type="text">添加字段</el-button>
								</template>
								<template v-else>
								</template>
								
							</div>
							<el-table :data="tableoffields" border class="table" ref="multipleTable" header-cell-class-name="table-header">
								<el-table-column prop="fieldNamekey" label="字段名称"></el-table-column>
								<el-table-column prop="fieldTypekey" label="字段类型"></el-table-column>
								<el-table-column prop="fieldLengthkey" label="字段长度"></el-table-column>
								<el-table-column prop="decimalkey" label="字段小数点数"></el-table-column>
								<el-table-column prop="nonullkey" label="是否为空" :formatter="formatBoolean" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column prop="commentkey" label="数据描述"></el-table-column>
								<el-table-column prop="primary_key" label="主键" :formatter="formatBoolean" :show-overflow-tooltip="true"></el-table-column>
								<template v-if="form.userid == ''">
								  <el-table-column label="操作" width="180" align="center">
								  	<template slot-scope="scope">
								  		<el-button type="text" icon="el-icon-edit" @click="handlefieldEdit(scope.$index, scope.row)">编辑</el-button>
								  		<el-button type="text" icon="el-icon-delete" class="red" @click="handlefieldDelete(scope.$index, scope.row)">删除</el-button>
								  	</template>
								  </el-table-column>
								</template>
								<template v-else>
								</template>
							</el-table>
						</el-card>
					</el-card>
				</div>
				</el-row>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveadd">确 定</el-button>
			</span>
		</el-dialog>


		<!-- 添加设计表字段 -->
		<el-dialog title="编辑字段" :visible.sync="editfieldVisible" width="30%">
			<el-form ref="Tableoffield" :model="Tableoffield">
				<el-form-item label="字段名称" label-width="110px">
					<el-row :gutter="20">
						<el-col :span="21">
							<el-input v-model="Tableoffield.fieldNamekey" placeholder="请输入内容" clearable @blur="verificationfield"></el-input>
						</el-col>
						<el-col :span="2">
							<i :class="fieldNamekeyClass"  :style="fieldNamekeyColor"></i></el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="字段类型" label-width="110px">
					<el-row :gutter="20">
						<el-col :span="21">
							<el-select v-model="Tableoffield.fieldTypekey" placeholder="字段类型" @change="verificationfield" class="handle-select mr10">
								<el-option key="varchar" label="varchar" value="varchar"></el-option>
								<el-option key="longtext" label="longtext" value="longtext"></el-option>
								<el-option key="double" label="double" value="double"></el-option>
								<el-option key="int" label="int" value="int"></el-option>
								<el-option key="float" label="float" value="float"></el-option>
								<el-option key="datetime" label="datetime" value="datetime"></el-option>
								<el-option key="date" label="date" value="date"></el-option>
							</el-select>
						</el-col>
						<el-col :span="2"></el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="字段长度" label-width="110px">
					<el-row :gutter="20">
						<el-col :span="21">
							<el-input v-model="Tableoffield.fieldLengthkey" placeholder="请输入内容" clearable></el-input>
						</el-col>
						<el-col :span="2"></el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="字段小数点数" label-width="110px">
					<el-row :gutter="20">
						<el-col :span="21">
							<el-input v-model="Tableoffield.decimalkey" placeholder="请输入内容" clearable></el-input>
						</el-col>
						<el-col :span="2"></el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="数据描述" label-width="110px">
					<el-row :gutter="20">
						<el-col :span="21">
							<el-input v-model="Tableoffield.commentkey" placeholder="请输入内容" clearable></el-input>
						</el-col>
						<el-col :span="2"></el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="是否为空" label-width="110px">
					<el-row :gutter="20">
						<el-col :span="21">
							<el-switch v-model="Tableoffield.nonullkey" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
						</el-col>
						<el-col :span="2"></el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="主键" label-width="110px">
					<el-row :gutter="20">
						<el-col :span="21">
							<el-switch v-model="Tableoffield.primary_key" @change="verificationfield" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
						</el-col>
						<el-col :span="2"></el-col>
					</el-row>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editfieldVisible = false">取 消</el-button>
				<el-button type="primary" @click="savefieldEdit">确 定</el-button>
			</span>
		</el-dialog>


		<!-- 新增弹出框   消费者-->
		<el-dialog title="编辑" :visible.sync="editConsumerVisible" width="60%">
			 <el-form ref="consumer" :model="consumer" >
			 	<el-input v-model="consumer.id" style="display: none;"></el-input>
			 	<el-form-item label="业务代码" label-width="110px">
			 		<el-select v-model="consumer.business_code" placeholder="业务代码" @change="businesscheck" class="handle-select mr10">
			 			<el-option v-for="item in business" :key="item.business_code" :label="item.business_name" :value="item.business_code">
			 			</el-option>
			 		</el-select>
			 	</el-form-item>
			 	<el-form-item label="业务字段" label-width="110px">
			 		<template>
			 		  <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
			 		  <div style="margin: 15px 0;"></div>
			 		  <el-checkbox-group v-model="consumer.fields" @change="handleCheckedCitiesChange">
			 		    <el-checkbox v-for="item in businessfields" :label="item" :key="item.fieldNamekey" >{{item.commentkey}}</el-checkbox>
			 		  </el-checkbox-group>
			 		</template>
			 		<!-- <el-input v-model="consumer.fields"></el-input> -->
			 	</el-form-item>
				<el-form-item label="查询条件" label-width="110px">
					<el-row :gutter="20">
						<el-col :span="21">
							<el-select v-model="sqlckey" placeholder="字段名称"  class="handle-select mr10">
								<el-option v-for="item in businessfields" :key="item.fieldNamekey" :label="item.commentkey" :value="item.fieldNamekey">
								</el-option>
							</el-select>
							<el-select v-model="sqltype" placeholder="判定条件" class="handle-select mr10">
								<el-option key="=" label="=" value="="></el-option>
								<el-option key="!=" label="!=" value="!="></el-option>
								<el-option key="like" label="like" value="like"></el-option>
							</el-select>
							<el-input  v-model="sqlcvalue" placeholder="内容" style="width: 10vw" clearable></el-input>
							<el-select v-model="sqlmerge" placeholder="合并条件" class="handle-select mr10">
								<el-option key="and" label="and" value="and"></el-option>
								<el-option key="or" label="or" value="or"></el-option>
								<el-option key="" label="" value=""></el-option>
							</el-select>
							 <el-button type="success" @click="setsql(true)">添加</el-button>
							 <el-button type="danger" @click="setsql(false)" >清空</el-button>
						</el-col>
						<el-col :span="2"></el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="开启自定义查询" label-width="110px">
					<el-row :gutter="20">
						<el-col :span="21">
							<el-switch v-model="consumer.customize" @change="verificationfield" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
						</el-col>
						<el-col :span="2"></el-col>
					</el-row>
				</el-form-item>
			 	<el-form-item label="SQL" label-width="110px">
			 		<el-row :gutter="20">
			 			<el-col :span="21">
							<template v-if="consumer.customize == true ">
								<el-input
								  type="textarea"
								  :autosize="{ minRows: 6, maxRows: 4}"
								  placeholder="请输入内容"
								  v-model="consumer.sql">
								</el-input>
							</template>
							<template v-else>
								<el-input
								  type="textarea"
								  :autosize="{ minRows: 6, maxRows: 4}"
								  placeholder="请输入内容"
								  v-model="consumer.sql"
								  :disabled="true">
								</el-input>
							</template>
			 			</el-col>
			 			<el-col :span="2"></el-col>
			 		</el-row>
			 	</el-form-item>
				<el-form-item label="SQL备注" label-width="110px">
					<el-row :gutter="20">
						<el-col :span="21">
							<el-tag type="warning">动态传参的输入格式${xxxx} 例如：${roadId}</el-tag>
						</el-col>
						<el-col :span="2"></el-col>
					</el-row>
				</el-form-item>
			 	<el-form-item label="是否推送" label-width="110px">
			 		<el-row :gutter="20">
			 			<el-col :span="21">
			 				<el-switch v-model="consumer.push" @change="verificationfield" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
			 			</el-col>
			 			<el-col :span="2"></el-col>
			 		</el-row>
			 	</el-form-item>
			 	<template v-if="consumer.push == true ">
			 	  <el-form-item label="推送地址" label-width="110px">
			 	  	<el-input v-model="consumer.pushadress" placeholder="请输入内容" clearable></el-input>
			 	  </el-form-item>
			 	  <el-form-item label="推送频道" label-width="110px">
			 	  	<el-input v-model="consumer.pushtopic" placeholder="请输入内容" clearable></el-input>
			 	  </el-form-item>
			 	  <el-form-item label="推送tag" label-width="110px">
			 	  	<el-input v-model="consumer.pushtag" placeholder="请输入内容" clearable></el-input>
			 	  </el-form-item>
			 	</template>
			 	<template v-else>
			 	</template>
			 	<el-form-item label="数据获取地址" label-width="110px">
			 		<el-input v-model="consumer.oldaddress" placeholder="请输入内容" clearable :disabled="true"></el-input>
			 	</el-form-item>
			 	<el-form-item label="到期时间" label-width="110px">
			 		 <el-date-picker
			 		      v-model="consumer.overdueteime"
			 		      type="datetime"
			 		      placeholder="选择日期时间"
			 			  clearable>
			 		    </el-date-picker>
			 	</el-form-item>
			 	
			 </el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editConsumerVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveConsumerEdit">确 定</el-button>
			</span>
		</el-dialog>
		
	</div>
</template>

<script>
	import {
		UserAll,
		SaveUserInfo,
		DeleteUserInfo
	} from '../../api/UserInfoapi.js'
	import {GetProducerInfos} from '../../api/produce.js'
	export default {
		name: 'basetable',
		data() {
			return {
				query: {
					username: '',
					type: '',
					pageIndex: 1,
					pageSize: 10
				},
				tableData: [],
				multipleSelection: [],
				delList: [],
				editVisible: false,
				addVisible: false,
				pageTotal: 0,
				form: {},
				producer:{},
				consumer:{},
				idx: -1,
				id: -1,
				ProduceruserStyle: 'display:none',
				ConsumeruserStyle: 'display:none',
				editfieldVisible: false,
				tableoffields: [],
				Consumerusers: [],
				Tableoffield: {},
				fieldEditOK: true,
				//字段名称校验的样式
				fieldNamekeyClass: 'el-icon-circle-close',
				//字段名称校验的颜色
				fieldNamekeyColor: 'color:#F56C6C',
				//业务代码校验的样式
				business_codeClass: 'el-icon-circle-close',
				//业务代码校验的颜色
				business_codeColor: 'color:#F56C6C',
				//表名称校验的样式
				tableNameClass: 'el-icon-circle-close',
				//表名称校验的颜色
				tableNameColor: 'color:#F56C6C',
				//用户名校验的样式
				usernameClass: 'el-icon-circle-close',
				//用户名校验的颜色
				usernameColor: 'color:#F56C6C',
				
				
				//以下是消费者
				editConsumerVisible: false,
				business:[],
				businessfields:[],
				checkAll: false,
				isIndeterminate: true,
				editConsumerparamVisible:false,
				sqlmerge:'',
				sqlckey:'',
				sqltype:'',
				sqlcvalue:''

			};
		},
		created() {
			this.getData(this.$data.query.username, this.$data.query.type, 1);
		},
		methods: {
			// 获取 easy-mock 的模拟数据
			getData(username, type, pageIndex) {
				//请求服务
				let params = {};
				params = {
					username: username,
					type: type,
					loginName: localStorage.getItem('ms_username'),
					token: localStorage.getItem('token')
				}
				params["page"] = pageIndex;
				let List = [];
				UserAll(params).then((response) => {
					if (response.data.code === 200) {
						let data = response.data.data;
						data.map(function(item, index) {
							let typeName = "";
							let type = item.type;
							if (type == "1") {
								typeName = "管理员";
							} else if (type == "2") {
								typeName = "生产者";
							} else {
								typeName = "消费者";
							}
							//item.type = typeName;
							item["typeName"] = typeName;
							List.push(item);
						});
						this.tableData = List;
						this.pageTotal = response.data.total || 10;
					} else if (response.data.code === 404) {
						this.tableData = [];
						this.pageTotal = response.data.total || 10;
					} else if (response.data.code === 209) {
						this.$message.error('登录失效，请重新登录！');
						//请求编辑页面
						this.$router.push('/login');
					}
				});
			},
			// 触发搜索按钮
			handleSearch() {
				//this.$set(this.query.login_name, 'pageIndex', 1);
				this.getData(this.$data.query.username, this.$data.query.type, 1);
			},
			// 删除操作
			handleDelete(index, row) {
				// 二次确认删除
				this.$confirm('确定要删除吗？', '提示', {
						type: 'warning'
					})
					.then(() => {
						this.deleteUserInfo(row.userid);
						this.$set(this.query, 'pageIndex', 1);
					})
					.catch(() => {});
			},
			deleteUserInfo(id) {
				if (id != null) {
					let params = {};
					params = {
						userid: id,
						loginName: localStorage.getItem('ms_username'),
						token: localStorage.getItem('token')
					}
					DeleteUserInfo(params).then((response) => {
						if (response.data.code === 200) {
							this.getData(this.$data.query.username, this.$data.query.type, 1);
							this.$message.success('删除成功');
						} else {
							this.$message.error('请求数据异常！');
						}
					});
				} else {
					this.$message.error('未获取到用户id信息');
				}
			},
			// 编辑操作
			handleEdit(index, row) {
				if(index == -1){
					//新增
					let add = {
						userid:'',
						username: '',
						password: '',
						name:'',
						type: ''
					};
					this.ProduceruserStyle = 'display:none';
					this.ConsumeruserStyle = 'display:none';
					this.usernameClass = "el-icon-circle-close";
					this.usernameColor = "color:#F56C6C";
					this.business_codeClass = "el-icon-circle-close";
					this.business_codeColor = "color:#F56C6C";
					this.tableNameClass = "el-icon-circle-close";
					this.tableNameColor = "color:#F56C6C";
					this.fieldNamekeyClass = "el-icon-circle-close";
					this.fieldNamekeyColor = "color:#F56C6C";
					this.tableoffields = [],
					this.producer = {},
					this.form = add;
					this.addVisible = true;
				}else{
					//修改
					this.usernameClass = "el-icon-circle-check";
					this.usernameColor = "color:#67C23A";
					this.business_codeClass = "el-icon-circle-check";
					this.business_codeColor = "color:#67C23A";
					this.tableNameClass = "el-icon-circle-check";
					this.tableNameColor = "color:#67C23A";
					this.idx = index;
					this.form = row;
					if(this.form.type == 1){
						this.ProduceruserStyle = 'display:none';
						this.ConsumeruserStyle = 'display:none';
					}else if(this.form.type == 2){
						this.ProduceruserStyle = 'display:block';
						this.ConsumeruserStyle = 'display:none';
						//请求数据
						let params = {};
						params = {
							userid: this.form.userid,
							loginName: localStorage.getItem('ms_username'),
							token: localStorage.getItem('token')
						}
						GetProducerInfos(params).then((response) => {
							if (response.data.code === 200) {
								let data = response.data.data[0];
								this.producer = data;
								this.tableoffields = data.tableoffields;
								console.info(data);
								this.pageTotal = response.data.total || 10;
							} else if (response.data.code === 404) {
								this.tableData = [];
								this.pageTotal = response.data.total || 10;
							} else if (response.data.code === 209) {
								this.$message.error('登录失效，请重新登录！');
								//请求编辑页面
								this.$router.push('/login');
							}
						});
					}else if(this.form.type == 3){
						this.ProduceruserStyle = 'display:none';
						this.ConsumeruserStyle = 'display:block';
						//请求数据
					}
					this.addVisible = true;
				}
			},
			// 保存新增
			saveadd() {
				//添加数据请求
				this.producer["tableoffields"] = this.tableoffields;
				this.form["produceruser"] = this.producer;
				this.form["loginName"] = localStorage.getItem('ms_username');
				this.form["token"] = localStorage.getItem('token');
				let ok = this.verificationfield();
				if(ok){
					SaveUserInfo(this.form).then((response) => {
						if (response.data.code === 200) {
							this.getData(this.$data.query.username, this.$data.query.type, 1);
							this.$set(this.query, 'pageIndex', 1);
							this.addVisible = false;
							this.$message.success(`保存成功`);
						} else {
							this.$message.error('请求数据异常！');
							this.addVisible = true;
						}
					});
				}else{
					this.$message.error('请检查表单！');
					this.addVisible = true;
				}
			},
			getUserType() {
				if (this.form.type == 1) {
					this.ProduceruserStyle = "display:none";
					this.ConsumeruserStyle = "display:none";
				} else if (this.form.type == 2) {
					this.ProduceruserStyle = "display:block";
					this.ConsumeruserStyle = "display:none";
				} else if (this.form.type == 3) {
					this.ProduceruserStyle = "display:none";
					this.ConsumeruserStyle = "display:block";
				}
			},
			/** 添加字段 **/
			handlefieldEdit(index, row) {
				if (index == -1) {
					this.Tableoffield = {
						tableNamekey: '',
						fieldNamekey: '',
						fieldTypekey: 'varchar',
						fieldLengthkey: '255',
						decimalkey: '0',
						nonullkey: true,
						commentkey: '',
						primary_key: false
					};
					this.fieldNamekeyClass = "el-icon-circle-close";
					this.fieldNamekeyColor = "color:#F56C6C";
					this.fieldEditOK = false;
				} else {
					this.Tableoffield = row;
					this.fieldEditOK = true;
				}
				this.editfieldVisible = true;
			},
			/** 删除字段 **/
			handlefieldDelete(index, row) {
				this.editfieldVisible = false;
				let newfields = [];
				if (row.tableNamekey == '' || row.tableNamekey == undefined) {
					//新创建的数据删除
					for (var i = 0; i < this.tableoffields.length; i++) {
						if (this.tableoffields[i] != row) {
							newfields.push(this.tableoffields[i]);
						}
					}
				} else {
					//删除现有的数据
					for (var i = 0; i < this.tableoffields.length; i++) {
						if (this.tableoffields[i].id == row.id) {
							//this.delanalysisDataParams.push(this.analysisDataParams[i]);
						} else {
							newfields.push(this.tableoffields[i]);
						}
					}
				}
				this.tableoffields = newfields;
			},
			savefieldEdit() {
				let  ok =  this.verificationfield();
				if(ok){
					if (this.fieldEditOK) {
						this.Tableoffield = {};
					} else {
						this.tableoffields.push(this.Tableoffield);
						this.Tableoffield = {};
					}
					this.editfieldVisible = false;
				}else{
					this.$message.error('请检查表单！');
				}
				
			},
			verificationfield() {
				debugger;
				let submitOK = true;
				//验证用户名
				if(this.form.username!= undefined && this.form.username!=''){
					if(this.usernameClass == "el-icon-circle-close"){
						if(this.form.username.length > 0){
							let params = {};
							params = {
								username: this.form.username,
								loginName: localStorage.getItem('ms_username'),
								token: localStorage.getItem('token')
							}
							UserAll(params).then((response) => {
								if (response.data.code == 200) {
									this.usernameClass = "el-icon-circle-close";
									this.usernameColor = "color:#F56C6C";
									this.$message.error('用户名已存在，请重新输入！');
									submitOK = false;
								}else if (response.data.code == 404) {
									this.usernameClass = "el-icon-circle-check";
									this.usernameColor = "color:#67C23A";
								} else {
									this.$message.error('请求数据异常！');
									submitOK = false;
								}
							});
						}else{
							submitOK = false;
						}
					}
				}else{
					submitOK = false;
				}
				//验证业务代码---生产者
				if(this.producer.business_code!= undefined && this.producer.business_code!=''){
					if(this.business_codeClass == "el-icon-circle-close"){
						if(this.producer.business_code.length > 0){
							//请求服务
							let params = {};
							params = {
								business_code: this.producer.business_code,
								loginName: localStorage.getItem('ms_username'),
								token: localStorage.getItem('token')
							}
							GetProducerInfos(params).then((response) => {
								if (response.data.code == 200) {
									this.business_codeClass = "el-icon-circle-close";
									this.business_codeColor = "color:#F56C6C";
									this.$message.error('业务代码已存在，请重新输入！');
									submitOK = false;
								}else if (response.data.code == 404) {
									this.business_codeClass = "el-icon-circle-check";
									this.business_codeColor = "color:#67C23A";
								} else {
									this.$message.error('请求数据异常！');
									submitOK = false;
								}
							});
						}else{
							submitOK = false;
						}
					}
				}else{
					submitOK = false;
				}
				//验证表名称---生产者
				if(this.producer.tableName!= undefined && this.producer.tableName!=''){
					if(this.tableNameClass == "el-icon-circle-close"){
						if(this.producer.tableName.length > 0){
							//请求服务
							let params = {};
							params = {
								tableName: this.producer.tableName,
								loginName: localStorage.getItem('ms_username'),
								token: localStorage.getItem('token')
							}
							GetProducerInfos(params).then((response) => {
								if (response.data.code == 200) {
									this.tableNameClass = "el-icon-circle-close";
									this.tableNameColor = "color:#F56C6C";
									this.$message.error('业务表名称已存在，请重新输入！');
									submitOK = false;
								}else if (response.data.code == 404) {
									this.tableNameClass = "el-icon-circle-check";
									this.tableNameColor = "color:#67C23A";
								} else {
									this.$message.error('请求数据异常！');
									submitOK = false;
								}
							});
						}else{
							submitOK = false;
						}
					}
				}else{
					submitOK = false;
				}
				if(this.Tableoffield.fieldNamekey == undefined && this.tableoffields.length > 0){
					
				}else{
					//验证表结构
					//字段重复性验证
					if(this.Tableoffield.fieldNamekey!= undefined && this.Tableoffield.fieldNamekey!=''){
						//修改的时候不需要
						if(!this.fieldEditOK){
							if(this.Tableoffield.fieldNamekey.length > 0){
								let ok = false;
								if(this.tableoffields.length > 0){
									for (var i = 0; i < this.tableoffields.length; i++) {
										if (this.tableoffields[i].fieldNamekey == this.Tableoffield.fieldNamekey) {
											ok = true;
											break;
										}
									}
								}
								if(ok){
									//存在
									this.fieldNamekeyClass = "el-icon-circle-close";
									this.fieldNamekeyColor = "color:#F56C6C";
									this.$message.error('字段名称重复，请重新输入！');
									submitOK = false;
								}else{
									//不存在
									this.fieldNamekeyClass = "el-icon-circle-check";
									this.fieldNamekeyColor = "color:#67C23A";
								}
							}
						}
					}else{
						submitOK = false;
					}
					
					//验证字段描述
					if(this.Tableoffield.commentkey!= undefined && this.Tableoffield.commentkey!=''){
						if(this.Tableoffield.commentkey.length == 0){
							submitOK = false;
						}
					}else{
						submitOK = false;
					}
					
					
					//验证设计表结构是否为空
					if(this.Tableoffield.fieldNamekey!= undefined && this.Tableoffield.fieldNamekey!=''){
						
					}else{
						if(this.tableoffields.length == 0){
							submitOK = false;
						}
					}
					
					//字段类型验证
					if(this.Tableoffield.fieldTypekey == "longtext"){
						this.Tableoffield.fieldLengthkey = 0;
						this.Tableoffield.decimalkey = 0;
						if(this.Tableoffield.primary_key == true){
							this.$message.error('该类型字段不能设置主键！');
							this.Tableoffield.primary_key = false;
							submitOK = false;
						}
					}else if(this.Tableoffield.fieldTypekey == "date"){
						this.Tableoffield.fieldLengthkey = 0;
						this.Tableoffield.decimalkey = 0;
					}else if(this.Tableoffield.fieldTypekey == "datetime"){
						this.Tableoffield.fieldLengthkey = 0;
						this.Tableoffield.decimalkey = 0;
					}else if(this.Tableoffield.fieldTypekey == "double"){
						this.Tableoffield.fieldLengthkey = 0;
						this.Tableoffield.decimalkey = 0;
					}else {
						if(this.Tableoffield.fieldLengthkey == 0){
							this.Tableoffield.fieldLengthkey = 255;
							this.Tableoffield.decimalkey = 0;
						}
					}
					
					//主键验证
					if(this.Tableoffield.primary_key == true){
						if(this.Tableoffield.fieldTypekey == 'varchar'){
							if(this.Tableoffield.fieldLengthkey > 100){
								this.$message.error('字段长度大于100，请设置小于100以下的数字！');
								this.Tableoffield.primary_key = false;
								submitOK = false;
							}
						}else{
							this.$message.error('该类型字段不能设置主键，请选择varcahr类型字段，并长度设置小于100以下的数字！');
							this.Tableoffield.primary_key = false;
							submitOK = false;
						}
					}
				}
				return submitOK;
			},
			//消费者配置相关操作
			//编辑
			handleConsumerEdit(index,row){
				this.sqlckey = '';
				this.sqltype = '';
				this.sqlcvalue  = '';
				this.sqlmerge = '';
				if(index == -1){
					this.consumer = {
						id:'',
						business_code:'',
						fields:[],
						push:false,
						customize:false,
						pushadress:'',
						oldaddress:'',
						overdueteime: new Date(),
						pushtopic:'',
						pushtag:'',
						sql:''
					}
				};
				this.getbusiness();
				this.editConsumerVisible = true;
			},
			//获取生产者的业务
			getbusiness(){
				//请求服务
				let params = {};
				params = {
					loginName: localStorage.getItem('ms_username'),
					token: localStorage.getItem('token')
				}
				GetProducerInfos(params).then((response) => {
					if (response.data.code == 200) {
						this.business = response.data.data;
					}else if (response.data.code == 404) {
						this.business = [];
					} else {
						this.$message.error('请求数据异常！');
					}
				});
			},
			//业务代码改变触发字段内容修改
			businesscheck(){
				let Arr = this.business;
				for(var i=0 ; i< Arr.length ;i++){
					if(Arr[i].business_code == this.consumer.business_code){
						this.businessfields = Arr[i].tableoffields;
						break;
					}
				}
			},
			handleCheckAllChange(val) {
			   this.consumer.fields = val ? this.businessfields : [];
			   this.isIndeterminate = false;
			},
			handleCheckedCitiesChange(value) {
			        let checkedCount = value.length;
			        this.checkAll = checkedCount === this.consumer.fields.length;
					if(this.consumer.fields.length == this.businessfields.length && checkedCount > 0){
						this.isIndeterminate = false;
					}else{
						this.isIndeterminate = true;
					}
					
			},
			setsql(ok){
				if(ok == true){
					this.consumer.sql =  this.consumer.sql +this.sqlckey + "  "+ this.sqltype + "  '"+ this.sqlcvalue + "'  "+ this.sqlmerge + "  ";
					alert(this.consumer.sql);
				}else{
					this.consumer.sql = "";
				}
			},
			saveConsumerEdit(){
				this.Consumerusers.push(this.consumer);
			},
			// 分页导航
			handlePageChange(val) {
				this.$set(this.query, 'pageIndex', val);
				this.getData(this.query.citycode, val);
			},
			formatBoolean(row, column, cellValue) {
				var ret = '' //你想在页面展示的值
				if (cellValue) {
					ret = "是" //根据自己的需求设定
				} else {
					ret = "否"
				}
				return ret;
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
