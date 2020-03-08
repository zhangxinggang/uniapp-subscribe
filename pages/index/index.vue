<template>
	<view>
		<view class="cu-bar search bg-white">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input :adjust-position="false" type="text" placeholder="搜所景点" @input="updateScenicinfoName" confirm-type="search"></input>
			</view>
			<view class="action">
				<button class="cu-btn bg-green shadow-blur round" @click="queryScenics">搜索</button>
			</view>
		</view>
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
								<button class="cu-btn bg-green shadow-blur" @click="subscribe(item)">预约</button>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				serverURI:uni.$serverURI,
				tempScenicinfoName:'',
				ScenicinfoName:'',
				scenicsTotal:0,
				scenics:[],
				rows:10,
				page:1
			};
		},
		onLoad:function(){
			let userInfo=uni.getStorageSync("userInfo");
			if(userInfo){
				this.loadScenics();
				return;
			}
			let url = window.location.search;
			let theRequest = {};
			if (url.indexOf("?") != -1) {
				let str = url.substr(1);
				let strs = str.split("&");
				for (let i = 0; i < strs.length; i++) {
					theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
				}
			}
			if(!theRequest.code){
				uni.redirectTo({
					url:"../authorize/authorize"
				})
				return;
			}
			uni.decorateRequest({
				url:"getUserinfo",
				data:{code:theRequest.code},
				success(data){
					uni.setStorageSync("userInfo",data);
					getApp().globalData.userInfo=data;
					this.loadScenics();
				},
				fail(err){
					uni.showToast({
						mask:true,
						icon:"none",
						title:'获取信息失败！'
					})
				}
			});
		},
		onReachBottom:function(){
			if(this.page*this.rows<this.scenicsTotal){
				this.page++;
				this.loadScenics();
			}
		},
		onPullDownRefresh:function(){
			this.baseLoadScenics((data)=>{
				this.scenics=data['rows'];
				uni.stopPullDownRefresh();
			})
		},
		methods: {
			updateScenicinfoName:function(e){
				this.tempScenicinfoName=e.detail.value;
			},
			queryScenics:function(){
				this.ScenicinfoName=this.tempScenicinfoName;
				this.baseLoadScenics((data)=>{
					this.scenics=data['rows'];
				})
			},
			baseLoadScenics:function(cb){
				uni.decorateRequest({
					url:'loadScenics',
					data:{
						rows:this.rows,
						page:this.page,
						ScenicinfoName:this.ScenicinfoName
					},
					success:(data)=>{
						this.scenicsTotal=data['total'];
						cb(data)
					}
				})
			},
			loadScenics:function(){
				this.baseLoadScenics((data)=>{
					this.scenics=this.scenics.concat(data['rows']);
				})
			},
			subscribe:function(item){
				uni.navigateTo({
					url:'../mySubscribe/addSubscribe?ScenicinfoID='+item["ScenicinfoID"]
				})
			}
		}
	}
</script>

<style>
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