<template>
     <div>
          <div class="container pt-5 w-75">
               <b-alert v-model="alertFlag" :variant="dangerAlert ? 'danger' : 'success'" dismissible>{{message}}</b-alert>
               <center><h1>Password reset</h1></center>
               <b-form class="justify-content-center" @submit.prevent="onSubmit" >
                    <b-form-group label="New Password">
                         <b-form-input name="password1-input" type="password"
                              v-model="form.password"
                              v-validate="{ required: true, min:8 }"
                              :state="validateState('password1-input')" 
                              aria-describedby="password1-input-live-feedback"
                              data-vv-as="New Password">
                         </b-form-input>
                         <b-form-invalid-feedback id="password1-input-live-feedback">{{ veeErrors.first('password1-input') }}</b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group label="Verify Password">
                         <b-form-input name="password2-input" type="password"
                              v-model="form.password2"
                              v-validate="{ required: true, min:8, is: form.password }"
                              :state="validateState('password2-input')" 
                              aria-describedby="password2-input-live-feedback"
                              data-vv-as="Verify Password">
                         </b-form-input>
                         <b-form-invalid-feedback id="password2-input-live-feedback">{{ veeErrors.first('password2-input') }}</b-form-invalid-feedback>
                    </b-form-group>
                    <b-button type="submit" :disabled="buttonClicked" variant="primary">Reset my password</b-button>                                      
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
               form: {
                    password: '',
                    password2: '',
                    token: this.$route.query.token
               },
               dangerAlert: false,
               alertFlag: false,
               message: '',
               buttonClicked: false
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
                    this.buttonClicked = true;
                    this.resetPassword();
               });
          },
          resetPassword() {
               let vm = this;
               axios.post(backEndUrl + `/api/auth/password/reset`, vm.form)
               .then(function (response){
                    if(response.status == 200)
                    {
                         vm.message = response.data;
                         vm.dangerAlert = false;
                         vm.alertFlag = true;
                         setTimeout(function () {
                              vm.$router.push('/login');
                         }, 3000);
                    }
               })
               .catch(function (error){
                    console.log(error);
                    vm.message = error.response.data;
                    vm.dangerAlert = true;
                    vm.alertFlag = true;
                    vm.buttonClicked = false;
               })
          },
     }
}
</script>