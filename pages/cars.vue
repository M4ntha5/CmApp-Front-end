<template>
  <div>
    <cars-list/>

    <v-snackbar v-model="showSnackbar" :color="snackbarColor">
      {{ snackbarMessage }}
      <v-btn icon @click="showSnackbar = false"><v-icon>mdi-close</v-icon></v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import CarsList from '@/components/cars/list.vue'

export default {
  components:{
    CarsList
  },
  data(){
    return{
      items: [],
      filters: {},
      announcementTypes: [],
      tab:0,
      loading: true,

      snackbarMessage: null,
      snackbarColor: null,
      showSnackbar: false
    }
  },
  created(){

  },
  computed:{
  },
  methods:{
  }
}
</script>