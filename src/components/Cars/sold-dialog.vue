<template>
    <b-modal id="sold-modal" ref="modal" title="Sold data"
    v-model="show"
    @show="resetModal"
    @ok.prevent="handleSubmit()"
    @close="resetModal">
        <b-form ref="form" @submit.stop.prevent="handleSubmit()">
            <b-form-group :label="'Sold price (' + currency + ')'">
                <b-form-input placeholder="15000" name="soldPrice-input"
                    v-model="soldDetails.soldPrice"
                    v-validate="{ required: true, decimal:'2', min_value: 0.01 }"
                    :state="validateState('soldPrice-input')" 
                    aria-describedby="soldPrice-input-live-feedback"
                    data-vv-as="Sold price">
                </b-form-input>
                <b-form-invalid-feedback id="soldPrice-input-live-feedback">
                    {{ veeErrors.first('soldPrice-input') }}
                </b-form-invalid-feedback>
            </b-form-group>     
        </b-form>
    </b-modal>
</template>
    
<script>
export default {
    props:['show'],
    data(){
        return{

        }
    },
    methods:{
        handleSubmit(){
            
        }
    }
}
</script>