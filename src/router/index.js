import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(Router)

//获取原型对象上的push函数
const originalPush = Router.prototype.push
//修改原型对象中的push方法
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const routes = [{
    path: '/',
    name: 'Home',
    component: Home,
    redirect:'/map'
  },
  {
    path: '/about',
    name: 'About',
    component: () => import( /* webpackChunkName: "about" */ '../views/About.vue')
  },
   {
     path:'/map',
     name:'Map',
     component:Home,
     redirect:'/mappage',
     children:[
       {
         path:'/mappage',
         name:'Mappage',
         component:()=>import('../views/Map/Map.vue')
       },
     ]
  },
  {
    path:'/map2',
    name:'Map2',
    component:Home,
    redirect:'/map2page',
    children:[
      {
        path:'/map2page',
        name:"Map2Page",
        component:()=>import('../views/Map2.vue')
      }
    ]
  }
]

export default new Router({routes:routes})