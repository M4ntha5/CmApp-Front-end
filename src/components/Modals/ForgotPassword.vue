<template>
     <div>
          <b-modal id="forgot-password-modal" ref="modal" title="Pssword reset"
          @show="resetModal"
          @ok.prevent="onSubmit()"
          @close="resetModal"
          :ok-disabled="buttonClicked">  
          <b-alert v-model="alertFlag" :variant="dangerAlert ? 'danger': 'success'" dismissible>{{alertMessage}}</b-alert>
          <b-form ref="form" @submit.stop.prevent="onSubmit()">
               <b-form-group label="Your account email address">
                    <b-form-input id="email-input" name="email-input" placeholder="example@example.com"
                         v-model="form.email"
                         v-validate="{ required: true, email: true }"
                         :state="validateState('email-input')" 
                         aria-describedby="email-input-live-feedback"
                         data-vv-as="Email">
                    </b-form-input>
                    <b-form-invalid-feedback id="email-input-live-feedback">{{ veeErrors.first('email-input') }}</b-form-invalid-feedback>
               </b-form-group>            
          </b-form>
        </b-modal>
    </div>
</template>

<script>
import axios from 'axios';
const backEndUrl = process.env.VUE_APP_API;
export default {
     data(){
          return {
               form:{
                    email:'',
                    password:'',
                    password2:''
               },          
               alertFlag: false,
               dangerAlert: false,
               alertMessage: '',
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
          resetModal() {
               this.form.email = '';
          },
          resetPassword() {
               let vm = this;        
               axios.post(backEndUrl + '/api/auth/password/reset/token', this.form)
               .then(function (response) {
                    if(response.status == 200)
                    {
                         vm.alertMessage = response.data;
                         vm.dangerAlert = false;
                         vm.alertFlag = true;
                         // Hide the modal manually
                         setTimeout(function () {
                              vm.$nextTick(() => {
                                   vm.$bvModal.hide('forgot-password-modal')
                              })
                         }, 4000);
                    }
               })
               .catch(function (error) {
                    vm.alertMessage = error.response.data;
                    vm.dangerAlert = true;
                    vm.alertFlag = true;
                    vm.buttonClicked = false;
                    if(error.response.status == 401) 
                    {
                         vm.$cookies.remove('token');
                         vm.$cookies.remove('user-email');
                         vm.$cookies.remove('role');
                         vm.$cookies.remove('user');
                         vm.$cookies.remove('currency');
                         vm.$router.push('/login');
                    }
               }); 
          },
     }
}
</script>