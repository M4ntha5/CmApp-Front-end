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
                    img-src="https://cdn.image4.io/cmapp/f_auto/327cbf70-235d-4cef-adf0-0ad79a3bb364.jpg"
                    caption="Automated BMW data insert" thumbnail >        
                </b-carousel-slide>

                <b-carousel-slide content-visible-up="sm"
                    img-src="https://cdn.image4.io/cmapp/f_auto/a5f89fa3-888e-43dc-8620-c82cb8286789.jpg"
                    caption="Automated Mercedes-benz data insert">
                </b-carousel-slide>

                <b-carousel-slide content-visible-up="sm"
                    img-src="https://cdn.image4.io/cmapp/f_auto/771d4221-3dda-4ce8-b32e-a22ba139c2e5.jpg" 
                    caption="Automated tracking info from 'Altantic Express'">
                </b-carousel-slide>

                <b-carousel-slide content-visible-up="sm"
                    img-src="https://cdn.image4.io/cmapp/f_auto/b6bab370-e80e-4150-b4cc-170f63d641c6.jpg" 
                    caption="Fast access to BMW dealership">
                </b-carousel-slide>

                <b-carousel-slide content-visible-up="sm"
                    img-src="https://cdn.image4.io/cmapp/f_auto/b2db9c21-98e9-4dd1-a6ce-dfbd4f816090.jpg" 
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
