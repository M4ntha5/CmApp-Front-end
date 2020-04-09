<template>
<div>
      <div class="container pt-5" >  
            <b-alert v-model="alertFlag" variant="success" dismissible>{{alertMessage}}</b-alert>
            <div v-if="!loading">     
                  <div class="row">
                        <div class="col-sm-8 col-12">
                              <h1>{{car.make}} {{car.model}}</h1>
                        </div>
                        <div class="col-sm-4 col-12">
                              <div class="row" style="float:right;">
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
                                    <div class="col">
                                          <button class="btn btn-info dropdown-toggle" type="button" 
                                          id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" 
                                          aria-expanded="false" >
                                                Actions
                                          </button>
                                          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
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
                                                <a @click.prevent="openTracking(car._id)" class="dropdown-item" href="">
                                                      Tracking info
                                                </a>                       
                                          </div>
                                          <!--shipping modal-->
                                          <shippingModal v-show="isShippingModalVisible" @click="closeShippingModal"/>
                                    </div>
                              </div>
                        </div>
                  </div>
                  <div class="ml-1">
                        <b-button variant="primary" size="lg" @click="goToCars()">Back to list</b-button>
                  </div> 
                  <div class="row mb-3 pt-5">
                        <div class="img-fluid col-sm-6 col-12 responsive">              
                              <gallery :images="car.base64images" :index="index" @close="index = null"></gallery>
                              <div class="image img-responsive" 
                                    @click="index = 0"
                                    :style="{ backgroundImage: 'url(' + car.base64images[0] + ')', width:'350px', height:'300px' }"
                              /> 
                        </div>
                        <div class="col-sm-6 col-12">    
                              <div class="mb-2">
                                    <center><h2>Summary</h2></center>               
                              </div>
                              <table class="table pt-3  ">
                                    <tr>
                                          <th>Bought Price</th>
                                          <td>{{formatPrice(summary.boughtPrice)}} {{currency}}</td>
                                    </tr>
                                    <tr v-if="summary.sold">
                                          <th>Sold?</th>
                                          <td>Yes</td>
                                    </tr>
                                    <tr v-else>
                                          <th>Sold?</th>
                                          <td>No</td>
                                    </tr>
                                    <tr v-if="summary.sold">
                                          <th>Sold Date</th>
                                          <td>{{summary.soldDate}}</td>
                                    </tr>
                                    <tr v-if="summary.sold">
                                          <th>Sold Price</th>
                                          <td>{{formatPrice(summary.soldPrice)}} {{currency}}</td>
                                    </tr>                                                                                        
                                    
                                    <tr v-if="summary.sold">
                                          <th>Profit </th>
                                          <td v-if="summary.profit < 0" style="color:red;font-weight:bold;">{{formatPrice(summary.profit)}} {{currency}}</td>
                                          <td v-else style="color:green;font-weight:bold;">{{formatPrice(summary.profit)}} {{currency}}</td>
                                    </tr>
                                    <tr>
                                          <th>Total spent</th>
                                          <td>{{formatPrice(summary.total)}} {{currency}}</td>
                                    </tr>                                                        
                              </table>
                        </div>
                        
                  </div>
                  <div class="row pt-5">
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
                        <b-collapse id="equipment-collapse" v-model="equipmentVisible" class="mt-2" >
                              <b-table striped  :items="car.equipment" responsive>                                                 </b-table>
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
                        <b-collapse id="repairs-collapse" v-model="repairsVisible" class="mt-2" >
                              <div v-if="repairs.length != 0"> 
                                    <b-table striped  :items="repairs" responsive :fields="fields"/> 
                                    <h2 class="pt-3">Repairs total: {{repairs[0].total}} {{currency}}</h2> 
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
                                    <h2 class="pt-3">Shipping total: {{shipping.total}} {{currency}}</h2>   
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
                        images: [],
                        equipment: [],
                        base64images: [], 
                        mainImgUrl: '' 
                  },
                  summary: {
                        boughtPrice:'',
                        soldPrice:'',
                        totalShipping: '',
                        sold: '',
                        soldDate:'',
                        profit: ''
                  },
                  repairs: [],
                  repair: {
                        name: '',
                        price: '',
                        total: ''
                  },
                  shipping: {
                        customs: '',
                        auctionFee: '',
                        transferFee: '',
                        transportationFee: '', 
                        total: 0
                  },
                  tracking:{
                        auctionImages: []
                  },
                  insertRepair: {
                        name: '',
                        price: '',
                  }, 
                  loading: true,
                  index: null,
                  isShippingModalVisible: false,
                  alertFlag: false,
                  alertMessage: '',
                  equipmentVisible: false,
                  repairsVisible: false,
                  shippingVisible: false,
                  myImgs: []
            }
            
      },
      components: {
            'gallery': VueGallery,
            shippingModal,
      },
      watch: {
            //'$route' (to, from) {
              //    alert("to", to.params.id);
            //      alert("from", from.params.id);
          //  }
      },
      created() {        
            this.fetchCar(); 
            this.fetchTracking();         
            this.fetchCarSummary();         
            this.fetchCarRepairs();
            this.fetchCarShipping();                  
      },

      methods: {
            fetchCar() {
                  var vm = this;
                  axios.get(backEndUrl + `/api/cars/${vm.$route.params.id}`, {
                        headers: {
                              Authorization: 'Bearer ' + window.$cookies.get('token')
                        }
                  })
                  .then(function (response) {
                        if(response.status == 200)
                        {  
                              vm.car = response.data;
                              vm.car.base64images[0] = vm.car.mainImgUrl
                              vm.loading = false;
                              //trimming unnecessary date ending           
                              vm.car.manufactureDate = vm.car.manufactureDate.substring(0, 10);
                              if(vm.car.images.length != 0)
                              {
                                    if(vm.car.base64images[0] == vm.car.mainImgUrl)
                                          vm.car.base64images = [];

                                    let n = vm.car.images.length;
                                    let from = vm.car.images;
                                    let to = vm.car.base64images;
                                    vm.getImagesRecursive(n, from, to); 
                              }
                        }
                        if(response.status == 401) 
                        {
                              vm.$cookies.remove('token');
                              vm.$cookies.remove('user-email');
                              vm.$cookies.remove('role');
                              vm.$cookies.remove('user');
                              vm.$cookies.remove('currency');
                              window.location.href('/');
                        } 
                  })
                  .catch(function (error) {
                        console.log(error);
                        vm.loading = false;
                  });        
            },
            fetchCarRepairs() {
                  var vm = this;
                  axios.get(backEndUrl + `/api/cars/${vm.$route.params.id}/repairs`, {
                        headers: {
                              Authorization: 'Bearer ' + window.$cookies.get('token')
                        }
                  })
                  .then(function (response) {
                        if(response.status == 200)
                              vm.repairs = response.data;
                        if(response.status == 401) 
                        {
                              vm.$cookies.remove('token');
                              vm.$cookies.remove('user-email');
                              vm.$cookies.remove('role');
                              vm.$cookies.remove('user');
                              vm.$cookies.remove('currency');
                              window.location.href('/');
                        } 
                  })
                  .catch(function (error) {
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
                        {
                              vm.shipping = response.data;
                              vm.shipping.total = 
                                    vm.shipping.customs +
                                    vm.shipping.auctionFee +
                                    vm.shipping.transferFee + 
                                    vm.shipping.transportationFee;
                              vm.shippingItems = [{
                                    "Transportation fee": vm.shipping.transportationFee,
                                    "Transfer Fee": vm.shipping.transferFee,
                                    "Auction Fee": vm.shipping.auctionFee,
                                    "Customs": vm.shipping.customs
                              }];
                        }
                        if(response.status == 401) 
                        {
                              vm.$cookies.remove('token');
                              vm.$cookies.remove('user-email');
                              vm.$cookies.remove('role');
                              vm.$cookies.remove('user');
                              vm.$cookies.remove('currency');
                              window.location.href('/');
                        } 
                              
                  })
                  .catch(function (error) {
                        console.log(error);
                  });
            },
            fetchCarSummary() {
                  var vm = this;
                  axios.get(backEndUrl + `/api/cars/${vm.$route.params.id}/summary`, {
                        headers: {
                              Authorization: 'Bearer ' + window.$cookies.get('token')
                        }
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
                              if(response.status == 401) 
                              {
                                    vm.$cookies.remove('token');
                                    vm.$cookies.remove('user-email');
                                    vm.$cookies.remove('role');
                                    vm.$cookies.remove('user');
                                    vm.$cookies.remove('currency');
                                    window.location.href('/');
                              } 
                        }
                  })
                  .catch(function (error) {
                        console.log(error);
                  });           
            },
            fetchTracking() {
                  let vm = this;
                  axios.get(backEndUrl + `/api/cars/${this.$route.params.id}/tracking`, {
                        headers: { Authorization: 'Bearer ' + window.$cookies.get('token') }
                  })
                  .then(function (response) {
                        if(response.status == 200)
                        {           
                              vm.tracking = response.data;
                              if(vm.tracking.auctionImages.length != 0)
                              {
                                    if(vm.car.base64images[0] == vm.car.mainImgUrl)
                                          vm.car.base64images = [];
                                    let n = vm.tracking.auctionImages.length;
                                    let from = vm.tracking.auctionImages;
                                    let to = vm.car.base64images;
                                    vm.getImagesRecursive(n, from, to);
                              }                                               
                        }
                        else if(response.status == 401) 
                        {
                              vm.$cookies.remove('token');
                              vm.$cookies.remove('user-email');
                              vm.$cookies.remove('role');
                              vm.$cookies.remove('user');
                              vm.$cookies.remove('currency');
                              window.location.href('/');
                        }                       
                  })
                  .catch(function (error) {
                        console.log(error);
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
                  this.deleteCar();
                  this.deleteCarSummary();
                  this.deleteCarTracking();
                  this.deleteCarRepairs();
                  this.deleteCarShipping();
            },
            deleteCar(){
                  var vm = this;
                  axios.delete(backEndUrl + `/api/cars/${vm.$route.params.id}`, {
                        headers: {
                              Authorization: 'Bearer ' + window.$cookies.get('token')
                        }
                  })
                  .then(function (response){
                        if(response.status == 204)
                        {
                              vm.alertMessage = "Car successfully deleted";
                              vm.alertFlag = true;
                              vm.$router.push("/cars");
                        }
                        if(response.status == 401) 
                        {
                              vm.$cookies.remove('token');
                              vm.$cookies.remove('user-email');
                              vm.$cookies.remove('role');
                              vm.$cookies.remove('user');
                              vm.$cookies.remove('currency');
                              window.location.href('/');
                        } 
                  })
                  .catch(function (error){
                        console.log(error);
                  })
            },
            deleteCarSummary(){
                  var vm = this;
                  axios.delete(backEndUrl + `/api/cars/${vm.$route.params.id}/summary`, {
                        headers: {
                              Authorization: 'Bearer ' + window.$cookies.get('token')
                        }
                  })
                  .catch(function (error){
                        console.log(error);
                  })
            },
            deleteCarTracking(){
                  var vm = this;
                  axios.delete(backEndUrl + `/api/cars/${vm.$route.params.id}/tracking`, {
                        headers: {
                              Authorization: 'Bearer ' + window.$cookies.get('token')
                        }
                  })
                  .catch(function (error){
                        console.log(error);
                  })
            },
            deleteCarShipping(){
                  var vm = this;
                  axios.delete(backEndUrl + `/api/cars/${vm.$route.params.id}/shipping`, {
                        headers: {
                              Authorization: 'Bearer ' + window.$cookies.get('token')
                        }
                  })
                  .catch(function (error){
                        console.log(error);
                  })
            },
            deleteCarRepairs(){
                  var vm = this;
                  axios.delete(backEndUrl + `/api/cars/${vm.$route.params.id}/repairs`, {
                        headers: {
                              Authorization: 'Bearer ' + window.$cookies.get('token')
                        }
                  })
                  .catch(function (error){
                        console.log(error);
                  })
            },
            formatPrice(value) {
                  return new Intl.NumberFormat('lt-LT').format(value);
            },
            getImage(image, saveTo){
                  axios.post(backEndUrl + "/api/get-image", image, {
                        headers: {
                              Authorization: 'Bearer ' + window.$cookies.get('token')
                        }
                  })
                  .then(function (response) {
                        if(response.status == 200)
                             saveTo.push(response.data); 
                              
                        if(response.status == 401) 
                        {
                              this.$cookies.remove('token');
                              this.$cookies.remove('user-email');
                              this.$cookies.remove('role');
                              this.$cookies.remove('user');
                              this.$cookies.remove('currency');
                              window.location.href('/');
                        }    
                  })
                  .catch(function (error) {
                        console.log(error);
                  });
            },
            getImagesRecursive(n, from, to){
                  for(let i =0;i<n;i++)
                        this.getImage(from[i], to);             
            },
            goToCars(){
                  this.$router.push('/cars');
            }

      }
}
</script>
<style scoped>
  .image {
    float: left;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    border: 1px solid #ebebeb;
    margin: 5px;
  }
  .divider{
    width:5px;
    height:auto;
    display:inline-block;
}
</style> 