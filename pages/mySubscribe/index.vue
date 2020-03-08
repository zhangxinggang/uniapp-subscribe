<template>
	<view style="height:100%;position:relative;">
		<view class="scrollPage">
			<scroll-view :scroll-y="modalName==null" class="page" :class="modalName!=null?'show':''">
				<cu-custom bgColor="bg-blue" :isBack="true">
					<block slot="backText" @click="judegeBack">返回</block>
					<block slot="content">我的预约</block>
				</cu-custom>
				<view class="cu-bar bg-white solid-bottom margin-top">
					<view class="action">
						<text class="cuIcon-title text-orange "></text> 左滑删除
					</view>
				</view>
				<view class="cu-list menu-avatar">
					<view v-for="(item,index) in myReserverRecords" class="cu-item" :class="modalName=='move-box-'+ index?'move-cur':''" :key="index"
					 @touchstart="ListTouchStart" @touchmove="ListTouchMove" @touchend="ListTouchEnd" :data-target="'move-box-' + index" @click="showTkiQrcode(item)">
						<view class="cu-avatar round lg" :style="[{backgroundImage:'url('+ item.ScenicinfoImg +')'}]"></view>
						<view class="content">
							<view class="text-grey">{{item.ScenicinfoName}}</view>
							<view class="text-gray text-sm" style="width:90%;">
								<text class="cuIcon-infofill text-red  margin-right-xs"></text>
								{{item.ScenicinfoDesc.length>25?item.ScenicinfoDesc.substring(0,25):item.ScenicinfoDesc}}
							</view>
						</view>
						<view class="action" style="width:150upx;">
							<view class="text-grey text-xs">{{item.ReserveDayTime}}</view>
							<!-- <view class="cu-tag round bg-grey sm">5</view> -->
						</view>
						<view class="move">
							<view class="bg-red" @click.stop="delMyRecord(item)">删除</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="cu-modal" :class="qrCodeModal=='Image'?'show':''">
			<view class="cu-dialog">
				<view style="margin-top:50upx">
					<tki-qrcode
						cid="qrcode"
						ref="qrcode"
						:val="qrCodeObj.qrCodeVal"
						:size="500"
						unit="upx"
						background="#b4e9e2"
						foreground="#309286"
						pdground="#32dbc6"
						:showLoading='true'
						:iconSize="100"
						:onval="true"
						:loadMake="false"
						:usingComponents="true"
					/>
				</view>
				<view class="cu-bar bg-white">
					<button form-type="submit" type="primary" @tap="hideModal" style="margin:20upx auto">关闭</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue'
	export default {
		onLoad:function(options){
			this.enterType=options.EnterType;
			this.loadMyReserverRecords();
		},
		onPullDownRefresh:function(){
			this.loadMyReserverRecords(()=>{
				uni.stopPullDownRefresh();
			})
		},
		components: {
			tkiQrcode
		},
		data() {
			return {
				qrCodeModal:null,
				qrCodeObj:{
					qrCodeVal:''
				},
				myReserverRecords:[],
				modalName: null,
				listTouchStart: 0,
				listTouchDirection: null,
			};
		},
		methods: {
			loadMyReserverRecords(cb){
				uni.decorateRequest({
					url:'myReserverRecords',
					data:{
						where:{
							UserOID:getApp().globalData.userInfo.UserOID
						}
					},
					success:(data)=>{
						this.myReserverRecords=data;
						if(cb){
							cb()
						}
					}
				})
			},
			hideModal(){
				this.$refs.qrcode._clearCode();
				this.qrCodeModal=null;
			},
			judegeBack(){
				if(this.enterType=='nohistory'){
					uni.redirectTo({
						url:'../mine/index'
					})
				}
			},
			showTkiQrcode(item){
				this.qrCodeObj.qrCodeVal='景区：'+item['ScenicinfoName']+
				'\n时间：'+item['ReserveDayTime']+' '+item['ReserveHourTime']+
				'\n是否有新冠病症状：'+(item['IsHaveSick']=='0'?'否':'是')+
				'\n有接触新冠病患者：'+(item['ContactSickLives']=='0'?'否':'是');
				setTimeout(()=>{
					this.$refs.qrcode._makeCode();
					this.qrCodeModal='Image'
				},500)
			},
			delMyRecord(item){
				uni.showModal({
				    title: '提示',
				    content: '你确定要删除此条记录吗？',
				    success: (res)=> {
				        if (res.confirm) {
							uni.decorateRequest({
								url:'delMyReserverRecord',
								method:'post',
								data:{
									ReserverecordID:[item['ReserverecordID']]
								},
								success:(data)=>{
									this.myReserverRecords.splice(this.myReserverRecords.indexOf(item),1)
								}
							})
				        }
				    }
				});
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
			}
		}
	}
</script>

<style>
	.scrollPage{
		z-index:1;
	}
	.page {
		height: 100vh;
		width: 100vw;
	}
	uni-page-body{
		height:100%;
	}
	.tki-qrcode{
		height:100%;
	}
	canvas[canvas-id=qrcode]{
		margin: auto;
	}
</style>
