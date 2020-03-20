<template>
<div>
      <div class="container pt-5" v-if="!loading">
            <b-alert v-model="alertFlag" variant="success" dismissible>{{alertMessage}}</b-alert>

            <button v-b-modal.car-insert-modal class="btn btn-primary"
            @click="showBmwModal"
            @close="fetchCars()">
                  Add new
            </button>
            <!-- bmw modal-->
            <bmwModal v-show="isBmwModalVisible" @click="closeBmwModal"/>

            <div class="row">
                  <div class="pt-5 col-4" v-for="car in cars" v-bind:key="car._id">     
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
                                                <h1 style="color:red;font-weight: bold;">SOLD {{car.summary.soldPrice}} €</h1>
                                                <h2>Profit: {{car.summary.profit}} €</h2>
                                          </div>
                                    </div>            
                              </div>
                              <div v-if="!car.summary.sold">
                                    <button @click="updateSoldStatus(car._id)" type="button" class="btn btn-warning">Sold?</button>
                              </div>
                        </div>             
                  </div>
            </div> 
      </div>
      <div class="pt-3" v-else>
            <center><h1>Loading... please wait</h1></center> 
      </div>  
 
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

const backEndUrl = process.env.VUE_APP_BACK_END_URL;
export default {      
      data() {
            return {
                  alertMessage:'',
                  alertFlag: false,
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
                  loading: true,
                  isBmwModalVisible: false,
                  soldDetails: {
                        soldPrice: 0,
                        car: '',
                        sold: ''
                  }
                  
            }
            
      },

      watch: {
            //'$route' (to, from) {
              //    alert("to", to.params.id);
            //      alert("from", from.params.id);
          //  }
      },
      created() {
            this.fetchCars();
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
            },
            fetchCars() {
                  let vm = this;
                  axios.get(backEndUrl + "/api/cars")
                  .then(function (response) {
                        if(response.status == 200)
                        {
                              vm.cars = response.data;
                              vm.loading = false;
                              //setting repair value to dafault - first of a list
                              vm.insertRepair.car = vm.cars[0]._id;
                              vm.fetchCarSummary();
                        }
                        
                  })
                  .catch(function (err) {
                        vm.loading = false;
                        console.log(err);
                  });
            },
            fetchCarSummary() {
                  let vm = this;
                  for(let i =0; i< vm.cars.length;i++)
                  {
                        axios.get(backEndUrl + `/api/cars/${vm.cars[i]._id}/summary`)
                        .then(function (response) {
                              if(response.status == 200)
                              {
                                    vm.cars[i].summary = response.data;
                                    vm.cars[i].summary.profit = 
                                          vm.cars[i].summary.soldPrice -
                                          vm.cars[i].summary.boughtPrice; 
                              }
                                    
                        })
                        .catch(function (error) {
                              console.log(error);
                        });           
                  }      
            },
            showAlert(message){
                  this.alertFlag = true;
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
            updateSoldStatus(carId) {
                  window.location.href = "/not-inplemented";
                  /*
                  this.soldDetails.car = carId;
                  this.soldDetails.sold = true;
                  this.soldDetails.soldPrice = 15000;
                  
                  axios.put(backEndUrl + `/api/cars/${carId}/summary`, this.soldDetails)
                  .catch(function (error){
                        console.log(error);
                  })*/
            }

      }
}
</script>