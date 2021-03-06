<template>
    <div>
        <b-modal id="car-insert-modal" ref="modal" title="Insert new car"
        @show="resetModal"
        @ok.prevent="handleSubmit()"
        @close="resetModal"
        :ok-disabled="buttonClicked">
        <b-alert v-model="alertFlag" :variant="dangerAlert ? 'danger' : 'success'" dismissible>{{alertMessage}}</b-alert>
            <form ref="form" @submit.stop.prevent="handleSubmit">
                <div class="mb-4">
                    <b-nav tabs>
                        <b-nav-item :active="activeBmwItem">
                            <a @click="bmwClick()">BMW</a>
                            </b-nav-item>
                        <b-nav-item :active="activeMbItem">
                            <a @click="mbClick()">Mercedes-benz</a>
                        </b-nav-item>
                        <b-nav-item>
                            <a @click="otherClick()">
                                Other
                            </a>
                        </b-nav-item>
                    </b-nav>
                </div>
                <b-form-group label="VIN">
                    <b-form-input id="vin-input" placeholder="WBA1E2C34JVD56789" name="vin-input"
                        v-model="car.vin"
                        v-validate="{ required: true, length:'17'}"
                        :state="validateState('vin-input')" 
                        aria-describedby="vin-input-live-feedback"
                        data-vv-as="VIN">
                    </b-form-input>
                    <b-form-invalid-feedback id="vin-input-live-feedback">
                        Vin is required and length must be numeric exactly 17 symbols 
                    </b-form-invalid-feedback>
                </b-form-group>
                <b-row>
                    <b-col cols="8">
                        <b-form-group label="Price">
                            <b-form-input id="price-input" placeholder="9000" name="price-input"
                                v-model="summary.boughtPrice"
                                v-validate="{ required: true, decimal:'2',min_value:0.01 }"
                                :state="validateState('price-input')" 
                                aria-describedby="price-input-live-feedback"
                                data-vv-as="Price">
                            </b-form-input>
                            <b-form-invalid-feedback id="price-input-live-feedback">
                                {{ veeErrors.first('price-input') }}
                            </b-form-invalid-feedback>
                        </b-form-group>
                    </b-col>
                    <b-col cols="4">
                        <b-form-group label="Currency">
                            <b-form-select id="currency-input" name="currency-input"
                                v-model="summary.selectedCurrency"
                                :options="rates"
                                v-validate="{ required: true }"
                                :state="validateState('currency-input')"
                                aria-describedby="currency-input-live-feedback"
                                data-vv-as="Currency" > 
                            </b-form-select>
                            <b-form-invalid-feedback id="currency-input-live-feedback">
                                {{ veeErrors.first('currency-input') }}
                            </b-form-invalid-feedback>
                        </b-form-group>
                    </b-col>
                </b-row>          
                <b-form-group label="Images">
                    <b-form-file name="images-input" multiple 
                        @change="onFileSelected" 
                        v-model="example" accept="image/*"
                        v-validate="{ required: false, image: true }" 
                        :state="validateState('images-input')"
                        aria-describedby="images-input-live-feedback"
                        data-vv-as="Images">
                    </b-form-file>
                    <b-form-invalid-feedback id="images-input-live-feedback">
                        {{ veeErrors.first('images-input') }}
                    </b-form-invalid-feedback>
                </b-form-group>
            </form>
        </b-modal>
    </div>
</template>

<script>
import axios from 'axios'
const backEndUrl = process.env.VUE_APP_API;
export default {
    data() {
        return {
            example:null,
            car: {
                vin: '',
                base64images: [],
                make: 'BMW'
            },  
            summary: {
                boughtPrice: '',
                car: '',
                selectedCurrency: '',
                baseCurrency: window.$cookies.get('currency'),
            },   
            rates: [],   
            priceState: null,
            vinState: null,
            alertFlag: false,
            alertMessage: '',
            dangerAlert: false,
            activeBmwItem: true,
            activeMbItem: false,
            buttonClicked: false
        }
    },
    mounted() {
        this.getCurrencies();
    },
    methods: {
        getCurrencies() {
            let vm = this;
            axios.get(backEndUrl + "/api/currency")
            .then(function (response) {
                vm.rates = response.data;
                vm.summary.selectedCurrency = vm.summary.baseCurrency;
            })
            .catch(function (error){
                console.log(error);
            });
        },
        resetModal() {
            this.car.vin = ''
            this.summary.boughtPrice = '';
            this.car.base64images = []
            this.car.make = 'BMW'
            this.priceState = null
            this.vinState = null
        },
        handleSubmit() {
            this.$validator.validateAll().then(result => {
                if (!result)
                    return;
                this.buttonClicked = true;
                this.insertCar();
            });  
        },
        insertCar(){
            let vm = this;
            vm.dangerAlert = false;
            vm.alertMessage = "Please wait while we fetch your car data";
            vm.alertFlag = true;
            axios.post(backEndUrl + "/api/cars", vm.car, {
                headers: { Authorization: 'Bearer ' + window.$cookies.get('token')}
            })
            .then(function (response) {
                if(response.status == 200)
                {
                    let insertedId = response.data._id;
                   // vm.insertImages(insertedId);                
                    vm.dangerAlert = false;
                    vm.alertMessage = "Car inserted successfully"
                    vm.alertFlag = true;  
                    vm.insertCarSummary(insertedId);
                }              
            })
            .catch(function (error) {
                if(error.response.data.includes('404'))
                    vm.alertMessage = "Car not found. Check if provided VIN number is for " + vm.car.make;
                else
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
        insertImages(carId){
            console.log("img-insert", this.car.base64images, carId);
            let vm = this;
            axios.post(backEndUrl + `/api/cars/${carId}/images`, vm.car.base64images, {
                headers: {Authorization: 'Bearer ' + window.$cookies.get('token')}
            })
            .catch(function (error) {
                console.log(error);
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
        insertCarSummary(carId) {
            let vm = this;
            axios.post(backEndUrl + `/api/cars/${carId}/summary`, vm.summary, {
                headers: {Authorization: 'Bearer ' + window.$cookies.get('token')}
            })
            .then(function (response){
                if(response.status == 200)
                {
                    vm.$nextTick(() => {
                        vm.$bvModal.hide('car-insert-modal')
                    });
                    window.location.href = '/cars';
                }  
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
        onFileSelected(e) {
            let vm = this;           
            for(let i=0; i < e.target.files.length; i++)
            {
                var reader = new FileReader();
                reader.readAsDataURL(e.target.files[i]);
                reader.onload = (ev) => {
                    vm.car.base64images[i] = ev.target.result;
                }                       
            }
        },
        bmwClick() {
            this.activeMbItem = false;
            this.activeBmwItem = true;
            this.car.make = 'BMW'
        },
        mbClick() {
            this.activeMbItem = true;
            this.activeBmwItem = false;
            this.car.make = 'Mercedes-benz'
        },
        otherClick() {
            this.$router.push("/other-insert");
        },
        validateState(ref) {
            if (this.veeFields[ref] && (this.veeFields[ref].dirty || this.veeFields[ref].validated))
                return !this.veeErrors.has(ref);
            return null;
        },
  }
}
</script>