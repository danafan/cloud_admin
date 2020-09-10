import Vue from 'vue'
import Router from 'vue-router'

const login = resolve=>require(['@/pages/Login/login'],resolve)
const home = resolve=>require(['@/pages/Home/home'],resolve)
const index = resolve=>require(['@/pages/Index/index'],resolve)
const trade_order = resolve=>require(['@/pages/Trading/trade_order'],resolve)
const receipt = resolve=>require(['@/pages/Trading/receipt'],resolve)
const hang_order = resolve=>require(['@/pages/Trading/hang_order'],resolve)
const pay_record = resolve=>require(['@/pages/Trading/pay_record'],resolve)
const money_detail = resolve=>require(['@/pages/Trading/money_detail'],resolve)
const money_record = resolve=>require(['@/pages/Trading/money_record'],resolve)
const single = resolve=>require(['@/pages/Single/single'],resolve)
const single_detail = resolve=>require(['@/pages/Single/single_detail'],resolve)
const account_management = resolve=>require(['@/pages/Store/AccountManagement/account_management'],resolve)
const invoice_category = resolve=>require(['@/pages/Invoice/invoice_category'],resolve)
const invoice_record = resolve=>require(['@/pages/Invoice/invoice_record'],resolve)
const have_invoice = resolve=>require(['@/pages/Invoice/have_invoice'],resolve)
const sign_user = resolve=>require(['@/pages/User/sign_user'],resolve)
const store_list = resolve=>require(['@/pages/Store/store_list'],resolve)
const store_index = resolve=>require(['@/pages/Store/StoreInfo/index'],resolve)
const store_data = resolve=>require(['@/pages/Store/store_data'],resolve)
const associated = resolve=>require(['@/pages/Store/associated'],resolve)
const deductions_record = resolve=>require(['@/pages/Tax/deductions_record'],resolve)
const correspondence = resolve=>require(['@/pages/Message/correspondence'],resolve)
const system = resolve=>require(['@/pages/Message/system'],resolve)
const basic_set = resolve=>require(['@/pages/System/basic_set'],resolve)
const ervice_subject = resolve=>require(['@/pages/System/ervice_subject'],resolve)
const bank_setting = resolve=>require(['@/pages/System/bank_setting'],resolve)
const account_pre = resolve=>require(['@/pages/Permissions/account_pre'],resolve)
const management = resolve=>require(['@/pages/Permissions/management'],resolve)
Vue.use(Router)

const router = new Router({
  routes: [
  {
    path: '/login',
    component: login,
  },
  {
    path: '/home',
    component: home,
    children:[
    { path: '/index',name:"首页列表", component: index},
    { path: '/trade_order',name:"交易订单", component: trade_order},
    { path: '/receipt',name:"电子回单", component: receipt},
    { path: '/hang_order',name:"挂起订单", component: hang_order},
    { path: '/pay_record',name:"批量打款记录", component: pay_record},
    { path: '/money_detail',name:"打款详情", component: money_detail},
    { path: '/money_record',name:"资金流水", component: money_record},
    { path: '/single',name:"调单记录", component: single},
    { path: '/single_detail',name:"调单记录/详情", component: single_detail},
    { path: '/account_management',name:"商户管理/账户管理", component: account_management},
    { path: '/invoice_category',name:"发票管理/发票类目", component: invoice_category},
    { path: '/invoice_record',name:"发票管理/申请记录", component: invoice_record},
    { path: '/have_invoice',name:"发票管理/已开发票", component: have_invoice},
    { path: '/sign_user',name:"用户管理/签约用户", component: sign_user},
    { path: '/store_list',name:"商户管理/商户列表", component: store_list},
    { path: '/store_index',name:"商户管理/商户信息", component: store_index},
    { path: '/store_data',name:"商户管理/商户数据", component: store_data},
    { path: '/associated',name:"商户管理/关联数据", component: associated},
    { path: '/deductions_record',name:"税务管理/个税扣缴明细", component: deductions_record},
    { path: '/correspondence',name:"消息管理/函件通知", component: correspondence},
    { path: '/system',name:"消息管理/系统公告", component: system},
    { path: '/basic_set',name:"系统设置/基本设置", component: basic_set},
    { path: '/ervice_subject',name:"系统设置/综合服务主体", component: ervice_subject},
    { path: '/bank_setting',name:"系统设置/银行卡设置", component: bank_setting},
    { path: '/account_pre',name:"权限管理/账号管理", component: account_pre},
    { path: '/management',name:"权限管理/权限管理", component: management},
    ]
  }
  ]
})
// 路由跳转前的钩子
router.beforeEach(function (to, from, next) {
  let path = to.fullPath;
  sessionStorage.setItem("tab",path);
  next()
})
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
export default router;