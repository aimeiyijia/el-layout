// sotre/index.ts
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({}) // 由于passenger->dynamic: true: 是动态创建动态模块,所以不需要再次注册
