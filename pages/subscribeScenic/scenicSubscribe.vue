<template>
	<view>
		<cu-custom bgColor="bg-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">景点发布</block>
		</cu-custom>
		<form @submit="saveData">
			<view class="cu-form-group margin-top">
				<view class="title">*你的姓名：</view>
				<input placeholder="请输入" name="RealName"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">*手机号码</view>
				<input placeholder="请输入" name="MobilePhone"></input>
				<view class="cu-capsule radius">
					<view class='cu-tag bg-blue '>
						+86
					</view>
					<view class="cu-tag line-blue">
						中国大陆
					</view>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">*身份证号码</view>
				<input placeholder="请输入" name="IdCardNum"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">*景点名称</view>
				<input maxlength="" placeholder="最大可输入20字符" name="ScenicinfoName"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">*景点描述</view>
				<input placeholder="请输入" name="ScenicinfoDesc"></input>
			</view>
			
			<view class="cu-bar bg-white margin-top">
				<view class="action">
					景点代表图片
				</view>
				<view class="action">
					{{imgList.length}}/1
				</view>
			</view>
			<view class="cu-form-group">
				<view class="grid col-4 grid-square flex-sub">
					<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
					 <image :src="imgList[index]" mode="aspectFill"></image>
						<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
							<text class='cuIcon-close'></text>
						</view>
					</view>
					<view class="solids" @tap="ChooseImage" v-if="imgList.length<1">
						<text class='cuIcon-cameraadd'></text>
					</view>
				</view>
			</view>
			<view class="cu-form-group timeChoosePanel">
				<view class="title">时间选择(左滑删除)</view>
				<view style="width:100%;">
					<view class='timeChooseItem'>
						<text>
							开始时间
						</text>
						<text>
							结束时间
						</text>
						<text>
							接纳人数
						</text>
					</view>
					<view class="cu-list menu-avatar">
						<view v-for="(item,index) in reservePeriod" class="cu-item" :class="[modalName=='move-box-'+ index?'move-cur':'']" :key="index"
						 @touchstart="ListTouchStart" @touchmove="ListTouchMove" @touchend="ListTouchEnd" :data-target="'move-box-' + index">
							<view class="content timeChooseItem" style="width: 100%;left: 0;">
								<view>
									<picker mode="time" :value="item['ScenicinfotimeStart']" @change="timeChange($event,item,'start')">
										<view class="picker">
											{{item['ScenicinfotimeStart']}}
										</view>
									</picker>
								</view>
								<view>
									<picker mode="time" :value="item['ScenicinfotimeEnd']" @change="timeChange($event,item,'end')">
										<view class="picker">
											{{item['ScenicinfotimeEnd']}}
										</view>
									</picker>
								</view>
								<view>
									<view class="cu-form-group oneTime">
										<input placeholder="请输入" type="number" :value="item['PermitPeopleNum']" @input="changePeopleNum($event,item)" ></input>
									</view>
								</view>
							</view>
							<view class="move">
								<view class="bg-red" @click="delTimePeroid(index)">删除</view>
							</view>
						</view>
					</view>
					<button class="cu-btn bg-green shadow addTimePeroid" @click="addTimePeroid">新增时间段</button>
				</view>
			</view>
			<view class="uni-btn-v submitInfoBtn">
				<button form-type="submit" type="primary">发布</button>
			</view>
		</form>
	</view>
</template>

<script>
	let origiPeriod={
		ScenicinfotimeStart:'08:00',
		ScenicinfotimeEnd:'18:00',
		PermitPeopleNum:100
	};
	export default {
		data() {
			return {
				modalName: null,
				listTouchStart: 0,
				listTouchDirection: null,
				imgList: [],
				reservePeriod:[]
			};
		},
		onLoad:function(){
			this.reservePeriod.push(JSON.parse(JSON.stringify(origiPeriod)))
		},
		methods: {
			changePeopleNum(e,item){
				setTimeout(()=>{item['PermitPeopleNum']=e.detail.value;},0)
			},
			ListTouchStart(e) {
				this.listTouchStart = e.touches[0].pageX
			},
			// ListTouch计算方向
			ListTouchMove(e) {
				this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
			},
			// ListTouch计算滚动
			ListTouchEnd(e) {
				if (this.listTouchDirection == 'left') {
					this.modalName = e.currentTarget.dataset.target
				} else {
					this.modalName = null
				}
				this.listTouchDirection = null
			},
			ChooseImage() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						var tempFiles=res['tempFiles'];
						tempFiles.map((item)=>{
							if(item.size/1024/2024>2){
								uni.showModal({
									title: '提示',
									content: '所选图片不得大于2M？'
								})
							}else{
								this.imgList.push(item.path)
							}
						})
					}
				});
			},
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			DelImg(e) {
				uni.showModal({
					title: '提示',
					content: '确定要删除这张照片吗？',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			},
			addTimePeroid(){
				this.reservePeriod.push(JSON.parse(JSON.stringify(origiPeriod)))
			},
			delTimePeroid(index){
				if(this.reservePeriod.length==1){
					uni.showModal({
						title:'提示',
						content:'至少存在一个时间段！'
					})
				}else{
					this.reservePeriod.splice(index,1)
				}
			},
			checkVal(value){
				if(!value['RealName']){
					uni.showToast({
						mask:true,
						icon:"none",
						title:'请输入姓名！'
					})
					return false;
				}
				if(this.imgList.length==0){
					uni.showToast({
						mask:true,
						icon:"none",
						title:'请选择图片！'
					})
					return false;
				}
				var tempReservePeriod=this['reservePeriod'].filter((item)=>{
					if(item['PermitPeopleNum'] && item['PermitPeopleNum']>0){
						return true;
					}
				});
				if(tempReservePeriod.length==0){
					uni.showToast({
						mask:true,
						icon:"none",
						title:'请输入接纳人数！'
					})
					return false;
				}
				if(!(/^1[3456789]\d{9}$/.test(value['MobilePhone']))){
					uni.showToast({
						mask:true,
						icon:"none",
						title:'手机号码输入有误！'
					})
					return;
				}
				if(!(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/).test(value['IdCardNum'])){
					uni.showToast({
						mask:true,
						icon:"none",
						title:'身份证输入有误！'
					})
					return;
				}
				value['reservePeriod']=this.reservePeriod;
				value['UserOID']=getApp().globalData.userInfo.UserOID;
				for(var key in value){
					if(typeof(value[key])=='string'){
						value[key]=value[key].replace(/\s+/g,'');
					}
				}
				return true;
			},
			uploadFile(cb){
				let filePath=this.imgList[0];
				uni.uploadFile({
					url:uni.$serverURI+'/system.files.upload',
					filePath:filePath,
					name:'scenicSubscribeImage',
					formData:{
						customPath:JSON.stringify({
							path:'../images/scenic',
							imgSrcLib:'NS'
						})
					},
					success: (res) => {
						let data=res.data;
						if(typeof(data)=='string'){
							data=JSON.parse(data);
						}
						if (res.statusCode == 200 && data['isSuccess']){
							cb(data.data[0])
						}else{
							uni.showToast({
								icon:'error',
								title:res.errMsg
							})
						}
					},
					fail(err){
						uni.showToast({
							icon:'error',
							title: "图片保存失败..."
						})
					}
				});
			},
			saveData(e){
				var value=e.detail.value;
				var pass=this.checkVal(value);
				if(pass){
					this.uploadFile((ScenicinfoImg)=>{
						value['ScenicinfoImg']=ScenicinfoImg;
						uni.decorateRequest({
							url:'saveScenicRecord',
							method:'post',
							data:value,
							success:function(data){
								uni.showModal({
									title:'提示',
									content:'添加成功！',
									success:function(){
										uni.switchTab({
											url:'../index/index'
										})
									}
								})
							},
							fail(error){
								uni.showToast({
									icon:'error',
									title:error.message
								})
							}
						})
					});
				}
			},
			timeChange(e,item,type){
				if(type=='start'){
					item['ScenicinfotimeStart']=e.detail.value;
				}else{
					item['ScenicinfotimeEnd']=e.detail.value;
				}
			}
		}
	}
</script>

<style>
	.timeChoosePanel{
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}
	.timeChooseItem{
		display: flex;
		justify-content: space-between;
	}
	.oneTime{
		width:110upx;
		margin:0;
		padding:0;
	}
	.addTimePeroid{
		margin:20upx;
		float:right
	}
	.yisiyesOrNosTitle{
		width:50%;
	}
	.yisiyesOrNos label{
		margin-left: 50upx;
	}
	.submitInfoBtn{
		margin-top:100upx
	}
	.remainderTicketGroup{
		align-items: flex-start;
	}
	.remainderTicketGroup,.remainderTicket{
		display: flex;
		flex-direction: column;
	}
</style>