<template>
  <v-app dark>
    <v-navigation-drawer
      :mini-variant="miniVariant"
      permanent
      fixed
      app
    >
      <div class="px-3">
        <v-app-bar-nav-icon @click.stop="miniVariant = !miniVariant" />
      </div>
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-avatar color="purple">MD</v-avatar>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="text-h6">{{title}}</v-list-item-title>
          <v-list-item-subtitle>Full name</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider />
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider />
      <v-list-item router exact @click="logout">
        <v-list-item-action>
          <v-icon>mdi-power</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>logout</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>

    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  data () {
    return {
      fixed: false,
      miniVariant: true,
      title: 'Cm App',
      items: [
        {
          icon: 'mdi-car',
          title: 'Cars',
          to: '/cars',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Login',
          to: '/login'
        }
      ],
    }
  },
  created(){
    var token = Cookies.get('token')
    var currRoute = this.$router.currentRoute.fullPath
    if(!token && currRoute != '/login')
      this.$router.push('/login')
  },
  methods:{
    logout(){
      console.log('logout')
    }
  }
}
</script>
