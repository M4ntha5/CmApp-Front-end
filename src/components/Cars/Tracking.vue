<template>
      <div class="container pt-5">
            <b-alert v-model="alertFlag" :variant="dangerAlert ? 'danger' : 'success'" dismissible>{{alertMessage}}</b-alert>          
            <div class="pt-4 mb-4 ml-2">
                  <b-button variant="primary" @click="goToSelectedCar()">Back</b-button>
                  <b-button id="tracking-button-info" @click="handleTracking()" style="float:right;" class="mr-2">
                        Look for tracking
                  </b-button> 
            </div>
            <h1 style="text-align:center;">{{selectedCar.make}} {{selectedCar.model}}</h1>

            <div v-if="!loading && !empty">
                  <div class="row pt-4" >                    
                        <div class="img-fluid col-sm-6 col-12" v-if="trackingImages.length != 0">              
                              <gallery :images="trackingImages" :index="index" @close="index = null"></gallery>
                              <div class="image img-fluid" 
                                    @click="index = 0"
                                    :style="{ backgroundImage: 'url(' + trackingImages[0].href + ')', width:'350px', height:'300px' }"
                              />
                        </div>
                        <div class="img-fluid col-sm-6 col-12" v-else>              
                              <gallery :images="defaultImg" :index="index" @close="index = null"></gallery>
                              <div class="image img-fluid" 
                                    @click="index = 0"
                                    :style="{ backgroundImage: 'url(' + defaultImg[0].href + ')', width:'350px', height:'300px' }"
                              />
                        </div>
                        <div class="col-sm-6 col-12 pt-4">
                              <table class="table table-responsive-sm">
                                    <tr>
                                          <th>Shipping line</th>
                                          <td>{{tracking.shippingLine}}</td>
                                    </tr>
                                    <tr>
                                          <th>Container number</th>
                                          <td>{{tracking.containerNumber}}</td>
                                    </tr>
                                    <tr>
                                          <th>Booking number</th>
                                          <td>{{tracking.bookingNumber}}</td>
                                    </tr>
                                    <tr>
                                          <th>Url to full tracking info</th>
                                          <td><a :href='tracking.url' target="_blank">Click here</a></td>
                                    </tr>
                                    <tr>
                                          <th>Final port</th>
                                          <td>{{tracking.finalPort}}</td>
                                    </tr>
                                    <tr>
                                          <th>Pick up date</th>
                                          <td>{{tracking.datePickedUp}}</td>
                                    </tr>
                              </table>
                        </div>                   
                  </div>
                  <div class="row pt-5 ml-1">
                        <table class="table table-responsive-sm">
                              <tr>
                                    <th>Vin</th>
                                    <td>{{tracking.vin}}</td>
                              </tr>
                              <tr>
                                    <th>Year</th>
                                    <td>{{tracking.year}}</td>
                              </tr>
                              <tr>
                                    <th>Make</th>
                                    <td>{{tracking.make}}</td>
                              </tr> 
                              <tr>
                                    <th>Model</th>
                                    <td>{{tracking.model}}</td>
                              </tr>
                              <tr>
                                    <th>Title</th>
                                    <td>{{tracking.title}}</td>
                              </tr>
                              <tr>
                                    <th>State</th>
                                    <td>{{tracking.state}}</td>
                              </tr>
                              <tr>
                                    <th>Status</th>
                                    <td>{{tracking.status}}</td>
                              </tr>
                              <tr>
                                    <th>Received date</th>
                                    <td>{{tracking.dateReceived}}</td>
                              </tr>
                              <tr>
                                    <th>Order date</th>
                                    <td>{{tracking.dateOrdered}}</td>
                              </tr>
                              <tr>
                                    <th>Branch</th>
                                    <td>{{tracking.branch}}</td>
                              </tr>                    
                              <tr>
                                    <th>Color</th>
                                    <td>{{tracking.color}}</td>
                              </tr>
                              <tr>
                                    <th>Damage</th>
                                    <td>{{tracking.damage}}</td>
                              </tr>
                              <tr>
                                    <th>Condition</th>
                                    <td>{{tracking.condition}}</td>
                              </tr>
                              <tr>
                                    <th>Keys</th>
                                    <td>{{tracking.keys}}</td>
                              </tr>
                              <tr>
                                    <th>Running</th>
                                    <td>{{tracking.running}}</td>
                              </tr>
                              <tr>
                                    <th>Wheels</th>
                                    <td>{{tracking.wheels}}</td>
                              </tr>
                              <tr>
                                    <th>AirBag</th>
                                    <td>{{tracking.airBag}}</td>
                              </tr>
                              <tr>
                                    <th>Radio</th>
                                    <td>{{tracking.radio}}</td>
                              </tr>                     
                        </table>
                  </div>
            </div> 
            <div class="pt-3" v-if="loading">        
                  <center>
                        <b-spinner label="Loading..."></b-spinner>
                  </center> 
            </div>
            <center v-if="empty && !loading">
                  <h2>No tracking info yet</h2>
            </center>

            <b-popover target="tracking-button-info" triggers="hover" placement="top">
                  <template v-slot:title>Info</template>
                  <p>
                        Gets or updates tracking data like: container and booking number,
                        as well as URL for deeper information about your car tracking.<br>
                        Also it downloads all available images.
                  </p>              
            </b-popover>              
      </div>
</template>

<script>
const backEndUrl = process.env.VUE_APP_API;
import VueGallery from 'vue-gallery';
import axios from 'axios';

export default { 
      data() {
            return {               
                  tracking: {
                        vin: '',
                        year: '',
                        make: '',
                        model: '',
                        title: '',
                        state: '',
                        status: '',
                        dateReceived: '',
                        dateOrdered: '',
                        branch: '',
                        shippingLine: '',
                        containerNumber: '',
                        bookingNumber: '',
                        url: '',
                        finalPort: '',
                        datePickedUp: '',
                        color: '',
                        damage: '',
                        condition: '',
                        keys: '',
                        running: '',
                        wheels: '',
                        airBag: '',
                        radio: '',  
                        images: [],                
                        car: ''
                  },
                  selectedCar:{},
                  index: null,
                  loading: true,
                  empty: true,
                  alertFlag: false,
                  alertMessage: '',
                  dangerAlert: false,
                  urls: [],
                  defaultImg: [{
                        href: process.env.VUE_APP_DEFAULT_IMAGE,
                        title: '1/1'
                  }]
            }       
      },
      components: {
               'gallery': VueGallery,
      },
      created() {
            this.fetchTracking();
            this.fetchCar();
      },
      computed: {
            trackingImages: function(){
                  let list = [];
                  let shared = '';
                  if(this.urls.length > 0)
                  {
                        shared = this.urls;
                        for(let i =0;i<shared.length;i++)
                        {
                              let obj = {
                                    href: shared[i],
                                    title: i + 1 + '/' + shared.length
                              }
                              list.push(obj);
                        } 
                        return list;
                  }
                  else
                  {
                        shared = this.tracking.images;
                        for(let i =0;i<shared.length;i++)
                        {
                              let obj = {
                                    href: shared[i].url,
                                    title: i + 1 + '/' + shared.length
                              }
                              list.push(obj);
                        } 
                        return list;
                  }
                   
            }
      },

      methods: {
            fetchCar() {
                  var vm = this;
                  axios.get(backEndUrl + `/api/cars/${vm.$route.params.id}`, {
                        headers: { Authorization: 'Bearer ' + window.$cookies.get('token') }
                  })
                  .then(function (response) {
                        if(response.status == 200)
                              vm.selectedCar = response.data;
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
                        {
                              vm.tracking = response.data;
                              vm.tracking.dateReceived = vm.tracking.dateReceived.substring(0, 10);
                              vm.tracking.dateOrdered = vm.tracking.dateOrdered.substring(0, 10);
                              vm.tracking.datePickedUp = vm.tracking.datePickedUp.substring(0, 10);
                              
                              if(vm.tracking.containerNumber != '')
                                    vm.empty = false;
                              vm.loading = false;           
                        }                          
                  })
                  .catch(function (error) {
                        vm.alertMessage = error.response.data;
                        vm.dangerAlert = true;
                        vm.alertFlag = true;
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
            lookForTracking(){
                  let vm = this;
                  axios.post(backEndUrl + `/api/cars/${this.$route.params.id}/tracking`,{}, {
                        headers: { Authorization: 'Bearer ' + window.$cookies.get('token') }
                  })
                  .then(function (response) {
                        if(response.status == 200)
                        {                              
                              vm.tracking = response.data;

                              vm.tracking.dateReceived = vm.tracking.dateReceived.substring(0, 10);
                              vm.tracking.dateOrdered = vm.tracking.dateOrdered.substring(0, 10);
                              vm.tracking.datePickedUp = vm.tracking.datePickedUp.substring(0, 10);

                              if(vm.tracking.containerNumber != '')
                                    vm.empty = false;
                              vm.loading = false;
                    
                              vm.dangerAlert = false;
                              vm.alertMessage = "Tracking data updated sccessfully.";
                              vm.alertFlag = true;
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
            lookForTrackingImagesUrls(){
                  let vm = this;
                  axios.get(backEndUrl + `/api/cars/${this.$route.params.id}/tracking-images`, {
                        headers: { Authorization: 'Bearer ' + window.$cookies.get('token') }
                  })
                  .then(function (response) {
                        if(response.status == 200)
                        {
                              vm.urls = response.data;   
                              if(vm.urls.length > 0)   
                              {
                                    //bring back if needed
                                    //vm.downloadTrackingImages(response.data)                      
                                    vm.dangerAlert = false;
                                    vm.alertMessage = "Images successfully updated";
                                    vm.alertFlag = true;
                              }              
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
            //bring back if needed
            /*
            downloadTrackingImages(urls){
                  let vm = this;
                  axios.post(backEndUrl + `/api/cars/${this.$route.params.id}/tracking/download-images`, urls, {
                        headers: { Authorization: 'Bearer ' + window.$cookies.get('token') }
                  })
                  .catch(function (error) {
                        vm.alertMessage = "Failed saving tracking images, you may try again later!";
                        vm.dangerAlert = true;
                        vm.alertFlag = true;
                        console.log(error.response.data);
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

            },*/
            handleTracking(){
                  this.dangerAlert = false;
                  this.alertMessage = "Looking for data please wait... This may take several minutes!!";
                  this.alertFlag = true;
                  if(this.tracking.vin == '')
                  {                    
                        this.lookForTrackingImagesUrls();  
                        this.lookForTracking();
                  }
                  else
                        this.lookForTracking();
                                  
            },
            goToSelectedCar(){
                  this.$router.push(`/cars/${this.$route.params.id}`);
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
      border: 3px solid #ebebeb;
}
.divider{
      width:5px;
      height:auto;
      display:inline-block;
}     
</style> 