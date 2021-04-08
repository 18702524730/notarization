<template>
	<div id="app" class="app">
		<sebe-header :userName="userName" :cartNum="cartNum"></sebe-header>
		<mini-login @callbackDo="callbackDo" :showMini.sync="showMini" @closeMini="showMini=false"></mini-login>
		<div class="container clearfix web-container">
			<!-- 位置导航 -->
			<div class="position-wrap" >
				<div class="position commWidth" >
					<div class="pos-nav fl">您的位置：<a :href="indexUrl">首页</a>><a :href="indexUrl + '/cms/service/rightoriginal.htm'">存证</a>><span>版权存证</span></div>
				</div>
			</div>
			<div class="content-wrap">
				<div class="top-banner"></div>
			</div>
		</div>
		<!-- 存证包数量 -->
		<div class="top mt15">
			<p v-if="!txtType">每一次创新，都值得守护</p>
			<p v-if="txtType==1">区块链存证+公证存证，双重保障</p>
			<p v-if="txtType==2">区块链存证+司法鉴定存证，双重保障</p>
			<div>
				<p>剩余存证包数量：
					<span>{{czbNum}}</span>
					<a class="ml20" :href="indexUrl+'/store/1180036088.htm?pageIndex=1&classId=33'" target="_blank">购买存证包&nbsp;></a>
				</p>
			</div>
		</div>
		<!-- 首页部分 -->
		<div class="homepage" v-if="pageIndex">
			<!-- 存证分类 -->
			<div class="category_list mt10">
				<p class="prompt mb20">为了更好的保证作品的安全性且具备法律效力，平台会把作品以区块链的技术手段进行存储。</p>
				<div class="clearfix">
				<!-- 公证存证 -->
					<div class="category fl" @click="czstate(1),txtType=1">
						<p class="tit">公证存证</p>
						<img class="mt25 mb15" src="~assets/img/literature/hzgz.png" width="60" alt="">
						<p class="name mt5">杭州互联网公证处</p>
						<p class="txt">公证机构作为法定的证明机构，拾贝携手杭州互联网公证处借助可靠的技术手段提供专业的解决方案，对知识产权的权利进行预登记，公证机构借助法定保密义务，保管权利载体文件。在发生纠纷时，通过公证职能，证明权利人在什么时间、持有什么知识产权，起到法定的特殊证据效力。</p>
						<button class="mt15">选择</button>
					</div>
					<!-- 司法鉴定存证 -->
					<div class="category fl ml20" @click="czstate(2),txtType=2">
						<p class="tit">司法鉴定存证</p>
						<img class="mt10" src="~assets/img/literature/zgz.png" alt="">
						<p class="name mt5">福建中证司法鉴定中心</p>
						<p class="txt">司法鉴定存证是由我国专业、权威的司法鉴定机构——福建中证司法鉴定中心予以鉴证，确定了“什么人、在什么时候、拥有什么样的电子数据”的客观事实，并且存证证书及文件是不能被篡改和伪造的。</p>
						<button class="mt15">选择</button>
					</div>
				</div>
			</div>
		</div>
		<!-- 存证流程 -->
		<div class="process_list" v-loading="loadingSf" v-if="!pageIndex">
			<!-- 公正 -->
			<div class="list_tab clearfix" v-if="czType">
				<p class="fl">选择申请人</p>
				<p class="fl">填写作品信息</p>
				<p class="fl">填写创作信息</p>
			</div>
			<!-- 司法 -->
			<div class="tab_list clearfix" v-if="!czType">
				<p class="fl">选择申请人</p>
				<p class="fl">存证信息</p>
			</div>
			<i :class="{'bdc01':czProcess==1&&czType,'bdc02':czProcess==2&&czType,'bdc03':czProcess==3&&czType,'bdc1':czProcess==1&&!czType,'bdc2':czProcess==2&&!czType}"></i>
			<!-- 申请人 -->
			<div class="applicant" v-if="czProcess==1">
				<p class="mt30 mb10">请选择已实名认证的申请企业/个人，点击未实名认证的申请人可完成实名认证（注：企业实名认证需要1~2个工作日）</p>
				<!-- 主体信息 -->
				<apply-subject-qy v-if="txtType==1" :notarizationType="2" @selectApplySubjectId="getApplySubjectId" @nologin="showMini=true" :needRender="needRender" :authVisible.sync="authVisible" :authVisibleQy.sync="authVisibleQy"></apply-subject-qy>
				<apply-subject v-if="txtType==2" applytype="5" :notarizationType="2" @selectApplySubjectId="getApplySubjectId" @nologin="showMini=true" :needRender="needRender" :authVisible.sync="authVisible"></apply-subject>
				<div class="btn_last">
					<button class="mt20" @click="goHome(),txtType=''">返回</button>
				</div>
			</div>
			<!-- 作品信息 -->
			<div class="works_data" v-show="czProcess==2">
				<el-form :model="works" :rules="rules" ref="works" label-width="130px" class="demo-ruleForm">
					<el-form-item label="作品名称" prop="productionName" v-if="czType">
						<el-input :maxlength="40" v-model="works.productionName" placeholder="请输入作品名称"></el-input>
					</el-form-item>
					<!-- 作品种类 -->
					<el-form-item label="作品种类" class="wid990" prop="notarizationPurpose">
						<el-select v-model="works.notarizationPurpose" placeholder="请选择作品种类">
							<el-option label="文字作品" value="4"></el-option>
							<el-option label="音乐作品" value="6"></el-option>
							<el-option label="美术作品" value="5"></el-option>
							<el-option label="其它" value="8"></el-option>
						</el-select>
					</el-form-item>
					<!-- 作品类型 个人 -->
					<el-form-item label="作品类型" class="wid990" v-if="czType && applyType==5" prop="typeWork">
						<el-select v-model="works.typeWork" placeholder="请选择作品类型">
							<el-option label="个人作品" value="0"></el-option>
							<el-option label="职务作品" value="1"></el-option>
							<el-option label="合作作品" value="2"></el-option>
							<el-option label="委托作品" value="3"></el-option>
						</el-select>
					</el-form-item>

					<!-- 作品类型 企业-->
					<el-form-item label="作品类型" class="wid990" v-if="czType && applyType==2" prop="typeWork">
						<el-select v-model="works.typeWork" placeholder="请选择作品类型">
							<el-option label="法人作品" value="4"></el-option>
							<el-option label="合作作品" value="2"></el-option>
							<el-option label="委托作品" value="3"></el-option>
						</el-select>
					</el-form-item>

					<p class="Introduction mb15" v-if="works.typeWork==1">职务作品是指公民为完成法人或者其他组织工作任务所创作的作品。</p>
					<p class="Introduction mb15" v-if="works.typeWork==2">合作作品是指两个以上的自然人，或者自然人与法人、其他组织，或者两个以上的法人、其他组织共同创作的作品。</p>
					<p class="Introduction mb15" v-if="works.typeWork==3">委托作品，是指委托人向作者支付约定的创作报酬，由作者按照他人的意志和具体要求而创作的特定作品。</p>
					<!-- 职务作品 -->
					<div v-if="works.typeWork==1">
						<el-form-item label="单位信息" prop="unitName" v-if="czType" class="shumin">
							<el-input :maxlength="40" class="addInput" v-model="works.unitName" placeholder="请输入单位名称">
								<template slot="append" v-if="!unit">
									<span @click="unit=true"></span>
									<i class="el-icon-plus" @click="unit=true"></i>
								</template>
							</el-input>
						</el-form-item>
						<el-form-item prop="unitPhone" v-if="czType">
							<el-input v-model="works.unitPhone" :maxlength="13" placeholder="请输入单位电话"></el-input>
						</el-form-item>
						<!-- 职务作品02 -->
						<el-form-item label="单位信息" prop="unitName" v-if="czType&&unit" class="shumin">
							<el-input :maxlength="40" v-model="works.unitName02" placeholder="请输入单位名称">
								<template slot="append" v-if="unit">
									<span @click="unit=false,works.unitName02='',works.unitPhone02=''"></span>
									<i class="el-icon-minus" @click="unit=false,works.unitName02='',works.unitPhone02=''"></i>
								</template>
							</el-input>
						</el-form-item>
						<el-form-item prop="unitPhone" v-if="czType&&unit">
							<el-input :maxlength="13" v-model="works.unitPhone02" placeholder="请输入单位电话"></el-input>
						</el-form-item>
					</div>

					<!-- 合作作品 -->
					<div v-if="works.typeWork==2">
						<el-form-item label="合作人信息" prop="cooperationName" v-if="czType" class="shumin">
							<el-input :maxlength="40" class="addInput" v-model="works.cooperationName" placeholder="请输入合作人姓名">
								<template slot="append" v-if="!cooperation">
									<span @click="cooperation=true"></span>
									<i class="el-icon-plus" @click="cooperation=true"></i>
								</template>
							</el-input>
						</el-form-item>
						<el-form-item prop="cooperationPhone" v-if="czType">
							<el-input :maxlength="13" v-model="works.cooperationPhone" placeholder="请输入合作人联系电话"></el-input>
						</el-form-item>
						<!-- 合作作品02 -->
						<el-form-item label="合作人信息" v-if="czType&&cooperation" class="shumin">
							<el-input :maxlength="40" v-model="works.cooperationName02" placeholder="请输入合作人姓名">
								<template slot="append" v-if="cooperation">
									<span @click="cooperation=false,works.cooperationName02='',works.cooperationPhone02=''"></span>
									<i class="el-icon-minus" @click="cooperation=false,works.cooperationName02='',works.cooperationPhone02=''"></i>
								</template>
							</el-input>
						</el-form-item>
						<el-form-item v-if="czType&&cooperation">
							<el-input :maxlength="13" v-model="works.cooperationPhone02" placeholder="请输入合作人联系电话"></el-input>
						</el-form-item>
					</div>

					<!-- 委托作品 -->
					<div v-if="works.typeWork==3">
						<el-form-item label="委托人信息" prop="entrustName" v-if="czType" class="shumin">
							<el-input :maxlength="40" class="addInput" v-model="works.entrustName" placeholder="请输入委托人姓名">
								<template slot="append" v-if="!entrust">
									<span @click="entrust=true"></span>
									<i class="el-icon-plus" @click="entrust=true"></i>
								</template>
							</el-input>
						</el-form-item>
						<el-form-item prop="entrustPhone" v-if="czType">
							<el-input :maxlength="13" v-model="works.entrustPhone" placeholder="请输入委托人联系电话"></el-input>
						</el-form-item>
						<!-- 委托作品02 -->
						<el-form-item label="委托人信息" v-if="czType&&entrust" class="shumin">
							<el-input :maxlength="40" v-model="works.entrustName02" placeholder="请输入委托人姓名">
								<template slot="append" v-if="entrust">
									<span @click="entrust=false,works.entrustName02='',works.entrustPhone02=''"></span>
									<i class="el-icon-minus" @click="entrust=false,works.entrustName02='',works.entrustPhone02=''"></i>
								</template>
							</el-input>
						</el-form-item>
						<el-form-item v-if="czType&&entrust">
							<el-input :maxlength="13" v-model="works.entrustPhone02" placeholder="请输入委托人联系电话"></el-input>
						</el-form-item>
					</div>
					<!-- 受托人 -->
					<div v-if="works.typeWork==3">
						<el-form-item label="受托人信息" prop="depositaryInfo" v-if="czType" class="shumin">
							<el-input :maxlength="40" class="addInput" v-model="works.depositaryInfo" placeholder="请输入受托人姓名">
								<template slot="append" v-if="!depositary">
									<span @click="depositary=true"></span>
									<i class="el-icon-plus" @click="depositary=true"></i>
								</template>
							</el-input>
						</el-form-item>
						<el-form-item prop="depositaryInfoPhone" v-if="czType">
							<el-input :maxlength="13" v-model="works.depositaryInfoPhone" placeholder="请输入受托人联系电话"></el-input>
						</el-form-item>
						<!-- 受托人02 -->
						<el-form-item label="受托人信息" v-if="czType&&depositary" class="shumin">
							<el-input :maxlength="40" v-model="works.depositaryInfo02" placeholder="请输入受托人姓名">
								<template slot="append" v-if="depositary">
									<span @click="depositary=false,works.depositaryInfo02='',works.depositaryInfoPhone02=''"></span>
									<i class="el-icon-minus" @click="depositary=false,works.depositaryInfo02='',works.depositaryInfoPhone02=''"></i>
								</template>
							</el-input>
						</el-form-item>
						<el-form-item v-if="czType&&depositary">
							<el-input :maxlength="13" v-model="works.depositaryInfoPhone02" placeholder="请输入受托人联系电话"></el-input>
						</el-form-item>
					</div>
					<!-- 作品署名 -->
					<div v-if="czType">
						<el-form-item label="作品署名" prop="productionSign" class="shumin">
							<el-input :maxlength="40"  class="productInput" v-model="works.productionSign" placeholder="请输入作品署名">
								<template slot="append" v-if="!unitProduct">
									<span @click="unitProduct=true"></span>
									<i class="el-icon-plus" @click="unitProduct=true"></i>
								</template>
							</el-input>
						</el-form-item>
						<!-- 作品署名02 -->
						<el-form-item label="作品署名" prop="productionSign02" class="shumin" v-if="unitProduct">
							<el-input :maxlength="40" v-model="works.productionSign02" placeholder="请输入作品署名">
								<template slot="append" v-if="unitProduct">
									<span @click="unitProduct=false,works.productionSign02=''"></span>
									<i class="el-icon-minus" @click="unitProduct=false,works.productionSign02=''"></i>
								</template>
							</el-input>
						</el-form-item>
					</div>

					<!-- 合作，委托作品 -->
					<div v-if="works.typeWork>1&&works.typeWork<4&&czType">
						<!-- 创作协议 -->
						<el-form-item label="创作协议" prop="standby1">
							<div class="file_up clearfix">
								<uploader class="fl" @complete="setUploadedData" @resetUploader="resetUploader" :valueName="'standby1'" :url="standby1" :fileName="standby1_name" :size="2" :extensions="'doc,docx,jpeg,pdf,zip'" :postAction="czUrl+'/EvidenceController/uploadData.do'"></uploader>
								<div class="right_txt fl ml10 mt70">
									<p>• 上传文件大小不得超过2M</p>
									<p>• 文件格式必须符合条件，支持上传格式：docx／doc／pdf／zip格式</p>
								</div>
								<el-input v-model="works.standby1" style="display:none"></el-input>
							</div>
						</el-form-item>
						<!-- 著作权归属协议 -->
						<el-form-item label="著作权归属协议" prop="standby2">
							<div class="file_up clearfix">
								<uploader class="fl" @complete="setUploadedData" @resetUploader="resetUploader" :valueName="'standby2'" :url="standby2" :fileName="standby2_name" :size="2" :extensions="'doc,docx,jpeg,pdf,zip'" :postAction="czUrl+'/EvidenceController/uploadData.do'"></uploader>
								<div class="right_txt fl ml10 mt70">
									<p>• 上传文件大小不得超过2M</p>
									<p>• 文件格式必须符合条件，支持上传格式：docx／doc／pdf／zip格式</p>
								</div>
								<el-input v-model="works.standby2" style="display:none"></el-input>
							</div>
						</el-form-item>
					</div>
					<!-- 权利取得 -->
					<el-form-item label="权利取得" v-if="czType">
						<span style="line-height: 40px;">原始取得</span>
					</el-form-item>
					<!-- 作品文件 -->
					<el-form-item label="作品文件" prop="standby3">
						<div class="file_up clearfix">
							<nuploader v-if="czType" class="fl" @complete="setUploadedData" @resetUploader="resetUploader" :valueName="'standby3'" :url="standby3" :fileName="standby3_name" :postAction="czUrl + '/EvidenceController/uploadDataBaoQuan'" :size="50" :extensions="'png,jpg,jpeg,gif,txt,pdf,docx,doc,xls,ppts,ppt,htm,html,bmp'"></nuploader>
							<uploader v-if="!czType" class="fl" @complete="setUploadedData" @resetUploader="resetUploader" :valueName="'standby3'" :url="standby3" :fileName="standby3_name"  :size="50" :extensions="'png,jpg,jpeg,gif,txt,pdf,docx,doc,xls,xlsx,ppt,mp4,avi,mp3,wma'"></uploader>
							<div class="right_txt fl ml10">
								<p>• 请确保您上传的作品文件打开后标题与您输入的作品名称一致。</p>
								<p v-if="czType">• 上传文件大小文档类不得超过20M，图片不得超过50M</p>
								<p v-if="!czType">• 上传文件大小不得超过50M</p>
								<p v-if="czType">• 文件格式必须符合条件，支持上传格式：png／jpg／jpeg／gif／txt／pdf／docx／doc／xls／ppts／ppt／htm／html／bmp格式</p>
								<p v-if="!czType">• 文件格式必须符合条件，支持上传格式：png／jpg／jpeg／gif／txt／pdf／docx／doc／xls／xlsx／ppt／mp4／avi／mp3／wma格式</p>
								<p>• 上传的存证版权归用户自己所有，未经用户授权，平台绝对不会私自使用用户上传的作品</p>
							</div>
							<el-input v-model="works.standby3" style="display:none"></el-input>
						</div>
					</el-form-item>
				</el-form>
				<!-- 下一步：判断司法还是公证 -->
				<div class="works_btn mt30">
					<p class="mb30" v-if="!czType"><span class="txt">扣除存证包</span><span class="num">1个</span>（保存时间3年）</p>
					<button class="last" @click="czProcess=1">上一步</button>
					<button v-if="czType" type="button" class="next ml20" @click="nextClick">下一步</button>
					<button v-if="!czType" type="button" class="next ml20" @click="czbNumber(1)">立即下单</button>
				</div>
			</div>
			<!-- 创作信息：公证 -->
			<div class="creation_data" v-show="czProcess==3">
				<el-form :model="creation" :rules="relus02" ref="creation" label-width="135px" class="demo-ruleForm">
					<el-form-item label="创作时间" prop="productionTime">
						<el-date-picker type="date" placeholder="请选择创作完成时间" v-model="creation.productionTime"></el-date-picker>
					</el-form-item>
					<!--修改次数  -->
					<!-- <el-form-item label="修改次数" prop="updateCishu">
						<el-input :maxlength="4" v-model="creation.updateCishu" placeholder="请输入作品修改次数（数字）"></el-input>
					</el-form-item> -->
					<!--发表状态  -->
					<el-form-item label="发表状态" prop="published">
						<el-select v-model="creation.published" prop="published">
							<el-option label="创作完成，未上线" value="0"></el-option>
							<!-- <el-option label="网络发表" value="1"></el-option>
							<el-option label="已出版" value="2"></el-option> -->
							<el-option label="已上线" value="3"></el-option>
						</el-select>
					</el-form-item>
					<!-- 网络发表 -->
					<div v-if="creation.published==1">
						<el-form-item label="首次发表网站" prop="web">
							<el-input :maxlength="200" v-model="creation.web" placeholder="请输入作品发表所在网址"></el-input>
						</el-form-item>
						<el-form-item label="发表网站账号" prop="account">
							<el-input :maxlength="60" v-model="creation.account" placeholder="请输入发表网站账号"></el-input>
						</el-form-item>
					</div>
					<!-- 已出版 -->
					<div v-if="creation.published==2">
						<el-form-item label="出版社名称" prop="Press">
							<el-input :maxlength="40" v-model="creation.Press" placeholder="请输入出版社名称"></el-input>
						</el-form-item>
						<!-- 期刊号 -->
						<el-form-item label="期刊号/书号ISBN" prop="isbn">
							<el-input :maxlength="20" v-model="creation.isbn" placeholder="请输入期刊号/书号ISBN"></el-input>
						</el-form-item>
					</div>
					<!-- 其他 -->
					<div v-if="creation.published==3">
						<el-form-item label="首次发表地址" prop="creationAddress">
							<el-input :maxlength="500" v-model="creation.creationAddress" placeholder="请输入首次发表地址"></el-input>
						</el-form-item>
					</div>
					<!-- 首次发表时间 -->
					<el-form-item label="首次发表时间" prop="creationTime" v-if="creation.published&&creation.published!=0">
						<el-date-picker type="date" placeholder="请选择首次发表时间" v-model="creation.creationTime"></el-date-picker>
					</el-form-item>
				</el-form>
				<!-- 声明 -->
				<div class="statement">
					<el-checkbox v-model="checked"></el-checkbox>
					<span>声明：本人上传的资料为真实信息，作品著作权为本人所有，作品不存在权利纠纷，并承担由此产生的一切法律责任<a @click.prevent="veiwAgree">《权利具结声明》</a>且同意<a href="/notarization/pages/czAgreement.html" target="_blank">《拾贝网用户存证服务协议》</a></span>
				</div>
				<div class="statement_btn mt15" >
					<p class="mb30">扣除存证包<span style="padding-left:12px;">1个</span>（保存时间3年）</p>
					<button class="last" type="button"  @click="czProcess=2">上一步</button>
					<button class="next ml20" type="button" @click="czbNumber(2)">立即下单</button>
				</div>
			</div>
		</div>
		<!-- 权利具结声明 -->
		<el-dialog title="著作权权利具结声明书" :visible.sync="agreeVisible" custom-class="dialog-payTip dialog-agree" :close-on-click-modal="false">
			<div class="pop_window">
				<div class="payTipCon">
					<h3>致杭州互联网公证处：</h3>
					<p class="c_txt">本人提交公证处保管的作品属于个人作品，本人对该作品拥有完整著作权，作品不存在侵害他人合法权利的情形，并且以下作品主要事项由本人填写并保证该事项的真实性。</p>
					<p class="c_txt">作品名称：{{works.productionName}}</p>
					<p class="c_txt">作品种类：{{works.notarizationPurpose | Purpose}}</p>
					<p class="c_txt">作者：{{works.productionSign+(works.productionSign02 ? '，'+works.productionSign02:'')}}</p>
					<p class="c_txt">创作完成时间：{{creation.productionTime|dateFilter}}</p>
					<p class="c_txt">发表状态：{{creation.published|publishe}}</p>
					<p class="c_txt" v-if="creation.published == 3 && creation.creationTime">首次发表日期：{{creation.creationTime|dateFilter}}</p>
					<p class="c_txt">保管文件名称：{{decodeURIComponent(standby3_name)}}</p>
					<p class="c_txt">本人保证：提交保管时填写的内容及上述声明内容均真实，若有虚假，由此所产生的一切法律责任均由声明人本人承担，与平台及贵公证处无关。</p>
					<p class="c_txt">特此声明！</p>
					<div class="sign" v-if="applyType==2">
						声明主体：{{apply_name}}<br>统一社会信用代码：{{apply_number}}<br>{{fwqTime | dateFilter}}
					</div>
					<div class="sign" v-if="applyType==5">
						声明人：{{apply_name}}<br>证件号码：{{apply_number}}<br>{{fwqTime | dateFilter}}
					</div>
				</div>
			</div>
		</el-dialog>
		<!-- 司法存证成功 -->
		<el-dialog :title="czChannel == 3 ? '本人操作验证' : '提示'" :visible.sync="sfvisible" size="tiny" class="self_validation" :lock-scroll="false" :before-close="close" :close-on-click-modal="false">
		<div class="validation_data">
			<!-- 成功 -->
			<div class="validation_end">
				<p><span>存证成功</span><i class="el-icon-check"></i></p>
				<div class="end_btn">
					<p class="mt10">剩余存证包数量：{{czbNum-1}}<a class="ml5" :href="indexUrl + '/store/1180036088.htm?pageIndex=1&classId=33'" target="_blank">购买存证包</a></p>
					<div class="btn_end mt20">
						<a class="end_left mr20" :href="userUrl+'/iprp/#/orders'">查看我的存证</a>
						<a class="end_right" @click.prevent="resetAll">继续存证</a>
					</div>
				</div>
			</div>
		</div>
	</el-dialog>
	<!-- 互联网存证成功 -->
	<el-dialog title="提示" :visible.sync="stateSteps" size="tiny" class="self_validation" :lock-scroll="false" :before-close="close" :close-on-click-modal="false">
		<div class="validation_data">
			<!-- 成功 -->
			<div class="validation_end">
				<p><span>存证成功</span><i class="el-icon-check"></i></p>
				<div class="end_btn">
					<p class="mt10">剩余存证包数量：{{czbNum-1}}<a class="ml5" :href="indexUrl + '/store/1180036088.htm?pageIndex=1&classId=33'" target="_blank">购买存证包</a></p>
					<div class="btn_end mt20">
						<a class="end_left mr20" :href="userUrl+'/iprp/#/orders'">查看我的存证</a>
						<a class="end_right" @click.prevent="resetAll">继续存证</a>
					</div>
				</div>
			</div>
		</div>
	</el-dialog>
	<!-- 存证包不够 -->
	<el-dialog class="czb" title="操作提醒" width="500px" :visible.sync="czbHref" size="tiny" :lock-scroll="false" :before-close="czbClick" :close-on-click-modal="false">
		<div class="czb_info">
			<p>抱歉，由于您的存证包数量不足，请前往购买存证包</p>
			<!-- <a class="mt20" :href="indexUrl+'/products/87.htm'" target="_blank" @click="payCzb">我要购买存证包</a> -->
			<a class="mt20" @click="payCzb">我要购买存证包</a>
		</div>
	</el-dialog>
		<sebe-footer class="mt-15"></sebe-footer>
		<!-- 本人操作验证 -->
		<!-- <self-validation :czbNum="czbNum" :bankPhone="bankPhone" @initialize="initialize" :allData="allData" :selfValidateVisible="selfValidateVisible" @selfClick="selfClick" @selfVisible="selfVisible"></self-validation> -->

	</div>
</template>
<script>
	import Vue from 'vue'
	import $ from 'jquery'
	import qs from 'qs'
	import sebeHeader from 'components/Header.vue'
	import sebeFooter from 'components/Footer.vue'
	import uploader from 'components/uploader/uploader.vue'
	import nuploader from 'components/uploader/nuploader.vue'
	import miniLogin from 'components/miniLogin.vue'
	import applySubject from 'components/applySubject/ApplySubject.vue'
	import applySubjectQy from 'components/applySubject/ApplySubjectQy.vue'
	import selfValidation from './component/selfValidation.vue'
	import FauxPlaceholder from 'assets/js/ie9Compatible.js'
	import { EventBus } from 'assets/event-bus.js';
	const indexUrl = CONFIG.indexUrl;
	const cartUrl = CONFIG.cartUrl;
	const czUrl = CONFIG.czUrl;
	const userUrl = CONFIG.userUrl;
	const queryCzUrl = './cunnar/querycznum.do';
// 检查标签是否支持该属性
	function ElementSupportAttribute(elm, attr) {
		var test = document.createElement(elm);
		return attr in test;
	}
	export default {
		data () {
			//首次发表地址
			let checkCreationAddress = (rule, value, callback) =>{
				if (!value) {
					return callback(new Error('请输入首次发表地址'));
				}
				setTimeout(() => {
					if (value.replace(/[\u4e00-\u9fa5]/g,'***').length > 500) {
						callback(new Error('地址长度不能超过500个字符'));
					} else {
						callback();
					}
				}, 50);
			};
			return {
				stateSteps:false,
				czChannel:'',
				applyType: 5, //默认是个人
				clickDouble:true,//防止重复提交
				czbHref:false,
				fwqTime:'',//服务器时间
				txtType:'',
				userUrl:userUrl,
				sfvisible:false,
				loadingSf:false,
				unitProduct:false,//作品署名
				bankPhone:'',//主体电话
				unit:false,//职务作品
				cooperation:false,//合作作品
				entrust:false,//委托作品
				depositary:false,//受托人
				czUrl:czUrl,
				authVisible:false,
				authVisibleQy:false,
				agreeVisible:false,
				needRender: false, //判断是否要重新渲染申请主体列表
				selfValidateVisible:false,//本人操作
				real:false,//实名认证弹框
				pageIndex:true,//是否是首页
				czType:false,// 存证类型,true:工证，false：司法
				czProcess:1,//存证进度
				// 创作协议
				standby1:'',
				standby1_name:'',
				// 归属协议
				standby2:'',
				standby2_name:'',
				// 作品
				standby3:'',
				standby3_name:'',
				czbNum:0, //存证包数量
				indexUrl: indexUrl,
				showMini: false,
				userName: '',
				cartNum:'',
				works:{
					notarizationPurpose:'',
					typeWork:'',
					// 创作协议
					standby1:'',
					standby1_name:'',
					// 归属协议
					standby2:'',
					standby2_name:'',
					// 作品
					standby3:'',
					standby3_name:'',
					unitName:'',
					cooperationPhone:'',
					entrustName:'',
					entrustPhone:'',
					depositaryInfo:'',
					depositaryInfoPhone:''
				},// 作品信息
				creation:{
					productionTime:'',
					published:'',
					creationTime:''
				},// 创作信息
				checked:false,//声明

				apply_name:'',
				apply_number:'',
				orderApplySubjectId:'',
				rules:{
					productionName:[
						{ required: true, message: '请输入作品名称', trigger: 'blur' },
						{ min: 1, max: 40, message: '作品名称长度 1到 40个字符', trigger: 'blur' }
					],
					notarizationPurpose: [
						{ required: true, message: '请选择作品种类', trigger: 'change' }
					],
					productionSign: [
						{ required: true, message: '请输入作品署名', trigger: 'blur' },
						{ min: 2, max: 40, message: '作品署名长度 2到 40个字符', trigger: 'blur' }
					],
					typeWork:[
						{ required: true, message: '请选择作品类型', trigger: 'change' }
					],
					unitName:[
						{ required: true, message: '请输入单位名称', trigger: 'blur' },
						{ min:2,max:40, message: '单位名称长度 2到 40个字符', trigger: 'blur' }
					],
					unitPhone:[
						{ required: true, message: '请输入单位电话', trigger: 'blur' },
						{ required: true, pattern: /(^(\d{3,4}-)?\d{7,8})$|(1[0-9]{10})/, message: '单位电话有误', trigger: 'blur' }
					],
					entrustPhone:[
						{ required: true, message: '请输入委托人电话', trigger: 'blur' },
						{ required: true, pattern: /(^(\d{3,4}-)?\d{7,8})$|(1[0-9]{10})/, message: '委托人电话有误', trigger: 'blur' }
					],
					entrustName:[
						{ required: true, message: '请输入委托人姓名', trigger: 'blur' },
						{ min:2,max:40, message: '委托人姓名长度 2到 40个字符', trigger: 'blur' }
					],
					depositaryInfo:[
						{ required: true, message: '请输入受托人姓名', trigger: 'blur' },
						{ min:2,max:40, message: '受托人姓名长度 2到 40个字符', trigger: 'blur' }
					],
					depositaryInfoPhone:[
						{ required: true, message: '请输入受托人电话', trigger: 'blur' },
						{ required: true, pattern: /(^(\d{3,4}-)?\d{7,8})$|(1[0-9]{10})/, message: '受托人电话有误', trigger: 'blur' }
					],
					cooperationName:[
						{ required: true, message: '请输入合作人姓名', trigger: 'blur' },
						{ min:2,max:40, message: '合作人姓名长度 2到 40个字符', trigger: 'blur' }
					],
					cooperationPhone:[
						{ required: true, message: '请输入合作人电话', trigger: 'blur' },
						{ required: true, pattern: /(^(\d{3,4}-)?\d{7,8})$|(1[0-9]{10})/, message: '合作人电话有误', trigger: 'blur' }
					],
					standby3:[
						{ required: true, message: '请上传存证作品文件', trigger: 'change' }
					],
					standby2:[
						{ required: true, message: '请上传著作权归属协议', trigger: 'change' }
					],
					standby1:[
						{ required: true, message: '请上传创作协议', trigger: 'change' }
					]
				},
				relus02:{
					published:[
						{  required: true, required: true, message: '请选择发表状态', trigger: 'change' }
					],
					productionTime: [
						{ type: 'date', required: true, message: '请选择创作时间', trigger: 'change' }
					],
					updateCishu: [
						{ required: true, pattern: /^[1-9][0-9]{0,}$/, message: '请输入作品修改次数(数字)', trigger: 'blur' }
					],
					web:[
						{ required: true, message: '请输入作品发表所在的网站', trigger: 'blur' },
						{ max:200, message: '网站长度在200个字符以内', trigger: 'blur' }
					],
					account:[
						{ required: true, message: '请输入首次发表网站账号', trigger: 'blur' },
						{ min:2,max:60, message: '网站账号长度 2到 60个字符', trigger: 'blur' }
					],
					Press:[
						{ required: true, message: '请输入出版社名称', trigger: 'blur' },
						{ min:2,max:40, message: '出版社名称长度 2到 40个字符', trigger: 'blur' }
					],
					isbn:[
						{ required: true, message: '请输入期刊号/书号ISBN', trigger: 'blur' },
						{ min:1,max:20, message: '期刊号/书号ISBN长度 1到 20个字符', trigger: 'blur' }
					],
					creationAddress:[
						{ required: true, validator:checkCreationAddress, trigger: 'blur' }
					],
					creationTime:[
						{ type: 'date', required: true, message: '请选择首次发表时间', trigger: 'change' }
					]
				},
				worksInfo:{},//作品信息
				allData:{},
				fileSize:'',
				clickDouble: true
			}
		},
		components: {
			sebeHeader,
			uploader,
			nuploader,
			miniLogin,
			sebeFooter,
			selfValidation,
			applySubject,
			applySubjectQy
		},
		mounted () {
			var self = this;
			EventBus.$on('needLogin', () => {
				this.needLogin();
			});
			if(this.$route.query.state){
				this.czType=this.$route.query.state;
			}
			self.pageClick();
			var userName = this.$cookie.get('truename');
			var phone = this.$cookie.get('phone');
			if (phone) {
				phone = phone.slice(0, 3) + '****' + phone.slice(-4);
			}
			this.userName = userName ? userName : phone;
			this.cartNum = this.$cookie.get('cart_num') || '0';
			this.getCzNum();
			setTimeout(function(){
				FauxPlaceholder();
			},300);
			this.getTime();
		},
		watch:{
		},
		methods: {
			resetUploader(valueName){
				this[valueName] = '';
				this[valueName+'_name'] = '';
			},
			payCzb(){
				this.czbHref=false;
				this.clickDouble=true;
				window.open(indexUrl+'/store/1180036088.htm?pageIndex=1&classId=33');
			},
			// changeInfo(){//针对下拉框选中后增加的输入框做ie9兼容
			//   if(!ElementSupportAttribute('input','placeholder')){
			//     setTimeout(function(){
			//       FauxPlaceholder();
			//     },300);
			//   }
			// },
			getTime(){
				var self = this;
				var xhr = new XMLHttpRequest();
				if( !xhr ){
					 xhr = new ActiveXObject("Microsoft.XMLHTTP");
				}
				xhr.open("HEAD",this.czUrl+'/cunnar/querycznum.do?t='+Math.random(),true);
				xhr.onreadystatechange=function(){
					if( xhr.readyState == 4 && xhr.status == 200 ){
						self.fwqTime=xhr.getResponseHeader("Date");
					}
				}
				xhr.send(null);
			},
			close(){
				this.getCzNum();
				this.sfvisible=false;
				this.stateSteps = false
			},
			initialize(){//认证成功，信息初始化
				this.clickDouble=true;
				this.selfValidateVisible=false;
				this.czProcess=1;//首先返回主体页面
				// 信息初始化
				this.works.productionSign='';
				this.works.productionSign02='';
				this.works.unitName='';
				this.works.unitPhone='';
				this.works.unitName02='';
				this.works.unitPhone02='';

				this.works.cooperationName='';
				this.works.cooperationPhone='';
				this.works.cooperationName02='';
				this.works.cooperationPhone02='';

				this.works.entrustName='';
				this.works.entrustPhone='';
				this.works.entrustName02='';
				this.works.entrustPhone02='';

				this.works.depositaryInfo='';
				this.works.depositaryPhone='';
				this.works.depositaryInfo02='';
				this.works.depositaryPhone02='';
				// form表单重置
				this.$refs['works'].resetFields();
				this.$refs['creation'].resetFields();
				// 文件重置
				this.standby1 = '';
				this.standby2 = '';
				this.standby3 = '';
				this.standby1_name = '';
				this.standby2_name = '';
				this.standby3_name = '';
				this.goHome();
				this.getCzNum();
			},
			setUploadedData(data){
				if(data.data.code=='3010019'){
					this.$message.error('文件名称长度不能超过30个字符');
					this.resetUploader();
					return;
				}
				if (data.data.code=='4010008') {
					EventBus.$emit('needLogin');
					this.resetUploader();
					return;
				}
				this[data.valueName]= data.data.url
				this[data.valueName+'_name']= data.data.fileName;
				if(this.standby3){
					this.fileSize=data.data.fileSize;
				}
			},
			veiwAgree(){//权利具结声明
				var self = this;
				this.$refs['creation'].validate((valid) => {
					if (valid) {
						self.agreeVisible=true;
					}
				})

			},
			goShop(){//立即下单
				var self = this;
				this.$refs['creation'].validate((valid) => {
					if (valid) {
						if(!this.checked){
							self.clickDouble=true;
							this.$message.warning('请仔细阅读声明，并确认');
							return;
						}
						if(self.works.unitName&&self.works.typeWork==1){
							var unitData=[];//单位
							unitData[0]={
								name:self.works.unitName,
								contact:self.works.unitPhone
							}
							if(self.works.unitName02){
								unitData[1]={
									name:self.works.unitName02,
									contact:self.works.unitPhone02
								}
							}
						}
						if(self.works.cooperationName&&self.works.typeWork==2){
							var cooperationData=[];//合作
							cooperationData[0]={
								name:self.works.cooperationName,
								contact:self.works.cooperationPhone
							}
							if(self.works.cooperationName02){
								cooperationData[1]={
									name:self.works.cooperationName02,
									contact:self.works.cooperationPhone02
								}
							}
						}
						if(self.works.entrustName&&self.works.typeWork==3){
							var entrustData=[];//委托
							entrustData[0]={
								name:self.works.entrustName,
								contact:self.works.entrustPhone
							}
							if(self.works.entrustName02){
								entrustData[1]={
									name:self.works.entrustName02,
									contact:self.works.entrustPhone02
								}
							}
						}
						if(self.works.depositaryInfo&&self.works.typeWork==3){
							var depositaryData=[];//受托
							depositaryData[0]={
								name:self.works.depositaryInfo,
								contact:self.works.depositaryInfoPhone
							}
							if(self.works.edepositaryInfo02){
								depositaryData[1]={
									name:self.works.edepositaryInfo02,
									contact:self.works.edepositaryInfoPhone02
								}
							}
						}
						if(self.works.standby1){
							var createAgreement = [
								{
									fileName:self.works.standby1_name,//创作协议
									file:self.works.standby1
								}
							]
						}
						if(self.works.standby1){
							var createAgreement = [
								{
									fileName:self.works.standby1_name,//创作协议
									file:self.works.standby1
								}
							]
						}
						if(self.works.standby2){
							var ownershipAgreement = [
								{
									fileName:self.works.standby2_name,//创作协议
									file:self.works.standby2
								}
							]
						}
						var data = {
							orderApplySubjectId:self.orderApplySubjectId,
							payType:2,
							czChannel:"6",//6 渠道公证区块链存证   4公证区块链存证
							notarizationPurpose:self.works.notarizationPurpose,
							source:1,//需要从路由获取
							notarizationType:2,
							notarizationRefList:[{
								url:self.works.standby3,//文件路径
								fileName:self.works.standby3_name,//文件名称
								createAgreementList:createAgreement?createAgreement:null,//文件名称
								ownershipAgreementList:ownershipAgreement?ownershipAgreement:null,//归属协议,
								productionName:self.works.productionName,//作品名称
								notarizationPurpose:self.works.typeWork,//作品类型

								productionLeixin:self.works.typeWork,//作品类型

								productionSign:this.works.productionSign02?this.works.productionSign+','+this.works.productionSign02:this.works.productionSign,//作品署名
								obtain:1,
								depositaryInfoList:depositaryData?depositaryData:null,
								unitInfoList:unitData?unitData:null,//单位信息
								copartnerInfoList:cooperationData?cooperationData:null,//合作
								depositaryInfoList:entrustData?entrustData:null,//委托
								publishTime:new Date(self.creation.creationTime).getTime(),//发表时间
								productionTime:new Date(self.creation.productionTime).getTime(),//创作时间
								updateCishu:self.creation.updateCishu,//修改次数
								publishState:self.creation.published,//发表状态
								publicWebSite:self.creation.web,//发表网站
								publicAccount:self.creation.account,//网站账号
								pressName:self.creation.Press,//出版社名称
								pressNo:self.creation.isbn,//期刊号
								publicSite:self.creation.creationAddress,//发表地址
								fileSize:self.fileSize
							}]
						}
						self.worksInfo = data;
						self.allData = self.worksInfo;
						// this.bankPhone = this.$cookie.get('phone');
						// self.selfValidateVisible=true;
						self.selfValidationSubmit()
					} else {
						self.clickDouble=true;
						this.$message.warning('请先填写作品信息');
						return false;
					}
				})
			},
			selfValidationSubmit(){
				var self = this;
				if(this.clickDouble){
					self.submit();
				}
			},
			submit(){//请求存证
				var self = this;
				self.loadingSf=true;
				var postData=$.extend(this.allData,{mobCode:''});
				self.$http.post('./EvidenceController/addAttestations.do', postData)
				.then((resp) => {
					self.loadingSf=false;
					self.clickDouble=true;
					if(resp.data.code === '0'){
						self.stateSteps = true;
					}else if(resp.data.code === '2010010'){
						self.$message.error('验证码错误');
					}else if(resp.data.code === '3010019'){
						self.$message.error('验证码错误');
					}else if(resp.data.code === '4010023'){
						self.selfClick();
						self.$message.error('剩余存证次数不足');
					}else if(resp.data.code === '4010020'){
						self.selfClick();
						self.$message.error(resp.data.desc);
					}else if(resp.data.code === '4010008'){
						// 未登录全局统一处理了
					}else{
						self.selfClick();
						self.$alert('订单生成失败，请重试');
					}
				})
				.catch((error) => {
					this.clickDouble=true;
					this.loadingSf=false;
					// this.selfValidate();
					self.$alert('订单生成失败，请重试');
				})

			},
			goHome(){//返回选择存证类型
				// 填写内容初始化
				this.standby1 = '';
				this.standby2 = '';
				this.standby3 = '';
				this.standby1_name = '';
				this.standby2_name = '';
				this.standby3_name = '';
				this.txtType='';
				this.works.notarizationPurpose='';
				this.creation.productionTime='';
				this.works.typeWork='';
				this.$router.push({path: '/', query:{'page':1,'state':this.czType}});
			},
			pageClick(){//当前页面
				if(this.$route.query.page&&this.$route.query.page != 1){
					this.pageIndex = false;
					if(this.$route.query.state){
						this.txtType=1;
					}else{
						this.txtType=2;
					}
				}else{
					this.pageIndex = true;
					this.txtType='';
				}
				this.czProcess=1;
				this.czType = this.$route.query.state;
			},
			needLogin() {
				this.$message.warning('未登录或登录已失效，请登录');
				this.showMini = true;
			},
			getApplySubjectId(data){
				this.apply_name = data.apply_name,
				this.apply_number = data.apply_number
				this.orderApplySubjectId = data.orderApplySubjectId;
				this.applyType = data.apply_type;
				this.czProcess = 2;
				if(!ElementSupportAttribute('input','placeholder')){
					FauxPlaceholder();
				}
			},
			selfClick(){//存证成功后页面初始化
				this.selfValidateVisible=false;
				this.clickDouble=true;
				this.getCzNum();
			},
			czbClick(){//存证包数量不足初始化
				this.clickDouble=true;
				this.czbHref=false;
			},
			selfVisible(){
				this.clickDouble=true;
				this.getCzNum();
				this.selfValidateVisible=false;
			},
			czbNumber(num){
				var self = this;
				if(self.clickDouble){
					self.clickDouble=false;
				}else{
					return;
				}
				this.$http.get(queryCzUrl + '?t=' + Math.random())
				.then((resp) => {
					self.clickDouble=true;
					resp = resp.data;
					if(resp.code === '0'){
						self.czbNum = resp.data;
						if(resp.data){
							if(num==1){
								self.nextClick();
							}else{
								self.goShop();
							}
						}else{
							self.czbHref=true;
						}
					}
				}).catch((error) => {
					self.clickDouble=true;
				});
			},
			nextClick(){
				// 公正存证
				var self = this;
				if(this.czType){//区块链
					self.$refs['works'].validate((valid) => {
						if (valid) {
							self.czProcess = 3;
						} else {//司法
							self.clickDouble=true;
							this.$message.warning('请先填写作品信息');
							return false;
						}
					})
				}else{//司法
					self.$refs['works'].validate((valid) => {
						if (valid) {
							self.loadingSf=true;
							self.allData={
								orderApplySubjectId:self.orderApplySubjectId,
								payType:2,
								czChannel:"5",
								notarizationPurpose:self.works.notarizationPurpose,
								source:1,//需要从路由获取
								notarizationType:2,
								notarizationRefList:[{
									url:self.works.standby3,//文件路径
									fileName:self.works.standby3_name,//文件名称
									obtain:1,
									fileSize:self.fileSize
								}]
							}
							self.$http.post('./EvidenceController/addAttestations.do', self.allData)
							.then((resp) => {
								self.loadingSf=false;
								if(resp.data.code === '0'){
									self.sfvisible=true;
								}else if(resp.data.code === '4010023'){
									self.selfClick();
									self.czProcess=1;//首先返回主体页面
									self.$message.error('剩余存证次数不足');
								}else if(resp.data.code === '4010020'){
									self.selfClick();
									self.czProcess=1;
									self.$message.error(resp.data.desc);
								}else{
									self.selfClick();
									self.czProcess=1;
									self.$alert('订单生成失败，请重试');
								}
								})
								.catch((error) => {
									self.$alert('订单生成失败，请重试');
									self.loadingSf=false;
									this.selfClick();
									self.czProcess=1;
								})
						} else {//司法
							self.clickDouble=true;
							self.loadingSf=false;
							this.$message.warning('请先填写作品信息');
							return false;
						}
					})
				}
			},
			resetAll(){
				this.clickDouble=true;
				this.sfvisible=false;
				this.stateSteps = false
				this.goHome();
				this.getCzNum();
				this.czProcess=1;
			},
			czstate(type){
				if(type==1){
					this.$router.push({path: '/', query:{'page':2,'state':true}});
				}else if(type==2){
					this.$router.push({path: '/', query:{'page':2,'state':''}});
				}
			},
			// 获取存证包数量
			getCzNum(){
				var self = this;
				this.$http.get(queryCzUrl + '?t=' + Math.random())
				.then((resp) => {
					resp = resp.data;
					console.log(resp)
					if(resp.code === '0'){
						self.czbNum = resp.data;
					}
				}).catch((error) => {
				});
			},
			// 登陆后跳转判断
			callbackDo (){
				this.showMini = false;
				var userName = this.$cookie.get('truename');
				var phone = this.$cookie.get('phone');
				this.needRender=true;
				this.bankPhone = phone;
				if (phone) {
					phone = phone.slice(0, 3) + '****' + phone.slice(-4);
				}
				this.userName = userName ? userName : phone;
				this.cartNum = this.$cookie.get('cart_num') || '0';
				this.getCzNum();
			}
		},
		filters: {
			dateFilter(v){
				var t = v;
				if (typeof v === 'string') {
					t = new Date(v).getTime();
				}
				//日期格式转换
				var dateFormat = function (input,type) {
					if(input == null || input=='' || typeof(input) == "undefined"){
							return "--";
					}
					var _date = new Date(input);
					var year = _date.getFullYear();
					var month = _date.getMonth() + 1 > 9 ? _date.getMonth() + 1 : "0" + (_date.getMonth() + 1);
					var day = _date.getDate() > 9 ? _date.getDate() : "0" + _date.getDate();
					var hour = _date.getHours() > 9 ? _date.getHours() : "0" + _date.getHours();
					var minutes = _date.getMinutes() > 9 ? _date.getMinutes() : "0" + _date.getMinutes();
					var seconds = _date.getSeconds() > 9 ? _date.getSeconds() : "0" + _date.getSeconds();
					if(type == "date"){
							return year + "年" + month + "月" + day+ "日";
					} else if(type == "time") {
							return hour + ":" + minutes + ":" + seconds;
					} else {
							return year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
					}
					return "--";
				}
				return dateFormat(t, "date");
			},
			Purpose(input){
				var ret = ''
				switch (input+''){
					case '4':
						ret = "文字作品";
						break;
					case '6':
						ret = "音乐作品";
						break;
					case '5':
						ret = "美术作品";
						break;
					case '8':
						ret = "其他";
						break;
				}
				return ret;
			},
			publishe(input){
				var ret = ''
				switch (input+''){
					case '0':
						ret = "创作完成，未上线";
						break;
					case '3':
						ret = "已上线";
						break;
				}
				return ret;
			}
		},
		watch: {
			'$route':'pageClick',
			standby1(){
				var self = this;
				self.works.standby1 = self.standby1;
				self.works.standby1_name = self.standby1_name;
			},
			standby2(){
				var self = this;
				self.works.standby2 = self.standby2;
				self.works.standby2_name = self.standby2_name;
			},
			standby3(){
				var self = this;
				self.works.standby3 = self.standby3;
				self.works.standby3_name = self.standby3_name;
			}
		}
	}
</script>


<style lang="scss">
.app{background-color:#f2f2f2;
	.Introduction{margin-left: 130px;font-size:14px;color:#999;line-height:100%;margin-top: -15px;}
	.mt70{margin-top: 70px;}
	.works_btn  >button{width:140px;height:42px;background-color:#3db1fa;color:#FFF;font-size:14px;text-align:center;border-radius:3px;}
.web-container{width:100%;overflow: hidden;background-color: #f2f2f2;
	.top-banner{
		height: 180px;background: #FFF url(~assets/img/literature/literature_bg.jpg) center 0 no-repeat
	}
}

.top{width:1170px;margin:20px auto 0;position: relative;
	>p{position: absolute;left:0;top:8px;background:url(~assets/img/literature/Group.png) no-repeat;width:255px;height:38px;font-size: 13px;color: #FFFFFF;line-height:33px;padding-left:14px;}
	div{background-color:#fff;width:1164px;height:50px;padding-top:15px;padding-right: 60px;margin-left: 6px;
		p{font-size: 14px;color: #666666;line-height:20px;text-align:right;
			span{color:#3db1fa;}
			a{text-decoration:none;color:#3db1fa;}
		}
	}
}

.homepage{width:1170px;margin:0 auto;
	.category_list{background-color:#fff;padding:40px 60px 50px;
		.prompt{background: #FFF7E4;width:1050px;height:40px;font-size: 13px;color: #D8A045;text-align:center;line-height:40px; }
		.category:hover{border-color:#3db1fa}
		.category{width:515px;height:368px;border:1px solid #eee;text-align:center;padding-top:30px;cursor:pointer;
			.tit{font-size:20px;color:#000;font-weight: bolder;line-height:26px;}
			.name{font-size: 14px;color: #666666;line-height:20px;}
			.txt{width:350px;text-align:left;margin:10px auto 0;font-size: 13px;color:#999;height:90px;line-height:18px;}
			button {
		    width: 140px;
		    height: 42px;
		    background-color: #3db1fa;
		    color: #FFF;
		    font-size: 14px;
		    text-align: center;
		    border-radius: 3px;
			}
		}
	}
}

.process_list{width:1170px;margin:20px auto 0;background-color:#fff;padding:60px 90px 105px;position: relative;
	>i{position: absolute;height:2px;border-bottom:2px solid #3db1fa}
	.bdc01{width:330px;transition:all 0.5s ease;}
	.bdc02{width:660px;transition:all 0.5s ease;}
	.bdc03{width:990px;transition:all 0.5s ease;}
	.bdc1{width:495px;transition:all 0.5s ease;}
	.bdc2{width:990px;transition:all 0.5s ease;}
	.list_tab{font-size:0;
		p{border-bottom:1px solid #eee;width:330px;font-size: 16px;color: #999999;line-height:100%;padding-bottom:15px;text-align:center;}
	}
	.tab_list{font-size:0;
		p{border-bottom:1px solid #eee;width:495px;font-size: 16px;color: #999999;line-height:100%;padding-bottom:15px;text-align:center;}
	}
	.applicant{width:1005px;
		.btn_last{text-align:center;
			button{width:140px;height:42px;color:#3db1fa;font-size:14px;text-align:center;border-radius:3px;border:1px solid #3db1fa;}
		}
		>p{width:990px;height:40px;line-height:40px;background-color:#fff7e4;font-size: 13px;color: #D8A045;text-align:center;}
		.main_body{
			div{width:320px;height:90px;border:1px solid #cfecff;border-radius:2px;background:rgba(61,177,250,0.05) url(~assets/img/literature/hover.png) no-repeat;background-position:right bottom;padding-left:20px;cursor:pointer;
				.tit{width:80px;height:24px;line-height:24px;color:#fff;font-size: 12px;border-radius:0 0 6px 6px;text-align:center;margin-right:6px;}
				.name{font-size: 16px;color: #333333;line-height:24px;width:220px;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}
				.type{font-size: 14px;color: #666666;line-height:19px;}
			}
			.add_apply{width:320px;height:90px;border:1px solid #ddd;border-radius:2px;background:rgba(221,221,221,0.05) url(~assets/img/literature/hovernull.png) no-repeat;background-position:right bottom;padding-left:0px;
				p{font-size: 14px;color: #666666;line-height:90px;text-align:center;
					i{}
				}
			}
			div:hover{border-color:#3db1fa;}
			.add_apply:hover{border-color:#3db1fa;
				p{color:#3db1fa;}
			}
		}
	}
}
.el-input__inner{line-height:34px;height: 34px;}
.works_data,.creation_data{margin-top: 60px;
	.el-date-editor.el-input{width:360px;}
	.el-form-item__label{color:#666;}
	.el-form-item__content{line-height:34px;
		.el-textarea{width:360px;}
		.addInput .el-input__inner{border-top-right-radius: 0;border-bottom-right-radius: 0;line-height: 34px;}
		.productInput .el-input__inner{border-top-right-radius: 0;border-bottom-right-radius: 0;height:35px;line-height: 34px;}
		.el-input-group__append{cursor:pointer;}
		.el-input{width:360px;
			.input{line-height: 34px;height:34px;width:360px;border-radius:3px;}
		}
	}
	.el-select .el-input__inner{line-height:34px;}
	.works_btn{font-size:0;padding-left: 130px;
		p{font-size: 14px;color: #666666;line-height:100%;margin-left: -90px;border-top:1px solid #eee;padding-top:20px;
			.txt{width:90px;display:inline-block;text-align:right;padding-right: 12px;}
			.num{font-size: 18px;color: #F64744;}
		}
		.last{background-color:#fff;color:#3db1fa;border:1px solid #3db1fa;}
	}
	.statement{padding-left: 130px;border-bottom:1px solid #eee;padding-bottom:20px;
		>span{font-size: 12px;color: #666666;width:616px;display:inline-block;vertical-align: top;line-height:14px;}
		a{text-decoration:none;color: #666666;cursor: pointer;}
		a:hover{color:#3db1fa;}
	}
	.statement_btn{padding-left: 130px;
		p{font-size: 14px;color: #666666;line-height:100%;margin-left: -90px;
			span{font-size: 18px;color: #F64744;}
		}
		.last{background-color:#fff;color:#3db1fa;border:1px solid #3db1fa;}
		.next{color:#fff;background-color:#3db1fa;}
		button{width:140px;height:42px;font-size:14px;text-align:center;border-radius:3px;}
	}
	.file_up{
		p{width:110px;font-size: 14px;color: #666666;padding-right: 12px;}
		.right_txt{padding-top:4px;vertical-align: bottom;
			p{width:730px;text-align:left;font-size: 12px;color: #999999;line-height: 22px;}
		}
	}
}
.judicial_list{width:1170px;margin:20px auto 0;background-color:#fff;padding:60px 90px 105px;}
.wid990{width:990px;}
}
</style>
<style lang="scss">
.dialog-payTip{
	width:440px;
	.el-dialog__body{padding-top: 20px;}
	.payTipCon{
		.payTipText{line-height: 27px;padding:0 40px 20px;}
		.actionBtn{
			text-align: center;
			a{height: 42px;line-height: 42px;background-color: #3db1fa;color: #fff;display:inline-block;border-radius:3px;width:142px;text-align: center;cursor: pointer;margin:0 15px;}
			a:hover{text-decoration: none;background-color: #369FE0;}
			.otherpay{background-color: transparent;border:1px solid #3db1fa;color: #3db1fa;}
			.otherpay:hover{background-color: #fafafa;}
		}
	}
}
.dialog-agree{
	width:700px;
	.el-dialog__header{text-align: center;}
	.el-dialog__body{border-top: 1px solid #eee;padding-top: 0;margin-top:20px;}
	.payTipCon{
		line-height: 21px;padding:20px;
		h3{font-weight:normal;font-size:14px;}
		p.c_txt{text-indent: 28px;padding:7px 0;}
		.sign{text-align: right;}
	}
}
.el-input{position: relative;
	.placeholder{position: absolute;top:0px;left:10px;color:#999;line-height:36px;}
}
.el-input-group__append{position: relative;
	span{display:block;width:35px;height:35px;position:absolute;top:0;left:0;}
}
.el-select-dropdown{/* min-width:360px !important; */}
.czb{
	.el-dialog--tiny{width:400px;}
	.czb_info{text-align:center;
		p{font-size:14px;}
		a{width:160px;height:42px;display:inline-block;background-color:#3db1fa;color:#fff;border-radius: 3px;font-size: 14px;text-align:center;line-height:42px;text-decoration:none;cursor:pointer;}
	}
	.el-dialog__title{font-size:14px;}
}
.shumin{
	.el-form-item__content{
		height: auto;display:block;
		.el-input-group{vertical-align: top;}
	}
}
//.ie9 .el-dialog{-ms-transform: translateX(0%) !important;transform: translateX(0%);margin-left: -280px;}
.el-message{z-index: 3001!important;}
</style>

