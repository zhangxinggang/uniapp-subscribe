<template>
	<view>
		<cu-custom bgColor="bg-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">发布列表</block>
		</cu-custom>
		<view>
			<view class="cu-card case">
				<view class="cu-item shadow" v-for="(item,index) in scenics" :key="index">
					<view class="image">
						<view class="scenicinfoName">
							{{item['ScenicinfoName']}}
						</view>
						<view>
							<image :src="serverURI+item['ScenicinfoImg']" mode="widthFix" style="max-height:500upx;"></image>
							<view class="cu-tag bg-blue">推荐</view>
							<view class="cu-bar bg-shadeBottom">
								<text class="text-cut">{{item['ScenicinfoDesc']}}</text>
							</view>
						</view>
					</view>
					<view class="cu-list menu-avatar">
						<view class="cu-item">
							<view class="cu-avatar round lg" :style="'background-image:url('+(item['headimgurl'] || (serverURI+item['ScenicinfoImg']))+')'"></view>
							<view class="content flex-sub">
								<view class="text-grey">{{item['nickname']}}</view>
								<view class="text-gray text-sm flex justify-between">
									{{item['CreateTime']}}
									<button class="cu-btn bg-green shadow-blur" @click="delSubscribe(item)">删除</button>
									<button class="cu-btn bg-green shadow-blur" @click="generaterQrcode(item)">二维码</button>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="cu-modal" :class="modalName=='Image'?'show':''">
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
		components:{
			tkiQrcode
		},
		data() {
			return {
				modalName:null,
				serverURI:uni.$serverURI,
				qrCodeObj:{
					qrCodeVal:''
				},
				scenicsTotal:0,
				scenics:[],
				rows:10,
				page:1
			};
		},
		onLoad:function(){
			this.loadScenics();
		},
		onReachBottom:function(){
			if(this.page*this.rows<this.scenicsTotal){
				this.page++;
				this.loadScenics();
			}
		},
		methods: {
			hideModal(){
				this.$refs.qrcode._clearCode();
				this.modalName=null;
			},
			delSubscribe:function(item){
				uni.showModal({
				    title: '提示',
				    content: '你确定要删除此发布吗？',
				    success: (res)=> {
				        if (res.confirm) {
							uni.decorateRequest({
								url:'delSubscribe',
								method:'post',
								data:{
									ScenicinfoID:[item['ScenicinfoID']]
								},
								success:(data)=>{
									this.scenics.splice(this.scenics.indexOf(item),1)
								}
							})
				        }
				    }
				});
			},
			loadScenics:function(){
				uni.decorateRequest({
					url:'loadScenics',
					data:{
						rows:this.rows,
						page:this.page,
						UserOID:getApp().globalData.userInfo.UserOID
					},
					success:(data)=>{
						this.scenicsTotal=data['total'];
						this.scenics=this.scenics.concat(data['rows']);
					}
				})
			},
			generaterQrcode:function(item){
				let uri=uni.$serverURI+'/subscribe#/pages/mySubscribe/addSubscribe?ScenicinfoID='+item["ScenicinfoID"]+'&EnterType=nohistory'
				this.qrCodeObj.qrCodeVal=uri;
				setTimeout(()=>{
					this.$refs.qrcode._makeCode();
					this.modalName='Image'
				},500)
			}
		}
	}
</script>

<style>
	.tki-qrcode{
		width:100%;
		text-align: center;
	}
	.image{
		position:relative;
	}
	.scenicinfoName{
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 50upx;
		color: #37354d;
		margin-top:-20upx
	}
</style>