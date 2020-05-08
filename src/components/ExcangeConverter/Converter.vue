<template>
     <div>
          <center class="pt-3"><h1>Here you can convert between most popular world currencies!</h1></center>
          <b-form class="container pt-5" @submit.prevent="onSubmit">
               <div class="row">
                    <div class="col-md-5">
                         <b-form-group label="Amount">
                              <b-form-input id="amount-input" placeholder="3000" name="amount-input"
                                   v-model="data.amount"
                                   v-validate="{ required: true, decimal:3, min_value:1 }"
                                   :state="validateState('amount-input')" 
                                   aria-describedby="amount-input-live-feedback"
                                   data-vv-as="Amount">
                              </b-form-input>
                              <b-form-invalid-feedback id="amount-input-live-feedback">{{ veeErrors.first('amount-input') }}</b-form-invalid-feedback>
                         </b-form-group>
                         <b-form-group label="Currency from">
                              <b-form-select id="currency-from-input" name="currency-from-input"
                                   v-model="data.from"
                                   :options="rates"
                                   v-validate="{ required: true }"
                                   :state="validateState('currency-from-input')"
                                   aria-describedby="currency-from-input-live-feedback"
                                   data-vv-as="Currency from" > 
                              </b-form-select>
                              <b-form-invalid-feedback id="currency-from-input-live-feedback">{{ veeErrors.first('currency-from-input') }}</b-form-invalid-feedback>
                         </b-form-group>
                    </div>
                    <div class="col-md-5">
                         <b-form-group label="Currency to">
                              <b-form-select id="currency-to-input" name="currency-to-input"
                                   v-model="data.to"
                                   :options="rates"
                                   v-validate="{ required: true }"
                                   :state="validateState('currency-to-input')"
                                   aria-describedby="currency-to-input-live-feedback"
                                   data-vv-as="Currency to" > 
                              </b-form-select>
                              <b-form-invalid-feedback id="currency-to-input-live-feedback">{{ veeErrors.first('currency-to-input') }}</b-form-invalid-feedback>
                         </b-form-group>
                    </div>                 
               </div>
               <div class="pt-3">
                    <b-button type="submit" class="btn btn-primary">Convert</b-button>
               </div>
          </b-form>
          <div class="container mb-5">
               <center v-if="result" style="float:right;"><h2>Result: <b>{{result}} {{currTo}}</b></h2></center>
          </div>
     </div>
</template>

<script>
const backEndUrl = process.env.VUE_APP_API;
import axios from 'axios';

export default {
     data(){
          return{
               rates: [],
               data: {
                    from: '',
                    to: '',
                    amount: ''
               },
               result: '',
               currTo: '',
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
                    vm.data.from = 'USD';
                    vm.data.to = 'EUR';
               })
               .catch(function (error){
                    console.log(error);
               });
          },

          convert() {
               let vm = this;
               vm.currTo = vm.data.to;
               axios.post(backEndUrl + "/api/currency", this.data)
               .then(function (response) {
                    if(response.data)
                    {
                         //vm.data.to = 'USD';
                         //vm.data.from = 'EUR';
                         vm.result = response.data;
                    }
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

                    this.convert();
               });
          }
     }
}
</script>