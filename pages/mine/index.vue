<template>
	<view class="body">
		<view class="top" :style="'background-image:url('+backSrc+')'">
			<view class="img_box">
				<image class="top_img" :src="userInfo.headimgurl" v-if="userInfo.headimgurl"></image>
				<image class="top_img" src="../../static/image/avatar.png" v-else></image>
			</view>
			<view class="text_box">
				<text>{{userInfo.nickname}}</text>
			</view>
		</view>
		<view class="centent">
			<view class="item" v-for="(item,index) in ctentList" :key="index" @click="linkPage(item)">
				<view class="item_left">
					<image class="item_img" :src="item.img"></image>
					<text class="item_text">{{item.text}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				backSrc:"./static/image/bg/top_bg.jpg",
				userInfo:uni.getStorageSync("userInfo"),
				ctentList:[
					{img:"../../static/image/mine/writeScenic.png",text:"景点发布",url:"../subscribeScenic/scenicSubscribe"},
					{img:"../../static/image/mine/subscribe.png",text:"我的预约",url:"../mySubscribe/index"},
					{img:"../../static/image/mine/deploy.png",text:"我的发布",url:"../subscribeScenic/myScenicSubscribe"}
				]
			}
		},
		methods: {
			linkPage(item){
				uni.navigateTo({
					url:item.url
				})
			}
		}
	}
</script>

<style>
	page {
		width: 100%;
		height: 100%;
		background: #c3dffd;
		overflow: hidden;
	}
	
	view, text {
		box-sizing: border-box;
	}

	.body {
		width: 100%;
		height: 100%;
		overflow-y: scroll;
		padding-bottom: 20rpx;
		overflow-x: hidden;
	}

	.body::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}
	.top{
		width: 750rpx;
		height: 400rpx;
		/* background: linear-gradient(#3995ef, #8dc4fd); */
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-size: 100% 100%;
	}
	.img_box{
		width: 160rpx;
		height: 160rpx;
		background: #ffffff;
		overflow: hidden;
		border-radius: 80rpx;
	}
	.img_box image{
		width: 160rpx;
		height: 160rpx;
	}
	.text_box{
		font-size: 40rpx;
		line-height: 50rpx;
		margin-top: 10rpx;
	}
	.item{
		height: 100rpx;
		background: #ffffff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8rpx;
	}
	.item_left{
		display: flex;
		align-items: center;
	}
	.item_img{
		width: 80rpx;
		height: 80rpx;
		margin-left: 20rpx;
		margin-right: 40rpx;
	}
	.item_text{
		font-size: 32rpx;
	}
	image{
		will-change: transform;
	}
</style>
