<template>
     <div class="container">
           <b-form class="pt-4">
               <div class="form-row">
                    <b-form-group class="col-md-4 mb-3" label="Make">
                         <b-form-select id="make-input" name="make-input"
                              v-model="car.make"
                              :options="allMakes.Make_Name"
                              v-validate="{ required: true }"
                              :state="validateState('make-input')" 
                              aria-describedby="make-input-live-feedback"
                              data-vv-as="make"
                         ></b-form-select>
                         <b-form-invalid-feedback id="make-input-live-feedback">{{ veeErrors.first('make-input') }}</b-form-invalid-feedback>
                    </b-form-group>

                    <b-form-group class="col-md-4 mb-3" label="Model">
                         <b-form-input id="model-input" name="model-input" placeholder="M5"
                              v-model="car.model"
                              v-validate="{ required: true }"
                              :state="validateState('model-input')" 
                              aria-describedby="model-input-live-feedback"
                              data-vv-as="model">
                         </b-form-input>
                         <b-form-invalid-feedback id="model-input-live-feedback">{{ veeErrors.first('model-input') }}</b-form-invalid-feedback>
                    </b-form-group>

                    <b-form-group class="col-md-4 mb-3" label="Series">
                         <b-form-input id="series-input" placeholder="F10" name="series-input"  
                              v-model="car.series"
                              v-validate="{ required: true }"
                              :state="validateState('series-input')" 
                              aria-describedby="series-input-live-feedback"
                              data-vv-as="series">>
                         </b-form-input>
                         <b-form-invalid-feedback id="series-input-live-feedback">{{ veeErrors.first('series-input') }}</b-form-invalid-feedback>
                    </b-form-group>
               </div>
               <div class="form-row">
                    <b-form-group class="col-md-6 mb-3" label="Vin">
                         <b-form-input disabled v-model="car.vin">>
                         </b-form-input>
                    </b-form-group>
                    <b-form-group class="col-md-6 mb-3" label="Manufacture date">
                         <b-form-input id="date-input" type="date" name="date-input"
                              v-model="car.manufactureDate"
                              v-validate="{ required: true }"
                              :state="validateState('date-input')" 
                              aria-describedby="date-input-live-feedback"
                              data-vv-as="date">
                         </b-form-input>
                         <b-form-invalid-feedback id="date-input-live-feedback">{{ veeErrors.first('date-input') }}</b-form-invalid-feedback>
                    </b-form-group>
               </div>
               <div class="form-row">
                    <b-form-group class="col-md-3 mb-3" label="Body type">
                         <b-form-select id="body-input" name="body-input"
                              v-model="car.bodyType"
                              :options="body"
                              v-validate="{ required: true }"
                              :state="validateState('body-input')" 
                              aria-describedby="body-input-live-feedback"
                              data-vv-as="body"
                         ></b-form-select>
                         <b-form-invalid-feedback id="body-input-live-feedback">{{ veeErrors.first('body-input') }}</b-form-invalid-feedback>

                    </b-form-group>
                    <b-form-group class="col-md-3 mb-3" label="Steering">
                         <b-form-select id="steering-input" name="steering-input"
                              v-model="car.steering"
                              :options="steering"
                              v-validate="{ required: true }"
                              :state="validateState('steering-input')" 
                              aria-describedby="steering-input-live-feedback"
                              data-vv-as="steering"
                         ></b-form-select>
                         <b-form-invalid-feedback id="steering-input-live-feedback">{{ veeErrors.first('steering-input') }}</b-form-invalid-feedback>

                    </b-form-group>
                    <b-form-group class="col-md-3 mb-3" label="Drive">
                         <b-form-select id="drive-input" name="drive-input"
                              v-model="car.drive"
                              :options="drive"
                              v-validate="{ required: true }"
                              :state="validateState('drive-input')" 
                              aria-describedby="drive-input-live-feedback"
                              data-vv-as="drive"
                         ></b-form-select>
                         <b-form-invalid-feedback id="drive-input-live-feedback">{{ veeErrors.first('drive-input') }}</b-form-invalid-feedback>

                    </b-form-group>
                    <b-form-group class="col-md-3 mb-3" label="Transmission">
                         <b-form-select id="transmission-input" name="transmission-input"
                              v-model="car.transmission"
                              :options="transmission"
                              v-validate="{ required: true }"
                              :state="validateState('transmission-input')" 
                              aria-describedby="transmission-input-live-feedback"
                              data-vv-as="transmission"
                         ></b-form-select>
                         <b-form-invalid-feedback id="transmission-input-live-feedback">{{ veeErrors.first('transmission-input') }}</b-form-invalid-feedback>

                    </b-form-group>
               </div>
               <div class="form-row">
                    <b-form-group class="col-md-4 mb-3" label="Engine">
                         <b-form-input id="engine-input" placeholder="N55" name="engine-input"
                              v-model="car.engine"
                              v-validate="{ required: true }"
                              :state="validateState('engine-input')" 
                              aria-describedby="engine-input-live-feedback"
                              data-vv-as="engine">
                         </b-form-input>
                         <b-form-invalid-feedback id="engine-input-live-feedback">{{ veeErrors.first('engine-input') }}</b-form-invalid-feedback>

                    </b-form-group>
                    <b-form-group class="col-md-4 mb-3" label="Engine displacement">
                         <b-form-input id="displacement-input" type="number" step=".1" placeholder="3.0" name="displacement-input"
                              v-model="car.displacement"
                              v-validate="{ required: true, min: 0 }"
                              :state="validateState('displacement-input')" 
                              aria-describedby="displacement-input-live-feedback"
                              data-vv-as="displacement">
                         </b-form-input>
                         <b-form-invalid-feedback id="displacement-input-live-feedback">{{ veeErrors.first('displacement-input') }}</b-form-invalid-feedback>

                    </b-form-group>
                    <b-form-group class="col-md-4 mb-3" label="Power">
                         <b-form-input id="power-input" placeholder="180kw /245hp" name="power-input"
                              v-model="car.power"
                              v-validate="{ required: true }"
                              :state="validateState('power-input')" 
                              aria-describedby="power-input-live-feedback"
                              data-vv-as="power">
                         </b-form-input>
                         <b-form-invalid-feedback id="power-input-live-feedback">{{ veeErrors.first('power-input') }}</b-form-invalid-feedback>

                    </b-form-group>
               </div>
               <div class="form-row">
                    <b-form-group class="col-md-6 mb-3" label="Color">
                         <b-form-input id="color-input" placeholder="ALPINWEISS 3 (300)" name="color-input"
                              v-model="car.color"
                              v-validate="{ required: true }"
                              :state="validateState('color-input')" 
                              aria-describedby="color-input-live-feedback"
                              data-vv-as="color">
                         </b-form-input>
                         <b-form-invalid-feedback id="color-input-live-feedback">{{ veeErrors.first('color-input') }}</b-form-invalid-feedback>

                    </b-form-group>
                    <b-form-group class="col-md-6 mb-3" id="input-group-1" label="Interior">
                         <b-form-input id="interior-input" placeholder="Leather/nappa/semi-aniline..." name="interior-input"
                              v-model="car.interior"
                              v-validate="{ required: true }"
                              :state="validateState('interior-input')" 
                              aria-describedby="interior-input-live-feedback"
                              data-vv-as="interior">
                         </b-form-input>
                         <b-form-invalid-feedback id="interior-input-live-feedback">{{ veeErrors.first('interior-input') }}</b-form-invalid-feedback>
                    </b-form-group>
               </div>   
              <!-- <div class="row mb-5">
                    <div class="card ml-3 mr-3" style="width:70rem; height:23rem;">
                         <div class="row ml-4 mr-4 pt-4 justify-content-between" 
                              v-for="image in car.base64images" v-bind:key="image">              
                              <div class="card col-md-2 pt-3">
                                   <img class="card-img-top mb-3"
                                        :src="image">
                              </div>
                         </div>                       
                    </div>
               </div> -->     
               <div class="pt-3">
                    <b-button type="submit" @click.prevent="onSubmit()" variant="primary">Submit</b-button>
               </div>  
          </b-form>
     </div>
</template>
<script>
import axios from 'axios';
     export default {
          
          data() {
               return {
                    car: {          
                         _id: '',
                         make:'',
                         model:'',
                         vin:'',
                         manufactureDate:'',
                         series:'',
                         bodyType: null,
                         steering: null,
                         engine:'',
                         displacement:'',
                         power:'',
                         drive: null,
                         transmission: null,
                         color:'',
                         interior:'',
                         created_at:'',
                         mainImgUrl:'',
                         equipment: [],
                         base64images: [],
                    },
                    transmission: [{ text: 'Select One', value: null }, 'Automatic', 'Manual'],
                    drive: [{ text: 'Select One', value: null }, 'Front wheel drive', 'Rear wheel drive', 'All wheel drive (4x4)'],
                    steering: [{ text: 'Select One', value: null }, 'Left hand drive', 'Right hand drive'],
                    body: [
                         { text: 'Select One', value: null }, 
                         'Saloon / sedan', 'Hatchback',
                         'Coupe', 'Wagon', 'Limousine',
                         'SUV', 'Minivan', 'Pick-up',
                    ],
                    allMakes: []
               }
          },
          created(){
               this.getAllMakes();
          },
          methods: {
               validateState(ref) {
                    if (this.veeFields[ref] && (this.veeFields[ref].dirty || this.veeFields[ref].validated))
                         return !this.veeErrors.has(ref);
                    return null;
               },
               onSubmit() {
                    this.$validator.validateAll().then(result => {
                         if (!result)
                              return;
                         this.updateAll();
                    })
               },
               getAllMakes(){
                    let vm =this;
                    axios.get("https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json")
                    .then(function (response){
                         if(response.status == 200)
                              vm.allMakes = response.data;
                         vm.allMakes = vm.allMakes.Results.slice(0, 50);
                         vm.$delete(vm.allMakes, 'Make_ID');
                         console.log(vm.allMakes);
                    })
                    .catch(function (error){
                         console.log(error);
                    })
               }
          }
     }
</script>
