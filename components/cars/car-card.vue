<template>
  <v-card class="mx-auto" max-width="420">
    <v-img class="white--text align-end" height="200px" :src="computedItem.img">
      <v-card-title>{{computedItem.title}}</v-card-title>
    </v-img>

    <v-card-text class="text--primary">
      <div>{{computedItem.text}}</div>
    </v-card-text>

    <v-card-actions>
      <v-btn color="orange" text> Share</v-btn>
      <v-btn  color="orange" text>Explore</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  props:['data'],
  data(){
    return{

    }
  },
  computed:{
    computedItem(){
      console.log('data',this.data)

      if(this.data){
        var item = JSON.parse(JSON.stringify(this.data))
        return item
      }
      else
        return []  
    }
  }
}
</script>