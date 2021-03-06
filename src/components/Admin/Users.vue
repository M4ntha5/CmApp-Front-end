<template>
     <div class="pt-5">
          <b-container fluid>
               <b-alert v-model="alertFlag" style="text-align:center;" :variant="dangerAlert ? 'danger' : 'success'" dismissible>{{alertMessage}}</b-alert>
               <h1 style="text-align:center;" class="mb-5">All currently registerd users</h1>
               
               <b-table id="users-table" responsive striped hover 
                    :busy="isBusy"
                    :items="users" 
                    :fields="fields"
                    :per-page="perPage"
                    :current-page="currentPage">
                    <template v-slot:cell(actions)="row">
                         <b-dropdown id="actions-dropdown" text="Actions" variant="info">
                              <b-dropdown-item @click="goToUserEdit(users[row.index+perPage*currentPage-perPage]._id)">Edit user details</b-dropdown-item>
                              <b-dropdown-item 
                                   v-if="users[row.index+perPage*currentPage-perPage].blocked"
                                   @click="unblockUser(users[row.index+perPage*currentPage-perPage]._id)">Unblock
                              </b-dropdown-item>
                              <b-dropdown-item v-else
                                   @click="blockUser(users[row.index+perPage*currentPage-perPage]._id)">Block
                              </b-dropdown-item>
                              <b-dropdown-item 
                                   v-b-modal.change-role-modal
                                   @click="showModal(users[row.index+perPage*currentPage-perPage])">
                                   Change role
                              </b-dropdown-item>


                              <b-dropdown-item @click="deleteUser(users[row.index+perPage*currentPage-perPage]._id)">Delete user</b-dropdown-item>
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
                    aria-controls="users-table"
               ></b-pagination>
          </b-container>      

          <b-modal id="change-role-modal" ref="modal" title="Change role"
          @ok.prevent="onSubmit()"
          @close="resetModal"
          :ok-disabled="buttonClicked">
               <b-form ref="form" @submit.stop.prevent="onSubmit()">            
                    <b-form-group>
                         <b-form-select name="role-input"
                              v-model="form.role"
                              :options="roles"
                              v-validate="{ required: false }"
                              :state="validateState('role-input')" 
                              aria-describedby="role-input-live-feedback"
                              data-vv-as="user role">
                         </b-form-select>
                         <b-form-invalid-feedback id="role-input-live-feedback">{{ veeErrors.first('role-input') }}</b-form-invalid-feedback>
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
               form: {
                    role: '',
                    id: ''
               },              
               users:[],
               fields: [    
                    { key: '_id', label: 'ID' },
                    { key: 'email', sortable: true },
                    { key: 'currency', sortable: true },
                    { key: 'role', sortable: true },
                    { key: 'blocked', sortable: true },      
                    'actions',
               ],
               roles: ['user','admin'],
               alertMessage: '',
               alertFlag: false,
               dangerAlert: false,
               rows: 0,
               currentPage: 1,
               perPage: 10,
               isBusy: true,
               showRoleModal:'',
               buttonClicked:false
          }
     },
     created() {
         this.getAllUsers();
     },
     methods: {
          getAllUsers(){
               let vm = this;
               axios.get(backEndUrl + '/api/users',{
                    headers: { Authorization: 'Bearer ' + window.$cookies.get('token')}
               })
               .then(function (response) {
                    if(response.status == 200)
                    {
                         vm.users = response.data;
                         vm.rows = vm.users.length;
                         vm.isBusy = false;
                    }                  
               })
               .catch(function (error){
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
          goToUserEdit(index){
               this.$router.push(`/users/${index}/edit`);
          },
          blockUser(userId){
               let vm = this;
               axios.get(backEndUrl + `/api/users/block/${userId}`,{
                    headers: { Authorization: 'Bearer ' + window.$cookies.get('token')}
               })
               .then(function (response) {
                    if(response.status == 200)
                    {
                         vm.getAllUsers();
                         vm.alertMessage = response.data;
                         vm.dangerAlert = false;
                         vm.alertFlag = true;
                    }
               })
               .catch(function (error) {
                    console.log(error);
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
          unblockUser(userId){
               let vm = this;
               axios.get(backEndUrl + `/api/users/unblock/${userId}`,{
                    headers: { Authorization: 'Bearer ' + window.$cookies.get('token')}
               })
               .then(function (response) {
                    if(response.status == 200)
                    {
                         vm.getAllUsers();
                         vm.alertMessage = response.data;
                         vm.dangerAlert = false;
                         vm.alertFlag = true;
                    }
               })
               .catch(function (error) {
                    console.log(error);
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
          deleteUser(userId){
               let vm = this;
               axios.get(backEndUrl + `/api/users/delete/${userId}`,{
                    headers: { Authorization: 'Bearer ' + window.$cookies.get('token')}
               })
               .then(function (response) {
                    if(response.status == 200)
                    {
                         vm.getAllUsers();
                         vm.alertMessage = response.data;
                         vm.dangerAlert = false;
                         vm.alertFlag = true;
                    }
               })
               .catch(function (error) {
                    console.log(error);
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
          changeRole(){
               let vm = this;
               axios.put(backEndUrl + `/api/users/${vm.form.id}/role`, this.form, {
                    headers: { Authorization: 'Bearer ' + window.$cookies.get('token')}
               })
               .then(function (response) {
                    if(response.status == 200)
                    {
                         vm.getAllUsers();
                         vm.alertMessage = response.data;
                         vm.dangerAlert = false;
                         vm.alertFlag = true;
                         vm.$nextTick(() => {
                              vm.$bvModal.hide('change-role-modal')
                         })
                    }
               })
               .catch(function (error) {
                    console.log(error);
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
          validateState(ref) {
               if (this.veeFields[ref] && (this.veeFields[ref].dirty || this.veeFields[ref].validated))
                    return !this.veeErrors.has(ref);
               return null;
          },
          onSubmit() {
               this.$validator.validateAll().then(result => {
                    if (!result)
                         return;
                    this.buttonClicked = true;
                    this.changeRole();
               })          
          },
          resetModal() {
               this.form.role = '';
               this.form.id = ''
          },
          showModal(user){
               this.form.role = user.role;
               this.form.id = user._id;
               this.showRoleModal = true;       
          }
     }
}
</script>