<template>
     <div>
        <b-modal id="repair-insert-modal" ref="modal" title="Insert new repair"
        @show="resetModal"
        @ok.prevent="onSubmit"
        @close="resetModal">  
          <b-alert v-model="failedAlert" :variant="!failedAlert ? 'danger': 'succes'" dismissible>{{alertMessage}}</b-alert>
          <b-form ref="form" @submit.stop.prevent="onSubmit">            
               <b-form-group label="Name">
                    <b-form-input id="name-input" placeholder="New engine" name="name-input" 
                         v-model="insert.name"
                         v-validate="{ required: true }"
                         :state="validateState('name-input')" 
                         aria-describedby="name-input-live-feedback"
                         data-vv-as="name">
                    </b-form-input>
                    <b-form-invalid-feedback id="name-input-live-feedback">{{ veeErrors.first('name-input') }}</b-form-invalid-feedback>
               </b-form-group>

               <b-form-group label="Price (€)">
                    <b-form-input id="price-input" name="price-input" placeholder="500"
                         v-model="insert.price"
                         v-validate="{ required: true, decimal: 2 }"
                         :state="validateState('price-input')" 
                         aria-describedby="price-input-live-feedback"
                         data-vv-as="price">
                    </b-form-input>
                    <b-form-invalid-feedback id="price-input-live-feedback">{{ veeErrors.first('price-input') }}</b-form-invalid-feedback>
               </b-form-group>
               <b-form-group label="Car">
                    <b-form-select id="car-input" name="car-input" 
                         v-model="insert.car"
                         :options="cars"
                         v-validate="{ required: true }"
                         :state="validateState('car-input')" 
                         aria-describedby="car-input-live-feedback"
                         data-vv-as="car">
                    </b-form-select>
                    <b-form-invalid-feedback id="car-input-live-feedback">{{ veeErrors.first('car-input') }}</b-form-invalid-feedback>
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
               insert: {
                    name: '',
                    price: '',
                    car: ''
               },
               cars: [],
               failedAlert: false,
               alertMessage: ''
          }
     },
     methods: {
          resetModal() {
               this.getCarNames();
               this.insert.name = ''
               this.insert.price = ''
               this.insert.car = ''
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

                    this.insertRepair();
               })          
          },
          insertRepair() {
               let vm = this;
               let repairs = [];
               repairs.push(vm.insert);
             
               axios.post(backEndUrl + `/api/cars/${vm.insert.car}/repairs`, repairs, {
                    headers: {
                              Authorization: 'Bearer ' + window.$cookies.get('token')
                    }
               })
               .then(function (response) {
                    if(response.status == 200)
                    {
                         vm.failedAlert = true;
                         // Hide the modal manually
                         vm.$nextTick(() => {
                              vm.$bvModal.hide('repair-insert-modal')
                         })
                    }
               })
               .catch(function (error) {
                    vm.failedAlert = false;
                    console.log(error);
               }); 
          },
          getCarNames() {
               let vm = this;
               axios.get(backEndUrl + "/api/user-car-names", {
                    headers: {
                              Authorization: 'Bearer ' + window.$cookies.get('token')
                    }
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
                    vm.failedAlert = true;
                    console.log(error);
               });
          },
     }
}
</script>