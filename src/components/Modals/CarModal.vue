<template>
    <div>
        <b-modal id="car-insert-modal" ref="modal" title="Insert new car"
        @show="resetModal"
        @ok="handleOk"
        @close="resetModal">
        <b-alert v-model="alertFlag" dismissible>Fetching data please wait...</b-alert>

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
                <b-form-group :state="vinState" label="Vin" label-for="vin-input" invalid-feedback="Vin is required">  
                    <b-form-input v-model='car.vin' id="vin-input" :state="vinState" required></b-form-input>
                </b-form-group>

                <b-form-group :state="priceState"  label="Price" label-for="price-input" 
                            invalid-feedback="Price is required and should be more/equal 0">
                    <b-form-input v-model='summary.boughtPrice' id="price-input" :state="priceState" type="number" min="0" step=".01" required></b-form-input>
                </b-form-group>

                <b-form-group label="Choose images" label-for="image-input">
                    <input  type="file" multiple @change="onFileSelected" id="image-input"/>       
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
            car: {
                vin: '',
                base64images: [],
                make: 'BMW'
            },  
            summary: {
                boughtPrice: '',
                car: ''
            },      
            priceState: null,
            vinState: null,
            alertFlag: false,
            activeBmwItem: true,
            activeMbItem: false,
        }
    },
    methods: {
        checkFormValidity() {
            const valid = this.$refs.form.checkValidity()
            this.vinState = this.$refs.form[0].checkValidity()
            this.priceState = this.$refs.form[1].checkValidity()
            return valid
        },
        resetModal() {
            this.car.vin = ''
            this.summary.boughtPrice = ''
            this.car.Base64images = []
            this.car.make = 'BMW'
            this.priceState = null
            this.vinState = null
        },
        handleOk(bvModalEvt) {
            // Prevent modal from closing
            bvModalEvt.preventDefault()
            // Trigger submit handler
            this.handleSubmit()
        },
        handleSubmit() {
            // Exit when the form isn't valid
            if (!this.checkFormValidity()) {
                return
            }
            else
            {
                this.showAlert();
                // Push the name to submitted names
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
                })
                .catch(function (error) {
                        console.log(error);
                });
            }
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
                    window.location.href = "/cars";
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
        onFileSelected(e) {
            for(let i=0; i < e.target.files.length; i++)
            {
                var reader = new FileReader();
                reader.readAsDataURL(e.target.files[i]);
                reader.onload = (e) => {
                        this.car.Base64images[i] = e.target.result;
                }                 
            }
            console.log(this.car.Base64images);                
        }, 
        showAlert(){
            this.alertFlag = true;
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
            //window.location.href= "/other-insert";s
            window.location.href= "/404";
        }
  }
}
</script>