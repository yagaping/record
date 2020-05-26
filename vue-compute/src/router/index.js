import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import My from '../views/My.vue'
import 'vant/lib/index.css'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about/:id',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },{
    path: '/my/:id',
    name: '我的',
    component: My,
    children:[
      {
        path:'like',
        component:() => import('../views/my/like.vue')
      },{
        path:'',
        component:() => import('../views/my/play.vue')
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/404.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
