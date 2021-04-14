<template>
	<view class="box">
		<view v-if="isReady">
			<view style="display: flex;justify-content: space-between;height: 1.76rem  /* 33/18.75 */;margin-top: 0.373rem  /* 7/18.75 */;background-color: #FFFFFF;text-align: left;padding: 0 0.64rem  /* 12/18.75 */ 0.587rem;">
				<view style="cursor:pointer;height: 1.76rem /* 33/18.75 */; line-height: 1.76rem;width: 3rem; float: left; font-size: 0.747rem  /* 14/18.75 */;color: #01B065;"
				      @click="onClickLeft" >
					<
				</view>
				<view class="input-view">
					<uni-icons class="input-uni-icon" type="search" color="#b5b5b5"/>
					<input
							class="orderno-select"
							placeholder="快速查找订单号"
							v-model="orderNo" @input="orderNoSelect"/>
				</view>
				<view class="navBar-btn" v-has="'client-bind'">
					<image class="bind-unbind" src="../../static/thirdStore/unbind.png"
					       @click="unbindStore"></image>
				</view>
				<view class="navBar-btn" v-has="'client-bind'">
					<image class="bind-unbind" src="../../static/thirdStore/bind.png" @click="bindStore"></image>
				</view>
			</view>
			<view v-if="!isStoreType" class="content_head" style="background-color: #FFFFFF;padding-top: 30%;">
				<image src="../../static/thirdStore/empty.png"  style="width: 11.8rem!important" class="empty-img"></image>
				<button class="bind-btn" @click="bindStore" v-has="'client-bind'">去绑定</button>
			</view>
			<view v-if="isStoreType">
				<view class="custom-tabs" v-if="tabList.length > 1">
					<ms-tabs :list="tabList" v-model="tabActiveIdx"></ms-tabs>
				</view>
				<view class="time-range" v-if="isSearch">
					<picker class="time-picker" :end="endDate || formatDate(new Date())" @change="changeStart"
					        mode="date">
						<view class="uni-input">{{startDate}}</view>
					</picker>
					<text class="time-picker" style="margin: 0 1.273rem;">至</text>
					<picker class="time-picker" :start="startDate || ''" :end="formatDate(new Date())"
					        @change="changeEnd"
					        mode="date">
						<view class="uni-input">{{endDate}}</view>
					</picker>
					<button class="clear-date" @click="changeDate">重置</button>
				</view>
				<view class="select-group" v-if="type == 1 && isSearch">
					<view class="select-option">
						<picker @change="changeStore" range-key="username" :range="storeList">
							<view class="uni-input">
								<view class="choose-status" v-for="item in storeList" v-if="bindId == item.key">
									<view class="select-title">
										{{item.username}}
									</view>
									<uni-icons type="arrowdown" class="arrowdown"></uni-icons>
									<view class="borderRight"></view>
								</view>
							</view>
						</picker>
					</view>
					<view class="select-option">
						<picker @change="changeCardNo" range-key="cardNo" :range="cardNoList">
							<view class="uni-input">
								<view class="choose-status" v-for="item in cardNoList" v-if="cardNo == item.cardNo">
									<view class="select-title">
										{{item.cardNo}}
									</view>
									<uni-icons type="arrowdown" class="arrowdown"></uni-icons>
									<view class="borderRight"></view>
								</view>
							</view>
						</picker>
					</view>
					<view class="select-option">
						<picker @change="changeStatus" range-key="title" :range="statusList">
							<view class="uni-input">
								<view class="choose-status" v-for="item in statusList" v-if="status == item.key">
									<view class="select-title">
										{{item.title}}
									</view>
									<uni-icons type="arrowdown" class="arrowdown"></uni-icons>
									<view class="borderRight"></view>
								</view>
							</view>
						</picker>
					</view>
					<view class="select-option">
						<picker @change="changeStores" range-key="shop_name" :range="storesList">
							<view class="uni-input">
								<view class="choose-status" v-for="item in storesList" v-if="storeId == item.id">
									<view class="select-title">
										{{item.shop_name}}
									</view>
									<uni-icons type="arrowdown" class="arrowdown"></uni-icons>
								</view>
							</view>
						</picker>
					</view>
				</view>
				<view class="select-group" v-if="type == 2 && isSearch">
					<view class="select-option1">
						<picker @change="changeStore" range-key="username" :range="storeList">
							<view class="uni-input">
								<view class="choose-status1" v-for="item in storeList" v-if="bindId == item.key">
									<view class="select-title1">
										{{item.username}}
									</view>
									<uni-icons type="arrowdown" class="arrowdown"></uni-icons>
									<view class="borderRight"></view>
								</view>
							</view>
						</picker>
					</view>
					<view class="select-option1">
						<picker @change="changeRefundStatus" range-key="name" :range="refundStatusList">
							<view class="uni-input">
								<view class="choose-status1" v-for="item in refundStatusList"
								      v-if="refundStatus == item.key">
									<view class="select-title1">
										{{item.name}}
									</view>
									<uni-icons type="arrowdown" class="arrowdown"></uni-icons>
								</view>
							</view>
						</picker>
					</view>
				</view>
				<view class="select-group" v-if="(type == 3 || type == 4) && isSearch">
					<view class="select-option1">
						<picker @change="changeStore" range-key="username" :range="storeList">
							<view class="uni-input">
								<view class="choose-status1" v-for="item in storeList" v-if="bindId == item.key">
									<view class="select-title1">
										{{item.username}}
									</view>
									<uni-icons type="arrowdown" class="arrowdown"></uni-icons>
									<view class="borderRight"></view>
								</view>
							</view>
						</picker>
					</view>
					<view class="select-option1">
						<picker @change="changeTBStatus" range-key="title" :range="tbStatusList">
							<view class="uni-input">
								<view class="choose-status1" v-for="item in tbStatusList"
								      v-if="tbStatus == item.id">
									<view class="select-title1">
										{{item.title}}
									</view>
									<uni-icons type="arrowdown" class="arrowdown"></uni-icons>
								</view>
							</view>
						</picker>
					</view>
				</view>
				<view style="background-color: #FFFFFF;" v-if="type == 1 && userInfo.length != 0">
					<view class="uni-padding-wrap">
						<view class="page-section swiper">
							<view class="page-section-spacing">
								<swiper class="swiper" style="height: 6.933rem;" :key="swiperKey"
								        :indicator-dots="userInfo.length == 1 ? false : indicatorDots"
								        indicator-active-color="#01B065" :autoplay="autoplay">
									<swiper-item v-for="item in userInfo">
										<view class="card-no">
											卡号NO.{{item.cardNo}}
										</view>
										<view style="margin-top: 1.067rem;">
											<view class="userinfo">
												<view class="info-title">{{item.gradeName}}</view>
												<view class="info-name">会员等级</view>
											</view>
											<view class="userinfo">
												<view class="info-title">{{item.points}}</view>
												<view class="info-name">积分</view>
											</view>
											<view class="userinfo">
												<view class="info-title">￥{{item.money}}</view>
												<view class="info-name">余额</view>
											</view>
										</view>
									</swiper-item>
								</swiper>
							</view>
						</view>
					</view>
				</view>
				<view style="margin: 0.533rem 0 0.267rem; height: 2.667rem; line-height: 2.667rem;background-color: #FFFFFF;text-align: left;font-weight: 700;">
					<text style="margin-left: 0.533rem;height: 0.693rem;color: #01B065;font-size: 0.693rem;">|</text>
					<text class="orders-title">订单记录（{{total}}条）</text>
				</view>
				<view>
					<scroll-view scroll-y="true" style="" class="scroll-Y"
					             v-if="orderList&&orderList.length>0"
					             @scrolltolower="loadMore">
						<view v-if="type == 1 || type == 2" id="demo1" class="scroll-view-item"
						      v-for="item in orderList">
							<view style="height: 2.187rem;line-height: 2.187rem;">
								<text class="storename">{{item.storeName}}</text>
								<text v-if="type==1" class="order-status">{{item.status}}</text>
								<text v-if="type==2" class="order-status">{{item.orderStatus}}</text>
							</view>
							<view style="width: 100%;height: 0rem;border-top: solid 1px #EFEFEF;margin: 0 auto;">
							</view>
							<view v-if="type == 1">
								<view class="orderno">
									<text>订单编号：</text>
									{{item.orderNo}}
								</view>
								<view class="orderno">
									<text>商品名称：</text>
									{{item.goodsName}}
								</view>
								<view class="payuser">
									<text>支付人：</text>
									{{item.name}}
								</view>
								<view class="payuser">
									<text>付款时间：</text>
									{{item.payTime}}
								</view>
								<view class="payuser">
									<text>支付金额：</text>
									<view style="color: #FF4C45;display: inline-block;">{{item.money}}元</view>
								</view>
							</view>
							<view v-if="type == 2" style="margin-top: 0.587rem /* 11/18.75 */;">
								<view v-for="goods in item.goodsInfo" style="margin-bottom: 0.533rem  /* 10/18.75 */;">
									<view class="goods">
										<image :src="goods.pic_path"
										       style="width: 4rem  /* 75/18.75 */; height: 4rem  /* 75/18.75 */;"></image>
									</view>
									<view class="goods goods-title">
										<view>{{goods.title}}</view>
										<view style="font-size: 0.64rem  /* 12/18.75 */; color: #999999;margin-top: 0.267rem  /* 5/18.75 */;">
											<text v-for="sn in goods.sku_name"
											      style="margin-right: 0.267rem  /* 5/18.75 */;">{{sn.k}}：{{sn.v}}
											</text>
										</view>
									</view>
									<view class="goods"
									      style='width: 4.267rem  /* 80/18.75 */; overflow: hidden; text-align: right;'>
										<view>￥ {{goods.price}}</view>
										<view style="color: #999999;margin-top: 0.267rem  /* 5/18.75 */;">x
											{{goods.num}}
										</view>
									</view>
								</view>
								<view style="font-size: 0.64rem  /* 12/18.75 */;text-align: right;">
									<text v-if="item.totalFee">总价￥{{item.totalFee}}，优惠￥{{item.discount}}，</text>
									<text style="margin-left: 0.267rem  /* 5/18.75 */;">实付款￥{{item.money}}</text>
								</view>
							</view>
							<view style="width: 100%;height: 0rem;border-top: solid 1px #EFEFEF;margin: 0.907rem  0 0.587rem 0;">
							</view>
							<view style="text-align: right;height: 1.867rem  /* 35/18.75 */;">
								<button @click="lookDetail(item.id)" class="look-detail">查看</button>
							</view>
						</view>
						<view v-if="type == 3 || type == 4" id="demo1" class="scroll-view-item"
						      v-for="item in orderList">
							<view style="height: 2.187rem;line-height: 2.187rem;">
								<text class="storename">{{item.storeName}}</text>
								<text class="order-status">{{item.status}}</text>
							</view>
							<view style="width: 100%;height: 0rem;border-top: dashed 0.053rem #EFEFEF;margin: 0 auto;">
							</view>
							<view>
								<view class="orderno">订单编号：{{item.orderNo}}</view>
								<view class="goodsname">{{item.goodName}}</view>
								<view class="payuser">支付人：{{item.name}}</view>
								<view class="payuser">付款时间：{{item.payTime}}</view>
								<view class="payuser">支付金额：
									<text style="color: #FF4C45;">{{item.money}}元</text>
								</view>
							</view>
							<view style="width: 100%;height: 0rem;border-top: solid 0.053rem #EFEFEF;margin: 0.907rem  0 0.587rem 0;">
							</view>
							<view style="text-align: right;height: 1.867rem  /* 35/18.75 */;">
								<button @click="lookDetail(item.id)" class="look-detail">查看</button>
							</view>
						</view>
					</scroll-view>
					<view style="height: 26.667rem;" v-if="orderList&&orderList.length<=0">
						<image  src="../../static/scrm/empty.png"
						       style="margin-top:0.8rem;width: 11.8rem!important" class="empty-img"></image>
					</view>

				</view>
			</view>
			<Footer v-if="is_show_copyright == 1"></Footer>
		</view>
		<!--客户绑定弹窗-->
		<uni-popup ref="bindVisible" type="bottom" :mask-click="false">
			<view class="uni-tip" ref="uniTip">
				<view class="uni-tip-title">
					<text style="float: left;border-bottom: 2px solid #01B065;">客户绑定</text>
					<icon type="clear" style="float: right;" size="20" @click="cancle"/>
				</view>
				<scroll-view scroll-y="true" style="height: 18.667rem;" class="scroll-Y">
					<view class="bind-tip">
						<view class="tip-title">
							绑定第三方店铺，目前支持淘宝、有赞和小猪智慧店铺。绑定后，可获取到该店铺的交易订单信息，在与客户对话中，可快速查看到该客户的历史订单记录。
						</view>
					</view>
					<view style="margin-top: 1.28rem  /* 24/18.75 */;text-align: left;">
						<input
								class="store-select"
								placeholder="凭手机号、会员卡号、任意订单号绑定客户"
								v-model="selectNo" @confirm="selectStore"/>
						<button class="select-btn" @click="selectStore">搜索</button>
					</view>
					<view style="margin: 0.853rem  /* 16/18.75 */ auto;">
						<view v-if="storeData.length > 0" style="margin-bottom: 0.48rem;color: #666; height: 1.5rem;">
							<text style="float: left;">搜索结果</text>
							<text style="float: right;">客户昵称：{{storeData[0].nickName}}</text>
						</view>
						<t-table v-if="storeData.length > 0" border="1" border-color="#eaeaea" :is-check="true"
						         @change="change">
							<t-tr class="first-tr" font-size="9" color="#999" align="left">
								<t-th align="left">店铺</t-th>
								<t-th align="center">会员等级</t-th>
								<t-th align="center">积分</t-th>
								<t-th align="center">余额（元）</t-th>
								<t-th align="center">订单（条）</t-th>
								<t-th align="center">状态</t-th>
							</t-tr>
							<t-tr :isBind="item.isBind" font-size="9" color="#666" align="right"
							      v-for="item in storeData"
							      :key="item.key">
								<t-td align="left">{{item.name}}</t-td>
								<t-td align="center">{{item.gradeName}}</t-td>
								<t-td align="center">{{item.points}}</t-td>
								<t-td align="center">{{item.money}}</t-td>
								<t-td align="center">{{item.orderCount}}</t-td>
								<t-td align="center" style="color:#01B065;">{{item.isBind}}</t-td>
							</t-tr>
						</t-table>
						<view v-if="noData" style="margin: 16px 0;color: #666;">暂无数据</view>
					</view>
				</scroll-view>
				<view class="uni-tip-group-button">
					<text class="uni-tip-button" @click="cancle"
					      style="border-right: 1px solid #CCC;">取消
					</text>
					<text class="uni-tip-button" @click="bind"
					      :style="{background: selectData.length == 0 ? '#F2F2F2' : '#01B065', color: selectData.length == 0 ? '#C3C3C3' : '#FFFFFF'}"
					      style="margin-left: 0.693rem  /* 13/18.75 */;">确定绑定
					</text>
				</view>
			</view>
		</uni-popup>
		<!--客户解绑弹窗-->
		<uni-popup ref="unbindVisible" type="bottom" :mask-click="false">
			<view class="uni-tip" ref="uniTip">
				<view class="uni-tip-title">
					<text style="float: left;border-bottom: 2px solid #01B065;">解除绑定</text>
					<icon type="clear" style="float: right;" class="icon-clear"
					      @click="cancleUnbind"/>
				</view>
				<scroll-view scroll-y="true" style="height: 18.667rem;" class="scroll-Y">
					<checkbox-group @change="changeCheckedBox">
						<view v-for="item in bindStoreList" class="store-list">
							<checkbox :value="item.key"></checkbox>
							<label style="margin-left: 5px;">{{item.username}}</label>
						</view>
					</checkbox-group>
					<view v-if="bindStoreList.length == 0" style="margin: 16px 0;color: #666;">暂无数据</view>
				</scroll-view>
				<view class="uni-tip-group-button">
					<text class="uni-tip-button" @click="cancleUnbind"
					      style="border-right: 1px solid #CCC;">取消
					</text>
					<text class="uni-tip-button"
					      style="background: #01B065;color: #FFF;margin-left: 0.693rem  /* 13/18.75 */;"
					      @click="unbind">提交
					</text>
				</view>
			</view>
		</uni-popup>
		<!--查看详情弹窗-->
		<uni-popup ref="detailVisible" type="bottom" :mask-click="false">
			<view class="uni-tip" ref="uniTip">
				<view class="uni-tip-title">
					<text style="float: left;border-bottom: 2px solid #01B065;">支付详情</text>
					<icon type="clear" style="float: right;" class="icon-clear"
					      @click="cancleDetail"/>
				</view>
				<scroll-view scroll-y="true" style="height: 18.667rem;" class="scroll-Y">
					<view v-if="type==1 || type ==2">
						<view class="form-border">
							<view>
								<label style="font-size: 0.693rem  /* 13/18.75 */; font-weight: 700;">订单信息</label>
							</view>
							<view v-if="type == 1">
								<label>商品名称：</label>
								<text>{{orderDetail.goods_name}}</text>
							</view>
							<view v-if="type == 1">
								<label v-if='orderDetail.refund == 0'>支付金额：</label>
								<label v-if='orderDetail.refund == 2'>退款金额：</label>
								<text>￥{{orderDetail.goods_price}}</text>
							</view>
							<view>
								<label>订单编号：</label>
								<text>{{orderDetail.order_id}}</text>
							</view>
							<view>
								<label v-if='orderDetail.refund == 0'>付款方式：</label>
								<label v-if='orderDetail.refund == 2'>退款方式：</label>
								<text>{{orderDetail.pay_mode}}</text>
							</view>
							<view v-if="type == 1">
								<label v-if='orderDetail.refund == 0'>支付人：</label>
								<label v-if='orderDetail.refund == 2'>退款人：</label>
								<text>{{orderDetail.name}}</text>
							</view>
							<view>
								<label>支付时间：</label>
								<text>{{orderDetail.pay_time}}</text>
							</view>
							<view v-if='orderDetail.refund == 2 && type == 1'>
								<label>退款时间：</label>
								<text>{{orderDetail.refund_time}}</text>
							</view>
							<view>
								<label v-if='orderDetail.refund == 0'>支付状态：</label>
								<label v-if='orderDetail.refund == 2'>退款状态：</label>
								<text>{{orderDetail.pay_name}}</text>
							</view>
							<view v-if="type == 2">
								<label>订单状态：</label>
								<text>{{orderDetail.orderStatus}}</text>
							</view>
							<view v-if="type == 1">
								<label>门店：</label>
								<text>{{orderDetail.store_name}}</text>
							</view>
							<view v-if="type == 2">
								<label>收货人：</label>
								<text>{{orderDetail.receiver_name}}</text>
							</view>
							<view v-if="type == 2">
								<label>收货地址：</label>
								<text>{{orderDetail.address}}</text>
							</view>
							<view v-if="type == 2">
								<label>配送方式：</label>
								<text>{{orderDetail.express_type}}</text>
							</view>
							<view v-if="type == 1">
								<label v-if='orderDetail.refund == 0'>收款人：</label>
								<label v-if='orderDetail.refund == 2'>操作人：</label>
								<text>{{orderDetail.payee}}</text>
							</view>
							<view v-if="orderDetail.goods_describe">
								<label v-if='orderDetail.refund == 0'>订单备注：</label>
								<label v-if='orderDetail.refund == 2'>退单备注：</label>
								<text>{{orderDetail.goods_describe}}</text>
							</view>
						</view>
						<view style="margin: 0.533rem 0;"
						      v-if="orderDetail.infoList && orderDetail.infoList.length > 0 && type == 1">
							<view style="text-align: left;margin-left: 0.267rem  /* 5/18.75 */; margin-bottom: 0.533rem  /* 10/18.75 */;">
								<label style="font-size: 0.693rem  /* 13/18.75 */; font-weight: 700;">订单详情</label>
							</view>
							<t-table border="1" border-color="#eaeaea" :is-check="false">
								<t-tr font-size="9" color="#333" align="left">
									<t-th align="center">名称</t-th>
									<t-th align="center">数量</t-th>
									<t-th align="center">单价（元）</t-th>
								</t-tr>
								<t-tr font-size="9" color="#666" align="right" v-for="item in orderDetail.infoList"
								      :key="item.key">
									<t-td align="center">{{item.title}}</t-td>
									<t-td align="center">{{item.num}}</t-td>
									<t-td align="center">{{item.price}}</t-td>
								</t-tr>
							</t-table>
						</view>
						<view v-if="type == 2" style="margin-top: 0.587rem /* 11/18.75 */;">
							<view v-for="goods in orderDetail.goodsInfo"
							      style="margin-bottom: 0.533rem  /* 10/18.75 */;">
								<view class="goods">
									<image :src="goods.pic_path"
									       style="width: 4rem  /* 75/18.75 */; height: 4rem  /* 75/18.75 */;"></image>
								</view>
								<view class="goods goods-title" style="width: 7.8rem;">
									<view>{{goods.title}}</view>
									<view style="font-size: 0.64rem  /* 12/18.75 */; color: #999999;margin-top: 0.267rem  /* 5/18.75 */;">
										<text v-for="sn in goods.sku_name"
										      style="margin-right: 0.267rem  /* 5/18.75 */;">{{sn.k}}：{{sn.v}}
										</text>
									</view>
								</view>
								<view class="goods"
								      style='width: 4.267rem  /* 80/18.75 */; overflow: hidden; text-align: right;'>
									<view>￥ {{goods.price}}</view>
									<view style="color: #999999;margin-top: 0.267rem  /* 5/18.75 */;">x
										{{goods.num}}
									</view>
									<view style="color: #999999;margin-top: 0.267rem  /* 5/18.75 */;">
										{{goods.refund_state}}
									</view>
								</view>
							</view>
						</view>
						<view v-if="(orderDetail.order_price || orderDetail.order_price == 0) || (orderDetail.statisticData && orderDetail.statisticData.length != 0)"
						      class="form-border1" style="text-align: left; padding-left: 0.533rem  /* 10/18.75 */;">
							<view style="display: inline-block;" v-if="orderDetail.order_price">
								<label>订单金额：</label>
								<text>￥{{orderDetail.order_price}}</text>
							</view>
							<view v-for="item in orderDetail.statisticData"
							      v-if="orderDetail.statisticData && type == 1">
								<label>{{item.discount_name}}：</label>
								<text>{{item.discount_money}}</text>
							</view>
							<view style="display: inline-block;"
							      v-if="type == 2 && (orderDetail.post_fee || orderDetail.discount)">
								<label v-if="orderDetail.post_fee">，运费：</label>
								<text v-if="orderDetail.post_fee">￥{{orderDetail.post_fee}}</text>
								<label v-if="orderDetail.post_fee && orderDetail.discount">，</label>
								<label v-if="orderDetail.discount">优惠：</label>
								<text v-if="orderDetail.discount">￥{{orderDetail.discount}}</text>
							</view>
						</view>
						<view class="form-border1" style="text-align: left; padding-left: 0.533rem  /* 10/18.75 */;">
							<view v-if="orderDetail.goods_price">
								<label v-if='orderDetail.refund == 0'>实付金额：</label>
								<label v-if='orderDetail.refund == 2'>退款金额：</label>
								<text>￥{{orderDetail.goods_price}}</text>
							</view>
						</view>
						<view class="form-border1" style="text-align: left; padding-left: 0.533rem  /* 10/18.75 */;"
						      v-if="orderDetail.marketingStr || orderDetail.giveStr || orderDetail.refundStr">
							<view v-if="orderDetail.marketingStr">
								<label>消费后赠送：</label>
								<text>{{orderDetail.marketingStr}}</text>
							</view>
							<view v-if="orderDetail.giveStr">
								<label>赠送金额：</label>
								<text>{{orderDetail.giveStr}}</text>
							</view>
							<view v-if="orderDetail.refundStr">
								<label>退款金额：</label>
								<text>{{orderDetail.refundStr}}</text>
							</view>
						</view>
					</view>
					<view v-if="type == 3 || type == 4">
						<view class="form-border" style="padding: 0.267rem  /* 5/18.75 */;">
							<view>
								<label style="font-size: 0.693rem  /* 13/18.75 */; font-weight: 700;">订单信息</label>
							</view>
							<view>
								<label>订单编号：</label>
								<text>{{orderDetail.orderNo}}</text>
							</view>
							<view>
								<label>支付宝账号：</label>
								<text>{{orderDetail.phone}}</text>
							</view>
							<view>
								<label>订单状态：</label>
								<text>{{orderDetail.status}}</text>
							</view>
							<view>
								<label>收货人姓名：</label>
								<text>{{orderDetail.receiverName}}</text>
							</view>
							<view>
								<label>收货地址：</label>
								<text>{{orderDetail.receiverAddress}}</text>
							</view>
							<view>
								<label>运送方式：</label>
								<text>{{orderDetail.express}}</text>
							</view>
							<view>
								<label>联系手机：</label>
								<text>{{orderDetail.receiverPhone}}</text>
							</view>
							<view>
								<label>支付时间：</label>
								<text>{{orderDetail.payTime}}</text>
							</view>
							<view>
								<label>订单备注：</label>
								<text>{{orderDetail.remark}}</text>
							</view>
						</view>
						<view style="margin: 0.533rem 0;"
						      v-if="orderDetail.infoList && orderDetail.infoList.length > 0">
							<view style="text-align: left;margin-left: 0.267rem  /* 5/18.75 */; margin-bottom: 0.533rem  /* 10/18.75 */;">
								<label style="font-size: 0.693rem  /* 13/18.75 */; font-weight: 700;">订单详情</label>
							</view>
							<t-table border="1" border-color="#eaeaea" :is-check="false">
								<t-tr font-size="9" color="#333" align="left">
									<t-th align="center">名称</t-th>
									<t-th align="center">数量</t-th>
									<t-th align="center">单价（元）</t-th>
								</t-tr>
								<t-tr font-size="9" color="#666" align="right" v-for="item in orderDetail.infoList"
								      :key="item.key">
									<t-td align="center">{{item.title}}</t-td>
									<t-td align="center">{{item.num}}</t-td>
									<t-td align="center">{{item.price}}</t-td>
								</t-tr>
							</t-table>
						</view>
						<view class="form-border1" style="padding: 0.267rem  /* 5/18.75 */;">
							<view>
								<label>应付货款：</label>
								<text>￥{{orderDetail.price}}</text>
							</view>
							<view>
								<label>应付邮费：</label>
								<text>{{orderDetail.postFee}}</text>
							</view>
							<view>
								<label>支付积分：</label>
								<text>{{orderDetail.costPoint}}</text>
							</view>
							<view>
								<label>返点积分：</label>
								<text>{{orderDetail.backPoint}}</text>
							</view>
						</view>
						<view class="form-border1" style="padding: 0.267rem  /* 5/18.75 */;">
							<view>
								<label>支付金额：</label>
								<text>￥{{orderDetail.payment}}</text>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="uni-tip-group-button">
					<text class="uni-tip-button" @click="cancleDetail"
					      style="border-right: 1px solid #CCC;">关闭
					</text>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {Toast} from "vant";
	import tTable from '@/components/t-table/t-table.vue';
	import tTh from '@/components/t-table/t-th.vue';
	import tTr from '@/components/t-table/t-tr.vue';
	import tTd from '@/components/t-table/t-td.vue';
	import Footer from "../../components/footer/footer.vue";

	export default {
		name      : "thirdStore",
		inject    : ['getParameter'],
		components: {
			tTable, tTh, tTr, tTd,Footer
		},
		data () {
			return {
				id              : '', // 客户id
				orderNo         : '', // 订单号
				tabListData     : [], // 获取的店铺类型
				tabList         : [], // 店铺类型展示tab
				isSearch        : true,
				tabActiveIdx    : 0, // tab index
				type            : 1, // tab
				page            : 1,
				pageSize        : 10,
				total           : 0,
				start           : '',
				end             : '',
				startDate       : '请选择开始时间',
				endDate         : '请选择结束时间',
				orderList       : [], // 订单列表
				storeList       : [], // 店铺列表
				bindId          : '', // 店铺key
				userInfo        : [], // 会员信息
				memberId        : [], // 所有会员id
				cardNoList      : [], // 会员卡号列表
				cardNo          : '会员卡号', // 选中的卡号
				statusList      : [
					{
						key  : '0',
						title: '状态'
					}, {
						key  : '1',
						title: '未退款'
					}, {
						key  : '2',
						title: '已退款'
					},
				], // 订单状态列表
				status          : '0', // 退款状态
				storesList      : [], // 门店列表
				storeId         : '0', // 选择的门店
				refundStatus    : '0', // 退款状态
				refundStatusList: [],// 退款状态列表
				tbStatus        : '',
				tbStatusList    : [],
				indicatorDots   : true, // 是否展示swiper的圆点
				swiperKey       : 0, // 用作强刷swiper
				autoplay        : false, // 是否自动播放
				tableKey        : 0, // 表格强刷多选状态
				selectNo        : '', // 绑定店铺搜索的输入框
				storeData       : [], //绑定店铺搜索表格列表
				noData          : false, // 是否显示暂无数据
				selectData      : [], // 选中的数据
				bindStoreList   : [], // 绑定的店铺列表
				selectKeys      : [], // 解绑选中的key
				orderDetail     : {}, // 订单详情
				detailColumns   : [
					{
						title    : "名称",
						dataIndex: "title",
						key      : "title",
						width    : '300',
						align    : 'center'
					},
					{
						title    : "数量",
						dataIndex: "num",
						key      : "num",
						width    : '190',
						align    : 'center'
					},
					{
						title    : "单价",
						dataIndex: "price",
						key      : "price",
						width    : '200',
						align    : 'center'
					},
				],
				isReady         : false, // 页面加载
				isStoreType     : false,// 是否有店铺类型
				searchBarFixed : false,
				is_show_copyright : localStorage.getItem('is_show_copyright'),//是否展示底部版權

			}
		},
		mounted () {
			window.addEventListener('scroll', this.handleScroll)
		},
		onShow () {
			uni.setNavigationBarTitle({
				title: '第三方店铺'
			});
			this.isReady = false
			Toast.loading({
				message    : '加载中...',
				forbidClick: true,
				loadingType: 'spinner',
			});
			this.id = this.$route.query.id
			this.is_show_copyright = localStorage.getItem('is_show_copyright')
			// localStorage.setItem('uid', '2')
			// localStorage.setItem('token', 'TWFpblVzZXItZGY0NGRmOGY1ZTBlMjMzNWIwOWI3YzY3MDJjOGQ0NWE=')
			this.getStoreTypeList()
			this.getOrderType()
		},
		methods   : {
			handleScroll () {
				var scrollTop = window.pageYOffset || document.documentElement.scrollTop ||
					document.body.scrollTop
				this.scrollTop = scrollTop;
				if (this.scrollTop <= 400) {
					//添加你想要的事件
					this.searchBarFixed = false
				} else if (this.scrollTop > 400) {
					//添加你想要的事件
					this.searchBarFixed = true
				}
			},
			// 有赞订单状态
			async getOrderType () {
				const {data: res} = await this.axios.post("third-store/youzan-order-status");
				if (res.error != 0) {
					Toast.fail(res.error_msg)
				} else {
					this.refundStatusList = res.data
					let s = {
						key : '0',
						name: '状态'
					}
					this.refundStatusList.unshift(s)
				}
			},
			// 绑定店铺多选
			change (e) {
				this.selectData = []
				if (e.detail.length > 0) {
					e.detail.map(x => {
						this.selectData.push(this.storeData[x])
					})
				}
			},
			// 订单列表加载更多
			loadMore () {
				if (this.maxPage > this.page) {
					this.getOrderList(this.page + 1)
				}
			},
			// 查看详情
			async lookDetail (id) {
				const {data: res} = await this.axios.post(
					"third-store/order-info",
					{
						bindId : this.bindId,
						orderId: id,
						type   : 1
					}
				);
				if (res.error != 0) {
					Toast.fail(res.error_msg)
				} else {
					this.orderDetail = res.data
					this.$refs.detailVisible.open()
				}
			},
			// 关闭详情弹窗
			cancleDetail () {
				this.$refs.detailVisible.close()
			},
			// 解绑弹窗数据
			async unbindStore () {
				this.bindStoreList = []
				this.selectKeys = []
				const {data: res} = await this.axios.post("third-store/bind-merchants", {
					uid     : localStorage.getItem('uid'),
					customId: this.id,
					from    : 1
				});
				if (res.error != 0) {
					Toast.fail(res.error_msg)
				} else {
					this.bindStoreList = res.data
					if (this.bindStoreList.length == 0) {
						Toast.fail("暂无绑定的店铺")
					} else {
						this.$refs.unbindVisible.open()
					}
				}
			},
			// 解绑店铺多选
			changeCheckedBox (e) {
				this.selectKeys = e.detail.value
			},
			// 关闭解绑弹窗
			cancleUnbind () {
				this.$refs.unbindVisible.close()
				this.selectKeys = []
			},
			// 解绑店铺
			async unbind () {
				if (this.selectKeys.length == []) {
					Toast.fail("请选择要解绑的店铺")
					return false
				}
				const {data: res} = await this.axios.post("third-store/bind-cancel", {
					ids: this.selectKeys,
				});
				if (res.error != 0) {
					Toast.fail(res.error_msg)
				} else {
					this.swiperKey++
					this.bindId = ''
					this.orderNo = ''
					this.isSearch = true
					Toast.success("解绑成功")
					this.cancleUnbind()
					this.isReady = false
					this.getStoreTypeList()
				}
			},
			// 绑定店铺弹窗显示
			bindStore () {
				this.selectNo = ''
				this.storeData = []
				this.$refs.bindVisible.open()
			},
			// 绑定店铺
			async bind () {
				let id = {}
				let ids = []
				if (this.selectData.length == 0) {
					Toast.fail('请选择绑定店铺');
					return false
				}
				for (let data of this.selectData) {
					id = {
						member_id: data.member_id,
						uc_id    : data.uc_id,
						key      : data.key
					}
					ids.push(JSON.parse(JSON.stringify(id)))
				}
				const {data: res} = await this.axios.post("third-store/is-bind-more", {
					ids     : ids,
					customId: this.id,
					from    : 1
				});
				if (res.error != 0) {
					Toast.fail(res.error_msg);
				} else {
					Toast.success("绑定成功")
					this.cancle()
					this.orderNo = ''
					this.isSearch = true
					if (this.type == 1) {
						this.cardNo = '会员卡号'
						this.status = '0'
						this.storeId = '0'
					} else if (this.type == 2) {
						this.refundStatus = '0'
					} else if (this.type == 3 || this.type == 4) {
						this.tbStatus = ''
					}
					this.startDate = '请选择开始时间'
					this.endDate = '请选择结束时间'
					this.selectData = []
					this.swiperKey++
					this.isReady = false
					this.getStoreTypeList(res.data.bindType[0].type, res.data.info[0].bindId)
				}
			},
			// 取消绑定弹窗
			cancle () {
				this.selectData = []
				this.$refs.bindVisible.close()
				this.selectNo = ''
				this.storeData = []
			},
			// 页面返回
			onClickLeft () {
				uni.navigateBack()
			},
			// 快速查找订单号
			orderNoSelect (e) {
				this.orderNo = e.detail.value
				if (this.orderNo != '') {
					this.cardNo = '会员卡号'
					this.status = '0'
					this.storeId = '0'
					this.refundStatus = '0'
					// this.tbStatus = ''
					this.tbStatus = ''
					this.startDate = '请选择开始时间'
					this.endDate = '请选择结束时间'
					this.isSearch = false
					this.searchOrder()
				} else {
					this.isSearch = true
					this.getStoreTypeList()
				}

			},
			async searchOrder () {
				const {data: res} = await this.axios.post("third-store/search-order", {
					uid      : localStorage.getItem('uid'),
					customId : this.id,
					orderCode: this.orderNo,
					from     : 1
				});
				if (res.error != 0) {
					Toast.fail(res.error_msg);
				} else {
					if (res.data.length == 0) {
						this.tabList = []
						this.isStoreType = false
					} else {
						this.userInfo = []
						this.tabList = []
						this.tabListData = []
						for (let data of res.data) {
							let tab = {
								title: data.typeName
							}
							let tabData = {
								type    : data.type,
								typeName: data.typeName,
								bindId  : data.bindId
							}
							this.tabList.push(JSON.parse(JSON.stringify(tab)))
							this.tabListData.push(JSON.parse(JSON.stringify(tabData)))
							let user = {
								memberId : data.memberId,
								cardNo   : data.cardNo,
								points   : data.points,
								money    : data.money,
								gradeName: data.gradeName
							}
							if (data.type == 1) {
								this.userInfo.push(user)
							}
						}
						this.type = this.tabListData[0].type
						this.bindId = res.data[0].bindId
						this.isStoreType = true
						this.getOrderList()
					}
				}
			},
			// 事件数据处理
			formatDateNull () {
				let date = ['', '']
				if (this.startDate == '请选择开始时间') {
					date[0] = ''
				} else {
					date[0] = this.startDate
				}
				if (this.endDate == '请选择结束时间') {
					date[1] = ''
				} else {
					date[1] = this.endDate
				}
				if (date[0] == '' && date[1] == '') {
					date = null
				}
				return date
			},
			// 重置
			changeDate () {
				if (this.type == 1) {
					// this.bindId = this.storeList.length > 0 ? this.storeList[0].key : ''
					this.cardNo = this.cardNoList.length > 0 ? this.cardNoList[0].cardNo : ''
					this.status = this.statusList.length > 0 ? this.statusList[0].key : ''
					this.storeId = this.storesList.length > 0 ? this.storesList[0].id : ''
				} else if (this.type == 2) {
					this.refundStatus = this.refundStatusList.length > 0 ? this.refundStatusList[0].key : '0'
				} else if (this.type == 3 || this.type == 4) {
					this.tbStatus = ''
				}
				this.startDate = '请选择开始时间'
				this.endDate = '请选择结束时间'

				this.getOrderList()
			},
			// 开始时间
			changeStart (e) {
				this.startDate = e.detail.value
				this.getOrderList()
			},
			// 结束时间
			changeEnd (e) {
				this.endDate = e.detail.value
				this.getOrderList()
			},
			// 选择店铺
			changeStore (e) {
				this.bindId = this.storeList[e.detail.value].key
				this.swiperKey++
				this.getMembers()
			},
			// 淘宝订单状态
			changeTBStatus (e) {
				this.tbStatus = this.tbStatusList[e.detail.value].id
				this.getOrderList()
			},
			// 选择退款状态
			changeRefundStatus (e) {
				this.refundStatus = this.refundStatusList[e.detail.value].key
				this.getOrderList()
			},
			// 切换会员卡号
			changeCardNo (e) {
				this.cardNo = this.cardNoList[e.detail.value].cardNo
				this.getOrderList()
			},
			// 切换订单状态
			changeStatus (e) {
				this.status = this.statusList[e.detail.value].key
				this.getOrderList()
			},
			// 切换门店
			changeStores (e) {
				this.storeId = this.storesList[e.detail.value].id
				this.getOrderList()
			},
			// 时间选择限制
			formatDate (date) {
				let y = date.getFullYear();
				let m = date.getMonth() + 1;
				m = m < 10 ? ('0' + m) : m;
				let d = date.getDate();
				d = d < 10 ? ('0' + d) : d;
				return y + '-' + m + '-' + d;
			},
			// 获取客户绑定店铺类型
			async getStoreTypeList (type, bindId) {
				this.isStoreType = true
				const {data: res} = await this.axios.post("third-store/get-bind-type", {
					uid     : localStorage.getItem('uid'),
					customId: this.id,
					from    : 1
				});
				if (res.error != 0) {
					Toast.fail(res.error_msg);
				} else {
					this.tabListData = res.data
					this.tabList = []
					if (this.tabListData.length != 0) {
						for (let tab of this.tabListData) {
							this.tabList.push({title: tab.typeName})
						}
						if (type) {
							this.tabActiveIdx = this.tabListData.findIndex(x => x.type == type)
							this.bindId = bindId
						} else {
							this.tabActiveIdx = 0
							this.bindId = ''
						}
						this.type = this.tabListData[this.tabActiveIdx].type
						this.isStoreType = true
						this.getStoreList(this.bindId)
					} else {
						this.isReady = true
						this.isStoreType = false
					}
				}
			},
			// 绑定店铺弹窗搜索店铺
			async selectStore (e) {
				if (e && e.detail && (e.detail.value || e.detail.value == 0)) {
					this.selectNo = e.detail.value
				}
				if (this.selectNo == "") {
					Toast.fail("请输入手机号、卡号或订单号！")
					return false
				}
				const {data: res} = await this.axios.post("third-store/search-member", {
					uid     : localStorage.getItem('uid'),
					cardNo  : this.selectNo,
					customId: this.id,
					from    : 1
				});
				if (res.error != 0) {
					Toast.fail(res.error_msg);
				} else {
					this.tableKey++
					this.selectKeys = []
					for (let store of res.data) {
						if (store.isBind == 1) {
							store.isBind = '已绑定'
						} else {
							store.isBind = '未绑定'
						}
					}
					this.storeData = res.data
					if (this.storeData.length == 0) {
						this.noData = true
					} else {
						this.noData = false
					}
					console.log(this.storeData, 'storeData')
				}
			},
			// 获取店铺
			async getStoreList (bindId) {
				Toast.loading({
					message    : '加载中...',
					forbidClick: true,
					loadingType: 'spinner',
				});
				const {data: res} = await this.axios.post("third-store/bind-merchants", {
					uid     : localStorage.getItem('uid'),
					customId: this.id,
					type    : this.type,
					from    : 1
				});
				if (res.error != 0) {
					Toast.clear();
					Toast.fail(res.error_msg);
				} else {
					this.storeList = res.data
					if (this.storeList.length != 0) {
						if (bindId) {
							this.bindId = bindId
						} else {
							this.bindId = this.storeList[0].key
						}
						if (this.type == 1) {
							this.getMembers()
							this.getStoresList()
						} else if (this.type == 2) {
							this.getOrderList()
						} else if (this.type == 3 || this.type == 4) {
							this.getOrderList()
							this.getTBStatusList()
						}
					} else {
						this.isReady = true
						this.isStoreType = false
						Toast.clear();
					}
				}
			},
			// 获取淘宝订单状态
			async getTBStatusList () {
				const {data: res} = await this.axios.post(
					"third-store/taobao-status",
					{
						uid: localStorage.getItem('uid')
					}
				);
				if (res.error != 0) {
					Toast.fail(res.error_msg)
				} else {
					this.tbStatusList = res.data
					let status = {
						id   : "",
						title: '状态',
					}
					this.tbStatusList.unshift(status)
				}
			},
			// 获取门店列表
			async getStoresList () {
				const {data: res} = await this.axios.post("third-store/get-stores", {
					bindId: this.bindId
				});
				if (res.error != 0) {
					Toast.fail(res.error_msg)
				} else {
					this.storesList = res.data
					for (let store of this.storesList) {
						store.shop_name = store.shop_name + ' ' + store.branch_name
					}
					let stores = {
						id       : "0",
						shop_name: '门店',
					}
					this.storesList.unshift(stores)
				}
			},
			// 获取客户信息
			async getMembers () {
				const {data: res} = await this.axios.post("third-store/get-bind-members", {
					id: this.bindId
				});
				if (res.error != 0) {
					Toast.fail(res.error_msg);
				} else {
					this.userInfo = res.data
					this.memberId = []
					for (let user of this.userInfo) {
						this.memberId.push(user.memberId)
					}
					this.cardNoList = JSON.parse(JSON.stringify(this.userInfo))
					this.cardNoList.unshift({cardNo: '会员卡号'})
					this.getOrderList()
				}
			},
			// 获取订单列表
			async getOrderList (page = 1, pageSize = this.pageSize) {
				Toast.loading({
					message    : '加载中...',
					forbidClick: true,
					loadingType: 'spinner',
				});
				let params = {
					bindId   : this.bindId,
					page     : page,
					pageSize : pageSize,
					type     : 1,
					memberId : this.memberId,
					orderCode: this.orderNo,
					payTime  : this.formatDateNull(),
					customId : this.id,
					from     : 1
				}
				if (this.type == 1) {
					params['cardNo'] = this.cardNo == '会员卡号' ? '' : this.cardNo
					params['orderStatus'] = this.status
					params['storeId'] = this.storeId
				} else if (this.type == 2) {
					params['orderStatus'] = this.refundStatus
					params['customId'] = this.id
				} else if (this.type == 3 || this.type == 4) {
					params['orderStatus'] = this.tbStatus == '选择订单状态' ? '' : this.tbStatus
				}
				const {data: res} = await this.axios.post("third-store/get-orders", params);
				if (res.error != 0) {
					Toast.clear();
					this.isReady = true
					Toast.fail(res.error_msg);
				} else {
					if (page == 1) {
						this.orderList = res.data.info
					} else {
						this.orderList = this.orderList.concat(res.data.info)
					}
					this.total = res.data.count
					this.maxPage = Math.ceil(this.total / 10.0)
					this.page = page
					this.pageSize = pageSize
					this.isStoreType = true
					this.isReady = true
					Toast.clear();
				}
			},
		},
		watch     : {
			// 切换店铺类型tabs
			tabActiveIdx () {
				Toast.loading({
					message    : '加载中...',
					forbidClick: true,
					loadingType: 'spinner',
				});
				this.orderList = []
				if (this.type == 1) {
					this.cardNo = this.cardNoList.length > 0 ? this.cardNoList[0].cardNo : ''
					this.status = this.statusList.length > 0 ? this.statusList[0].key : ''
					this.storeId = this.storesList.length > 0 ? this.storesList[0].id : ''
				} else if (this.type == 2) {
					this.refundStatus = this.refundStatusList.length > 0 ? this.refundStatusList[0].key : ''
				} else if (this.type == 3 || this.type == 4) {
					this.tbStatus = ''
				}
				this.startDate = '请选择开始时间'
				this.endDate = '请选择结束时间'
				this.page = 1
				this.type = this.tabListData[this.tabActiveIdx].type
				if (this.cardNo != '') {
					this.bindId = this.tabListData[this.tabActiveIdx].bindId
					this.getStoreList(this.bindId)
				} else {
					this.getStoreList()
				}
			}
		},
	}
</script>

<style scoped>
	.fixed {
		background: #FFF;
		z-index: 999;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		box-shadow: 0 0.053rem /* 1/18.75 */ 0.213rem /* 4/18.75 */ 0 rgba(0, 0, 0, 0.08);
	}
	/deep/ .uni-load-more__text {
		color: #C3C3C3 !important;
	}

	.box {
		background: #F6F6F6;
	}

	.custom-tabs {
		background: #FFF;
		line-height: 2.24rem /* 42/18.75 */;
		overflow: hidden;
		border-bottom: 1px solid #F5F5F5;
		font-size: 0.693rem /* 13/18.75 */;
		color: #999;
	}

	.time-range {
		height: 2.187rem /* 41/18.75 */;
		line-height: 2.187rem /* 41/18.75 */;
		background-color: #FFFFFF;
		margin-top: 0.533rem /* 10/18.75 */;
	}

	.time-picker {
		display: inline-block;
		font-size: 0.693rem /* 13/18.75 */;
		color: #999999;
		/*width: 6.933rem  !* 130/18.75 *!;*/
	}

	.clear-date {
		margin-left: 1.067rem /* 20/18.75 */;
		display: inline-block;
		height: 1.28rem /* 24/18.75 */;
		font-size: 0.64rem /* 12/18.75 */;
		line-height: 1.28rem /* 24/18.75 */;
		vertical-align: middle;
		background-color: #FFFFFF;
		border: 1px solid #01B065;
		color: #01B065;
	}

	.clear-date:after {
		border: 0;
	}

	.empty-img {
		width: 11.733rem /* 220/18.75 */;
		height: 6.827rem /* 128/18.75 */;
		display: block;
		margin: 0 auto;
	}

	.bind-btn {
		margin-top: 1.067rem /* 20/18.75 */;
		display: inline-block;
		height: 1.6rem /* 30/18.75 */;
		line-height: 1.6rem /* 30/18.75 */;
		font-size: 0.64rem /* 12/18.75 */;
		vertical-align: middle;
		background-color: #01B065;
		border: 1px solid #01B065;
		color: #FFFFFF;
	}

	.bind-btn:after {
		border: 0;
	}

	.select-group {
		background-color: #FFFFFF;
		height: 2.4rem /* 45/18.75 */;
		border-top: 1px solid #EEEEEE;
		border-bottom: 1px solid #EEEEEE;
	}

	.select-option {
		color: #666666;
		width: calc(25% - 1px);
		float: left;
	}

	.select-option uni-picker {
		height: 2.4rem;
	}

	.select-option uni-picker > > div {
		height: 2.4rem;
	}

	.select-option:last-child .choose-status {
		border: 0;
	}

	.choose-status {
		/*border-right: 1px solid #e6e6e6;*/
		line-height: 2.4rem /* 45/18.75 */;
		height: 100%;
	}

	.select-title {
		display: inline-block;
		max-width: 2.5rem /* 70/18.75 */;
		font-size: 0.64rem /* 12/18.75 */;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		margin-right: 0.267rem /* 5/18.75 */;
	}

	.select-option1 {
		color: #666666;
		width: calc(50% - 2px);
		float: left;
	}

	.select-option1 uni-picker {
		height: 2.4rem;
	}

	.select-option1 uni-picker > > div {
		height: 2.4rem;
	}

	.choose-status1 {
		line-height: 2.4rem /* 45/18.75 */;
		height: 100%;
	}

	.borderRight {
		width: 0.107rem /* 2/18.75 */;
		height: 0.853rem /* 16/18.75 */;
		background: #E6E6E6;
		float: right;
		margin-top: 0.8rem /* 15/18.75 */;
	}

	.select-title1 {
		max-width: 5.5rem;
		display: inline-block;
		font-size: 0.64rem /* 12/18.75 */;
		/*line-height: 0.64rem;*/
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		margin-right: 0.267rem /* 5/18.75 */;
	}

	.arrowdown {
		display: inline-block;
		width: 0.267rem /* 5/18.75 */;
		font-size: 0.267rem /* 5/18.75 */ !important;
		vertical-align: top;
	}

	.card-no {
		margin: 0 auto;
		margin-top: 0.693rem;
		font-size: 0.64rem;
		background-color: rgba(204, 204, 204, 0.2);
		color: #999999;
		border-radius: 0.64rem;
		height: 1.28rem;
		line-height: 1.28rem;
		padding: 0 0.8rem /* 15/18.75 */;
		display: inline-block;
	}

	.userinfo {
		width: 33%;
		display: inline-block;
	}

	.info-title {
		font-size: 0.907rem /* 17/18.75 */;
		font-weight: 700;
		font-stretch: normal;
		letter-spacing: 0rem;
		color: #000000;
	}

	.info-name {
		margin-top: 0.64rem /* 12/18.75 */;
		height: 0.68rem;
		font-family: PingFang-SC-Medium;
		font-size: 0.64rem;
		font-weight: normal;
		font-stretch: normal;
		letter-spacing: 0rem;
		color: #8D8D8D;
	}

	.orders-title {
		font-size: 0.693rem /* 13/18.75 */;
		margin-left: 0.427rem /* 8/18.75 */;
		color: #333333;
		font-family: PingFang-SC-Bold;
	}

	.scroll-view-item {
		padding: 0 0.64rem /* 12/18.75 */;
		background-color: #FFFFFF;
		/*height: 11.893rem !* 223/18.75 *!;*/
		margin-bottom: 0.533rem;
		border-top: 0.053rem solid #F6F6F6;
	}

	.orderno {
		margin-top: 0.587rem /* 11/18.75 */;
		text-align: left;
		font-size: 0.64rem /* 12/18.75 */;
		height: 0.64rem /* 12/18.75 */;
		line-height: 0.64rem /* 35/18.75 */;
		letter-spacing: 0rem /* 0/18.75 */;
		color: #999999;
	}

	.orderno text {
		text-align: right;
		display: inline-block;
		width: 4.267rem /* 80/18.75 */;
	}

	.order-status {
		font-size: 0.693rem;
		float: right;
		color: #999999;
	}

	.storename {
		font-size: 0.693rem;
		font-weight: 700;
		float: left;
		color: #232323;
	}

	.goodsname {
		margin-top: 0.587rem /* 11/18.75 */;
		text-align: left;
		height: 0.747rem /* 14/18.75 */;
		font-family: PingFang-SC-Medium;
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 0.747rem /* 14/18.75 */;
		font-weight: normal;
		font-stretch: normal;
		line-height: 0.747rem;
		color: #666666;
	}

	.payuser {
		margin-top: 0.587rem /* 11/18.75 */;
		text-align: left;
		height: 0.64rem /* 12/18.75 */;
		font-family: PingFang-SC-Regular;
		font-size: 0.64rem /* 12/18.75 */;
		font-weight: normal;
		font-stretch: normal;
		line-height: 0.64rem /* 35/18.75 */;
		letter-spacing: 0rem /* 0/18.75 */;
		color: #999999;
	}

	.payuser text {
		text-align: right;
		display: inline-block;
		width: 4.267rem /* 80/18.75 */;
	}

	.look-detail {
		width: 3.2rem /* 60/18.75 */;
		height: 1.28rem /* 24/18.75 */;
		line-height: 1.28rem /* 24/18.75 */;
		font-size: 0.64rem /* 12/18.75 */;
		background-color: #FFFFFF;
		border-radius: 0.64rem /* 12/18.75 */;
		border: solid 1px #01B065;
		color: #01B065;
		display: inline-block;
		padding: 0 0.267rem /* 5/18.75 */;
	}

	.input-view {
		width: 65%;
		height: 1.76rem /* 33/18.75 */;
		background-color: #F2F2F2;
		border-radius: 0.907rem /* 17/18.75 */;
		display: inline-block;
		line-height: 1.76rem /* 33/18.75 */;
		padding: 0 0.693rem /* 13/18.75 */;
		float: left;
		box-sizing: border-box;
	}

	.input-uni-icon {
		float: left;
		font-size: 1.067rem /* 20/18.75 */;
	}

	.orderno-select {
		line-height: 1.76rem /* 33/18.75 */;
		height: 1.76rem /* 33/18.75 */;
		font-size: 0.693rem /* 13/18.75 */;
		text-align: left;
		width: calc(100% - 4rem /* 28/18.75 */);
		margin-left: 0.427rem /* 8/18.75 */;
		float: left;
	}

	.store-select {
		width: calc(100% - 3.2rem);
		box-sizing: border-box;
		height: 2.133rem /* 40/18.75 */;
		background-color: #F5F5F5;
		display: inline-block;
		border-radius: 0.213rem /* 4/18.75 */;
		line-height: 2.133rem;
		padding: 0 0.8rem 0;
		text-align: left;
		font-size: 0.64rem /* 12/18.75 */;
	}

	/deep/ .uni-input-placeholder {
		color: #BCBCBC;
	}

	.select-btn {
		margin-left: 0.48rem /* 9/18.75 */;
		display: inline-block;
		width: 2.667rem /* 50/18.75 */;
		height: 2.133rem /* 40/18.75 */;
		line-height: 2.133rem;
		vertical-align: top;
		padding: 0 0.533rem /* 10/18.75 */;
		background-color: #01B065;
		font-size: 0.693rem /* 13/18.75 */;
		color: #FFFFFF;
		border-radius: 0.213rem /* 4/18.75 */;
	}

	.select-btn:after {
		border: 1px solid #01B065;
	}

	.tab-list-button {
		background-color: #FFFFFF;
		height: 1.6rem /* 30/18.75 */;
		line-height: 1.4rem;
		width: 5.867rem /* 110/18.75 */;
		font-size: 0.693rem /* 13/18.75 */;
		color: #666666;
		border-radius: 0px;
		border: 2px solid #F5F5F5;
		font-family: PingFang-SC-Medium;
	}

	.tab-list-button:after {
		border-radius: 0px;
		border: 0px;
	}

	.tab-list-button:first-child {
		border-top-left-radius: 15px;
		border-bottom-left-radius: 15px;
	}

	.tab-list-button:last-child {
		border-top-right-radius: 15px;
		border-bottom-right-radius: 15px;
	}

	.active {
		font-family: PingFang-SC-Blod;
		background-color: #DEEEFF;
		border: 2px solid #DEEEFF;
		color: #01B065;
	}

	.navBar-btn {
		/*width: 2.56rem !* 48/18.75 *!;*/
		/*height: 1.76rem !* 33/18.75 *!;*/
		/*background-color: #F2F2F2;*/
		/*border-radius: 0.907rem !* 17/18.75 *!;*/
		float: left;
		margin-left: 0.533rem /* 10/18.75 */;
	}

	.bind-unbind {
		width: 1.12rem /* 21/18.75 */;
		height: 1.12rem /* 21/18.75 */;
		margin: 0.373rem /* 7/18.75 */ 0;
		cursor: pointer
	}

	/deep/ uni-checkbox .uni-checkbox-input {
		height: 0.853rem /* 16/18.75 */;
		width: 0.853rem /* 16/18.75 */;
	}

	/*.store-list /deep/ uni-checkbox .uni-checkbox-input {*/
	/*	border-radius: 50%;*/
	/*}*/

	.uni-tip {
		background-color: #FFF;
		box-sizing: border-box;
		font-size: 0.747rem /* 14/18.75 */;
		padding: 0 0.8rem /* 15/18.75 */;
	}

	.uni-tip-title {
		height: 2.827rem /* 53/18.75 */;
		line-height: 2.827rem /* 53/18.75 */;
		font-size: 0.8rem /* 15/18.75 */;
		font-weight: 700;
		font-stretch: normal;
		letter-spacing: 0px;
		color: #333333;
		border-bottom: 1px solid #F3F3F3;
	}

	.uni-tip-group-button {
		padding: 0.8rem /* 15/18.75 */ 0;
	}

	.uni-tip-button {
		width: 7.627rem /* 143/18.75 */;
		height: 2.24rem /* 42/18.75 */;
		background-color: #FFFFFF;
		border-radius: 1.12rem /* 21/18.75 */;
		border: solid 1px #E5E5E5;
		display: inline-block;
		font-size: 0.853rem /* 16/18.75 */;
		line-height: 2.24rem /* 42/18.75 */;
		color: #333;
	}

	.bind-tip {
		padding: 0.533rem /* 10/18.75 */;
		background-color: #FFEDD7;
		border-radius: 0.16rem /* 3/18.75 */;
		margin-top: 0.427rem /* 8/18.75 */;
	}

	.tip-title {
		width: 100%;
		text-align: left;
		font-family: PingFang-SC-Medium;
		font-size: 0.64rem /* 12/18.75 */;
		font-weight: normal;
		font-stretch: normal;
		line-height: 0.907rem /* 17/18.75 */;
		letter-spacing: 0px;
		color: #FFA332;
	}

	.store-list {
		text-align: left;
		margin: 0 auto;
		height: 2.347rem /* 44/18.75 */;
		line-height: 2.347rem;
		background-color: #F5F5F5;
		border-radius: 0.213rem /* 4/18.75 */;
		padding: 0 0.8rem /* 15/18.75 */;
		margin-top: 0.533rem /* 10/18.75 */;
	}

	.uni-checkbox-input {
		border-radius: 11px;
	}

	.form-border {
		padding: 0 0.533rem;
		border: 1px solid #F3F3F3;
		margin-top: 0.267rem /* 5/18.75 */;
	}

	.form-border1 {
		font-size: 0.64rem /* 12/18.75 */;
		/*padding: 0.533rem 0.533rem;*/
		border: 1px solid #F3F3F3;
		margin-top: 0.267rem /* 5/18.75 */;
	}

	.form-border1 view {
		font-size: 0.64rem /* 12/18.75 */;
		text-align: left;
		line-height: 1.6rem /* 30/18.75 */;
	}

	.form-border view {
		font-size: 0.64rem /* 12/18.75 */;
		text-align: left;
		line-height: 1.6rem /* 30/18.75 */;
		/*margin-bottom: 0.267rem !* 5/18.75 *!;*/
	}

	.form-border view:first-child label {
		text-align: left;
		display: inline-block;
		width: 3.2rem /* 60/18.75 */;
	}

	.form-border view label {
		text-align: right;
		display: inline-block;
		width: 5.333rem /* 100/18.75 */;
	}

	.form-border view text {
		line-height: 1.173rem;
	}

	/deep/ .tabBlock .tab {
		padding-bottom: 0px;
	}

	/deep/ .tabBlock .tab__item {
		line-height: 39px !important;
	}

	/deep/ .tabBlock .tab__line {
		bottom: 0;
	}

	.goods {
		display: inline-block;
		vertical-align: top;
		font-size: 0.693rem /* 13/18.75 */;
		color: #000000;
	}

	.goods-title {
		padding: 0 0.747rem /* 14/18.75 */;
		width: 8.8rem /* 165/18.75 */;
		text-align: left;
		overflow: hidden;
		text-overflow: ellipsis;
		line-clamp: 2;
	}

	.goods-title view {
		width: 8.8rem /* 165/18.75 */;
		text-align: left;
		overflow: hidden;
		word-break: break-all; /* break-all(允许在单词内换行。) */
		text-overflow: ellipsis; /* 超出部分省略号 */
		display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
		-webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
		-webkit-line-clamp: 2; /** 显示的行数 **/
	}

	.first-tr /deep/ .t-check-box:first-child uni-checkbox-group:first-child {
		display: none;
	}

	input::-webkit-input-placeholder {
		font-size: 0.64rem /* 12/18.75 */;
	}
</style>