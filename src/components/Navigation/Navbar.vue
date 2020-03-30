<template>
<div>
       <nav class="navbar navbar-expand-lg navbar-light bg-light my-nav">
            <router-link to="/" class="navbar-brand">Big Logo</router-link>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                  <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul class="navbar-nav mr-auto">
                        <li class="nav-item">
                              <router-link to="/about" class="nav-link">About</router-link>
                        </li>
                        <template v-if="role == 'user' || role == 'admin'">
                              <li class="nav-item">
                                    <router-link to="/cars" class="nav-link">Cars</router-link>
                              </li>  
                              <li class="nav-item" >
                                    <a @click.prevent="showRepairModal" href v-b-modal.repair-insert-modal class="nav-link">
                                          Add repair
                                    </a>
                              </li> 
                        </template>
                                                                  
                  </ul>
                  <ul class="navbar-nav ml-auto">                   
                        <li class="nav-item">
                              <router-link to="/converter" class="nav-link">Exchange converter</router-link>
                        </li>       
                        <template v-if="token == null">
                              <li class="nav-item">
                                    <router-link to="/login" class="nav-link">Login</router-link>
                              </li>
                              <li class="nav-item">
                                    <router-link to="/register" class="nav-link">Register</router-link>
                              </li> 
                        </template>         
                        
                        <template v-else>
                              <li class="nav-item">
                                    <div class="dropdown">
                                          <a class="nav-link dropdown-toggle" href="" role="button" 
                                          id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" 
                                          aria-expanded="false"
                                          >
                                               {{name}}
                                          </a>

                                          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuLink">
                                                <a class="dropdown-item" href="/not-implemented">Profile</a>
                                                <a class="dropdown-item" @click.prevent="logout()" href="">Log out</a>
                                          </div>
                                    </div>
                              </li>
                        </template>
                  </ul>
            </div>
      </nav>
      <!-- repair modal-->
      <RepairModal v-show="isRepairModalVisible" @click="closeRepairModal"/>
      
</div>
</template>
<script>
import RepairModal from '../Modals/RepairModal.vue';

export default {
      data() {
            return {
                  isRepairModalVisible: false,
            }
      },
      components: {
            RepairModal,
      },
       computed: {
            token: function () {  
                  return window.$cookies.get('token');  
            },
            role: function() {
                  return window.$cookies.get('role');
            },
            name: function() {
                  return window.$cookies.get('user-name');
            }
      },
      methods: {
            showRepairModal() {
                  this.isRepairModalVisible = true;
            },
            closeRepairModal() {
                  this.isRepairModalVisible = false;
            },
            logout(){
                  window.$cookies.remove('role');
                  window.$cookies.remove('token');
                  window.location.href = "/";
            },
      }
}
</script>