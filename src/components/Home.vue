<template>
    <div>
        <div class="container" >
            <b-carousel class="myCarousel" 
            id="carousel-1"
            v-model="slide"
            :interval="5000"
            controls
            img-width="900px"
            img-height="600px"
            style="text-shadow: 1px 1px 2px #333;"
            @sliding-start="onSlideStart"
            @sliding-end="onSlideEnd"
            >
                <!-- Text slides with image -->
                <b-carousel-slide 
                    img-src="https://cm-9b932d71-5bb4-4579-9d69-c61e6dbca245.s3.eu-central-1.amazonaws.com/3af9730e-8f27-49c9-b6bb-adcaa8d6d456.jpg"
                    text="Automated BMW data insert" block alt="Responsive image">        
                </b-carousel-slide>

                <b-carousel-slide 
                    img-src="https://cm-9b932d71-5bb4-4579-9d69-c61e6dbca245.s3.eu-central-1.amazonaws.com/a107591c-0369-4193-a54a-9d7875721ec7.jpg"
                    text="Automated Mercedes-benz data insert" block alt="Responsive image">
                </b-carousel-slide>
                <!-- Slides with custom text -->
                <b-carousel-slide 
                    img-src="https://cm-9b932d71-5bb4-4579-9d69-c61e6dbca245.s3.eu-central-1.amazonaws.com/d497edf8-8d8e-436e-9abf-0a99503c4824.jpg" 
                    text="Automated tracking info from 'Altantic Express'" block alt="Responsive image">
                </b-carousel-slide>
                <!-- Slides with image only -->
                <b-carousel-slide 
                    img-src="https://cm-9b932d71-5bb4-4579-9d69-c61e6dbca245.s3.eu-central-1.amazonaws.com/e4fe7943-6f5a-4f4a-b3ed-b459d21c422d.jpg" 
                    text="Fast access to BMW dealership" block alt="Responsive image">
                </b-carousel-slide>
                                <!-- Slides with image only -->
                <b-carousel-slide 
                    img-src="https://cm-9b932d71-5bb4-4579-9d69-c61e6dbca245.s3.eu-central-1.amazonaws.com/da1ccda6-8f61-482a-94f2-c0d524df07bd.jpg" 
                    text="Fast access to Mercedes-benz dealership" block alt="Responsive image">
                </b-carousel-slide>
            </b-carousel>
        </div>
    </div>
</template>

<script>
  export default {
        data() {
          return {
              slide: 0,
              sliding: null
          }
    },
    methods: {
        onSlideStart() {
            this.sliding = true
        },
        onSlideEnd() {
            this.sliding = false
        }
    }
  }
</script>
<style scoped>
    .myCarousel img {

    width: auto;

    height: 5px;

    max-height: 100px;

    }
</style>