<template>
     <div>
          <div v-if="token">
               {{$router.push("/cars")}}
          </div>
          <div class="container w-75pt-4" v-else>
               <b-alert v-model="alertFlag" :variant="dangerAlert ? 'danger' : 'success'" dismissible>{{alertMessage}}</b-alert>
               <center class="pt-3">
                    <h1>Registration</h1>
               </center>
               <b-form class="justify-content-center" @submit.stop.prevent="onSubmit">
                    <div class="row">  
                         <b-form-group label="Email" class="col-sm-8">
                              <b-form-input id="email-input" name="email-input" placeholder="example@example.com"
                                   v-model="form.email"
                                   v-validate="{ required: true, email: true }"
                                   :state="validateState('email-input')" 
                                   aria-describedby="email-input-live-feedback"
                                   data-vv-as="email">
                              </b-form-input>
                              <b-form-invalid-feedback id="email-input-live-feedback">{{ veeErrors.first('email-input') }}</b-form-invalid-feedback>
                         </b-form-group>
                         <b-form-group label="Pick your currency" class="col-sm-4">
                              <b-form-select id="currency-input" name="currency-input"
                                   v-model="form.currency"
                                   :options="rates"
                                   v-validate="{ required: true }"
                                   :state="validateState('currency-input')"
                                   aria-describedby="currency-input-live-feedback"
                                   data-vv-as="currency" > 
                              </b-form-select>
                              <b-form-invalid-feedback id="currency-input-live-feedback">{{ veeErrors.first('currency-input') }}</b-form-invalid-feedback>
                         </b-form-group>
                    </div>
                    <b-form-group label="Password">
                         <b-form-input id="password1-input" name="password1-input" type="password"
                              v-model="form.password"
                              v-validate="{ required: true, min:8}"
                              :state="validateState('password1-input')" 
                              aria-describedby="password1-input-live-feedback"
                              data-vv-as="password">
                         </b-form-input>
                         <b-form-invalid-feedback id="password1-input-live-feedback">{{ veeErrors.first('password1-input') }}</b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group class=" mb-3" label="Repeat password">
                         <b-form-input id="password2-input" name="password2-input" type="password" 
                              v-model="form.password2"
                              v-validate="{ required: true, min:8, is: form.password}"
                              :state="validateState('password2-input')" 
                              aria-describedby="password2-input-live-feedback"
                              data-vv-as="password">>
                         </b-form-input>
                         <b-form-invalid-feedback id="password2-input-live-feedback">
                              {{ veeErrors.first('password2-input') }}
                         </b-form-invalid-feedback>
                    </b-form-group>  
                    <b-button type="submit" variant="primary">Register</b-button>                          
               </b-form>
          </div>
     </div>
</template>

<script>
import axios from 'axios';
const backEndUrl = process.env.VUE_APP_API;
export default {
     data() {
          return {
               form:{
                    email: '',
                    password: '',
                    password2: '',
                    currency: ''
               },
               rates: [],
               email:'',
               dangerAlert: false,
               alertFlag: false,
               alertMessage: ''
          }
     }, 
     computed: {
          token: function () {  
               return window.$cookies.get('token');  
          }
     },
     created() {
        this.getCurrencies();  
     },
     methods: {
          getCurrencies() {
               let vm = this;
               axios.get(backEndUrl + "/api/currency")
               .then(function (response) {
                    vm.rates = response.data;
                    vm.form.currency = 'EUR';
               })
               .catch(function (error){
                    console.log(error);
               });
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

                    this.register();
               });
          },
          register() {
               let vm = this;
               axios.post(backEndUrl + '/api/auth/register', this.form)
               .then(function (response){
                    if(response.status == 200)
                    {     
                         vm.alertMessage = response.data;
                         vm.dangerAlert = false;
                         vm.alertFlag = true;         
                         //vm.$router.push('/login');
                         //vm.login();           
                    }
               })
               .catch(function (error){
                    console.log(error);
                    vm.alertMessage = error.response.data;
                    vm.dangerAlert = true;
                    vm.alertFlag = true; 
               })
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
                              vm.message = "Successfully loged in user";
                              vm.successAlert = true;
                              window.location.href = "/cars";
                         }
                         else if(role == "admin")
                         {
                              vm.message = "Successfully loged in admin";
                              vm.successAlert = true;
                              window.location.href = "/admin";
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