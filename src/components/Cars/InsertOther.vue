<template>
     <div class="container" >
          <div v-if="!loading">
               <b-form class="pt-4">
                    <div class="form-row">
                         <b-form-group class="col-md-4 mb-3" label="Make">
                              <b-form-select id="make-input" name="make-input" @change="getAllModelsForMake(car.make)"
                                   v-model="car.make"
                                   :options="allMakes"
                                   v-validate="{ required: true }"
                                   :state="validateState('make-input')" 
                                   aria-describedby="make-input-live-feedback"
                                   data-vv-as="make">
                              </b-form-select>
                              <b-form-invalid-feedback id="make-input-live-feedback">{{ veeErrors.first('make-input') }}</b-form-invalid-feedback>
                         </b-form-group>

                         <b-form-group class="col-md-4 mb-3" label="Model">
                              <b-form-select id="model-input" name="model-input"
                                   v-model="car.model"
                                   :options="makeModels"
                                   v-validate="{ required: true }"
                                   :state="validateState('model-input')" 
                                   aria-describedby="model-input-live-feedback"
                                   data-vv-as="model">
                              </b-form-select>
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
                              <b-form-input id="vin-input" name="vin-input" placeholder="ABCD1234EFG56789"
                                   v-model="car.vin"
                                   v-validate="{ required: true }"
                                   :state="validateState('vin-input')" 
                                   aria-describedby="vin-input-live-feedback"
                                   data-vv-as="vin">
                              </b-form-input>
                              <b-form-invalid-feedback id="vin-input-live-feedback">{{ veeErrors.first('vin-input') }}</b-form-invalid-feedback>
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
                              <b-form-input id="displacement-input" step=".1" placeholder="3.0" name="displacement-input"
                                   v-model="car.displacement"
                                   v-validate="{ required: true, decimal:1 }"
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
                    <div class="form-row">
                         <b-form-group class="col-md-6 mb-3" label="Bought price (€)">
                              <b-form-input id="price-input" placeholder="5000" step=".1" name="price-input"
                                   v-model="summary.boughtPrice"
                                   v-validate="{ required: true, decimal:1 }"
                                   :state="validateState('price-input')" 
                                   aria-describedby="price-input-live-feedback"
                                   data-vv-as="price">
                              </b-form-input>
                              <b-form-invalid-feedback id="price-input-live-feedback">{{ veeErrors.first('price-input') }}</b-form-invalid-feedback>

                         </b-form-group>
                         <b-form-group class="col-md-6 mb-3" id="images-group-1" label="Images">
                               <b-form-file name="images-input"
                                   v-model="car.base64images"
                                   v-validate="{ image:'' }"
                                   :state="validateState('images-input')" 
                                   aria-describedby="images-input-live-feedback"
                                   data-vv-as="images"
                              ></b-form-file>
                              <b-form-invalid-feedback id="images-input-live-feedback">{{ veeErrors.first('images-input') }}</b-form-invalid-feedback>
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
                         <b-button
                              block variant="secondary"
                              :class="equipmentVisible ? null : 'collapsed'"
                              :aria-expanded="equipmentVisible ? 'true' : 'false'"
                              aria-controls="equipment-collapse"
                              @click="equipmentVisible = !equipmentVisible">
                              Equipment
                         </b-button> 
                         <b-collapse id="equipment-collapse" v-model="equipmentVisible" class="mt-2" >
                              <b-table :items="car.equipment" responsive>                      
                                   <template v-slot:cell(action)="row">
                                        <b-button size="sm" @click="deleteEquipmentRow(row.index)" class="mr-2">
                                             Delete
                                        </b-button>
                                   </template>                             
                              </b-table>       

                              <b-form>
                                   <div class="form-row">
                                        <b-form-group class="col-md-1 mb-3">
                                             <b-form-input id="code-input" placeholder="S717" name="code-input"
                                                  v-model="equipmentCode"
                                                  v-validate="{ required: true }"
                                                  :state="validateState('code-input')" 
                                                  aria-describedby="code-input-live-feedback"
                                                  data-vv-as="code">
                                             </b-form-input>
                                             <b-form-invalid-feedback id="code-input-live-feedback">{{ veeErrors.first('code-input') }}</b-form-invalid-feedback>
                                        </b-form-group>
                                        <b-form-group class="col-md-8 mb-3 ml-5 mr-1">
                                             <b-form-input id="name-input" placeholder="Heated seats" name="name-input"
                                                  v-model="equipmentName"
                                                  v-validate="{ required: true }"
                                                  :state="validateState('name-input')" 
                                                  aria-describedby="name-input-live-feedback"
                                                  data-vv-as="name">
                                             </b-form-input>
                                             <b-form-invalid-feedback id="name-input-live-feedback">{{ veeErrors.first('name-input') }}</b-form-invalid-feedback>
                                        </b-form-group>
                                        <div class="col-md-2 mb-3 ml-4">
                                             <b-button class="ml-2" size="sm" @click="addRow()">
                                                  Add
                                             </b-button> 
                                        </div>                           
                                   </div>                                  
                              </b-form>
                         </b-collapse>
                    </div>  
                    <div class="pt-3">
                         <b-button type="submit" @click.prevent="onSubmit()" variant="primary">Submit</b-button>
                    </div>  
               </b-form>
          </div>
          <div class="pt-3" v-else>        
               <center>
                    <b-spinner label="Loading..."></b-spinner>
               </center> 
          </div>     


     </div>
</template>
<script>
import axios from 'axios';
const backEndUrl = process.env.VUE_APP_API;
     export default {
          
          data() {
               return {
                    car: {
                         make: 'BMW',
                         model: null,
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
                         equipment: [],
                         images: [],
                         base64images: [],
                    },
                    summary: {
                         boughtPrice: '',
                         car: ''
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
                    allMakes: [],
                    makeModels: [],
                    loading: true,
                    equipmentCode: '',
                    equipmentName: '',
                    equipmentVisible: false
               }
          },
          mounted(){
               this.getAllMakes();
          },
          methods: {
               validateState(ref) {
                    if (this.veeFields[ref] && (this.veeFields[ref].dirty || this.veeFields[ref].validated))
                         return !this.veeErrors.has(ref);
                    return null;
               },
               async onSubmit() {
                    const results = Promise.all([
                         this.$validator.validate('make-input'),this.$validator.validate('model-input'),
                         this.$validator.validate('series-input'),this.$validator.validate('date-input'),
                         this.$validator.validate('body-input'),this.$validator.validate('steering-input'),
                         this.$validator.validate('drive-input'),this.$validator.validate('transmission-input'),
                         this.$validator.validate('engine-input'),this.$validator.validate('displacement-input'),
                         this.$validator.validate('power-input'),this.$validator.validate('color-input'),
                         this.$validator.validate('interior-input'),this.$validator.validate('price-input')
                    ]);

                    const areValid = (await results).every(isValid => isValid);  
                    console.log(areValid);
                    if(!areValid)
                         return;

                    this.insertCar();
               
               },
               insertCar() {
                    let vm = this;
                    axios.post(backEndUrl + "/api/cars", vm.car, {
                         headers: {
                              Authorization: 'Bearer ' + window.$cookies.get('token')
                         }
                    })
                    .then(function (response) {             
                         if(response.status == 200)
                         {
                              console.log(response);
                              vm.alertFlag = false;
                              let insertedId = response.data._id;
                              vm.insertCarSummary(insertedId);                        
                         }  
                         console.log(response);            
                    })
                    .catch(function (error) {
                         console.log(error);
                    });
               },
               insertCarSummary(carId) {
                    let vm = this;
                    console.log(this.summary);
                    axios.post(backEndUrl + `/api/cars/${carId}/summary`, vm.summary, {
                         headers: {
                              Authorization: 'Bearer ' + window.$cookies.get('token')
                         }
                    })
                    .then(function (response) {
                         if(response.status == 200)
                         {
                              vm.$router.push("/cars");
                              //window.location.href = "/cars";
                              // Hide the modal manually
                              vm.$nextTick(() => {
                                   vm.$bvModal.hide('car-insert-modal')
                              })
                         }                        
                    })
                    .catch(function (error) {
                         console.log(error);
                    });       
               },
               getAllMakes(){
                    let vm =this;
                    axios.get(backEndUrl + '/api/makes', {
                         headers: {
                              Authorization: 'Bearer ' + window.$cookies.get('token')
                         }
                    })
                    .then(function (response){
                         if(response.status == 200)
                         {
                              vm.allMakes = response.data;
                              vm.getAllModelsForMake(vm.car.make);
                         }         
                    })
                    .catch(function (error){
                         vm.loading = false;
                         console.log(error);
                    })
               },
               getAllModelsForMake(make){
                    let vm =this;
                    axios.get(backEndUrl + `/api/makes/${make}/models`, {
                         headers: {
                              Authorization: 'Bearer ' + window.$cookies.get('token')
                         }
                    })
                    .then(function (response){
                         if(response.status == 200)
                         {
                              let models = response.data;
                              models.push({ text: 'Select One', value: null });
                              vm.makeModels = models;
                              console.log(vm.makeModels);
                              vm.loading = false;
                         }    
                              
                    })
                    .catch(function (error){
                         console.log(error);
                         vm.loading = false;
                    })
               },
               deleteEquipmentRow (ind) {
                    this.car.equipment.splice(ind, 1);
                    console.log(this.car.equipment);
               },
               async addRow() {
                    const results = Promise.all([
                         this.$validator.validate('code-input'),
                         this.$validator.validate('name-input')
                    ]);

                    const areValid = (await results).every(isValid => isValid);  

                    if(areValid)
                    {
                         let eqname = this.equipmentName;
                         let eqcode = this.equipmentCode.toUpperCase();
                         this.car.equipment.push({
                              code: eqcode,
                              name: eqname
                         });
                         this.equipmentName = '';
                         this.equipmentCode = '';
                         console.log(this.car.equipment);
                    }
               },
          }
     }
</script>
