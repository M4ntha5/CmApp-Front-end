<template>
<div>
     <div class="container pt-4"  v-if="!loading">
          <center class="mb-4"><h1>Your profile information</h1></center>
          <b-form>
               <div class="form-row">
                    <b-form-group class="col-md-6" label="First name">
                         <b-form-input id="name-input" name="name-input" placeholder="John"
                              v-model="user.firstName"     
                              v-validate="{ required: false }"
                              :state="validateState('name-input')" 
                              aria-describedby="name-input-live-feedback"
                              data-vv-as="name">
                         </b-form-input>
                         <b-form-invalid-feedback id="name-input-live-feedback">
                              {{ veeErrors.first('name-input') }}
                         </b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Last name">
                         <b-form-input id="surname-input" name="surname-input" placeholder="Kennedy"
                              v-model="user.lastName"     
                              v-validate="{ required: false }"
                              :state="validateState('surname-input')" 
                              aria-describedby="surname-input-live-feedback"
                              data-vv-as="surname">
                         </b-form-input>
                         <b-form-invalid-feedback id="surname-input-live-feedback">
                              {{ veeErrors.first('surname-input') }}
                         </b-form-invalid-feedback>
                    </b-form-group>
               </div>
               <div class="form-row">
                    <b-form-group class="col-md-12" label="Email">
                         <b-form-input disabled id="email-input" name="email-input" placeholder="example@example.com"
                              v-model="user.email"
                              v-validate="{ required: false, email: true }"
                              :state="validateState('email-input')" 
                              aria-describedby="email-input-live-feedback"
                              data-vv-as="email">
                         </b-form-input>
                         <b-form-invalid-feedback id="email-input-live-feedback">
                              {{ veeErrors.first('email-input') }}
                         </b-form-invalid-feedback>
                    </b-form-group>
               </div>
               <div class="form-row">
                    <b-form-group class="col-md-2" label="Sex">
                         <b-form-radio-group name="sex-input" id="sex-input"
                              v-model="user.sex"
                              :options="sexOptions"
                              v-validate="{ required: false }"
                              :state="validateState('sex-input')" 
                              aria-describedby="sex-input-live-feedback"
                              data-vv-as="sex">
                         </b-form-radio-group>
                         <b-form-invalid-feedback id="sex-input-live-feedback">
                              {{ veeErrors.first('sex-input') }}
                         </b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group class="col-md-5" label="Born date">
                         <b-form-input name="bornDate-input" type="date"
                              v-model="user.bornDate"     
                              v-validate="{ required: false }"
                              :state="validateState('bornDate-input')" 
                              aria-describedby="bornDate-input-live-feedback"
                              data-vv-as="bornDate">
                         </b-form-input>
                         <b-form-invalid-feedback id="bornDate-input-live-feedback">
                              {{ veeErrors.first('bornDate-input') }}
                         </b-form-invalid-feedback>
                    </b-form-group>
                    
                    <b-form-group class="col-md-5" label="Country">
                         <b-form-select name="country-input"
                              v-model="user.country" 
                              :options="countries"
                              v-validate="{ required: false }"
                              :state="validateState('country-input')" 
                              aria-describedby="country-input-live-feedback"
                              data-vv-as="country">
                         </b-form-select>
                         <b-form-invalid-feedback id="country-input-live-feedback">
                              {{ veeErrors.first('country-input') }}
                         </b-form-invalid-feedback>
                    </b-form-group>

               </div>
          </b-form>
          <div class="pt-3">
               <b-button type="submit" @click.prevent="onSubmit()" variant="primary">Save</b-button>
          </div>
     </div>
     <div class="pt-3" v-else>
          <center>
               <b-spinner label="Loading..."></b-spinner>
          </center> 
     </div>
</div>   
</template>
<script>
import axios from 'axios';
const backEndUrl = process.env.VUE_APP_API;

export default {
     data() {
          return {
               loading: true,
               user: {
                    firstName: '',
                    lastName: '',
                    email: '',
                    sex: '',
                    bornDate: '',
                    country: 'Lithuania'
               },
               sexOptions: ['Men', 'Women'],
               countries: []
          }
     },
     mounted() {
          this.getAllCountries();
          this.fetchUser();
     },
     methods: {
          validateState(ref) {
               if (this.veeFields[ref] && (this.veeFields[ref].dirty || this.veeFields[ref].validated))
                    return !this.veeErrors.has(ref);
               return null;
          },
          fetchUser() {
               let vm = this;
               axios.get(backEndUrl + `/api/users/${vm.$route.params.id}`, {
                    headers: {
                              Authorization: 'Bearer ' + window.$cookies.get('token')
                    }
               })
               .then( function (response){
                    if(response.status == 200)
                    {
                         vm.user = response.data;
                         vm.loading = false;
                    }
                    else if(response.status == 401)
                    {
                         vm.$cokkies.remove('token');
                         vm.$router.push('/');
                    }
               })
               .catch(function (error) {
                    console.log(error);
                    vm.loading = false;
               })
          },
          onSubmit() {
               this.$validator.validateAll().then(result => {
                    if (!result)
                         return;
                    this.updateUser();
               });             
          },
          updateUser() {
               let vm = this;
               console.log(window.$cookies.get('token'));
               axios.put(backEndUrl + `/api/users/${vm.$route.params.id}`, vm.user, {
                    headers: {
                              Authorization: 'Bearer ' + window.$cookies.get('token')
                    }
               })
               .then( function (response){
                    if(response.status == 204)
                         vm.$router.push('/cars');

                    else if(response.status == 401)
                    {
                         vm.$cokkies.remove('token');
                         vm.$router.push('/');
                    }
               })
               .catch(function (error) {
                    console.log(error);
               })
          },
          getAllCountries() {
               let vm = this;
               axios.get(backEndUrl + '/api/countries', {
                    headers: {
                         Authorization: 'Bearer ' + window.$cookies.get('token')
                    }
               })
               .then(function (response){
                    if(response.status == 200)
                         vm.countries = response.data;

                    else if(response.status == 204)
                    {
                         vm.$cokkies.remove('token');
                         vm.$router.push('/');
                    }
               })
               .catch(function (error){
                    console.log(error);
               })
          }
     }
     
}
</script>
