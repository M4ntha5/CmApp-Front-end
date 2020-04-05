<template>
  <div class="container pt-5">
      <h1>Cars VIN numbers for testing:</h1>
      <h3> For BMW (vin): </h3>
      <p>WBA7E2C37HG740629</p>
      <p>wba3n9c56ek245582</p>
      <p>WBS1J5C56JVD36905</p>    

      <h3>For Mercedes-benz (vin):</h3>
      <p>WDDLJ7EB1CA031646</p>

      <h2>
            All tracking data is taken from <a href="http://atlanticexpresscorp.com/" target="_blank">here</a>
      </h2>
      <p>Do not hesitate to visit for more information about shipping serices they suggest</p>
            
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