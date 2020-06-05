<template>
     <div class="pt-5">
          <b-container>
               <b-alert v-model="alertFlag" style="text-align:center;" :variant="dangerAlert ? 'danger' : 'success'" dismissible>{{alertMessage}}</b-alert>
               <h1 class="mb-5" style="text-align:center;" >All makes</h1>  

               <b-button style="float:right;" class="mr-2" v-b-modal.make-modal
                    @click="openModal(null)">Add new
               </b-button>  
           
               <b-table id="makes-table" responsive striped hover class="pt-3" 
                    :busy="isBusy"
                    :items="makes" 
                    :fields="fields"
                    :per-page="perPage"
                    :current-page="currentPage">
                    <template v-slot:cell(actions)="row">
                         <b-button v-b-modal.make-modal class="mr-1" variant="info"
                                   @click="openModal(row)">Update
                         </b-button>
                         <b-button variant="danger"
                              @click="deleteMake(row)">Delete
                         </b-button>
                    </template>
                    <template v-slot:table-busy>
                         <div class="text-center text-primary my-2">
                              <b-spinner class="align-middle"></b-spinner>
                              <strong>Loading...</strong>
                         </div>
                    </template>
               </b-table>
               <b-pagination pills align="center"
                    v-model="currentPage"
                    :total-rows="rows"
                    :per-page="perPage"
                    aria-controls="makes-table"
               ></b-pagination>
          </b-container>

          <b-modal id="make-modal" ref="modal" title="Handle make"
          @ok.prevent="onSubmit()"
          @close="resetModal">
               <b-alert v-model="modalAlertFlag" style="text-align:center;" 
                    :variant="modalDangerAlert ? 'danger' : 'success'" dismissible>
                    {{modalAlertMessage}}
               </b-alert>

               <b-form ref="form" @submit.stop.prevent="onSubmit()">            
                    <b-form-group label="Make">
                         <b-form-input id="make-input" name="make-input"
                              v-model="form.make" placeholder="Audi"
                              v-validate="{ required: true}"
                              :state="validateState('make-input')" 
                              aria-describedby="make-input-live-feedback"
                              data-vv-as="Make">
                         </b-form-input>
                         <b-form-invalid-feedback id="make-input-live-feedback">
                              {{ veeErrors.first('make-input') }}
                         </b-form-invalid-feedback>
                    </b-form-group> 
                    <label class="row ml-1">Models</label>
                    <div class="form-row" v-for="(model, index) in form.models" v-bind:key="index">
                         <b-form-group class="col-sm-10">
                              <b-form-input id="models-input" name="models-input" class="mb-2"
                                   v-model="model.name" placeholder="A4"
                                   v-validate="{ required: true}"
                                   :state="validateState('models-input')" 
                                   aria-describedby="models-input-live-feedback"
                                   data-vv-as="Models">
                              </b-form-input>
                              <b-form-invalid-feedback id="make-input-live-feedback">
                                   {{ veeErrors.first('make-input') }}
                              </b-form-invalid-feedback>
                         </b-form-group> 
                         <div class="col-sm-2">
                              <b-button size="sm" @click="deleteModelRow(index)" class="mr-2 btn-danger">
                                   Delete
                              </b-button>
                         </div>                  
                    </div>
                    <div class="form-row">
                         <b-form-group class="col-sm-10">
                              <b-form-input id="empty-input" name="empty-input" class="mb-2"
                                   v-model="modelRow" placeholder="A4"
                                   v-validate="{ required: false}"
                                   :state="validateState('empty-input')" 
                                   aria-describedby="empty-input-live-feedback"
                                   data-vv-as="Models">
                              </b-form-input>
                              <b-form-invalid-feedback id="empty-input-live-feedback">
                                   {{ veeErrors.first('empty-input') }}
                              </b-form-invalid-feedback>
                         </b-form-group> 
                         <div class="col-sm-2">
                              <b-button size="sm" @click="addModelRow()">
                                   Add
                              </b-button>
                         </div> 
                    </div>                 
               </b-form>
          </b-modal> 
     </div>
     
</template>

<script>
import axios from 'axios';
const backEndUrl = process.env.VUE_APP_API;
export default {
     data(){
          return {         
               makes:[],
               models:[],
               fields: [    
                    { key: '_id', label: '#' },
                    { key: 'make' },
                    'Actions'
               ],
               fields2: [
                    { key: 'name', label: 'models' },
               ],
               form:{
                    make: '',
                    models:[],
                    id: null
               },
               modelRow: '',
               list:[],
               alertMessage: '',
               alertFlag: false,
               dangerAlert: false,
               modalAlertFlag: false,
               modalDangerAlert: false,
               modalAlertMessage:'',
               rows: 0,
               currentPage: 1,
               perPage: 10,
               isBusy: true,
          }
     },
     created() {
         this.getAllMakes();
     },
     methods: {
          deleteModelRow(index){               
               this.form.models.splice(index, 1);
          },
          async addModelRow(){
               const results = Promise.all([
                    this.$validator.validate('empty-input')
               ]);

               const areValid = (await results).every(isValid => isValid);    

               if(areValid)
               {
                    //check if inserted model already exists
                    let alreadyExists = false;
                    this.form.models.forEach(element => {
                         if(element.name.toLowerCase() == this.modelRow.toLowerCase())
                              alreadyExists = true;
                    });
                    if(alreadyExists)
                    {
                         this.$validator.errors.add({
                              field: 'empty-input',
                              msg: 'Such a model already exists'
                         });
                    }              
                    else
                    {
                         this.form.models.push({name:this.modelRow});
                         this.modelRow = '';
                         this.$validator.reset('empty-input');
                    }                 
               }      
          },
          validateState(ref) {
               if (this.veeFields[ref] && (this.veeFields[ref].dirty || this.veeFields[ref].validated))
                    return !this.veeErrors.has(ref);
               return null;
          },
          resetModal(){
               this.form.make = '';
               this.form.id = null;
               this.form.models = [];
          },
          openModal(row){              
               this.resetModal();
               if(row != null)
               {
                    let index = row.index + this.perPage * this.currentPage - 10;
                    this.form.make = this.makes[index].make;
                    this.form.id = this.makes[index]._id;
                    this.form.models = this.makes[index].models;
                    this.form.models.sort((a, b) => (a.name > b.name) ? 1 : -1);
               }
          },
          onSubmit(){
               console.log(this.form);
               this.$validator.validateAll().then(result => {
                    if (!result)
                         return;
                    if(this.form.id == null)
                    {
                         this.form.make = this.form.make.charAt(0).toUpperCase() + 
                              this.form.make.slice(1).toLowerCase();
                         
                         var alreadyContains = this.list.includes(this.form.make);
                         if(alreadyContains)
                              this.$validator.errors.add({
                                   field: 'make-input',
                                   msg: 'Such a make already exists'
                              });
                         else
                              this.insertMake();
                    }                
                    else
                         this.updateMake();
               });
          },
          getAllMakes(){
               let vm = this;
               axios.get(backEndUrl + '/api/makes',{
                    headers: { Authorization: 'Bearer ' + window.$cookies.get('token')}
               })
               .then(function (response) {
                    if(response.status == 200)
                    {
                         vm.makes = response.data;               
                         vm.rows = vm.makes.length;
                         vm.isBusy = false;
                         vm.makes.forEach(element => {
                              vm.list.push(element.name);
                         });
                    }
               })
               .catch(function (error){
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
          insertMake(){
               let vm = this;
               axios.post(backEndUrl + '/api/makes', vm.form, {
                    headers: { Authorization: 'Bearer ' + window.$cookies.get('token')}
               })
               .then(function (response) {
                    if(response.status == 200)
                    {
                         vm.alertMessage = "Added successfully";
                         vm.dangerAlert = false;
                         vm.alertFlag = true;                        
                         vm.getAllMakes();
                         vm.rows = vm.makes.length;
                         vm.isBusy = false;
                         vm.$nextTick(() => {
                              vm.$bvModal.hide('make-modal')
                         });
                    }
               })
               .catch(function (error){
                    vm.modalAlertMessage = error.response.data;
                    vm.modalDangerAlert = true;
                    vm.modalAlertFlag = true; 
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
          updateMake(){
               let vm = this;
               axios.put(backEndUrl + `/api/makes/${vm.form.id}`, vm.form, {
                    headers: { Authorization: 'Bearer ' + window.$cookies.get('token')}
               })
               .then(function (response) {
                    if(response.status == 204)
                    {
                         vm.alertMessage = "Added successfully";                       
                         vm.dangerAlert = false;
                         vm.alertFlag = true;
                         vm.getAllMakes();
                         vm.$nextTick(() => {
                              vm.$bvModal.hide('make-modal')
                         });
                    }
               })
               .catch(function (error){
                    vm.modalAlertMessage = error.response.data;
                    vm.modalDangerAlert = true;
                    vm.modalAlertFlag = true;
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
          deleteMake(row){
               let index = row.index + this.perPage * this.currentPage - 10;
               let makeId = this.makes[index]._id;              
               let vm = this;
               axios.delete(backEndUrl + `/api/makes/${makeId}`, {
                    headers: { Authorization: 'Bearer ' + window.$cookies.get('token')}
               })
               .then(function (response) {
                    if(response.status == 204)
                    {
                         vm.alertMessage = "Deleted successfully";                       
                         vm.dangerAlert = false;
                         vm.alertFlag = true;
                         vm.getAllMakes();
                    }
               })
               .catch(function (error){
                    vm.modalAlertMessage = error.response.data;
                    vm.modalDangerAlert = true;
                    vm.modalAlertFlag = true;
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
          }
     }
}
</script>