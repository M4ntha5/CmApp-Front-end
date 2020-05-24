<template>
     <div>
          <div v-if="!token" class="pt-5">
               <hr class="rgba-white-light" style="margin: 0 15%;">   
               <div class="text-center py-4">
                    <div>
                         Having trouble while using site? Email me at:
                         <a href="mailto:mantas.daunoravicius@ktu.edu" target="_blank">mantas.daunoravicius@ktu.edu</a>
                    </div>
                    <div class="text-center py-3">© 2020 Copyright: 
                         <a href="mailto:mantas.daunoravicius@ktu.edu" target="_blank">Mantas Daunoravičius</a>
                    </div>
               </div>
          </div>

          <footer v-else class="pt-5">
               <hr class="rgba-white-light" style="margin: 0 15%;">
               
               <div class="container">
                    <div class="row">
                         <div class="col-sm-4">
                              <h5 class="font-weight-bold mt-3 mb-4">General</h5>
                              <ul class="list-unstyled">
                                   <li>
                                        <a @click.prevent="$router.push('/about')" href="">About</a>
                                   </li>
                                   <li>
                                        <a @click.prevent="$router.push('/404')" href="">Suggest a feature</a>
                                   </li>
                                   <li>
                                        <a @click.prevent="$router.push('/404')" href="">Report a problem</a>
                                   </li>
                              </ul>
                         </div>
                         <div class="col-sm-4">
                              <h5 class="font-weight-bold mt-3 mb-4">Features</h5>
                              <ul class="list-unstyled">
                                   <li>
                                        <a @click.prevent="$router.push('/cars')" href="">My cars</a>
                                   </li>
                                   <li>
                                        <a @click.prevent="$router.push(`/users/${user}/stats`)" href="">Sold stats</a>
                                   </li>
                                   <li>
                                        <a @click.prevent="$router.push('/converter')" href="">Exchange converter</a>
                                   </li>
                              </ul>
                         </div>
                         <div class="col-sm-4">
                              <h5 class="font-weight-bold mt-3 mb-4">Account</h5>
                              <ul class="list-unstyled">
                                   <li>
                                        <a @click.prevent="$router.push(`/users/${user}/edit`)" href="">Edit profile</a>
                                   </li>
                                   <li>
                                        <a @click.prevent="$router.push(`/users/${user}/change/password`)" href="">Change password</a>
                                   </li>
                              </ul>
                         </div>
                    </div>
               </div>

               <div class="text-center py-3">© 2020 Copyright: 
                    <a href="mailto:mantas.daunoravicius@ktu.edu" target="_blank">Mantas Daunoravičius</a>
               </div>
          </footer>
     </div>
</template>
<script>
export default {
     computed: {
          token: function () {  
               return window.$cookies.get('token');  
          },
          user: function() {
               return window.$cookies.get('user');
          }
     }
}
</script>