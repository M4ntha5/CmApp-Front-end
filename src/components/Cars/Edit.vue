<template>
<div>
     <div class="container pt-4" v-if="!loading">
          <b-alert v-model="alertFlag" :variant="dangerAlert ? 'danger' : 'success'" dismissible>{{alertMessage}}</b-alert>
          
          <div class="row pt-3">
               <div class="col-sm-4">
                    <b-button variant="primary" @click="goToCar()">Back to car</b-button> 
               </div>
               <h1 class="col-sm-8">{{make}} {{model}}</h1>
          </div> 
          <b-form class="pt-4" v-if="!loading">
               <div class="form-row">
                    <b-form-group class="col-sm-4 mb-3" label="Make">
                         <b-form-input disabled name="make-input" placeholder="BMW"
                              v-model="car.make"
                              v-validate="{ required: true }"
                              :state="validateState('make-input')" 
                              aria-describedby="make-input-live-feedback"
                              data-vv-as="Make">
                         </b-form-input>
                         <b-form-invalid-feedback id="make-input-live-feedback">
                              {{ veeErrors.first('make-input') }}
                         </b-form-invalid-feedback>
                    </b-form-group>

                    <b-form-group class="col-sm-4 mb-3" label="Model">
                         <b-form-input name="model-input" placeholder="M5"
                              v-model="car.model"
                              v-validate="{ required: true }"
                              :state="validateState('model-input')" 
                              aria-describedby="model-input-live-feedback"
                              data-vv-as="Model">
                         </b-form-input>
                         <b-form-invalid-feedback id="model-input-live-feedback">{{ veeErrors.first('model-input') }}</b-form-invalid-feedback>
                    </b-form-group>

                    <b-form-group class="col-sm-4 mb-3" label="Series">
                         <b-form-input placeholder="F10" name="series-input"  
                              v-model="car.series"
                              v-validate="{ required: false }"
                              :state="validateState('series-input')" 
                              aria-describedby="series-input-live-feedback"
                              data-vv-as="Series">>
                         </b-form-input>
                         <b-form-invalid-feedback id="series-input-live-feedback">{{ veeErrors.first('series-input') }}</b-form-invalid-feedback>
                    </b-form-group>
               </div>
               <div class="form-row">
                    <b-form-group class="col-sm-6 mb-3" label="VIN">
                         <b-form-input disabled v-model="car.vin">>
                         </b-form-input>
                    </b-form-group>
                    <b-form-group class="col-sm-6 mb-3" label="Manufacture date">
                         <b-form-input type="date" name="date-input"
                              v-model="car.manufactureDate"
                              v-validate="{ required: true }"
                              :state="validateState('date-input')" 
                              aria-describedby="date-input-live-feedback"
                              data-vv-as="Manufacture date">
                         </b-form-input>
                         <b-form-invalid-feedback id="date-input-live-feedback">{{ veeErrors.first('date-input') }}</b-form-invalid-feedback>
                    </b-form-group>
               </div>
               <div class="form-row">
                    <b-form-group class="col-sm-3 mb-3" label="Body type">
                         <b-form-select name="body-input"
                              v-model="car.bodyType"
                              :options="body"
                              v-validate="{ required: false }"
                              :state="validateState('body-input')" 
                              aria-describedby="body-input-live-feedback"
                              data-vv-as="Body type">
                         </b-form-select>
                         <b-form-invalid-feedback id="body-input-live-feedback">{{ veeErrors.first('body-input') }}</b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group class="col-sm-3 mb-3" label="Steering">
                         <b-form-select name="steering-input"
                              v-model="car.steering"
                              :options="steering"
                              v-validate="{ required: false }"
                              :state="validateState('steering-input')" 
                              aria-describedby="steering-input-live-feedback"
                              data-vv-as="Steering">
                         </b-form-select>
                         <b-form-invalid-feedback id="steering-input-live-feedback">{{ veeErrors.first('steering-input') }}</b-form-invalid-feedback>

                    </b-form-group>
                    <b-form-group class="col-sm-3 mb-3" label="Drive">
                         <b-form-select name="drive-input"
                              v-model="car.drive"
                              :options="drive"
                              v-validate="{ required: false }"
                              :state="validateState('drive-input')" 
                              aria-describedby="drive-input-live-feedback"
                              data-vv-as="Drive">
                         </b-form-select>
                         <b-form-invalid-feedback id="drive-input-live-feedback">{{ veeErrors.first('drive-input') }}</b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group class="col-sm-3 mb-3" label="Transmission">
                         <b-form-select name="transmission-input"
                              v-model="car.transmission"
                              :options="transmission"
                              v-validate="{ required: false }"
                              :state="validateState('transmission-input')" 
                              aria-describedby="transmission-input-live-feedback"
                              data-vv-as="Transmission">
                         </b-form-select>
                         <b-form-invalid-feedback id="transmission-input-live-feedback">{{ veeErrors.first('transmission-input') }}</b-form-invalid-feedback>
                    </b-form-group>
               </div>
               <div class="form-row">
                    <b-form-group class="col-sm-4 mb-3" label="Engine name">
                         <b-form-input placeholder="N55" name="engine-input"
                              v-model="car.engine"
                              v-validate="{ required: false }"
                              :state="validateState('engine-input')" 
                              aria-describedby="engine-input-live-feedback"
                              data-vv-as="Engine name">
                         </b-form-input>
                         <b-form-invalid-feedback id="engine-input-live-feedback">{{ veeErrors.first('engine-input') }}</b-form-invalid-feedback>

                    </b-form-group>
                    <b-form-group class="col-sm-4 mb-3" label="Engine displacement">
                         <b-form-input placeholder="3.0" name="displacement-input"
                              v-model="car.displacement"
                              v-validate="{ required: false, decimal:'1',min_value:0.1 }"
                              :state="validateState('displacement-input')" 
                              aria-describedby="displacement-input-live-feedback"
                              data-vv-as="Engine displacement">
                         </b-form-input>
                         <b-form-invalid-feedback id="displacement-input-live-feedback">
                              {{ veeErrors.first('displacement-input') }}
                              </b-form-invalid-feedback>

                    </b-form-group>
                    <b-form-group class="col-sm-4 mb-3" label="Power">
                         <b-form-input placeholder="180kw /245hp" name="power-input"
                              v-model="car.power"
                              v-validate="{ required: false }"
                              :state="validateState('power-input')" 
                              aria-describedby="power-input-live-feedback"
                              data-vv-as="Power">
                         </b-form-input>
                         <b-form-invalid-feedback id="power-input-live-feedback">{{ veeErrors.first('power-input') }}</b-form-invalid-feedback>

                    </b-form-group>
               </div>
               <div class="form-row">
                    <b-form-group class="col-sm-6 mb-3" label="Color">
                         <b-form-input placeholder="ALPINWEISS 3 (300)" name="color-input"
                              v-model="car.color"
                              v-validate="{ required: false }"
                              :state="validateState('color-input')" 
                              aria-describedby="color-input-live-feedback"
                              data-vv-as="Color">
                         </b-form-input>
                         <b-form-invalid-feedback id="color-input-live-feedback">{{ veeErrors.first('color-input') }}</b-form-invalid-feedback>

                    </b-form-group>
                    <b-form-group class="col-sm-6 mb-3" id="input-group-1" label="Interior">
                         <b-form-input placeholder="Leather/nappa/semi-aniline..." name="interior-input"
                              v-model="car.interior"
                              v-validate="{ required: false }"
                              :state="validateState('interior-input')" 
                              aria-describedby="interior-input-live-feedback"
                              data-vv-as="Interior">
                         </b-form-input>
                         <b-form-invalid-feedback id="interior-input-live-feedback">{{ veeErrors.first('interior-input') }}</b-form-invalid-feedback>
                    </b-form-group>
               </div>
               <b-form-group label="Your images" class="ml-3">
                    <div id="drop-area" class="row pt-2">
                         <b-form-file class="col-sm-4 mt-4" multiple            
                              @change="onFileSelected" name="images-input" 
                              v-model="example" accept="image/*"
                              v-validate="{ required: false, image: true }"
                              :state="validateState('images-input')" 
                              aria-describedby="images-input-live-feedback"
                              data-vv-as="Images">
                         </b-form-file>
                         <b-form-invalid-feedback id="images-input-live-feedback">
                              {{ veeErrors.first('images-input') }}
                         </b-form-invalid-feedback>
                         <div class="col-sm-4 mt-3" v-for="(image, index) in car.urls" v-bind:key="index">              
                              <img class="card-img-top mb-3 pt-3" responsive-image :src="image.url">
                              <b-button pill variant="danger" 
                                   style="position:absolute;right:0%;top:0%;"
                                   @click.prevent="removeImageFromList(index)">
                                   X
                              </b-button>
                         </div>
                    </div>
               </b-form-group>
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
                    <b-table striped :items="car.equipment" responsive :fields="fields">                      
                         <template v-slot:cell(action)="row">
                              <b-button size="sm" @click="deleteEquipmentRow(row.index)" class="mr-2">
                                   Delete
                              </b-button>
                         </template>                             
                    </b-table>       

                    <b-form>
                         <div class="form-row">
                              <b-form-group class="col-sm-5 mb-3">
                                   <b-form-input placeholder="S717" name="code-input"
                                        v-model="equipmentCode"
                                        v-validate="{ required: true }"
                                        :state="validateState('code-input')" 
                                        aria-describedby="code-input-live-feedback"
                                        data-vv-as="code">
                                   </b-form-input>
                                   <b-form-invalid-feedback id="code-input-live-feedback">{{ veeErrors.first('code-input') }}</b-form-invalid-feedback>
                              </b-form-group>
                              <b-form-group class="col-sm-5 mb-3">
                                   <b-form-input placeholder="Heated seats" name="name-input"
                                        v-model="equipmentName"
                                        v-validate="{ required: true }"
                                        :state="validateState('name-input')" 
                                        aria-describedby="name-input-live-feedback"
                                        data-vv-as="name">
                                   </b-form-input>
                                   <b-form-invalid-feedback id="name-input-live-feedback">{{ veeErrors.first('name-input') }}</b-form-invalid-feedback>
                              </b-form-group>
                              <div class="col-sm-2">
                                   <b-button size="sm" @click="addRow()">
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
                    <b-table striped :items="repairs" responsive :fields="repairFields">
                         <template v-slot:cell(action)="row">
                              <b-button size="sm" @click="deleteRepairRow(row.index)" class="mr-2">
                                   Delete
                              </b-button>
                         </template> 
                    </b-table>       

                    <b-form>
                         <div class="form-row">
                              <b-form-group class="col-sm-5 mb-3">
                                   <b-form-input placeholder="Front hood" name="repair-name-input"
                                        v-model="repairName"
                                        v-validate="{ required: true }"
                                        :state="validateState('repair-name-input')" 
                                        aria-describedby="repair-name-input-live-feedback"
                                        data-vv-as="name">
                                   </b-form-input>
                                   <b-form-invalid-feedback id="repair-name-input-live-feedback">
                                        {{ veeErrors.first('repair-name-input') }}
                                   </b-form-invalid-feedback>
                              </b-form-group>
                              <b-form-group class="col-sm-5 mb-3">
                                   <b-form-input placeholder="160" name="price-input"                                 
                                        v-model="repairPrice" step=".01"
                                        v-validate="{ required: true, decimal: 2, min_value:0.01 }"
                                        :state="validateState('price-input')" 
                                        aria-describedby="price-input-live-feedback"
                                        data-vv-as="price">
                                   </b-form-input>
                                   <b-form-invalid-feedback id="price-input-live-feedback">
                                        {{ veeErrors.first('price-input') }}
                                   </b-form-invalid-feedback>
                              </b-form-group>
                              <div class="col-sm-2 mb-3">
                                   <b-button size="sm" @click="addRepairRow()">
                                        Add
                                   </b-button> 
                              </div>
                         </div>
                    </b-form>
               </b-collapse>
          </div>
          <div class="pt-3">
               <b-button type="submit" :disabled="buttonClicked" @click.prevent="onSubmit()" variant="primary">Save</b-button>
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
               example: null,
               fields: ['code', 'name', 'action'],
               repairFields: ['name', 'price', 'action'],
               deletedUrls: [],
               addedImgs: [],
               leftUrls: [],
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
                    urls:[],
                    base64images: [],
               },
               summary: {
                    boughtPrice:'',
                    soldPrice:'',
                    totalShipping: '',
                    sold: '',
               },
               repairs: [],
               transmission: [{ text: 'Select One', value: '' }, 'Automatic', 'Manual'],
               drive: [{ text: 'Select One', value: '' }, 'Front wheel drive', 'Rear wheel drive', 'All wheel drive'],
               steering: [{ text: 'Select One', value: '' }, 'Left Hand Drive', 'Right Hand Drive'],         
               body: [
                    { text: 'Select One', value: '' }, 
                    'Saloon', 'Hatchback', 'Sedan',
                    'Coupe', 'Wagon', 'Limousine',
                    'Suv', 'Minivan', 'Pick-up',
               ],
               equipmentName: '',
               equipmentCode: '',
               repairPrice: null,
               repairName: '',
               make: '',
               model: '',                   
               loading: true,
               equipmentVisible: false,
               repairsVisible: false,
               shippingVisible: false,
               dangerAlert: false,
               alertMessage: '',
               alertFlag: false,
               equipmentCodes: [],
               buttonClicked: false
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
                    headers: { Authorization: 'Bearer ' + window.$cookies.get('token') }
               })
               .then(function (response) {
                    if(response.status == 200)
                    {
                         vm.car = response.data;
                         vm.leftUrls = response.data.urls;
                         vm.loading = false;

                         //trimming unnecessary dat ending           
                         vm.car.manufactureDate = vm.car.manufactureDate.substring(0, 10);
                         
                         vm.make = vm.car.make;
                         vm.model = vm.car.model;
                         vm.car.equipment.forEach(element => {
                              vm.equipmentCodes.push(element.code);
                         });
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
          updateCar() {
               let vm = this;
               axios.put(backEndUrl + `/api/cars/${this.$route.params.id}`, this.car, {
                    headers: { Authorization: 'Bearer ' + window.$cookies.get('token') }
               })
               .then(function (response){
                    if(response.status == 204 && vm.repairs.length == 0)
                         vm.updateImages(vm.$route.params.id);
               })
               .catch(function (error) {
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
               });     
          },
          updateImages(carId){
               let vm = this;
               let obj = {
                    deleted: this.deletedUrls, 
                    all: this.car.urls
               };
               axios.put(backEndUrl + `/api/cars/${carId}/images`, obj, {
                    headers: { Authorization: 'Bearer ' + window.$cookies.get('token') }
               })
               .then(function () {
                    vm.$router.push(`/cars/${vm.$route.params.id}`);
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
                    this.$validator.validate('interior-input'),this.$validator.validate('images-input'),
               ]);

               const areValid = (await results).every(isValid => isValid);  

               if(areValid)
               {
                    this.buttonClicked = true;
                    this.alertMessage = "Saving your changes...";
                    this.dangerAlert = false;
                    this.alertFlag = true;
                    this.updateAll();
               }  
               else
                    this.$el.querySelector('[name="' + 
                         this.$validator.errors.items[0].field + '"]').scrollIntoView(false);
          },
          deleteEquipmentRow (ind) {
               this.car.equipment.splice(ind, 1);
          },
          deleteRepairRow(ind){
               this.repairs.splice(ind, 1);
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

                    var alreadyContains = this.equipmentCodes.includes(eqcode);
                    if(alreadyContains)
                         this.$validator.errors.add({
                              field: 'code-input',
                              msg: 'Equipment with the same code already exists'
                         });
                    else
                    {     
                         this.car.equipment.push({
                              code: eqcode,
                              name: eqname
                         });
                         this.equipmentCodes.push(eqcode);
                         this.equipmentName = '';
                         this.equipmentCode = '';
                         this.$validator.reset('code-input');
                         this.$validator.reset('name-input');
                    }
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
                    this.$validator.reset('price-input');
                    this.$validator.reset('repair-name-input');
               }
               else
                    this.$el.querySelector('[name="' + 
                         this.$validator.errors.items[0].field + '"]').scrollIntoView(false);
          },
          deleteAllCarRepairs(){
               let vm = this;
               axios.delete(backEndUrl + `/api/cars/${vm.$route.params.id}/repairs`, {
                    headers: { Authorization: 'Bearer ' + window.$cookies.get('token')}
               })
               .then(function (response) {
                    if(response.status == 204)
                         vm.insertMultipleRepairs();
               })
               .catch(function (error) {
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
          insertMultipleRepairs(){
               let vm = this;
               axios.post(backEndUrl + `/api/cars/${vm.$route.params.id}/repairs`, vm.repairs, {
                    headers: { Authorization: 'Bearer ' + window.$cookies.get('token') }
               })
               .then(function (response) {
                    if(response.status == 200)
                         vm.$router.push(`/cars/${vm.$route.params.id}`);
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
               })
          },
          updateAll(){  
               this.updateCar();               
               if(this.repairs.length > 0)             
                    this.deleteAllCarRepairs();                        
          },
          removeImageFromList(index){
               if(this.car.urls[index].url.startsWith('http'))
                    this.deletedUrls.push(this.car.urls[index].url);   
               this.car.urls.splice(index, 1);
          },
          onFileSelected(e) {
               let vm = this;
               for(let i=0; i < e.target.files.length; i++)
               {
                    var reader = new FileReader();
                    reader.readAsDataURL(e.target.files[i]);
                    reader.onload = (e) => {
                         vm.car.urls.push({url: e.target.result});
                    }                 
               }
          },
          goToCar(){
               this.$router.push(`/cars/${this.$route.params.id}`);
          }
     }
}
</script>
<style scoped>
     #drop-area {
          border: 2px dashed #ccc;
          border-radius: 20px;
          max-width: 1100px;
          height: 320px;
          font-family: sans-serif;
          overflow:hidden;
          overflow-y:scroll;
     }
     [class*="col-"] {
          width: 100%;
     }
</style>