<template>
  <div class="container pt-5">
      <h1>All VIN's provided here will give you full this website functionality:</h1>
      <div class="row pt-5">
            <div class="col">
                  <h1 style="color:blue;">VIN's For BMW:</h1>
                  <div class="pl-5 pt-2">
                        <h5>WBA7E2C37HG740629</h5>
                        <h5>WBS8M9C56J5L00187</h5> 
                  </div>
                  
            </div>
            <div class="col">
                  <h1 style="color:purple;">VIN's For Mercedes-benz:</h1>
                  <h5 class="pl-5 pt-2">WDDLJ7EB1CA031646</h5>
            </div>
      </div>
      <div class="row pl-3 pt-5">
            <h1>
                  All tracking data is taken from 
                  <a href="http://atlanticexpresscorp.com/" target="_blank">Atlantic Express</a>
            </h1>        
      </div>
      <h5>Do not hesitate to visit for more information about shipping services they suggest</h5>

      
      <div class="row pt-5 pl-3">
            <h1>Show tracking images option</h1>           
      </div>
      <h4 class="row pl-3">This option lets user to be able to show tracking images </h4>
     
      <h5  class="row pt-4 pl-5">If Yes - shows user images combined with images got from fetched tracking</h5>
      <h5  class="row pl-5">If No - shows only user uploaded images</h5>

      
      <h1 class="pt-5" style="color:red;">
            Having trouble using our site? 
            <a href="mailto:mantas.daunoravicius@ktu.edu" target="_blank" class="btn btn-primary">Email Us</a>
      </h1>

  </div>
  
</template>

<script>
export default {
      watch: {
            //'$route' (to, from) {
              //    alert("to", to.params.id);
            //      alert("from", from.params.id);
          //  }
      },
      created() {
         ///   alert(this.$route.params.id);
      },
      methods: {
            goHome() {
                  this.$router.push('/');
            }
      }
}
</script>