<template>
<div>
      <div class="container pt-5" v-if="!loading">
            <b-alert v-model="successAlert" variant="success" dismissible>{{alertMessage}}</b-alert>
            <b-alert v-model="failedAlert" variant="danger" dismissible>{{alertMessage}}</b-alert>

            <button v-b-modal.car-insert-modal class="btn btn-primary"
            @click="showBmwModal"
            @close="fetchCars()"
            @ok="fetchCars()">
                  Add new car
            </button>
            <!-- bmw modal-->
            <bmwModal v-show="isBmwModalVisible" @click="closeBmwModal" @ok="fetchCars()" @close="fetchCars()"/>

            <div class="row">
                  <div class="pt-5 col-4" v-for="(car) in cars" v-bind:key="car._id">                
                        <div class="card" style="width: 20rem; height: 30rem;">
                              <a v-bind:href="'/cars/'+ car._id">                                                         
                                    <img :src='car.mainImgUrl' class="card-img-top img-thumbnail img-responsive" alt="Responsive image">
                              </a>
                              <div class="pt-3 card-body">
                                    <div class="row">
                                          <a v-bind:href="'/cars/'+ car._id">  
                                                <h2>{{car.make}} {{car.model}}</h2>
                                          </a>
                                    </div>
                                    <div class="row">           
                                          <h4>Already paid: {{car.summary.total}} €</h4>
                                    </div>
                                    <div class="row">
                                          <div v-if="car.summary.sold">
                                                <h1 style="color:red;font-weight: bold;">SOLD</h1>
                                                <h2 v-if="car.summary.profit < 0" style="color:red;font-weight:bold;">Profit: {{car.summary.profit}} €</h2>
                                                <h2 v-else style="color:green;font-weight:bold;">Profit: {{car.summary.profit}} €</h2>
                                          </div>
                                    </div>            
                              </div>
                              <div v-if="!car.summary.sold">
                                    <button v-b-modal.sold-modal @click="openSoldModal(car._id, index)" type="button" class="btn btn-warning">Sold?</button>
                              </div> 
                        </div> 
                                    
                  </div>
            </div> 
      </div>
      <div class="pt-3" v-else>
            <center>
                  <b-spinner label="Loading..."></b-spinner>
            </center> 
      </div> 

      <b-modal id="sold-modal" ref="modal" title="Sold data"
        @show="resetModal"
        @ok="handleOk"
        @close="resetModal">

        <b-alert v-model="successAlert" dismissible>Inserting please wait...</b-alert>

            <form ref="form" @submit.stop.prevent="handleSubmit">

                <b-form-group :state="soldDetails.soldPriceState" label="Sold price" label-for="price-input" 
                              invalid-feedback="Price is required and cannot be less than 0">  
                    <b-form-input v-model='soldDetails.soldPrice' :state="soldDetails.soldPriceState" 
                         id="price-input" type="number" min="0" step=".01" placeholder="10000" required>
                    </b-form-input>
                </b-form-group>     

            </form>
        </b-modal>


 
</div>
</template>

<script>

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function() 
{
     'use strict';
     window.addEventListener('load', function() 
     {
          // Fetch all the forms we want to apply custom Bootstrap validation styles to
          var forms = document.getElementsByClassName('needs-validation');
          // Loop over them and prevent submission
          Array.prototype.filter.call(forms, function(form) 
          {
               form.addEventListener('submit', function(event) 
               {
                    if (form.checkValidity() === false)
                    {
                         event.preventDefault();
                         event.stopPropagation();
                    }
                    form.classList.add('was-validated');
               }, false);
          });
     }, false);
})();

import bmwModal from '../Modals/CarModal.vue';
import axios from 'axios';

const backEndUrl = process.env.VUE_APP_API;
export default {      
      data() {
            return {
                  alertMessage:'',
                  successAlert: false,
                  failedAlert: false,
                  cars: [],
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
                        mainImgUrl:'',
                        equipment: [],
                        summary: {
                              boughtPrice:'',
                              soldPrice:'',
                              total: '',
                              sold: '',
                              profit: 0
                        },
                  },
                  insertCar: {
                        vin: '',
                        boughtPrice: '',
                        make: '',
                        Base64images: []
                  } ,
                  insertRepair: {
                        name: '',
                        price: '',
                        car: ''
                  },
                  loading: false,
                  isBmwModalVisible: false,
                  soldDetails: {
                        soldPrice: 0,
                        car: '',
                        sold: '',
                        index: '',
                        soldPriceState: null,
                  }                
            }           
      },

      watch: {
            /*'$route' (to, from) {
                  alert("to", to.params);
                  alert("from", from);
            }*/
      },
      created() {
            this.fetchCars();
            //console.log(window.$cookies.get('token'));
           // console.log(window.$cookies.get('role'));
         ///   alert(this.$route.params.id);
      },
      components: {
            bmwModal,
      },
      methods: {
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
                        headers: {
                              Authorization: 'Bearer ' + window.$cookies.get('token')
                        }
                  })
                  .then(function (response) {
                        if(response.status == 200)
                        {
                              vm.cars = response.data;
                              vm.loading = false;
                              //setting repair value to dafault - first of a list
                              vm.insertRepair.car = vm.cars[0]._id;
                              
                              vm.fetchCarsSummary();
                        }                       
                  })
                  .catch(function (error) {
                        vm.loading = false;
                        vm.alertMessage = error.response.data;
                        vm.failedAlert = true;
                        console.log(error);
                  });
            },
            fetchCarsSummary() {
                  let vm = this;
                  console.log(vm.cars);
                  for(let i =0; i< vm.cars.length;i++)
                  {
                        axios.get(backEndUrl + `/api/cars/${vm.cars[i].id}/summary`, {
                              headers: {
                                    Authorization: 'Bearer ' + window.$cookies.get('token')
                              }
                        })
                        .then(function (response) {
                              if(response.status == 200)
                              {
                                    vm.cars[i].summary = response.data;
                                    vm.cars[i].summary.profit = 
                                          vm.cars[i].summary.soldPrice -
                                          vm.cars[i].summary.total; 
                              }
                                    
                        })
                        .catch(function (error) {
                              vm.alertMessage = error.response.data;
                              vm.failedAlert = true;
                              console.log(error);
                        });           
                  }      
            },
            fetchCarSummary(index, carId) {
                  let vm = this;
                  axios.get(backEndUrl + `/api/cars/${carId}/summary`, {
                        headers: {
                              Authorization: 'Bearer ' + window.$cookies.get('token')
                        }
                  })
                  .then(function (response) {
                        if(response.status == 200)
                        {
                              vm.cars[index].summary = response.data;
                              vm.cars[index].summary.profit = 
                                    vm.cars[index].summary.soldPrice -
                                    vm.cars[index].summary.total; 
                        }                        
                  })
                  .catch(function (error) {
                        vm.alertMessage = error.response.data;
                        vm.failedAlert = true;
                        console.log(error);
                  });       
            },
            showAlert(message){
                  this.successAlert = true;
                  this.alertMessage = message;
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
                  console.log(this.insertCar.Base64images);                
            },
            fetchCar(carId, index) {
                  var vm = this;
                  axios.get(backEndUrl + `/api/cars/${carId}`, {
                        headers: {
                              Authorization: 'Bearer ' + window.$cookies.get('token')
                        }
                  })
                  .then(function (response) {
                        if(response.status == 200)
                              vm.fetchCarSummary(index, carId);
                  })
                  .catch(function (error) {
                        vm.alertMessage = error.response.data;
                        vm.failedAlert = true;
                        console.log(error);
                  });        
            },

            resetModal() {
                  this.soldDetails.soldPrice = '';
                  this.soldDetails.soldPriceState = null;
            },
            checkFormValidity() {
                  const valid = this.$refs.form.checkValidity();
                  this.soldDetails.soldPriceState = this.$refs.form[0].checkValidity();
                  return valid;
            },
            handleOk(bvModalEvt) {
                  // Prevent modal from closing
                  bvModalEvt.preventDefault()
                  // Trigger submit handler
                  this.handleSubmit()
            },
            handleSubmit() {
                  // Exit when the form isn't valid
                  if (!this.checkFormValidity()) {
                        return
                  }
                  else
                  {
                        this.soldDetails.sold = true;
                        console.log(this.soldDetails);
                        var vm = this;
                        axios.put(backEndUrl + `/api/cars/${vm.soldDetails.car}/summary`, this.soldDetails, {
                              headers: {
                                    Authorization: 'Bearer ' + window.$cookies.get('token')
                              }
                        })
                        .then(function (response) {
                              if(response.status == 204)
                              {
                                    vm.fetchCar(vm.soldDetails.car, vm.soldDetails.index);
                                    vm.$nextTick(() => {
                                          vm.$bvModal.hide('sold-modal')
                                    })
                              }                   
                        })
                        .catch(function (error){
                              vm.alertMessage = error.response.data;
                              vm.failedAlert = true;
                              console.log(error);
                        })                             
                  }
            },
            openSoldModal(carId, index) {
                  this.soldDetails.car = carId;
                  this.soldDetails.index = index;
            }

      }
}
</script>