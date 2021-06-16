<template>
<div>
      <div class="container pt-5" >  
            <b-alert v-model="alertFlag" variant="success" dismissible>{{alertMessage}}</b-alert>
     
            <div v-if="!loading">     
                  <div class="row mb-2 mt-1">
                        <div class="col-sm-8 col-12">
                              <h1>{{car.make}} {{car.model}}</h1>
                        </div>
                        <div class="col-sm-4 col-12">
                              <div class="row" style="float:right;">
                                    <div class="col">
                                          <a class="btn btn-secondary" target="_blank" v-if="car.make == 'BMW'"
                                          :href="'https://www.bmwautodalys.lt/en/catalog/selectVehicleByVin/INDEX/'+car.vin"
                                          >
                                                To dealer
                                          </a> 
                                          <a class="btn btn-secondary" target="_blank" 
                                                v-else-if="car.make == 'Mercedes-benz'"
                                                :href="'http://mbepc.net/en/vin/'+car.vin"
                                          >
                                                To dealer
                                          </a>
                                    </div>                    
                                    <div class="col">
                                          <button class="btn btn-info dropdown-toggle" 
                                          type="button" id="dropdownMenuButton" data-toggle="dropdown" 
                                          aria-haspopup="true" aria-expanded="false" >
                                                Actions
                                          </button>
                                          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                                                <a @click.prevent="editCar(car._id)" class="dropdown-item" href="">
                                                      Edit
                                                </a>
                                                <a @click.prevent="deleteAction()" class="dropdown-item" href="">
                                                      Delete
                                                </a>
                                                <a v-b-modal.shipping-modal class="dropdown-item" href=""
                                                      @click.prevent="showShippingModal">
                                                      Add/edit shipping info
                                                </a>
                                                <a @click.prevent="openTracking(car._id)" class="dropdown-item" href="" disabled>
                                                      Tracking info
                                                </a>                
                                          </div>
                                          <!--shipping modal-->
                                          <shippingModal v-show="isShippingModalVisible" @click="closeShippingModal"/>
                                    </div>
                              </div>
                        </div>
                  </div>
                  <div class="row">
                        <div class="col">
                              <b-button variant="primary" @click="goToCars()">Back to list</b-button>
                        </div>
                        
                        <div class="col">
                              <div style="float:right;">                           
                                    <h5>Show tracking images?</h5>
                                    <toggle-button :value="tracking.showImages" class="ml-5"
                                          color="#82C7EB" @change="displayImages()"
                                          :sync="true" :font-size="16" :width="60" :height="25"
                                          :labels="{checked: 'Yes', unchecked: 'No'}"
                                          :switch-color="{checked: '#25EF02', unchecked: 'linear-gradient(red, yellow)'}"
                                    />
                              </div>
                        </div>
                  </div> 
                  <div class="row mb-3 pt-3">
                        <div class="col responsive pt-5"> 
                             <template v-if="!tracking.showImages && car.urls.length > 0">       
                                    <gallery :images="carImages" :index="index"                      
                                    @close="index = null">
                                    </gallery>
                                    <div class="image img-fluid" 
                                          @click="index = 0"
                                          :style="{ backgroundImage: 'url(' + carImages[0].href + ')', width:'350px', height:'300px' }"
                                    /> 
                              </template> 
                              <template v-else-if="!tracking.showImages && car.urls.length == 0">       
                                    <gallery :index="index" :images="defaultImg" 
                                    @close="index = null">
                                    </gallery>
                                    <div class="image img-fluid" 
                                          @click="index = 0"
                                          :style="{ backgroundImage: 'url(' + defaultImg[0].href + ')', width:'350px', height:'300px' }"
                                    /> 
                              </template> 
                              <template v-else-if="tracking.showImages && sharedBase64Images.length > 0">          
                                    <gallery :images="sharedBase64Images" :index="index"                                
                                    @close="index = null">
                                    </gallery>
                                    <div class="image img-fluid" 
                                          @click="index = 0"
                                          :style="{ backgroundImage: 'url(' + sharedBase64Images[0].href + ')', width:'350px', height:'300px' }"
                                    /> 
                              </template> 
                              <template v-else-if="tracking.showImages && sharedBase64Images.length == 0">
                                    <gallery :images="defaultImg" :index="index" 
                                    @close="index = null">
                                    </gallery>
                                    <div class="image img-fluid"
                                          @click="index = 0"
                                          :style="{ backgroundImage: 'url(' + defaultImg[0].href + ')', width:'350px', height:'300px' }"
                                    />                            
                              </template>

                        </div>
                        <div class="col">    
                              <div class="">
                                    <center class="mb-3 mt-1"><h1><b>Summary</b></h1></center>               
                              </div>
                              <table class="table">
                                    <tr>
                                          <th>Bought Price</th>
                                          <td>{{formatPrice(summaryWatched.boughtPrice)}} {{currency}}</td>
                                    </tr>
                                    <tr v-if="summaryWatched.sold">
                                          <th>Sold?</th>
                                          <td>Yes</td>
                                    </tr>
                                    <tr v-else>
                                          <th>Sold?</th>
                                          <td>No</td>
                                    </tr>
                                    <tr v-if="summaryWatched.sold">
                                          <th>Sold Date</th>
                                          <td>{{summaryWatched.soldDate}}</td>
                                    </tr>
                                    <tr v-if="summaryWatched.sold">
                                          <th>Sold Price</th>
                                          <td>{{formatPrice(summaryWatched.soldPrice)}} {{currency}}</td>
                                    </tr>                                                                                        
                                    
                                    <tr v-if="summaryWatched.sold">
                                          <th>Profit </th>
                                          <td v-if="summaryWatched.profit < 0" style="color:red;font-weight:bold;">{{formatPrice(summaryWatched.profit)}} {{currency}}</td>
                                          <td v-else style="color:green;font-weight:bold;">{{formatPrice(summaryWatched.profit)}} {{currency}}</td>
                                    </tr>
                                    <tr>
                                          <th>Total spent</th>
                                          <td>{{formatPrice(summaryWatched.total)}} {{currency}}</td>
                                    </tr>                                                        
                              </table>
                        </div>
                        
                  </div>
                  <div class="row pt-5 ml-1">
                        <table class="table table-striped table-responsive-sm">
                              <tr>
                                    <th>Vin</th>
                                    <td>{{car.vin}}</td>
                              </tr>
                              <tr>
                                    <th>Manufacture Date</th>
                                    <td>{{car.manufactureDate}}</td>
                              </tr> 
                              <tr>
                                    <th>Series</th>
                                    <td>{{car.series}}</td>
                              </tr>                                                                 
                              <tr>
                                    <th>Body type</th>
                                    <td>{{car.bodyType}}</td>
                              </tr>
                              <tr>
                                    <th>Steering</th>
                                    <td>{{car.steering}}</td>
                              </tr>
                              <tr>
                                    <th>Engine / power</th>
                                    <td v-if="car.displacement != 0">{{car.engine}} ({{car.displacement}} l.)  {{car.power}}</td>
                                    <td v-else>{{car.engine}} {{car.power}}</td>
                              </tr>
                              <tr>
                                    <th>Driven wheels</th>
                                    <td>{{car.drive}}</td>
                              </tr>           
                              <tr>
                                    <th>Gearbox</th>
                                    <td>{{car.transmission}}</td>
                              </tr>
                              <tr>
                                    <th>Color</th>
                                    <td>{{car.color}}</td>
                              </tr>
                              <tr>
                                    <th>Interior</th>
                                    <td>{{car.interior}}</td>
                              </tr>
                              
                        </table>
                  </div>

            
                  <div class="pt-3">   
                        <b-button
                              block variant="info"
                              :class="equipmentVisible ? null : 'collapsed'"
                              :aria-expanded="equipmentVisible ? 'true' : 'false'"
                              aria-controls="equipment-collapse"
                              @click="equipmentVisible = !equipmentVisible">
                              Equipment
                        </b-button> 
                        <b-collapse id="equipment-collapse" v-model="equipmentVisible" class="mt-2">
                              <template v-if="car.equipment.length >0">
                                    <b-table striped :items="car.equipment" responsive></b-table>
                              </template> 
                              <div v-else>
                                    <label>Paste your shit here</label>
                                    <b-form-textarea v-model="equipmentData" placeholder="Code EnglishName GermanName" rows="3" max-rows="6"/>
                                    <b-button variant="primary" @click="addEquipment">Submit</b-button>
                                    <center>
                                          <h2 class="pt-3">No equipment</h2>
                                    </center>
                              </div>                                                
                        </b-collapse>
                  </div>
                  <div class="pt-3">   
                        <b-button
                              block variant="info"
                              :class="repairsVisible ? null : 'collapsed'"
                              :aria-expanded="repairsVisible ? 'true' : 'false'"
                              aria-controls="repairs-collapse"
                              @click="repairsVisible = !repairsVisible, fetchCarRepairs()">
                              Repairs
                        </b-button> 
                        <b-collapse id="repairs-collapse" v-model="repairsVisible" class="mt-2">
                              <div v-if="repairs.length != 0"> 
                                    <b-table striped  :items="repairs" responsive :fields="fields"/> 
                                    <h2 class="pt-3 ml-1">Repairs total: <b>{{repairs[0].total}} {{currency}}</b></h2> 
                              </div>
                              
                              <div v-else>
                                    <center>
                                          <h2 class="pt-3">No repairs yet</h2>
                                    </center>
                              </div>
                        </b-collapse>                  
                  </div> 
                  <div class="pt-3">   
                        <b-button
                              block variant="info"
                              :class="shippingVisible ? null : 'collapsed'"
                              :aria-expanded="shippingVisible ? 'true' : 'false'"
                              aria-controls="shipping-collapse"
                              @click="shippingVisible = !shippingVisible, fetchOther()">
                              Shipping
                        </b-button> 
                        <b-collapse id="shipping-collapse" v-model="shippingVisible" class="mt-2">
                              <div v-if="shipping.total > 0">
                                    <b-table striped :items="shippingItems" responsive /> 
                                    <h2 class="pt-3 ml-1">Shipping total: <b>{{shipping.total}} {{currency}}</b></h2>   
                              </div>
                              <div v-else>
                                    <center>
                                          <h2 class="pt-3">No shipping info yet</h2>
                                    </center>
                              </div>                                                
                        </b-collapse>                  
                  </div>
                                   
            </div>
            
            <div class="pt-3" v-else>        
                  <center>
                       <b-spinner label="Loading..."></b-spinner>
                  </center> 
            </div>
      </div>
      
</div>

</template>

<script>
import getSymbolFromCurrency from 'currency-symbol-map'
import { ToggleButton } from 'vue-js-toggle-button'
import VueGallery from 'vue-gallery';
import shippingModal from '../Modals/ShippingModal.vue';
import axios from 'axios';
const backEndUrl = process.env.VUE_APP_API;
export default { 
      data() {
            return {
                  fields: ['name', 'price'],
                  shippingItems: [],
                  currency: getSymbolFromCurrency(window.$cookies.get('currency')),
                  car: {
                        _id: '',
                        make:'',
                        model:'',
                        vin:'',
                        manufactureDate:'',
                        series:'',
                        bodyType:'',
                        steering:'',
                        engine:'',
                        displacement:'',
                        power:'',
                        drive:'',
                        transmission:'',
                        color:'',
                        interior:'',
                        created_at:'',                       
                        urls: [],
                        equipment: [],
                  },
                  summary: {
                        boughtPrice:'',
                        soldPrice:'',
                        totalShipping: '',
                        sold: '',
                        soldDate:'',
                        profit: ''
                  },               
                  shipping: {
                        customs: '',
                        auctionFee: '',
                        transferFee: '',
                        transportationFee: '', 
                        total: 0
                  },
                  tracking:{
                        images: [],
                        showImages: ''
                  },
                  repairs: [],
                  loading: true,
                  index: null,
                  isShippingModalVisible: false,
                  alertFlag: false,
                  alertMessage: '',
                  equipmentVisible: false,
                  repairsVisible: false,
                  shippingVisible: false,
                  defaultImg: [{
                        href: process.env.VUE_APP_DEFAULT_IMAGE,
                        title: '1/1'
                  }],
                  equipmentData:''

            }
            
      },
      components: {
            'gallery': VueGallery,
            shippingModal,
            ToggleButton
      },
      computed: {
            carImages: function() {
                  let list = [];
                  let shared = this.car.urls;
                  for(let i =0;i<shared.length;i++)
                  {
                        let obj = {
                              href: shared[i].url,
                              title: i+1 + '/'+shared.length
                        }
                        list.push(obj);
                  } 
                  return list;
            },
            trackingImages: function() {
                  let list = [];
                  let shared = this.tracking.images;
                  for(let i =0;i<shared.length;i++)
                  {
                        let obj = {
                              href: shared[i].url,
                              title: i+1 + '/'+shared.length
                        }
                        list.push(obj);
                  } 
                  return list;
            },
            sharedBase64Images: function () {   
                  let list = [];
                  let shared = this.car.urls.concat(this.tracking.images);
                  for(let i =0;i<shared.length;i++)
                  {
                        let obj = {
                              href: shared[i].url,
                              title: i+1 + '/'+shared.length
                        }
                        list.push(obj);
                  }
                  return list;
            },
            summaryWatched: function(){
                  this.watchSummary();
                  return this.summary;
            }
      },
      beforeRouteLeave (to, from, next) {
            this.updateShowImagesStatus();          
            next();
      },
      created() {        
            this.fetchCar(); 
            this.fetchTracking();   
            this.fetchCarSummary();         
            this.fetchCarRepairs();
            this.fetchCarShipping();         
      },

      methods: {
            addEquipment(){
                  let vm = this;
                  var rows = vm.equipmentData.split('\n')
                  var data = []
                  rows.forEach(row => {
                        let rowSplit = row.split('\t')
                        data.push({
                              code: rowSplit[0],
                              name: rowSplit[1]
                        })
                  });
                  console.log('data', data, rows)

                  axios.post(backEndUrl + `/api/cars/${vm.$route.params.id}/equipment`, data, {
                        headers: { Authorization: 'Bearer ' + window.$cookies.get('token')}
                  })
                  .then(function (response) {
                        if(response.status == 200)  
                              vm.fetchCar();                         
                  })
                  .catch(function (error) {
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
            watchSummary(){
                  let vm = this;
                  setTimeout(function () {
                        vm.fetchCarSummary();
                  }, 2000);
            },
            updateShowImagesStatus(){
                  let vm = this;
                  let body = {status: this.tracking.showImages} ;
                  axios.put(backEndUrl + `/api/cars/${vm.$route.params.id}/tracking/images/status`, body, {
                        headers: { Authorization: 'Bearer ' + window.$cookies.get('token')}
                  })
                  .catch(function (error) {
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
            displayImages(){
                  this.tracking.showImages = !this.tracking.showImages;
            },
            fetchCar() {
                  var vm = this;
                  axios.get(backEndUrl + `/api/cars/${vm.$route.params.id}`, {
                        headers: {  Authorization: 'Bearer ' + window.$cookies.get('token') }
                  })
                  .then(function (response) {
                        if(response.status == 200)
                        {  
                              vm.car = response.data;
                              //trimming unnecessary date ending
                              vm.car.manufactureDate = vm.car.manufactureDate.substring(0, 10);
                              vm.loading = false;                            
                        } 
                  })
                  .catch(function (error) {
                        vm.loading = false;
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
            fetchCarRepairs() {
                  var vm = this;
                  axios.get(backEndUrl + `/api/cars/${vm.$route.params.id}/repairs`, {
                        headers: { Authorization: 'Bearer ' + window.$cookies.get('token') }
                  })
                  .then(function (response) {
                        if(response.status == 200)
                              vm.repairs = response.data;
                  })
                  .catch(function (error) {
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
            fetchCarShipping() {
                  var vm = this;
                  axios.get(backEndUrl + `/api/cars/${this.$route.params.id}/shipping`, {
                        headers: {Authorization: 'Bearer ' + window.$cookies.get('token')}
                  })
                  .then(function (response) {
                        if(response.status == 200)
                        {
                              vm.shipping = response.data;
                              vm.shipping.total = 
                                    vm.shipping.customs +
                                    vm.shipping.auctionFee +
                                    vm.shipping.transferFee + 
                                    vm.shipping.transportationFee;
                              vm.shipping.total = Number.parseFloat(vm.shipping.total).toFixed(2);
                              vm.shippingItems = [{
                                    "Transportation fee": vm.shipping.transportationFee,
                                    "Transfer Fee": vm.shipping.transferFee,
                                    "Auction Fee": vm.shipping.auctionFee,
                                    "Customs": vm.shipping.customs
                              }];
                        }                
                  })
                  .catch(function (error) {
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
            fetchCarSummary() {
                  var vm = this;
                  axios.get(backEndUrl + `/api/cars/${this.$route.params.id}/summary`, {
                        headers: {Authorization: 'Bearer ' + window.$cookies.get('token')}
                  })
                  .then(function (response) {
                        if(response.status == 200)
                        {
                              vm.summary = response.data;
                              if(vm.summary.sold)
                              {
                                    vm.summary.profit = vm.summary.soldPrice - vm.summary.total;
                                    vm.summary.soldDate = vm.summary.soldDate.substring(0, 10);
                              }                   
                        }
                  })
                  .catch(function (error) {
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
            fetchTracking() {
                  let vm = this;
                  axios.get(backEndUrl + `/api/cars/${this.$route.params.id}/tracking`, {
                        headers: { Authorization: 'Bearer ' + window.$cookies.get('token') }
                  })
                  .then(function (response) {
                        if(response.status == 200)          
                              vm.tracking = response.data;                
                  })
                  .catch(function (error) {
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
            openTracking(id){
                  this.$router.push(`/cars/${id}/tracking`);    
            },
            editCar(id){
                  this.$router.push(`/cars/${id}/edit`);  
            },
            showShippingModal(){
                  this.isShippingModalVisible = true;
            },
            closeShippingModal(){
                  this.isShippingModalVisible = false;
            },
            fetchOther(){
                  this.fetchCarSummary();
                  this.fetchCarShipping();
            },
            deleteAction(){
                  this.alertMessage = "Deleting your car...";
                  this.alertFlag = true;
                  this.loading = true;
                  this.deleteCar();
                  this.deleteCarSummary();
                  this.deleteCarRepairs();
                  this.deleteCarShipping();
            },
            deleteCar(){
                  var vm = this;
                  axios.delete(backEndUrl + `/api/cars/${vm.$route.params.id}`, {
                        headers: { Authorization: 'Bearer ' + window.$cookies.get('token') }
                  })
                  .then(function (response){
                        if(response.status == 204)
                        {
                              vm.alertMessage = "Car successfully deleted";
                              vm.alertFlag = true;
                              vm.deleteCarTracking();
                              vm.$router.push("/cars");
                        } 
                  })
                  .catch(function (error){
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
            deleteCarSummary(){
                  var vm = this;
                  axios.delete(backEndUrl + `/api/cars/${vm.$route.params.id}/summary`, {
                        headers: {Authorization: 'Bearer ' + window.$cookies.get('token')}
                  })
                  .catch(function (error){
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
            deleteCarTracking(){
                  var vm = this;
                  axios.delete(backEndUrl + `/api/cars/${vm.$route.params.id}/tracking`, {
                        headers: { Authorization: 'Bearer ' + window.$cookies.get('token')}
                  })
                  .catch(function (error){
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
            deleteCarShipping(){
                  var vm = this;
                  axios.delete(backEndUrl + `/api/cars/${vm.$route.params.id}/shipping`, {
                        headers: { Authorization: 'Bearer ' + window.$cookies.get('token')}
                  })
                  .catch(function (error){
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
            deleteCarRepairs(){
                  var vm = this;
                  axios.delete(backEndUrl + `/api/cars/${vm.$route.params.id}/repairs`, {
                        headers: {Authorization: 'Bearer ' + window.$cookies.get('token') }
                  })
                  .catch(function (error){
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
            formatPrice(value) {
                  return new Intl.NumberFormat('lt-LT').format(value);
            },
            goToCars(){
                  this.$router.push('/cars');
            }

      }
}
</script>
<style>
      .image {
            float: left;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center center;
            border: 5px solid #ebebeb;
      }
      h1 {
            font-size: 1.2rem;
      }
      h2 {
            font-size: 1.1rem;
      }

      @media (min-width: 768px) {
            h1 {
                  font-size: 1.3rem;
            }
            h2 {
                  font-size: 1.2rem;
            }
      }

      @media (min-width: 991px) {
            h1 {
                  font-size: 1.5rem;
            }
            h2 {
                  font-size: 1.4rem;
            }
      }

      @media (min-width: 1200px) {
            h1 {
                  font-size: 1.7rem;
            }
            h2 {
                  font-size: 1.6rem;
            }
      }
</style>