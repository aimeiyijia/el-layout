// sotre/index.ts
import Vue from 'vue'
import Vuex from 'vuex'
import { VuexPersistence } from 'vuex-persist'

export interface IRootState {}

const vuexLocal = new VuexPersistence<IRootState>({
    key: 'layoutvuex',
    storage: window.sessionStorage,
  })

Vue.use(Vuex)
export default new Vuex.Store({ plugins: [vuexLocal.plugin] })
