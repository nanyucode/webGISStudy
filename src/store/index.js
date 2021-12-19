import Vue from 'vue';
//引入状态管理
import Vuex from 'vuex';

//调用
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    menuList:[
      {name:'平面地图',path:'/map'},
      {name:'三维地图',path:'/map2'},
    ],
    menuIndex:0,
  },
  mutations: {
    switchMenuIndex(state,index){
      state.menuIndex = index.index;
    }
  },
  actions: {
    switchMenuIndex(context,index){
      context.commit('switchMenuIndex',{index:index})
    }

  },
  modules: {
  }
})
