<template>
	<div class="login-wrap">
		<div class="ms-login">
			<div class="ms-title">后台管理系统</div>
			<el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
				<el-form-item prop="username">
					<el-input v-model="param.username" placeholder="username">
						<el-button slot="prepend" icon="el-icon-lx-people"></el-button>
					</el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input type="password" placeholder="password" v-model="param.password" @keyup.enter.native="submitForm()">
						<el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
					</el-input>
				</el-form-item>
				<div class="login-btn">
					<el-button type="primary" @click="submitForm()">登录</el-button>
				</div>
				<p class="login-tips">Tips : 用户名和密码随便填。</p>
			</el-form>
		</div>
	</div>
</template>
<script>
	import { getHttpGet, getHttpPost, getHttpDelete } from '../../api/index';
	import { JSEncrypt } from 'jsencrypt'
	export default {
		data: function() {
			return {
				param: {
					username: 'admin',
					password: 'admin',
				},
				rules: {
					username: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}],
				},
			};
		},
		methods: {
			submitForm() {
				let self=this;
				let webRoot=window.ZHCJAppConfig.webURL;
				let loginurl=webRoot+window.ZHCJAppConfig.API.login;
				let getpublickeyurl=webRoot+window.ZHCJAppConfig.API.getpublickey;
				
				//根据loginName获取公钥信息
				let params = {loginName: self.$data.param.username};
				getHttpGet(getpublickeyurl,(params)).then(res => {
					let tmpRes=res;
					if(tmpRes.code==200){
						let publicKey = tmpRes.publicKey;
						// 新建JSEncrypt对象
						let encrypt = new JSEncrypt();
						//加密
						encrypt.setPublicKey(
							publicKey
						);
						var password = encrypt.encrypt(self.$data.param.password.trim());
						//请求服务
						params = {
							loginName: self.$data.param.username,
							password: password
						};
						
						getHttpGet(loginurl,(params)).then(res => {
							let tmpRes=res;
							if(tmpRes.code==200){
								let uInfo = tmpRes;
								localStorage.setItem('ms_username', self.param.username);
								let roleJson=JSON.stringify(uInfo);
								//debugger
								localStorage.setItem("LWZHDC_tool_data",roleJson);
								console.info(roleJson);
								self.$router.push('/dashboard');
								self.$message.success('登录成功');
							}else{
								localStorage.removeItem("LWZHDC_tool_data");
								self.$message.error('请输入账号和密码');
								console.log('error submit!!');
								return false;
							}
						}).catch(function (error) {
							self.$message.warning('亲，网络出现异常');
							console.log(error);
						});
						
					}else{
						self.$message.error('获取用户公钥失败!');
						console.log('error submit!!');
						return false;
					}
				}).catch(function (error) {
					self.$message.warning('亲，网络出现异常');
					console.log(error);
				});
			},
		},
	};
</script>

<style scoped>
	.login-wrap {
		position: relative;
		width: 100%;
		height: 100%;
		background-image: url(../../assets/img/login-bg.jpg);
		background-size: 100%;
	}

	.ms-title {
		width: 100%;
		line-height: 50px;
		text-align: center;
		font-size: 20px;
		color: #fff;
		border-bottom: 1px solid #ddd;
	}

	.ms-login {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 350px;
		margin: -190px 0 0 -175px;
		border-radius: 5px;
		background: rgba(255, 255, 255, 0.3);
		overflow: hidden;
	}

	.ms-content {
		padding: 30px 30px;
	}

	.login-btn {
		text-align: center;
	}

	.login-btn button {
		width: 100%;
		height: 36px;
		margin-bottom: 10px;
	}

	.login-tips {
		font-size: 12px;
		line-height: 30px;
		color: #fff;
	}
</style>
