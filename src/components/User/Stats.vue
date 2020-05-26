<template>
     <div class="pt-3">
          <b-container>
               <b-alert v-model="alertFlag" style="text-align:center;" :variant="dangerAlert ? 'danger' : 'success'" dismissible>{{alertMessage}}</b-alert>
               <h1 style="text-align:center;" class="mb-3">Your sales stats in selected date range</h1>
               <b-form>
                    <div class="form-row">
                         <b-form-group class="col-sm-6" label="Date from">
                              <b-form-datepicker name="from-input" ref="dateFrom"
                              v-model="form.dateFrom" start-weekday='1'                         
                              v-validate="{required:true}"
                              :state="validateState('from-input')"
                              aria-describedby="from-input-live-feedback"
                              data-vv-as="Date from">
                              </b-form-datepicker>
                              <b-form-invalid-feedback id="from-input-live-feedback">
                                   {{ veeErrors.first('from-input') }}
                              </b-form-invalid-feedback>
                         </b-form-group>
                         <b-form-group class="col-sm-6" label="Date to">
                              <b-form-datepicker name="to-input" ref="dateTo"
                              v-model="form.dateTo" start-weekday='1'
                              v-validate="{required:true}"
                              :state="validateState('to-input')"
                              aria-describedby="to-input-live-feedback"
                              data-vv-as="Date to">
                              </b-form-datepicker>
                              <b-form-invalid-feedback id="to-input-live-feedback">
                                   {{ veeErrors.first('to-input') }}
                              </b-form-invalid-feedback>
                         </b-form-group>
                    </div>                  
               </b-form>
               <div class="row">
                    <div class="col-4">
                         <b-button type="submit" @click.prevent="onSubmit()" variant="primary">Search</b-button>
                    </div>
                    <template v-if="show">
                         <div class="col-4 text-center">
                              <h4>Cars sold: {{stats.length}}</h4>
                         </div>
                         <div class="col-4 text-right">
                              <h4>Total profit: {{totalProfit}} {{currency}}</h4>
                         </div> 
                    </template>
                                   
               </div>


               <template class="pt-5">
                    <b-table id="stats-table" responsive striped hover class="pt-5" 
                         :busy="isBusy"
                         :items="stats" 
                         :fields="fields"
                         :per-page="perPage"
                         :current-page="currentPage">
                         <template v-slot:table-busy>
                              <div class="text-center text-primary my-2">
                                   <b-spinner class="align-middle"></b-spinner>
                                   <strong>Loading...</strong>
                              </div>
                         </template>
                    </b-table>
                    <b-pagination pills align="center"
                         v-model="currentPage"
                         :total-rows="rows"
                         :per-page="perPage"
                         aria-controls="users-table"
                    ></b-pagination>
               </template>
          </b-container>
     </div>
</template>

<script>
import axios from 'axios';
import getSymbolFromCurrency from 'currency-symbol-map';
const backEndUrl = process.env.VUE_APP_API;
export default {
     data(){
          return {         
               stats:[],
               fields: [    
                    { key: 'car', sortable: true },
                    { key: 'vin' },
                    { key: 'boughtPrice', sortable: true, label:'Bought price (' + getSymbolFromCurrency(window.$cookies.get('currency')) + ')' },  
                    { key: 'soldPrice', sortable: true, label:'Sold price (' + getSymbolFromCurrency(window.$cookies.get('currency')) + ')' },
                    { key: 'soldWithin', sortable: true },
                    { key: 'additionallySpent', sortable: true, label:'Additionally spent (' + getSymbolFromCurrency(window.$cookies.get('currency')) + ')' },
                    { key: 'profit', sortable: true, label:'Profit (' + getSymbolFromCurrency(window.$cookies.get('currency')) + ')' }
               ],
               form: {
                    dateFrom: '',
                    dateTo: ''
               },
               alertMessage: '',
               alertFlag: false,
               dangerAlert: false,
               rows: 0,
               currentPage: 1,
               perPage: 10,
               isBusy: false,
               totalProfit: 0,
               currency: getSymbolFromCurrency(window.$cookies.get('currency')),
               show: false
          }
     },
     methods: {
          getStats(){
               let vm = this;
               axios.post(backEndUrl + `/api/users/${vm.$route.params.id}/stats`, this.form, {
                    headers: { Authorization: 'Bearer ' + window.$cookies.get('token')}
               })
               .then(function (response) {
                    if(response.status == 200)
                    {
                         vm.totalProfit = 0;
                         vm.stats = response.data;
                         vm.show = true;
                         vm.rows = vm.stats.length;
                         vm.stats.forEach(elem => {
                              vm.totalProfit = vm.totalProfit + elem.profit;
                              elem.additionallySpent = Number((elem.additionallySpent)).toFixed(2);
                              elem.profit = Number((elem.profit)).toFixed(2);
                         });
                         vm.totalProfit = Number((vm.totalProfit)).toFixed(2);

                         vm.isBusy = false;
                    }
               })
               .catch(function (error){
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
               })
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
                    this.isBusy = true;
                    this.getStats();
               });             
          },
     }
}
</script>