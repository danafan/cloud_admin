import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

Vue.use(ElementUI);
Vue.prototype.captcha = `${location.origin}/admin/admin/captcha`;		//获取验证码前缀
Vue.prototype.qn_url = 'http://img.gxk8090.com/';						//七牛云图片前缀前缀
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
