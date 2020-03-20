<template>
     <div>
          <b-modal id="car-sold-modal" ref="modal" title="Sold details"
          @show="resetModal"
          @ok="handleOk"
          @close="resetModal">

               <form ref="form" @submit.stop.prevent="handleSubmit">
                    <b-form-group :state="priceState" label="Sold price" label-for="price-input" 
                              invalid-feedback="Price is required and should be more/equal 0">
                         <b-form-input v-model='update.soldPrice' id="price-input" :state="priceState" type="number" min="0" step=".01" required></b-form-input>
                    </b-form-group>
               </form>

          </b-modal>
      </div>
</template>

<script>
import axios from 'axios'
const backEndUrl = process.env.VUE_APP_BACK_END_URL;
export default {
     data() {
          return {
               update: {
                  soldPrice: 0,   
                  car: ''  
               },           
               priceState: null,
          }
     },
     methods: {
          checkFormValidity() {
               const valid = this.$refs.form.checkValidity();
               this.priceState = this.$refs.form[0].checkValidity();
               return valid
          },
          resetModal() {
               this.update.soldPrice = '';
               this.priceState = null;
          },
          handleOk(bvModalEvt) {
               // Prevent modal from closing
               bvModalEvt.preventDefault();
               // Trigger submit handler
               this.handleSubmit();
          },
          handleSubmit() {
               // Exit when the form isn't valid
               if (!this.checkFormValidity()) {
                    return ;
               }
               else
               {
                    this.showAlert();
                    // Push the name to submitted names
                    let vm = this;
                    axios.put(backEndUrl + `/api/cars/${carId}/summary/${summaryId}`, vm.update)
                         .then(function (response) {             
                         if(response.status == 200)
                         {
                              console.log(response);
                              vm.alertFlag = false;
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
               }
          },
          onFileSelected(e) {
               for(let i=0; i < e.target.files.length; i++)
               {
                    var reader = new FileReader();
                    reader.readAsDataURL(e.target.files[i]);
                    reader.onload = (e) => {
                         this.insert.Base64images[i] = e.target.result;
                    }                 
               }
               console.log(this.insert.Base64images);                
          }, 
          showAlert(){
               this.alertFlag = true;
          },
          bmwClick() {
               this.activeMbItem = false;
               this.activeBmwItem = true;
               this.insert.make = 'BMW'
          },
          mbClick() {
               this.activeMbItem = true;
               this.activeBmwItem = false;
               this.insert.make = 'Mercedes-benz'
          },
          otherClick() {
               window.location.href= "/not-implemented";
          }
     }
}
</script>