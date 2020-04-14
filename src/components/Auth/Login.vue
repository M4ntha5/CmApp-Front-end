<template>
     <div>
          <div v-if="token">
               {{$router.push("/cars")}}
          </div>
          <div class="container pt-5 w-75" v-else>
               <b-alert v-model="dangerAlert" variant="danger" dismissible>{{message}}</b-alert>
               <b-alert v-model="successAlert" variant="success" dismissible>{{message}}</b-alert>
               <center><h1>Login</h1></center>
               <b-form class="justify-content-center" @submit.prevent="onSubmit" >
                    <b-form-group label="Email">
                         <b-form-input id="email-input" name="email-input" placeholder="example@example.com"
                              v-model="form.email"
                              v-validate="{ required: true, email: true }"
                              :state="validateState('email-input')" 
                              aria-describedby="email-input-live-feedback"
                              data-vv-as="email">
                         </b-form-input>
                         <b-form-invalid-feedback id="email-input-live-feedback">{{ veeErrors.first('email-input') }}</b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group label="Password">
                         <b-form-input id="password1-input" name="password1-input" type="password"
                              v-model="form.password"
                              v-validate="{ required: true, min:8 }"
                              :state="validateState('password1-input')" 
                              aria-describedby="password1-input-live-feedback"
                              data-vv-as="password">
                         </b-form-input>
                         <b-form-invalid-feedback id="password1-input-live-feedback">{{ veeErrors.first('password1-input') }}</b-form-invalid-feedback>
                    </b-form-group>
                    <b-row>
                         <b-button class="ml-3" type="submit" variant="primary">Log in</b-button>
                              <a v-b-modal.forgot-password-modal href=""
                                   @click.prevent="showResetModal" class="ml-2"
                                   @ok="fetchCars()">
                                   Forgot your password?
                              </a>
                         <resetModal v-show="isResetModalVisible"/>
                    </b-row>                                         
               </b-form>
          </div>
    </div>
</template>

<script>
import axios from 'axios';
import resetModal from '../Modals/ForgotPassword.vue';
const backEndUrl = process.env.VUE_APP_API;

export default {
     data() {
          return {
               form: {
                    email: '',
                    password: '',
               },
               dangerAlert: false,
               successAlert: false,
               message: '',
               isResetModalVisible: false   
          }
     }, 
     components:{
          resetModal
     },
     computed: {
          token: function () {  
               return window.$cookies.get('token');  
          }
     },
     methods: {
          showResetModal(){
               this.isResetModalVisible = true;
          },
          validateState(ref) {
               if (this.veeFields[ref] && (this.veeFields[ref].dirty || this.veeFields[ref].validated))
                    return !this.veeErrors.has(ref);
               return null;
          },
          onSubmit() {
               this.$validator.validateAll().then(result => {
                    if (!result)
                         return;

                    this.login();
               });
          },
          login() {
               let vm = this;
               axios.post(backEndUrl + '/api/auth/login', this.form)
               .then(function (response){
                    if(response.status == 200)
                    {
                         let token = response.data;   
                         //decode role from token
                         let jwtData = token.split('.')[1];
                         let decodedJwtJsonData = window.atob(jwtData);
                         let role = decodedJwtJsonData.split(',')[0].split('"')[3];
                         let email = decodedJwtJsonData.split(',')[2].split('"')[3];
                         let user = decodedJwtJsonData.split(',')[1].split('"')[3];
                         let currency = decodedJwtJsonData.split(',')[3].split('"')[3];

                         window.$cookies.set('token', token, '1h');
                         window.$cookies.set('user-email', email, '1h');
                         window.$cookies.set('role', role, '1h');
                         window.$cookies.set('user', user, '1h');
                         window.$cookies.set('currency', currency, '1h');

                         if(role == "user")
                         {
                              vm.message = "Successfully loged in";
                              vm.successAlert = true;
                              window.location.href = "/cars";
                         }
                         else if(role == "admin")
                         {
                              vm.message = "Successfully loged in admin";
                              vm.successAlert = true;
                              window.location.href = "/users";
                         }                          
                    }
               })
               .catch(function (error){
                    console.log(error);
                    vm.message = error.response.data;
                    vm.dangerAlert = true;
               })
          },
     }
}
</script>