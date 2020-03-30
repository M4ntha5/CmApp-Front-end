<template>
     <div>
          <div v-if="token">
               {{$router.push("/cars")}}
          </div>
          <div class="container pt-4" v-else>
               <b-alert v-model="dangerAlert" variant="danger" dismissible>{{message}}</b-alert>
               <b-alert v-model="successAlert" variant="success" dismissible>{{message}}</b-alert>
               <center class="pt-3">
                    <h1>Registration</h1>
               </center>
               <b-form class="justify-content-center" @submit.stop.prevent="onSubmit" >
                    <b-form-group label="Email">
                         <b-form-input id="email-input" name="email-input" type="email" placeholder="example@example.com"
                              v-model="form.email"
                              v-validate="{ required: true, email }"
                              :state="validateState('email-input')" 
                              aria-describedby="email-input-live-feedback"
                              data-vv-as="email">
                         </b-form-input>
                         <b-form-invalid-feedback id="email-input-live-feedback">{{ veeErrors.first('email-input') }}</b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group label="Password">
                         <b-form-input id="password1-input" name="password1-input" type="password"
                              v-model="form.password"
                              v-validate="{ required: true, min: 3 }"
                              :state="validateState('password1-input')" 
                              aria-describedby="password1-input-live-feedback"
                              data-vv-as="password">
                         </b-form-input>
                         <b-form-invalid-feedback id="password1-input-live-feedback">{{ veeErrors.first('password1-input') }}</b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group class=" mb-3" label="Repeat password">
                         <b-form-input id="password2-input" name="password2-input" type="password" 
                              v-model="form.password2"
                              v-validate="{ required: true, min: 3}"
                              :state="validateState('password2-input')" 
                              aria-describedby="password2-input-live-feedback"
                              data-vv-as="password">>
                         </b-form-input>
                         <b-form-invalid-feedback id="password2-input-live-feedback">{{ veeErrors.first('password2-input') }}</b-form-invalid-feedback>
                    </b-form-group>  
                    <b-button type="submit" variant="primary">Submit</b-button>                          
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
               },
               email:'',
               dangerAlert: false,
               successAlert: false,
               message: ''
          }
     }, 
     computed: {
          token: function () {  
               return window.$cookies.get('token');  
          }
     },
     methods: {
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
                         vm.message = response.data;
                         vm.successAlert = !vm.successAlert;           
                         setTimeout(() => {  vm.$router.push("/login"); }, 1800);            
                    }
               })
               .catch(function (error){
                    console.log(error);
                    vm.message = error.response.data;
                    vm.dangerAlert = !vm.dangerAlert;   
               })
          }
     }
}
</script>