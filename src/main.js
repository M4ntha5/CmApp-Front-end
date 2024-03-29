import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import VueRouter from 'vue-router'
import VueCookies from 'vue-cookies';
import Cars from './components/Cars/Cars.vue';
import ShowCar from './components/Cars/Show.vue';
import Edit from './components/Cars/Edit.vue';
import About from './components/Pages/About.vue';
import Home from './components/Home.vue';
import Login from './components/Auth/Login.vue';
import Register from './components/Auth/Register.vue';
import Tracking from './components/Cars/Tracking.vue';
import Converter from './components/ExcangeConverter/Converter.vue';
import InsertOther from './components/Cars/InsertOther.vue';
import NotFound from './components/Pages/404.vue';
import UserEdit from './components/User/UserEdit.vue';
import CarStats from './components/User/Stats.vue';
import ChangePass from './components/User/ChangePassword.vue';
import EmailConfirm from './components/Auth/ConfirmEmail.vue';
import PasswordReset from './components/Auth/PasswordReset.vue';
import AllUsers from './components/Admin/Users.vue';
import AllCars from './components/Admin/AllCars.vue';
import AllMakes from './components/Admin/CarMakes.vue';


Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.use(VueCookies);
Vue.use(VeeValidate, {
    // This is the default
    inject: true,
    // Important to name this something other than 'fields'
    fieldsBagName: 'veeFields',
    // This is not required but avoids possible naming conflicts
    errorBagName: 'veeErrors'
});
Vue.config.productionTip = false

const routes = [ 
    { path: '/', component: Home },
    { path: '/cars', component: Cars,
      beforeEnter: (to, from, next) => {
          let jwt = window.$cookies.get('token');
          if(jwt == null || jwt.length < 10) next("/login")
          else next()
        } 
    },
    { path: '/cars/:id', component: ShowCar,
      beforeEnter: (to, from, next) => {
          let jwt = window.$cookies.get('token');
          if(jwt == null || jwt.length < 10) next("/login")
          else next()
      }
    },
  { path: '/cars/:id/tracking', component: Tracking,
      beforeEnter: (to, from, next) => {
          let jwt = window.$cookies.get('token');
          if(jwt == null || jwt.length < 10) next("/login")
          else next()
      }  
    },
    { path: '/cars/:id/edit', component: Edit,
      beforeEnter: (to, from, next) => {
          let jwt = window.$cookies.get('token');
          if(jwt == null || jwt.length < 10) next("/login")
          else next()
      }  
    },
    { path: '/other-insert', component: InsertOther,
      beforeEnter: (to, from, next) => {
        let jwt = window.$cookies.get('token');
        if(jwt == null || jwt.length < 10) next("/login")
        else next()
      }
    },
    { path: '/users/:id/edit', component: UserEdit,
      beforeEnter: (to, from, next) => {
        let jwt = window.$cookies.get('token');
        if(jwt == null || jwt.length < 10) next("/login")
        else next()
      }
    },
    { path: '/users/:id/stats', component: CarStats,
      beforeEnter: (to, from, next) => {
        let jwt = window.$cookies.get('token');
        if(jwt == null || jwt.length < 10) next("/login")
        else next()
      }
    },
    { path: '/users/:id/change/password', component: ChangePass,
      beforeEnter: (to, from, next) => {
        let jwt = window.$cookies.get('token');
        if(jwt == null || jwt.length < 10) next("/login")
        else next()
      }
    },
    { path: '/users', component: AllUsers,
      beforeEnter: (to, from, next) => {
        let jwt = window.$cookies.get('token');
        let role = window.$cookies.get('role');
        if(jwt == null || jwt.length < 10 || role != 'admin') next("/login")
        else next()
      }
    },
    { path: '/admin/cars', component: AllCars,
      beforeEnter: (to, from, next) => {
        let jwt = window.$cookies.get('token');
        let role = window.$cookies.get('role');
        if(jwt == null || jwt.length < 10 || role != 'admin') next("/login")
        else next()
      }
    },
    { path: '/email/confirm/:id', component: EmailConfirm },
    { path: '/password/reset', component: PasswordReset },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/converter', component: Converter },
    { path: '/makes', component: AllMakes }, 
    { path: '/about', component: About }, 
    { path: '/404', component: NotFound },
    { path: '*', redirect: '/404' },

];

const router = new VueRouter({
    routes,
    mode:'history'
});

new Vue({
    el: '#app',
    router,
    render: h =>h(App)
});
