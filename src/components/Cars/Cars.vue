<template>
<div>
      <div class="container pt-5" v-if="!loading">
            <b-alert v-model="alertFlag" :variant="dangerAlert ? 'danger' : 'success'" dismissible>{{alertMessage}}</b-alert>
            <div class="row mr-3 ml-1">
                  <div class="col">
                        <button v-b-modal.car-insert-modal class="btn btn-primary"
                        @click="$router.push('/other-insert')" >
                              Add new car
                        </button>
                        <!-- bmw modal-->
                        <bmwModal v-show="isBmwModalVisible" @click="closeBmwModal"/>
                  </div>
                  <b-form-group label-cols-sm="auto" label="Sort:" class="ml-3">
                        <b-form-select 
                              v-model="selected" :options="options" @change="sortCars()"></b-form-select>
                  </b-form-group>
            </div>
            
            
            <div class="pt-3">
                  <b-card-group deck>
                        <b-col sm="4" v-for="(car, index) in carsList" v-bind:key="car.id" class="mb-4 d-flex align-items-stretch">                              
                              <b-card no-body>
                                    <b-link :to="'/cars/' + car.id">
                                          <b-card-img img-alt="image img-fluid" img-top :src='car.carImg'
                                          style="max-height:238.5px"></b-card-img>
                                          <b-card-body class="pl-3">            
                                                <b-card-title>{{car.make}} {{car.model}}</b-card-title>
                                          </b-card-body>
                                    </b-link>
                                    <b-card-text class="pl-3" style="flex-grow:1;">                                          
                                          <h4>Already paid: {{car.summary.total}} {{currency}}</h4>
                                          <template v-if="car.summary.sold">
                                                <h2 style="color:red;font-weight:bold;">SOLD</h2>
                                                <h2 v-if="car.summary.profit < 0" style="color:red;">
                                                      Profit: {{car.summary.profit}} {{currency}}
                                                </h2>
                                                <h2 v-else style="color:green;">
                                                      Profit: {{car.summary.profit}} {{currency}}
                                                </h2>
                                          </template>
                                    </b-card-text>         
                                    <template v-slot:footer>
                                          <b-button v-b-modal.sold-modal block
                                                @click="openSoldModal(car.id, index)" 
                                                type="button" class="btn btn-warning"
                                                v-if="!car.summary.sold">
                                                Sold?
                                          </b-button>
                                          <small v-else>{{car.summary.soldWithin}}</small>
                                    </template>
                              </b-card>                                               
                        </b-col>
                  </b-card-group>          
            </div>          
      </div>
      <div class="pt-3" v-else>        
            <center>
                  <b-spinner label="Loading..."></b-spinner>
            </center> 
      </div>

      <b-modal id="sold-modal" ref="modal" title="Sold data"
      @show="resetModal"
      @ok.prevent="handleSubmit()"
      @close="resetModal"
      :ok-disabled="buttonClicked">
            <b-form ref="form" @submit.stop.prevent="handleSubmit()">
                  <b-form-group :label="'Sold price (' + currency + ')'">
                        <b-form-input placeholder="15000" name="soldPrice-input"
                              v-model="soldDetails.soldPrice"
                              v-validate="{ required: true, decimal:'2', min_value: 0.01 }"
                              :state="validateState('soldPrice-input')" 
                              aria-describedby="soldPrice-input-live-feedback"
                              data-vv-as="Sold price">
                        </b-form-input>
                        <b-form-invalid-feedback id="soldPrice-input-live-feedback">
                              {{ veeErrors.first('soldPrice-input') }}
                        </b-form-invalid-feedback>
                  </b-form-group>     
            </b-form>
        </b-modal>
</div>
</template>

<script>


import getSymbolFromCurrency from 'currency-symbol-map'
import bmwModal from '../Modals/CarModal.vue';
import axios from 'axios';
const backEndUrl = process.env.VUE_APP_API;
export default {      
      data() {
            return {
                  alertMessage:'',
                  alertFlag: false,
                  dangerAlert: false,
                  currency: getSymbolFromCurrency(window.$cookies.get('currency')),
                  cars: [],
                  displayCars:[],
                  car: {
                        id: '',
                        make:'',
                        model:'',
                        carImg: '',
                        summary: {
                              boughtPrice:'',
                              soldPrice:'',
                              createdAt: '',
                              total: '',
                              sold: '',
                              profit: 0,
                              soldWithin: ''
                        },
                  },
                  insertCar: {
                        vin: '',
                        boughtPrice: '',
                        make: '',
                        Base64images: []
                  },
                  loading: true,
                  isBmwModalVisible: false,
                  soldDetails: {
                        soldPrice: 0,
                        car: '',
                        sold: '',
                        index: '',
                        createdAt: ''
                  },
                  rows: 0,
                  selected: 3,
                  options:[
                        {value: 1, text: 'Show all cars' },
                        {value: 2, text: 'Show only sold cars' },
                        {value: 3, text: 'Show only unsold cars' },                 
                  ],
                  buttonClicked: false            
            }           
      },
      created() {
            this.fetchCars();
      },
      components: {
            bmwModal,
      },
      computed:{
            carsList: function(){
                  return this.displayCars;
            }
      },
      methods: {
            sortCars(){          
                  if(this.selected == 2)
                  {
                        let array = [];
                        this.cars.forEach(element => {
                              if(element.summary.sold)
                                    array.push(element);
                        });
                        this.displayCars = array;
                  }
                  else if(this.selected == 3)
                  {
                        let array = [];
                        this.cars.forEach(element => {
                              if(!element.summary.sold)
                                    array.push(element);
                        });
                        this.displayCars = array;
                  }
                  else if(this.selected == 1)
                        this.displayCars = this.cars;              
            },
            showBmwModal(){
                  this.isBmwModalVisible = true;
            },
            closeBmwModal() {
                  this.isBmwModalVisible = false;
                  this.fetchCars();
            },
            fetchCars() {
                  let vm = this;
                  axios.get(backEndUrl + "/api/cars", {
                        headers: { Authorization: 'Bearer ' + window.$cookies.get('token') }
                  })
                  .then(function (response) {
                        if(response.status == 200)
                        {
                              vm.cars = response.data;
                              vm.displayCars = response.data;
                              vm.rows = response.data.length;
                              vm.loading = false;                

                              for(let i =0; i < vm.cars.length; i++)
                              {
                                    vm.cars[i].summary.profit = Number((vm.cars[i].summary.profit).toFixed(2)); 
                                    if(vm.cars[i].carImg == "")
                                          vm.cars[i].carImg = process.env.VUE_APP_DEFAULT_IMAGE;
                              }
                        }                             
                  })
                  .catch(function (error) {
                        vm.loading = false;
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
            fetchCarSummary(index, carId) {
                  let vm = this;
                  axios.get(backEndUrl + `/api/cars/${carId}/summary`, {
                        headers: {Authorization: 'Bearer ' + window.$cookies.get('token')}
                  })
                  .then(function (response) {
                        if(response.status == 200)
                        {
                              vm.cars[index].summary = response.data;
                              vm.cars[index].summary.profit = 
                                    vm.cars[index].summary.soldPrice -
                                    vm.cars[index].summary.total;
                              vm.cars[index].summary.profit = 
                                    Number.parseFloat(vm.cars[index].summary.profit).toFixed(0);
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
            onFileSelected(e) {
                  for(let i=0; i < e.target.files.length; i++)
                  {
                        var reader = new FileReader();
                        reader.readAsDataURL(e.target.files[i]);
                        reader.onload = (e) => {
                              this.insertCar.Base64images[i] = e.target.result;
                        }                 
                  }             
            },
            fetchCar(carId, index) {
                  var vm = this;
                  axios.get(backEndUrl + `/api/cars/${carId}`, {
                        headers: { Authorization: 'Bearer ' + window.$cookies.get('token') }
                  })
                  .then(function (response) {
                        if(response.status == 200)
                              vm.fetchCarSummary(index, carId);
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
            resetModal() {
                  this.soldDetails.soldPrice = '';
            },
            handleSubmit() {
                  this.$validator.validateAll().then(result => {
                        if (!result)
                              return;
                        this.buttonClicked = true;
                        this.insertSoldDetails();
                  });                                                                
            },
            insertSoldDetails() {
                  this.soldDetails.sold = true;
                  this.soldDetails.createdAt = this.cars[this.soldDetails.index].summary.createdAt;

                  var vm = this;
                  axios.put(backEndUrl + `/api/cars/${vm.soldDetails.car}/summary`, this.soldDetails, {
                        headers: { Authorization: 'Bearer ' + window.$cookies.get('token') }
                  })
                  .then(function (response) {
                        if(response.status == 204)
                        {
                              vm.fetchCar(vm.soldDetails.car, vm.soldDetails.index);
                              vm.buttonClicked = false;
                              vm.$nextTick(() => {
                                    vm.$bvModal.hide('sold-modal')
                              })
                        }              
                  })
                  .catch(function (error){
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
                  }) 
            },
            openSoldModal(carId, index) {
                  this.soldDetails.car = carId;
                  this.soldDetails.index = index;
            },
            validateState(ref) {
                  if (this.veeFields[ref] && (this.veeFields[ref].dirty || this.veeFields[ref].validated))
                  return !this.veeErrors.has(ref);
                  return null;
            },
      }
}
</script>