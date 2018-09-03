import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

Vue.filter('numberBeautify', value => {
  const str = String(value)
  if (str.includes('.')) {
    return value.toFixed(2)
  } else {
    return Number.parseInt(value, 10)
  }
})

new Vue({
  render: h => h(App)
}).$mount('#app')
