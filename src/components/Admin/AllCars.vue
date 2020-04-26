<template>
     <div class="pt-5">
          <b-container fluid>
                <b-alert v-model="alertFlag" style="text-align:center;" :variant="dangerAlert ? 'danger' : 'success'" dismissible>{{alertMessage}}</b-alert>
               <h1 style="text-align:center;" class="mb-5">All currently registerd cars</h1>
               
               <b-table id="users-table" responsive striped hover 
                    :busy="isBusy"
                    :items="cars" 
                    :fields="fields"
                    :per-page="perPage"
                    :current-page="currentPage">
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
     </div>
</template>

<script>
import axios from 'axios';
const backEndUrl = process.env.VUE_APP_API;
export default {
     data(){
          return {         
               cars:[],
               fields: [    
                    { key: 'make', sortable: true },
                    { key: 'model', sortable: true },
                    { key: 'vin', sortable: true },
                    { key: 'manufactureDate', sortable: true },  
                    { key: 'dateCreated', sortable: true }
               ],
               alertMessage: '',
               alertFlag: false,
               dangerAlert: false,
               rows: 0,
               currentPage: 1,
               perPage: 10,
               isBusy: true,
               showRoleModal:''
          }
     },
     created() {
         this.getAllUsers();
     },
     methods: {
          getAllUsers(){
               let vm = this;
               axios.get(backEndUrl + '/api/allcars',{
                    headers: { Authorization: 'Bearer ' + window.$cookies.get('token')}
               })
               .then(function (response) {
                    if(response.status == 200)
                    {
                         vm.cars = response.data;
                         vm.rows = vm.cars.length;
                         vm.isBusy = false;
                    }
                    else if(response.status == 401) 
                    {
                         vm.$cookies.remove('token');
                         vm.$cookies.remove('user-email');
                         vm.$cookies.remove('role');
                         vm.$cookies.remove('user');
                         vm.$cookies.remove('currency');
                         window.location.href = '/login';
                    }
               })
               .catch(function (error){
                    console.log(error);
                    console.log(error.response.data);
               })
          },
     }
}
</script>