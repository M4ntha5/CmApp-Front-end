<template>
  <div>
    <v-row>
      <div v-for="item in items" :key="item.id">
        <v-col>
          <car-card :data="item"/>
        </v-col>
      </div>
    </v-row>
  </div>
</template>
<script>
import CarCard from '@/components/cars/car-card.vue'

export default {
  components:{
    CarCard,
  },
  data(){
    return{
      items: [
        {id: 1, title: 'title1', img: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg', text:'text1'},
        {id: 2, title: 'title2', img: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg', text:'text2'},
        {id: 3, title: 'title3', img: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg', text:'text3'},
        {id: 4, title: 'title1', img: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg', text:'text1'},
        {id: 5, title: 'title2', img: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg', text:'text2'},
        {id: 6, title: 'title3', img: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg', text:'text3'},
        {id: 7, title: 'title1', img: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg', text:'text1'},
        {id: 8, title: 'title2', img: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg', text:'text2'},
        {id: 9, title: 'title3', img: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg', text:'text3'},
        {id: 10, title: 'title1', img: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg', text:'text1'},
        {id: 11, title: 'title2', img: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg', text:'text2'},
        {id: 12, title: 'title3', img: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg', text:'text3'},
      ],
      loading: true,

      snackbarMessage: null,
      snackbarColor: null,
      showSnackbar: false
    }
  },
  created(){
    this.getCars()
  },
  methods:{
    async getCars(){
      try{
        const {data} = await this.$axios.get('/api/cars')
        this.items = data
      }
      catch(ex){
        console.log(ex)
      }
    }
  }
}
</script>
