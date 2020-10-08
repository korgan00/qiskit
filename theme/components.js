import Vue from 'vue/dist/vue.esm.browser.js'
import World from '../content/states/world/World.vue'

Vue.component('World', World)

const app = new Vue({
  el: '#app'
})
