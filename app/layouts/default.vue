<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped || $vuetify.breakpoint.lgAndUp"
      dark
      fixed
      app
    >
      <v-list>
        <v-btn
          icon
          large
          style="margin-bottom: 4px;margin-left: 5px;"
          @click.stop="miniVariant = !miniVariant"
        >
          <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
        </v-btn>
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
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      v-if="$vuetify.breakpoint.mdAndDown"
      dark
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
    </v-app-bar>
    <v-main>
      <v-container fluid class="pa-0 fill-height">
        <nuxt />
      </v-container>
    </v-main>    
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      items: [
        {
          icon: 'mdi-format-list-bulleted',
          title: 'Projekte',
          to: '/'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false
    }
  },
  computed: {
    title() {
      return this.$store.state.title;
    }
  },
  head() {
    return {
      title: this.title
    };
  },
}
</script>
