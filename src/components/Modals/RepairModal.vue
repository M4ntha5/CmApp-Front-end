<template>
     <div>
          <b-modal id="repair-insert-modal" ref="rep-modal" title="Insert new repair"
          @show="resetModal"
          @ok.prevent="onSubmit()"
          @close="resetModal"
          :ok-disabled="buttonClicked">  
          <b-alert v-model="alertFlag" :variant="dangerAlert ? 'danger': 'success'" dismissible>{{alertMessage}}</b-alert>
          <b-form ref="form" @submit.prevent="onSubmit()">            
               <b-form-group label="Name">
                    <b-form-input id="name-input" placeholder="New engine" name="name-input" 
                         v-model="insert.name"
                         v-validate="{ required: true }"
                         :state="validateState('name-input')" 
                         aria-describedby="name-input-live-feedback"
                         data-vv-as="Name">
                    </b-form-input>
                    <b-form-invalid-feedback id="name-input-live-feedback">
                         {{ veeErrors.first('name-input') }}
                    </b-form-invalid-feedback>
               </b-form-group>
               <b-form-group :label="'Price (' + baseCurrency + ')'">
                    <b-form-input id="price-input" name="price-input" placeholder="500"
                         v-model="insert.price"
                         v-validate="{ required: true, decimal:'2',min_value:0.01 }"
                         :state="validateState('price-input')" 
                         aria-describedby="price-input-live-feedback"
                         data-vv-as="Price">
                    </b-form-input>
                    <b-form-invalid-feedback id="price-input-live-feedback">
                         {{ veeErrors.first('price-input') }}
                    </b-form-invalid-feedback>
               </b-form-group>
               <b-form-group label="Car">
                    <b-form-select id="car-input" name="car-input" 
                         v-model="insert.car"
                         :options="cars"
                         v-validate="{ required: true }"
                         :state="validateState('car-input')" 
                         aria-describedby="car-input-live-feedback"
                         data-vv-as="Car">
                    </b-form-select>
                    <b-form-invalid-feedback id="car-input-live-feedback">
                         {{ veeErrors.first('car-input') }}
                    </b-form-invalid-feedback>
               </b-form-group>
          </b-form>
        </b-modal>
    </div>
</template>

<script>
import getSymbolFromCurrency from 'currency-symbol-map';
import axios from 'axios';
const backEndUrl = process.env.VUE_APP_API;
export default {
     data(){
          return {
               baseCurrency: getSymbolFromCurrency(window.$cookies.get('currency')),
               insert: {
                    name: '',
                    price: '',
                    car: '',                    
               },
               cars: [],
               repairs: [],
               alertFlag: false,
               dangerAlert: false,
               alertMessage: '',
               buttonClicked: false
          }
     },
     methods: {
          resetModal() {
               this.getCarNames();
               this.insert.name = ''
               this.insert.price = ''
               this.insert.car = ''
               this.alertFlag = false;
               this.alertMessage = '';
               this.dangerAlert = false
               this.repairs = [];
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
                    this.buttonClicked = true;
                    this.insertRepair();
               })          
          },
          insertRepair() {
               this.alertMessage = "Inserting repair...";
               this.dangerAlert = false;
               this.alertFlag = true;
               let vm = this;
               vm.repairs.push(vm.insert);
             
               axios.post(backEndUrl + `/api/cars/${vm.insert.car}/repairs`, vm.repairs, {
                    headers: { Authorization: 'Bearer ' + window.$cookies.get('token') }
               })
               .then(function (response) {
                    if(response.status == 200)
                    {
                         vm.alertMessage = response.data;
                         vm.dangerAlert = false;
                         vm.alertFlag = true;
                         vm.buttonClicked = false;
                         // Hide the modal manually
                         vm.$nextTick(() => {
                              vm.$bvModal.hide('repair-insert-modal')
                         })
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
          getCarNames() {
               let vm = this;
               axios.get(backEndUrl + "/api/user-car-names", {
                    headers: { Authorization: 'Bearer ' + window.$cookies.get('token') }
               })
               .then(function (response) {
                    if(response.status == 200)
                    {
                         vm.cars = response.data;
                         vm.insert.car = vm.cars[0].value;
                    }                
               })
               .catch(function (error) {                  
                    vm.alertMessage = error.response.data;
                    vm.dangerAlert = true;
                    vm.alertFlag = true;
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