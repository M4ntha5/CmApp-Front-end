<template>
    <div>
        <div class="container-fluid w-100" >
            <b-carousel class="myCarousel"
            id="carousel-1"
            v-model="slide"
            :interval="5000"
            controls
            style="text-shadow: 1px 1px 2px #333;"
            @sliding-start="onSlideStart"
            @sliding-end="onSlideEnd"
            >
                <!-- Text slides with image -->
                <b-carousel-slide img-src="https://i.pinimg.com/originals/e9/94/6b/e9946b570081bc51c3ad1f442e6bdb49.jpg" >
                    <h1>BMW and MB automated car insert</h1>
                </b-carousel-slide>

                <!-- Slides with custom text -->
                <b-carousel-slide img-src="https://www.asendia.com/application/files/1115/0893/1684/17_Global_Blog_ABC_international_parcel_tracking_17_19.jpg" >
                    <h1>Automated tracking info with "Altantic Express"</h1>
                </b-carousel-slide>

                <!-- Slides with image only -->
                <b-carousel-slide img-src="https://pictures.dealer.com/m/mercedesbenzofstcharles/0888/69faa4ca876fe2d10bee55c57cd1e0c1x.jpg" >
                    <h1>Fast access to BMW and Mercedes-benz dealerships</h1>
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