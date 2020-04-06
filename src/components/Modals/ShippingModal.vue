<template>
     <div>
          <b-modal id="shipping-modal" ref="modal" title="Shipping details"
          @show="resetModal"
          @ok.prevent="handleSubmit()"
          @close="resetModal">
          <b-alert v-model="alertFlag" :variant="dangerAlert ? 'danger' : 'success'" dismissible>{{alertMessage}}</b-alert>
               <b-form ref="form" @submit.stop.prevent="handleSubmit()">
                    <b-row>
                         <b-col cols="8">
                              <b-form-group label="Transportation fee">
                                   <b-form-input placeholder="180" name="transportationFee-input"
                                        v-model="insert.transportationFee" min="0" step=".01"
                                        v-validate="{ required: true, decimal:'2' }"
                                        :state="validateState('transportationFee-input')" 
                                        aria-describedby="transportationFee-input-live-feedback"
                                        data-vv-as="transportationFee">
                                   </b-form-input>
                                   <b-form-invalid-feedback id="transportationFee-input-live-feedback">
                                        Transportation fee required, must be numeric and may contain 2 decimal points 
                                   </b-form-invalid-feedback>
                              </b-form-group>
                         </b-col>
                         <b-col cols="4">
                              <b-form-group label="Currency">
                                   <b-form-select name="transportationFeeCurrency-input"
                                        v-model="insert.transportationFeeCurrency"
                                        :options="rates"
                                        v-validate="{ required: true }"
                                        :state="validateState('transportationFeeCurrency-input')"
                                        aria-describedby="transportationFeeCurrency-input-live-feedback"
                                        data-vv-as="transportationFeeCurrency" > 
                                   </b-form-select>
                                   <b-form-invalid-feedback id="transportationFeeCurrency-input-live-feedback">
                                        {{ veeErrors.first('transportationFeeCurrency-input') }}
                                   </b-form-invalid-feedback>
                              </b-form-group>
                         </b-col>
                    </b-row>

                    <b-row>
                         <b-col cols="8">
                              <b-form-group label="Transfer fee">
                                   <b-form-input placeholder="220" name="transferFee-input"
                                        v-model="insert.transferFee" min="0" step=".01"
                                        v-validate="{ required: true, decimal:'2' }"
                                        :state="validateState('transferFee-input')" 
                                        aria-describedby="transferFee-input-live-feedback"
                                        data-vv-as="transferFee">
                                   </b-form-input>
                                   <b-form-invalid-feedback id="transferFee-input-live-feedback">
                                        Transfer fee required, must be numeric and may contain 2 decimal points 
                                   </b-form-invalid-feedback>
                              </b-form-group>
                         </b-col>
                         <b-col cols="4">
                              <b-form-group label="Currency">
                                   <b-form-select name="transferFeeCurrency-input"
                                        v-model="insert.transferFeeCurrency"
                                        :options="rates"
                                        v-validate="{ required: true }"
                                        :state="validateState('transferFeeCurrency-input')"
                                        aria-describedby="transferFeeCurrency-input-live-feedback"
                                        data-vv-as="transferFeeCurrency" > 
                                   </b-form-select>
                                   <b-form-invalid-feedback id="transferFeeCurrency-input-live-feedback">
                                        {{ veeErrors.first('transferFeeCurrency-input') }}
                                   </b-form-invalid-feedback>
                              </b-form-group>
                         </b-col>
                    </b-row>            
                    <b-row>
                         <b-col cols="8">
                              <b-form-group label="Auction fee">
                                   <b-form-input placeholder="960" name="auctionFee-input"
                                        v-model="insert.auctionFee" min="0" step=".01"
                                        v-validate="{ required: true, decimal:'2' }"
                                        :state="validateState('auctionFee-input')" 
                                        aria-describedby="auctionFee-input-live-feedback"
                                        data-vv-as="auctionFee">
                                   </b-form-input>
                                   <b-form-invalid-feedback id="auctionFee-input-live-feedback">
                                        Auction fee required, must be numeric and may contain 2 decimal points 
                                   </b-form-invalid-feedback>
                              </b-form-group>
                         </b-col>
                         <b-col cols="4">
                              <b-form-group label="Currency">
                                   <b-form-select name="auctionFeeCurrency-input"
                                        v-model="insert.auctionFeeCurrency"
                                        :options="rates"
                                        v-validate="{ required: true }"
                                        :state="validateState('auctionFeeCurrency-input')"
                                        aria-describedby="auctionFeeCurrency-input-live-feedback"
                                        data-vv-as="auctionFeeCurrency" > 
                                   </b-form-select>
                                   <b-form-invalid-feedback id="auctionFeeCurrency-input-live-feedback">
                                        {{ veeErrors.first('auctionFeeCurrency-input') }}
                                   </b-form-invalid-feedback>
                              </b-form-group>
                         </b-col>
                    </b-row>
                    <b-row>
                         <b-col cols="8">
                              <b-form-group label="Customs">
                                   <b-form-input placeholder="1800" name="customs-input"
                                        v-model="insert.customs" min="0" step=".01"
                                        v-validate="{ required: true, decimal:'2' }"
                                        :state="validateState('customs-input')" 
                                        aria-describedby="customs-input-live-feedback"
                                        data-vv-as="customs">
                                   </b-form-input>
                                   <b-form-invalid-feedback id="customs-input-live-feedback">
                                        Customs required, must be numeric and may contain 2 decimal points 
                                   </b-form-invalid-feedback>
                              </b-form-group>
                         </b-col>
                         <b-col cols="4">
                              <b-form-group label="Currency">
                                   <b-form-select name="customsCurrency-input"
                                        v-model="insert.customsCurrency"
                                        :options="rates"
                                        v-validate="{ required: true }"
                                        :state="validateState('customsCurrency-input')"
                                        aria-describedby="customsCurrency-input-live-feedback"
                                        data-vv-as="customsCurrency" > 
                                   </b-form-select>
                                   <b-form-invalid-feedback id="customsCurrency-input-live-feedback">
                                        {{ veeErrors.first('customsCurrency-input') }}
                                   </b-form-invalid-feedback>
                              </b-form-group>
                         </b-col>
                    </b-row> 
               </b-form>
          </b-modal>
    </div>
</template>
<script>
import axios from'axios';
const backEndUrl = process.env.VUE_APP_API;
export default {
     data(){
          return {
               insert: {
                    customs: '',                   
                    auctionFee: '',                  
                    transferFee: '',                    
                    transportationFee: '',  

                    customsCurrency: '',
                    auctionFeeCurrency: '',
                    transferFeeCurrency: '',
                    transportationFeeCurrency: '',
                    baseCurrency: window.$cookies.get('currency'),
                    car: this.$route.params.id
               },
               cars: [],
               rates: [],
               car: {
                    id: '',
                    name: ''
               },
               alertFlag: false,
               dangerAlert: false,
               alertMessage: ''
          }
     },
     mounted() {
          this.getCurrencies();
          this.fetchCarShipping();
     },
     methods: {
          getCurrencies() {
               let vm = this;
               axios.get(backEndUrl + "/api/currency")
               .then(function (response) {
                    vm.rates = response.data;
                    vm.insert.customsCurrency = 'EUR';
                    vm.insert.auctionFeeCurrency = 'EUR';
                    vm.insert.transferFeeCurrency = 'EUR';
                    vm.insert.transportationFeeCurrency = 'EUR';
               })
               .catch(function (error){
                    vm.dangerAlert = true;
                    vm.alertMessage = error.response.data;
                    vm.alertFlag = true;
                    console.log(error);
               });
          },
          validateState(ref) {
               if (this.veeFields[ref] && (this.veeFields[ref].dirty || this.veeFields[ref].validated))
                    return !this.veeErrors.has(ref);
               return null;
          },
          resetModal() {
               this.insert.car = this.$route.params.id;
               if(!this.insert._id)
               {
                    this.insert.auctionFee = '';
                    this.insert.customs = '';
                    this.insert.transferFee = '';
                    this.insert.transportationFee = '';
               }
               this.alertFlag = false;
               this.alertMessage = '';
               this.dangerAlert = false
          },
          handleSubmit() {
               this.$validator.validateAll().then(result => {
                    if (!result)
                         return;

                    if(!this.insert._id)
                         this.insertShipping();
                    else
                         this.updateShipping();       
               });
          },
          insertShipping(){
               let vm = this;
               vm.dangerAlert = false;
               vm.alertMessage = "Please wait while we handle your given shipping data";
               vm.alertFlag = true;
               axios.post(backEndUrl + `/api/cars/${vm.insert.car}/shipping`, vm.insert, {
                    headers: { Authorization: 'Bearer ' + window.$cookies.get('token') }
               })
               .then(function (response) {
                    if(response.status == 200)
                    {
                         vm.dangerAlert = false;
                         vm.alertMessage = "Your data saved successfully";
                         vm.alertFlag = true;
                         // Hide the modal manually
                         vm.$nextTick(() => {
                              vm.$bvModal.hide('shipping-modal')
                         })
                    }
                    else if(response.status == 401) 
                    {
                         vm.$cookies.remove('token');
                         vm.$cookies.remove('user-email');
                         vm.$cookies.remove('role');
                         vm.$cookies.remove('user');
                         vm.$cookies.remove('currency');
                         vm.$router.push('/');
                    } 
               })
               .catch(function (error) {
                    vm.dangerAlert = true;
                    vm.alertMessage = error.response.data;
                    vm.alertFlag = true;
                    console.log(error);
               }); 
          },
          updateShipping(){
               let vm = this;
               vm.dangerAlert = false;
               vm.alertMessage = "Please wait while we handle your given shipping data";
               vm.alertFlag = true;
               axios.put(backEndUrl + `/api/cars/${vm.insert.car}/shipping`, vm.insert, {
                    headers: { Authorization: 'Bearer ' + window.$cookies.get('token') }
               })
               .then(function (response) {
                    if(response.status == 200)
                    {
                         vm.dangerAlert = false;
                         vm.alertMessage = "Shipping data updated successfully";
                         vm.alertFlag = true;
                         // Hide the modal manually
                         vm.$nextTick(() => {
                              vm.$bvModal.hide('shipping-modal')
                         })
                    }
                    else if(response.status == 401) 
                    {
                         vm.$cookies.remove('token');
                         vm.$cookies.remove('user-email');
                         vm.$cookies.remove('role');
                         vm.$cookies.remove('user');
                         vm.$cookies.remove('currency');
                         vm.$router.push('/');
                    } 
               })
               .catch(function (error) {
                    vm.dangerAlert = true;
                    vm.alertMessage = error.response.data;
                    vm.alertFlag = true;
                    console.log(error);
               });
          },
          fetchCarShipping() {
               var vm = this;
               axios.get(backEndUrl + `/api/cars/${vm.$route.params.id}/shipping`, {
                    headers: {
                         Authorization: 'Bearer ' + window.$cookies.get('token')
                    }
               })
               .then(function (response) {                      
                    if(response.status == 200)
                         vm.insert = response.data;
                    else if(response.status == 401) 
                    {
                         vm.$cookies.remove('token');
                         vm.$cookies.remove('user-email');
                         vm.$cookies.remove('role');
                         vm.$cookies.remove('user');
                         vm.$cookies.remove('currency');
                         vm.$router.push('/');
                    } 
               })
               .catch(function (error) {
                    vm.dangerAlert = true;
                    vm.alertMessage = error.response.data;
                    vm.alertFlag = true;
                    console.log(error);
               });
          },
     }
}
</script>
