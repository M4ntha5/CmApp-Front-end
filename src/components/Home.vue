<template>
    
        <div class="">
            <b-carousel
            id="carousel-1"
            v-model="slide"
            :interval="5000"
            controls no-hover-pause
            background="#ababab"
            style="text-shadow: 1px 1px 2px #333;"
            @sliding-start="onSlideStart"
            @sliding-end="onSlideEnd"
            >
                <b-carousel-slide content-visible-up="sm"
                    img-src="https://cm-9b932d71-5bb4-4579-9d69-c61e6dbca245.s3.eu-central-1.amazonaws.com/3af9730e-8f27-49c9-b6bb-adcaa8d6d456.jpg"
                    caption="Automated BMW data insert" thumbnail >        
                </b-carousel-slide>

                <b-carousel-slide content-visible-up="sm"
                    img-src="https://cm-9b932d71-5bb4-4579-9d69-c61e6dbca245.s3.eu-central-1.amazonaws.com/a107591c-0369-4193-a54a-9d7875721ec7.jpg"
                    caption="Automated Mercedes-benz data insert">
                </b-carousel-slide>

                <b-carousel-slide content-visible-up="sm"
                    img-src="https://cm-9b932d71-5bb4-4579-9d69-c61e6dbca245.s3.eu-central-1.amazonaws.com/d497edf8-8d8e-436e-9abf-0a99503c4824.jpg" 
                    caption="Automated tracking info from 'Altantic Express'">
                </b-carousel-slide>

                <b-carousel-slide content-visible-up="sm"
                    img-src="https://cm-9b932d71-5bb4-4579-9d69-c61e6dbca245.s3.eu-central-1.amazonaws.com/e4fe7943-6f5a-4f4a-b3ed-b459d21c422d.jpg" 
                    caption="Fast access to BMW dealership">
                </b-carousel-slide>

                <b-carousel-slide content-visible-up="sm"
                    img-src="https://cm-9b932d71-5bb4-4579-9d69-c61e6dbca245.s3.eu-central-1.amazonaws.com/da1ccda6-8f61-482a-94f2-c0d524df07bd.jpg" 
                    caption="Fast access to Mercedes-benz dealership">
                </b-carousel-slide>
            </b-carousel>
        </div>
    
</template>

<script>
import axios from 'axios'
const backEndUrl = process.env.VUE_APP_API;
export default {
    data() {
        return {
            slide: 0,
            sliding: null
        }
    },
    methods: {
        onSlideStart() {
            this.sliding = true;
        },
        onSlideEnd() {
            this.sliding = false;
        },
        getCurrencies() {
            axios.get(backEndUrl + "/api/currency");
        },
    }
}
</script>
<style>
    @media only screen and (min-width: 1200px) { 
        .carousel-item img {
            height:800px !important;
        }
    }   
</style>
