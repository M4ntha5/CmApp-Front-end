<template>
<div>
       <nav class="navbar navbar-expand-lg navbar-light bg-light my-nav">
            <router-link to="/" class="navbar-brand">CmApp</router-link>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                  <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul class="navbar-nav mr-auto">
                        <li class="nav-item">
                              <router-link to="/about" class="nav-link">About</router-link>
                        </li>
                        <template v-if="role == 'user'">
                              <li class="nav-item">
                                    <router-link to="/cars" class="nav-link">Cars</router-link>
                              </li>  
                              <li class="nav-item" >
                                    <a @click.prevent="showRepairModal()" href v-b-modal.repair-insert-modal class="nav-link">
                                          Add repair
                                    </a>
                                    <!-- repair modal-->
                                    <RepairModal v-show="isRepairModalVisible"/>
                              </li>
                              
                              <li class="nav-item" >
                                    <router-link :to='"/users/"+user+"/stats"' class="nav-link">Sold stats</router-link>
                              </li> 
                        </template>
                        <template v-if="role == 'admin'">
                              <li class="nav-item">
                                    <router-link to="/users" class="nav-link">Users</router-link>
                              </li>
                              <li class="nav-item">
                                    <router-link to="/admin/cars" class="nav-link">Cars</router-link>
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
                                          aria-expanded="false">
                                               {{email}}
                                          </a>

                                          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuLink">
                                                <a class="dropdown-item" @click.prevent="$router.push(`/users/${user}/edit`)" href="">Profile</a>                            
                                                <a class="dropdown-item" @click.prevent="$router.push(`/users/${this.user}/change/password`)" href="">Change password</a>
                                                <a class="dropdown-item" @click.prevent="logout()" href="">Log out</a>
                                          </div>
                                    </div>
                              </li>
                        </template>
                  </ul>
            </div>
      </nav>    
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
            email: function() {
                  return window.$cookies.get('user-email');
            },
            user: function() {
                  return window.$cookies.get('user');
            }
      },
      methods: {
            showRepairModal() {
                  this.isRepairModalVisible = true;
            },
            logout(){
                  window.$cookies.remove('role');
                  window.$cookies.remove('token');
                  window.$cookies.remove('user-email');
                  window.$cookies.remove('user');
                  window.location.href = '/login';
            },
      }
}
</script>