<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="12" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                ref="email"
                v-model="email"
                label="Email"
                name="email"
                prepend-icon="mdi-account"
                type="text"
                @keyup.enter="$refs.password.focus()"
              />
              <v-text-field
                ref="password"
                v-model="password"
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                @keyup.enter="login"
              />
            </v-form>
          
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn name="submit" color="primary" dark @click="login">
              <v-icon v-if="!loading">mdi-lock-open</v-icon>
              <v-progress-circular v-else indeterminate tiny />
              Login
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  
</template>

<script>
import Cookies from 'js-cookie'
export default {
  data(){
    return {
      form: {
        email: '',
        password: '',
      },
      dangerAlert: false,
      successAlert: false,
      alertFlag: false,
      message: '',
      isResetModalVisible: false,
      resendButton: false,
      buttonClicked: false,

      changePassword: false,
      loading:false,
      password:null,
      email:null
    }
  },

  computed:{
    token(){
      return Cookies.get('token')
    }
  },
  methods: {
    login() {
      try{
        const {data} = this.$axios.post('/api/auth/login', this.form)
        var token = data
        Cookies.set('token', token, '2h')
      }
      catch(ex){
        console.log(ex)
      }
    }
  },
};
</script>