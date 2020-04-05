<template>
      <div class="container pt-5">
            <b-alert class="row" v-model="alertFlag" :variant="dangerAlert ? 'danger' : 'success'" dismissible>{{alertMessage}}</b-alert>          
            <b-button class="row mb-4 ml-2" id="tracking-button-info" @click="handleTracking()">
                  Look for tracking
            </b-button>      
            <div class="row pt-4" v-if="!loading && !empty">                    
                  <div class="img-fluid col-sm-6">              
                        <gallery :images="tracking.base64images" :index="index" @close="index = null"></gallery>
                        <div class="image" 
                              @click="index = 0"
                              :style="{ backgroundImage: 'url(' + tracking.base64images[0] + ')', width:'350px', height:'300px' }"
                        />
                  </div>
                  <div class="col-sm-6">
                        <table class="table table-responsive-sm">
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
                        containerNumber: '',
                        bookingNumber: '',
                        auctionImages: [],
                        base64images: [],
                        url: '',
                        car: ''
                  }, 
                  index: null,
                  loading: true,
                  empty: true,
                  alertFlag: false,
                  alertMessage: '',
                  dangerAlert: false
            }       
      },
      components: {
               'gallery': VueGallery,
      },
      watch: {
            //'$route' (to, from) {
              //    alert("to", to.params.id);
            //      alert("from", from.params.id);
          //  }
      },
      created() {
            this.fetchTracking();
      },

      methods: {
            fetchTracking() {
                  let vm = this;
                  axios.get(backEndUrl + `/api/cars/${this.$route.params.id}/tracking`, {
                        headers: { Authorization: 'Bearer ' + window.$cookies.get('token') }
                  })
                  .then(function (response) {
                        if(response.status == 200)
                        {
                              vm.tracking = response.data;
                              vm.fetchImages();
                              if(vm.tracking.containerNumber != '')
                                    vm.empty = false;
                              vm.loading = false;           
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
                        console.log(error);
                        vm.alertMessage = error.response.data;
                        vm.dangerAlert = true;
                        vm.alertFlag = true;
                        vm.loading = false;
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
                              vm.dangerAlert = false;
                              vm.alertMessage = "Tracking data updated sccessfully. Downloading images...";
                              vm.alertFlag =true;
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
                        vm.alertMessage = error.response.data;
                        vm.dangerAlert = true;
                        vm.alertFlag = true;
                        console.log(error);
                  }); 
            },
            lookForTrackingImages(){
                  let vm = this;
                  axios.get(backEndUrl + `/api/cars/${this.$route.params.id}/tracking-images`, {
                        headers: { Authorization: 'Bearer ' + window.$cookies.get('token') }
                  })
                  .then(function (response) {
                        if(response.status == 200)
                        {
                              vm.tracking.base64images = response.data;                                  
                              vm.dangerAlert = false;
                              vm.alertMessage = "Images successfully updated";
                              vm.alertFlag =true;
                             // vm.loading = false;
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
                        vm.alertMessage = error.response.data;
                        vm.dangerAlert = true;
                        vm.alertFlag = true;
                        console.log(error);
                  }); 
            },
            handleTracking(){
                  this.lookForTracking();
                  this.lookForTrackingImages();            
            },
            fetchImages() {
                  var vm = this;
                  if(vm.tracking.containerNumber == '')
                        return;
                  vm.alertMessage = "Please wait while we get all images ready for you";
                  vm.dangerAlert = false;
                  vm.alertFlag = true;
                  axios.post(backEndUrl + "/api/get-images", vm.tracking.auctionImages, {
                        headers: { Authorization: 'Bearer ' + window.$cookies.get('token') }
                  })
                  .then(function (response) {
                        if(response.status == 200)
                        {
                              vm.tracking.base64images = response.data;
                              vm.alertMessage = "All images ready to use, enjoy :)";
                              vm.dangerAlert = false;
                              vm.alertFlag = true;
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
                        console.log(error);
                  });
            },
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