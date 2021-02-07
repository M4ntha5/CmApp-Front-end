<template>
    <div>
        <div class="container pt-5" v-if="!loading">
            <b-alert v-model="alertFlag" :variant="dangerAlert ? 'danger' : 'success'" dismissible>{{alertMessage}}</b-alert>
            <div class="row mr-3 ml-1">
                <div class="col">
                    <button v-b-modal.car-insert-modal class="btn btn-primary"
                    @click="$router.push('/other-insert')">
                        Add new car
                    </button>
                </div>
                <b-form-group label-cols-sm="auto" label="Sort:" class="ml-3">
                    <b-form-select v-model="selected" :options="options" @change="sortCars()"></b-form-select>
                </b-form-group>
            </div>         
            
            <div class="pt-3">
                <b-card-group deck>
                    <b-col sm="4" v-for="(car, index) in cars" v-bind:key="car.id" class="mb-4 d-flex align-items-stretch">                              
                        <b-card no-body>
                            <b-link :to="'/cars/' + car.id">
                                <b-card-img img-alt="image img-fluid" img-top :src='car.defaultImage'
                                style="max-height:238.5px"></b-card-img>
                                <b-card-body class="pl-3">            
                                    <b-card-title>{{car.make}} {{car.model}}</b-card-title>
                                </b-card-body>
                            </b-link>
                            <b-card-text class="pl-3" style="flex-grow:1;">                                          
                                <h4>Already paid: {{car.total}} {{currency}}</h4>
                                <template v-if="car.sold">
                                    <h2 style="color:red;font-weight:bold;">SOLD</h2>
                                    <h2 v-if="car.profit < 0" style="color:red;">
                                        Profit: {{car.profit}} {{currency}}
                                    </h2>
                                    <h2 v-else style="color:green;">
                                        Profit: {{car.profit}} {{currency}}
                                    </h2>
                                </template>
                            </b-card-text>         
                            <template v-slot:footer>
                                <b-button v-b-modal.sold-modal block
                                    @click="openSoldModal(car.id, index)" 
                                    type="button" class="btn btn-warning"
                                    v-if="!car.sold">
                                    Sold?
                                </b-button>
                                <small v-else>{{car.soldWithin}}</small>
                            </template>
                        </b-card>                                               
                    </b-col>
                </b-card-group>          
            </div>          
        </div>
        <div class="pt-3" v-else>        
            <center>
                <b-spinner label="Loading..."></b-spinner>
            </center> 
        </div>
        <car-sold-dialog :show="showSoldModal" v-if="showSoldModal"/>
    </div>
</template>
<script>
import CarSoldDialog from '@/components/Cars/sold-dialog'
import getSymbolFromCurrency from 'currency-symbol-map'
import axios from 'axios';
const backEndUrl = process.env.VUE_APP_API;
export default {  
    components:{
        CarSoldDialog
    },
    data() {
        return {
            alertMessage:'',
            alertFlag: false,
            dangerAlert: false,
            currency: getSymbolFromCurrency(window.$cookies.get('currency')),
            cars: [],
            displayCars:[],

            showSoldModal: false,

            loading: true,

            rows: 0,
            selected: 1,
            options:[
                {value: 1, text: 'Show all cars' },
                {value: 2, text: 'Show only sold cars' },
                {value: 3, text: 'Show only unsold cars' },                 
            ],
            buttonClicked: false            
        }           
    },
    created() {
        this.fetchCars();
    },
    computed:{
        carsList: function(){
            return this.displayCars;
        }
    },
    methods: {
        openSoldModal(){
            this.showSoldModal = true;
        },
        sortCars(){          
            if(this.selected == 2)
            {
                let array = [];
                this.cars.forEach(element => {
                        if(element.summary.sold)
                            array.push(element);
                });
                this.displayCars = array;
            }
            else if(this.selected == 3)
            {
                let array = [];
                this.cars.forEach(element => {
                        if(!element.summary.sold)
                            array.push(element);
                });
                this.displayCars = array;
            }
            else if(this.selected == 1)
                this.displayCars = this.cars;              
        },
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
                headers: { Authorization: 'Bearer ' + window.$cookies.get('token') }
            })
            .then(function (response) {
                if(response.status == 200)
                {
                    vm.cars = response.data;
                    vm.loading = false;
                }                             
            })
            .catch(function (error) {
                vm.loading = false;
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
        onFileSelected(e) {
            for(let i=0; i < e.target.files.length; i++)
            {
                var reader = new FileReader();
                reader.readAsDataURL(e.target.files[i]);
                reader.onload = (e) => {
                    this.insertCar.Base64images[i] = e.target.result;
                }                 
            }             
        }
    }
}
</script>