<template>
	<div id="app" class="checkplatform">
		<div class="checkplatform__header">
			<div class="checkplatform__logo">
				<a :href="'http://'+indexUrl">
					<img src="~assets/img/blockchnia/logo_sub.png" alt="">
				</a>
				<p>{{filterType ? '客服电话' : 'Hotline'}}：4000-315-426</p>
			</div>
			<div class="checkplatform__header__rg">
				<a href="javascript:;" :class="{'current-language': filterType}" @click="switchZH">简体中文</a>
				<i></i>
				<a href="javascript:;" :class="{'current-language': !filterType}" @click="switchEH">English</a>
			</div>
		</div>
		<div class="checkplatform__banner">
			 <span>{{ filterType ? '知识产权存证查验平台' : 'Certificate Verification Platform'}}</span>
		</div>
		<div class="checkplatform__content">
			<ul class="switch-tab">
				<li :class="{'current-tag': isActive === true}" @click="isActive = true,initSubmit()">
					{{ filterType ? '公证存证查验' : 'Certificate Verification'}}</li><li :class="{'current-tag': isActive === false}" @click="isActive = false,initSubmit()">
					{{ filterType ? '区块链存证查验' : 'Blockchain Verification'}}
				</li>
			</ul>
			<div class="checkplatform__content__con">
				<!-- 立即查验 -->
				<div class="checkplatform-con-form" v-if="status < 3">
						<h2>{{ filterType ? '请输入要查验的证书编号' : 'Enter The Certificate Number' }}</h2>
						<div class="input-wrap-code input-wrap" :style="{ 'margin-bottom': isNumError ? '0px' : '38px'}"><input type="text" class="input-style" :placeholder="filterType ? '请输入要查验的证书编号' : 'Enter the certificate number'" v-model="params.evidNo" @keyup="validNumHandle">
						</div>
						<div class="error-tip" v-show="isNumError">{{ filterType ? '请输入证据编号内容' : 'Please enter the verification number' }}</div>
						<div class="validation" v-if="checkTimes > 5">
							<div class="input-wrap-code">
								<input type="text" maxlength="4" class="input-style valid-code" :placeholder="filterType ? '请输入验证码' : 'Enter the verification code'"
									v-model="params.captcha" @keyup="validCodeHandle">
							</div>
							<div id="valid-code">
								 <img :src="czUrl + '/servlet/captchaCode?t=' + timer">
							</div>
							<span v-if="filterType">看不清？
								<a @click="switchPicHandle"> 换一张</a>
							</span>
							<span style="right: 83px" v-else>
								<a @click="switchPicHandle"> Change</a>
							</span>
						</div>
						<div class="error-tip" v-show="isCodeError">
							{{ filterType ? '请输入验证码' : 'Please enter the verification code' }}
						</div>
						<div class="error-tip" v-show="!isCodeError && serverCodeError">
							{{ filterType ? '图形验证码错误' : 'Verification code error' }}
						</div>
						<p :style="{'margin-top': isCodeError ? '0px' : '10px'}">*
							<template v-if="isActive">
								{{ filterType ? '公证存证查验服务由杭州互联网公证处提供支持' : 'Certificate verification service is delivered by Hangzhou Internet Notary Office'}}
							</template>
							<template v-else>
								{{ filterType ? '区块链存证查验服务由知金链提供支持' : 'Blockchain verification service is provided by Intelligence and Finance Chain Network Technology Co., Ltd.'}}
							</template>
						</p>
						<button class="btn" v-if="status === 2">{{ filterType ? '查询中...' : 'loading...' }}</button>
						<button class="btn" v-else @click="submit">{{ filterType ? '立即查验' : 'VERIFY' }}</button>
					<!-- </el-form> -->
				</div>
				<!-- 查询中 暂时去掉，不知道什么时候产品又搬出来-->
				<!-- <div class="checkplatform-con-search" v-else-if="status === 2">
					<img src="~assets/img/blockchnia/search-icon.png" alt="">
					<p>{{ filterType ? '查询中...' : 'Loading' }}</p>
					<button class="btn" @click="initSubmit">{{ filterType ? '返回' : 'BACK' }}</button>
				</div> -->
				<!-- 验证成功 -->
				<div class="checkplatform-con-success" v-else-if="status === 3">
					<dl>
						<dt><img src="~assets/img/blockchnia/valid-success.png" alt=""></dt>
						<dd>{{ filterType ? '验证成功' : 'Success' }}<br>
							<span>{{ filterType ? '该存证信息存在且被安全保存' : 'The certificate information is valid and securely kept' }}</span>
						</dd>
					</dl>
					<!-- 中文字体宽度384 英文字体宽度438 -->
					<ul :style="{ 'width': isActive ? '390px' : '455px'}">
						<li>
							<span>{{ filterType ? '申&nbsp 请 人' : 'Applicant' }} ：</span> 
							{{ validData.name }}
						</li>
						<li>
							<span>{{ filterType ? '文件名称' : 'File name' }} ：</span> 
							{{ validData.fileName }}
						</li>
						<li>
							<span>{{ filterType ? '时间信息' : 'Storage time' }} ：</span> 
							{{ validData.time }}
						</li>
						<li>
							<span>{{ filterType ? '数字指纹' : 'Digital fingerprint' }} ：</span> 
							 {{ validData.md5 }}
						</li>
					</ul>
					<button class="btn" @click="initSubmit">{{ filterType ? '返回' : 'BACK' }}</button>
				</div>
				<!-- 验证失败 -->
				<div class="checkplatform-con-error" v-else-if="status === 4">
					<dl>
						<dt><img src="~assets/img/blockchnia/valid-error.png" alt=""></dt>
						<dd>{{ filterType ? '验证失败' : 'Failure'}}</dd>
					</dl>
					<p>{{ filterType ? '未找到对应的存证信息，请重新查询' : 'The information is not found, please re-enter' }}</p>
					<button class="btn" @click="initSubmit">{{ filterType ? '重新输入' : 'RE-ENTER' }}</button>
				</div>
			</div>
			<div class="checkplatform__content__title">
				 <i></i>
				 <span>{{ filterType ? '支持机构' : 'Supported By'}}</span>
			</div>
			 <support-org v-if="!filterType"></support-org>
			<div class="checkplatform__content__list" v-if="filterType">
				<ul>
					<li>
						<span><img src="~assets/img/blockchnia/platform_title.png" alt=""></span>
						<p>
							中国知识产权公证服务平台以公证法律服务为核心，对知识产权实现从权利产生、权利确认到权利交易、纠纷解决的服务与保护全流程覆盖。同时，针对当前知识产权侵权行为呈现地域屏蔽、多点发生及突发性的特点，平台整合全国公证机构力量，开展多地多点协同服务，为当事人提供随时随地的公证法律服务。
						</p>
					</li>
					<li>
						<span><img src="~assets/img/blockchnia/sebe_logo_wht.png" alt=""></span>
						<p>杭州拾贝知识产权服务有限公司运用云计算、大数据及移动互联网技术，依托相关部门及行业资源，为国内外线上权利人搭建一个专业、简便、快捷、互通、多维的互联网电商知识产权保护服务平台。同时，杭州拾贝知识产权服务有限公司也是“中国产学研合作促进会反侵权假冒创新战略联盟”的副理事长单位。</p>
					</li>
					<li>
						<span><img src="~assets/img/header_footer/caasa1.jpg" height="38" alt=""></span>
						<p>在全国打击侵犯知识产权和制售假冒伪劣商品工作领导小组办公室的指导和中国产学研合作促进会的支持下，由中国防伪行业协会等四十余家行业协会及厦门大学、 浙江清华长三角研究院等高校科研机构，阿里巴巴、京东、杭州拾贝等数百家企业于 2015 年 1月23日共同发起成立非盈利性公益组织——中国产学研合作促进会反侵权假冒创新战略联盟。</p>
					</li>
				</ul>
			</div>
		</div>
		<div class="checkplatform__footer">
			浙ICP备15042618号 | 浙公网安备 33010402003197号 © 2018 拾贝公司 All Rights Reserved
		</div>
	</div>
</template>

<script>
	// 测试环境
	import $ from 'jquery'
	const czUrl = CONFIG.czUrl
	const userUrl = CONFIG.userUrl
	const indexUrl = CONFIG.indexUrl
	import supportOrg from "./component/supportOrg.vue";
	import FauxPlaceholder from 'assets/js/ie9Compatible.js'

	export default {
		components: {
			supportOrg
		},
		data() {
			return {
				isActive: true,
				status: 1, // 1 查验 2 查询中 3 查询成功 4 查询失败
				isNumError: false, // 证书编号验证错误提示
				isCodeError: false, // 验证码错误提示
				serverCodeError: false, // 验证码错误提示
				params: {
					evidNo: '', // 证书编号
					captcha: '', // 验证码
				},
				url: {
					isCaptcha: '/sebe/isCaptcha.do', // 查询是否需要图形验证码
					captchaCode: '/servlet/captchaCode', // 生成图形验证码
					blockchain: '/sebe/checkZhijinlian.do', // 区块链
					notarizat: '/sebe/checkEgongzheng.do', // 公证查询
				},
				czUrl: czUrl,  // 环境地址
				indexUrl: indexUrl,  // 首页环境地址
				userUrl: userUrl,
				checkTimes: 0, // 检查验证次数，超过5次需要输入图形验证码
				validData: {}, // 接收查验返回数据
				timer: '', // 时间戳
				type: 'zh', // zh 中文 en 英文
				origin: '' // 域名地址
			}
		},
		computed: {
			/**
			 * 处理中英文标识
			 * @return{ Boolean } type true 中午 false 英文
			*/
			filterType() {
				const type = this.type ? this.type.substring(6, 8) : 'zh'
				return type === 'zh' ? true : false
			}
		},
		mounted() {
			// setTimeout(function () {
			//   FauxPlaceholder()
			// }, 300)
			// 获取连接请求参数
			this.type = window.location.search
			// 验证请求
			this.queryValidHandle()
			// 域名 首页
			this.origin = location.origin
			// 首页环境地址
			this.indexUrl = this.indexUrl.substring(2)
		},
		methods: {
			getUrlParam(name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
				var r = window.location.search.substr(1).match(reg);
				if (r != null) return unescape(r[2]); return '';
			},
			/**
			 * 提交
			*/
			submit() {
				let self = this
				let params = self.params
				if (params.evidNo === '') {
					self.isNumError = true
				}
				if (params.captcha === '' && self.checkTimes > 5) {
					this.isCodeError = true
				}
				if (!self.isNumError && !self.isCodeError) {
					self.notarizatSubmit()
				}
			},
			/**
			 * 公证、区块链 提交
			*/
			notarizatSubmit() {
				let self = this
				let type = self.isActive ? 1 : 0 // ture公证查验 false 区块链存验
				let url = self.czUrl + (type ? self.url.notarizat : self.url.blockchain)
				self.status = 2
				this.$http.post(url, self.params).then((res) => {
					// 请求超过30秒后返回初始状态
					setTimeout(() => {
						if (self.status === 2) {
							self.initSubmit()
						}
					}, 30000)
					// 验证码错误处理
					if (res.data.code === '10013') {
						// 图形验证码错误，再次提交，同时更换图形验证码
						self.status = 1
						self.serverCodeError = true
						self.switchPicHandle()
						return
					}
					if (res.status === 200) {
						self.validData = res.data
						self.checkTimes = res.data.checkTimes
						self.status = res.data.check === 'true' ? 3 : 4 // 查验成功true 3 查验失败false 4
						setTimeout(function () {
							FauxPlaceholder()
						}, 300)
					} 
				}).catch((error) => {
					self.$message.error('系统繁忙，请稍后再试')
				})
			},
			/**
			 * 初始化提交数据
			*/
			initSubmit() {
				this.params.evidNo = ''
				this.params.captcha = ''
				this.isCodeError = false
				this.isNumError = false
				this.status = 1 // 初始化验证状态
				this.timer = new Date().getTime() // 初始化验证吗
				FauxPlaceholder()
				this.queryValidHandle()
			},
			/**
			 * 输入证书编号时校验,作出相应的错误提示
			*/
			validCodeHandle() {
				let self = this
				self.serverCodeError = false
				let captcha = self.params.captcha
				if (captcha === '' || captcha.length < 4) {
					self.isCodeError = true
					return
				} 
				self.isCodeError = false
			},
			/**
			 * 输入证书编号时校验,作出相应的错误提示
			*/
			validNumHandle() {
				let self = this
				self.isNumError = self.params.evidNo ? 0 : 1
			},
			/**
			 * 获取验证次数 一个ip地址一天免验证上限为5次
			*/
			queryValidHandle() {
				let url = this.czUrl + this.url.isCaptcha
				this.$http.post(url, {}).then((res) => {
					// 接受验证次数数据
					if (res.status === 200) {
						let checkTimes = res.data.checkTimes
						this.checkTimes = checkTimes
						setTimeout(function () {
							FauxPlaceholder()
						}, 300)
					}
				}).catch((error) => {
					this.$message.error('系统繁忙，请稍后再试')
				})
			},
			/**
			 * 换一张 验证码
			*/
			switchPicHandle() {
				this.timer = new Date().getTime()
			},
			/**
			 * 切换中文模式
			*/
			switchZH() {
				const win = window.location
				const url = 'https://' + win.host + win.pathname + '?type=zh'
				win.assign(url)
			},
			/**
			 * 切换英文模式
			*/
			switchEH() {
				const win = window.location
				const url = 'https://' + win.host + win.pathname + '?type=en'
				win.assign(url)
			}
		}
	}
</script>
<style lang="stylus">
	.placeholder {
		position absolute
		left 16px
		top: 11px
		color:rgba(187,187,187,1)
	}
</style>

<style lang="stylus" scoped>
	/* 抽出查验平台代码 */
	@import './block-chain.styl'
</style>
