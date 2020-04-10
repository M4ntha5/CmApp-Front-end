<template>
     <div class="container">
          <b-alert v-model="alertFlag" :variant="dangerAlert ? 'danger' : 'success'" dismissible>{{alertMessage}}</b-alert>
     </div>
</template>
<script>
import axios from 'axios';
const backEndUrl = process.env.VUE_APP_API;
export default {
     data(){
          return {
               alertFlag: false,
               dangerAlert: false,
               alertMessage: ''
          }        
     },
     mounted(){
          this.confirmEmail();
     },
     methods:{
          confirmEmail(){
               let vm = this;
               axios.get(backEndUrl + `/api/auth/email/confirm/${this.$route.params.id}`)
               .then(function (response) {
                    if(response.status == 200)
                    {
                         vm.dangerAlert = false;
                         vm.alertMessage = response.data;
                         vm.alertFlag = true;
                         setTimeout(function () {
                              vm.$router.push('/login');
                         }, 3000);
                    }
               })
               .catch(function (error) {
                    console.log(error);
               })
          }            
     }
}
</script>