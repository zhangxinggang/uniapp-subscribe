<template>
	<view>
		<cu-custom bgColor="bg-blue" :isBack="isBack">
			<block slot="backText">返回</block>
			<block slot="content">景点预约</block>
		</cu-custom>
		<form @submit="saveData">
			<view class="cu-form-group margin-top">
				<view class="title">*游客姓名：</view>
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
				<view class="title">日期选择</view>
				<picker mode="date" :value="ReserveDayTime" :start="reserveDayTime" @change="dateChange" name="ReserveDayTime">
					<view class="picker">
						{{ReserveDayTime}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group remainderTicketGroup">
				<view class="title">时间区间剩余票数</view>
				<view class="remainderTicket">
					<view v-for="(item,index) in Scenicinfotimes" :key="index">
						时间段：{{item.ScenicinfotimeStart}}至{{item.ScenicinfotimeEnd}}，剩余票数：{{item['RemainderNum']}}
					</view>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">时间选择</view>
				<picker mode="time" :value="ReserveHourTime" :start="reserveHourTime" @change="timeChange" name="ReserveHourTime">
					<view class="picker">
						{{ReserveHourTime}}
					</view>
				</picker>
			</view>
			<radio-group class="block">
				<view class="cu-form-group margin-top yisiyesOrNosPanel" style="display: flex;justify-content: space-between;">
					<view class="yisiyesOrNosTitle">你是否有新冠疑似症状：</view>
					<view class="yisiyesOrNos">
						<radio-group name="IsHaveSick">
							<label>
								<radio value="1" /><text>是</text>
							</label>
							<label>
								<radio value="0" checked="true" /><text>否</text>
							</label>
						</radio-group>
					</view>
				</view>
			</radio-group>
			<radio-group class="block">
				<view class="cu-form-group margin-top yisiyesOrNosPanel" style="display: flex;justify-content: space-between;">
					<view class="yisiyesOrNosTitle">是否接触过确诊或者疑似新冠病例人员：</view>
					<view class="yisiyesOrNos">
						<radio-group name="ContactSickLives">
							<label>
								<radio value="1" /><text>是</text>
							</label>
							<label>
								<radio value="0" checked="true" /><text>否</text>
							</label>
						</radio-group>
					</view>
				</view>
			</radio-group>
			<view class="uni-btn-v submitInfoBtn">
				<button form-type="submit" type="primary">提交</button>
			</view>
		</form>
	</view>
</template>

<script>
	export default {
		onLoad:function(options){
			var ScenicinfoID=options.ScenicinfoID;
			var EnterType=options.EnterType;
			if(EnterType=='nohistory'){
				this.isBack=false;
			}
			if(!ScenicinfoID){
				console.error('无ScenicinfoID')
				return;
			}
			//初始化数据
			this.ScenicinfoID=ScenicinfoID;
			this.ReserveDayTime=this.reserveDayTime;
			this.ReserveHourTime=this.reserveHourTime;
			this.loadScenicTime()
		},
		data() {
			return {
				isBack:true,
				ScenicinfoID:null,
				Scenicinfotimes:[],
				ReserveHourTime:'',
				ReserveDayTime:''
			};
		},
		computed:{
			reserveDayTime(){
				return this.getDate('start');
			},
			reserveHourTime(){
				var min='';
				for(var i=0;i<this.Scenicinfotimes.length;i++){
					!min && (min=this.Scenicinfotimes[i]['ScenicinfotimeStart']);
					this.Scenicinfotimes['min']<min && (min=this.Scenicinfotimes[i]['ScenicinfotimeStart']);
				}
				return min || '08:00';
			}
		},
		methods: {
			getDate(type){
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day=date.getDate();
				if(type === 'end') {
					month = month + 1;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			loadScenicTime:function(){
				uni.decorateRequest({
					url:'loadScenicTime',
					data:{
						where:{
							ScenicinfoID:this.ScenicinfoID,
							ReserveDayTime:this.ReserveDayTime
						}
					},
					success:(data)=>{
						this.Scenicinfotimes=data;
					},
					fail:function(err){
						console.log(err)
					}
				})
			},
			checkVal:function(value){
				if(!value['RealName']){
					uni.showToast({
						mask:true,
						icon:"none",
						title:'请输入姓名！'
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
				for(var key in value){
					if(typeof(value[key])=='string'){
						value[key]=value[key].replace(/\s+/g,'');
					}
				}
				value['UserOID']=getApp().globalData.userInfo.UserOID;
				value['ScenicinfoID']=this.ScenicinfoID;
				return true;
			},
			saveData:function(e){
				var value=e.detail.value;
				var pass=this.checkVal(value);
				if(pass){
					uni.decorateRequest({
						url:'saveReserverRecord',
						method:'post',
						data:value,
						success:function(data){
							uni.showModal({
								title:'提示',
								content:'预约成功！',
								success(){
									uni.redirectTo({
										url:'./index?EnterType=nohistory'
									})
								}
							})
						},
						fail(error){
							uni.showToast({
								mask:true,
								icon:"error",
								title:error
							})
						}
					})
				}
			},
			timeChange(e){
				let targetValue=e.detail.value;
				let avalibleVal=null;
				for(var i=0;i<this.Scenicinfotimes.length;i++){
					if(targetValue>=this.Scenicinfotimes[i]['ScenicinfotimeStart'] && targetValue<=this.Scenicinfotimes[i]['ScenicinfotimeEnd']){
						avalibleVal=targetValue;
						break;
					}
				}
				if(avalibleVal){
					this.ReserveHourTime=avalibleVal;
				}else{
					this.ReserveHourTime=this.reserveHourTime;
					uni.showToast({
						mask:true,
						icon:"none",
						title:'所选时间不在规定时间段！'
					})
				}
			},
			dateChange(e) {
				this.ReserveDayTime = e.detail.value;
				this.loadScenicTime()
			}
		}
	}
</script>

<style>
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