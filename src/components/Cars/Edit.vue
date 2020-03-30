<template>
<div>
     <div class="container" v-if="!loading">
          <center class="pt-4"><h1>{{make}} {{model}}</h1></center>

          <b-form class="pt-4" v-if="!loading">
               <div class="form-row">
                    <b-form-group class="col-md-4 mb-3" label="Make">
                         <b-form-input id="make-input" name="make-input" placeholder="BMW"
                              v-model="car.make"     
                              v-validate="{ required: true }"
                              :state="validateState('make-input')" 
                              aria-describedby="make-input-live-feedback"
                              data-vv-as="make">
                         </b-form-input>
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
                         <b-form-input id="body-input" placeholder="Limusine" name="body-input"
                              v-model="car.bodyType"
                              v-validate="{ required: true }"
                              :state="validateState('body-input')" 
                              aria-describedby="body-input-live-feedback"
                              data-vv-as="body">
                         </b-form-input>
                         <b-form-invalid-feedback id="body-input-live-feedback">{{ veeErrors.first('body-input') }}</b-form-invalid-feedback>

                    </b-form-group>
                    <b-form-group class="col-md-3 mb-3" label="Steering">
                         <b-form-input id="steering-input" placeholder="Left hand drive" name="steering-input"
                              v-model="car.steering"                 
                              v-validate="{ required: true }"
                              :state="validateState('steering-input')" 
                              aria-describedby="steering-input-live-feedback"
                              data-vv-as="steering">
                         </b-form-input>
                         <b-form-invalid-feedback id="steering-input-live-feedback">{{ veeErrors.first('steering-input') }}</b-form-invalid-feedback>

                    </b-form-group>
                    <b-form-group class="col-md-3 mb-3" label="Drive">
                         <b-form-input id="drive-input" placeholder="Rear wheel drive" name="drive-input"
                              v-model="car.drive"
                              v-validate="{ required: true }"
                              :state="validateState('drive-input')" 
                              aria-describedby="drive-input-live-feedback"
                              data-vv-as="drive">
                         </b-form-input>
                         <b-form-invalid-feedback id="drive-input-live-feedback">{{ veeErrors.first('drive-input') }}</b-form-invalid-feedback>

                    </b-form-group>
                    <b-form-group class="col-md-3 mb-3" label="Transmission">
                         <b-form-input id="transmission-input" placeholder="Automatic" name="transmission-input"
                              v-model="car.transmission"
                              v-validate="{ required: true }"
                              :state="validateState('transmission-input')" 
                              aria-describedby="transmission-input-live-feedback"
                              data-vv-as="transmission">
                         </b-form-input>
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
               <div class="row mb-5">
                    <div class="card ml-3 mr-3" style="width:70rem; height:23rem;">
                         <div class="row ml-4 mr-4 pt-4 justify-content-between" 
                              v-for="image in car.base64images" v-bind:key="image">              
                              <div class="card col-md-2 pt-3">
                                   <img class="card-img-top mb-3"
                                        :src="image">
                              </div>
                         </div>                       
                    </div>
               </div>      
                          
          </b-form>
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
                    <b-table :items="car.equipment" responsive :fields="fields">                      
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
               <b-button
                    block variant="secondary"
                    :class="repairsVisible ? null : 'collapsed'"
                    :aria-expanded="repairsVisible ? 'true' : 'false'"
                    aria-controls="repair-collapse"
                    @click="repairsVisible = !repairsVisible">
                    Repairs
               </b-button>  
               <b-collapse id="repair-collapse" v-model="repairsVisible" class="mt-2" >
                    <b-table :items="repairs" responsive :fields="repairFields">                      
                         <template v-slot:cell(action)="row">
                              <b-button size="sm" @click="deleteRepairRow(row.index)" class="mr-2">
                                   Delete
                              </b-button>
                         </template>                             
                    </b-table>       

                    <b-form>
                         <div class="form-row">
                              <b-form-group class="col-md-3 mb-3 mr-5">
                                   <b-form-input id="repair-name-input" placeholder="name" name="repair-name-input"
                                        v-model="repairName"
                                        v-validate="{ required: true }"
                                        :state="validateState('repair-name-input')" 
                                        aria-describedby="repair-name-input-live-feedback"
                                        data-vv-as="repair-name">
                                   </b-form-input>
                                   <b-form-invalid-feedback id="repair-name-input-live-feedback">{{ veeErrors.first('repair-name-input') }}</b-form-invalid-feedback>
                              </b-form-group>
                              <b-form-group class="col-md-2 mb-3 ml-5 mr-5">
                                   <b-form-input id="price-input" placeholder="price" name="price-input" type="number" step=".01"
                                        v-model="repairPrice"
                                        v-validate="{ required: true, min_value:1 }"
                                        :state="validateState('price-input')" 
                                        aria-describedby="price-input-live-feedback"
                                        data-vv-as="price">
                                   </b-form-input>
                                   <b-form-invalid-feedback id="price-input-live-feedback">{{ veeErrors.first('price-input') }}</b-form-invalid-feedback>
                              </b-form-group>
                              <div class="col-sm-2 mb-3 well">
                                   <b-button class="mr-5" style="float:right;" size="sm" @click="addRepairRow()">
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
               fields: ['code', 'name', 'action'],
               repairFields: ['name', 'price', 'action'],
               images: [],
               length: 0,
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
                    base64images: [],
               },
               summary: {
                    boughtPrice:'',
                    soldPrice:'',
                    totalShipping: '',
                    sold: '',
               },
               repairs: [],

               equipmentName: '',
               equipmentCode: '',
               repairPrice: null,
               repairName: '',
               make: '',
               model: '',                   
               loading: true,
               equipmentVisible: false,
               repairsVisible: false,
               shippingVisible: false

          }
     }, 
     created() {      
          this.fetchCar();
          this.fetchCarRepairs();
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
                         vm.fetchImages();                       
                         //trimming unnecessary dat ending           
                         vm.car.manufactureDate = vm.car.manufactureDate.substring(0, 10);
                         vm.loading = false;
                         vm.make = vm.car.make;
                         vm.model = vm.car.model;
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
               })
               .catch(function (error) {
                    console.log(error);
               });               
          },
          updateCar() {
               let vm = this;
               axios.put(backEndUrl + `/api/cars/${this.$route.params.id}`, this.car, {
                    headers: {
                         Authorization: 'Bearer ' + window.$cookies.get('token')
                    }
               })
               .then(function (response) {
                    if(response.status == 204)
                         vm.$router.push(`/cars/${vm.$route.params.id}`);
               })
               .catch(function (error) {
                    console.log(error);
               });     
          },
          validateState(ref) {
               if (this.veeFields[ref] && (this.veeFields[ref].dirty || this.veeFields[ref].validated))
                    return !this.veeErrors.has(ref);
               return null;
          },
          async onSubmit() {
               /*this.$validator.validateAll().then(result => {
                    if (!result)
                         return;*/

               const results = Promise.all([
                    this.$validator.validate('make-input'),this.$validator.validate('model-input'),
                    this.$validator.validate('series-input'),this.$validator.validate('date-input'),
                    this.$validator.validate('body-input'),this.$validator.validate('steering-input'),
                    this.$validator.validate('drive-input'),this.$validator.validate('transmission-input'),
                    this.$validator.validate('engine-input'),this.$validator.validate('displacement-input'),
                    this.$validator.validate('power-input'),this.$validator.validate('color-input'),
                    this.$validator.validate('interior-input')
               ]);

               const areValid = (await results).every(isValid => isValid);  
               console.log(areValid);

               if(areValid)
                    this.updateAll();
               
          },
          deleteEquipmentRow (ind) {
               this.car.equipment.splice(ind, 1);
               console.log(this.car.equipment);
          },
          deleteRepairRow(ind){
               this.repairs.splice(ind, 1);
               console.log(this.repairs);
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
          async addRepairRow(){
               const results = Promise.all([
                    this.$validator.validate('price-input'),
                    this.$validator.validate('repair-name-input')
               ]);

               const areValid = (await results).every(isValid => isValid);    

               if(areValid)
               {
                    let repName = this.repairName;
                    let repPrice = this.repairPrice;
                    this.repairs.push({
                         name: repName,
                         price: repPrice
                    });
                    this.repairName = '';
                    this.repairPrice = null;
                    console.log(this.repairs);
               }
          },
          fetchImages() {
               var vm = this;
               axios.post(backEndUrl + "/api/get-images", vm.car.images, {
                    headers: {
                         Authorization: 'Bearer ' + window.$cookies.get('token')
                    }
               })
               .then(function (response) {
                    if(response.status == 200)
                    {
                         vm.car.base64images = response.data;
                         vm.length = parseInt(vm.car.base64images.length/4, 10);
                    }
                         
               })
               .catch(function (error) {
                    console.log(error);
               });
          },

          deleteAllCarRepairs(){
               let vm = this;
               axios.delete(backEndUrl + `/api/cars/${vm.$route.params.id}/delete-repairs`, {
                    headers: {
                         Authorization: 'Bearer ' + window.$cookies.get('token')
                    }
               })
               .then(function (response) {
                    if(response.status == 200)
                         vm.insertMultipleRepairs();
               })
               .catch(function (error) {
                    console.log(error);
               })
          },
          insertMultipleRepairs(){
               let vm = this;
               axios.post(backEndUrl + `/api/cars/${vm.$route.params.id}/repairs`, vm.repairs, {
                    headers: {
                         Authorization: 'Bearer ' + window.$cookies.get('token')
                    }
               })
               .catch(function (error) {
                    console.log(error);
               })
          },
          updateAll(){
               this.updateCar();
               this.deleteAllCarRepairs();
               console.log(this.car);
               console.log(this.repairs);
          }
     }
}
</script>
