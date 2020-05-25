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
                         <b-dropdown id="actions-dropdown" text="Actions" variant="info">          
                              <b-dropdown-item v-b-modal.make-modal
                                   @click="openModal(row)">Update
                              </b-dropdown-item>
                              <b-dropdown-item
                                   @click="deleteMake(row)">Delete
                              </b-dropdown-item>
                         </b-dropdown>
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
               <b-form ref="form" @submit.stop.prevent="onSubmit()">            
                    <b-form-group label="Make">
                         <b-form-input id="make-input" name="make-input"
                              v-model="form.name" placeholder="Audi"
                              v-validate="{ required: true}"
                              :state="validateState('make-input')" 
                              aria-describedby="make-input-live-feedback"
                              data-vv-as="Make">
                         </b-form-input>
                         <b-form-invalid-feedback id="make-input-live-feedback">
                              {{ veeErrors.first('make-input') }}
                         </b-form-invalid-feedback>
                    </b-form-group>            
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
               fields: [    
                    { key: '_id', sortable: true, label: '#' },
                    { key: 'name', sortable: true },
                    'actions',
               ],
               form:{
                    name: '',
                    id: null
               },
               list:[],
               alertMessage: '',
               alertFlag: false,
               dangerAlert: false,
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
          validateState(ref) {
               if (this.veeFields[ref] && (this.veeFields[ref].dirty || this.veeFields[ref].validated))
                    return !this.veeErrors.has(ref);
               return null;
          },
          resetModal(){
               this.form.name = '';
               this.form.id = null;
          },
          openModal(row){
               this.resetModal();
               if(row != null)
               {
                    let index = row.index + this.perPage * this.currentPage - 10;
                    this.form.name = this.makes[index].name;
                    this.form.id = this.makes[index]._id;
               }
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
               })
          },
          onSubmit(){
               this.$validator.validateAll().then(result => {
                    if (!result)
                         return;
               if(this.form.id == null)
               {
                    var nameFirstUpper = this.form.name.charAt(0).toUpperCase() + this.form.name.slice(1).toLowerCase();
                    this.form.name = nameFirstUpper;
                    
                    var alreadyContains = this.list.includes(this.form.name);              
                    if(alreadyContains)
                         window.confirm('Such a make already exists');
                    else
                         this.insertMake();
               }                
               else
                    this.updateMake();
               });
          }
     }
}
</script>