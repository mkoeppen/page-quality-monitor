<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" lg="6">
      <v-switch
        v-model="nestedChilds"
        label="Nested Childs"
      ></v-switch>
      
    <h1>Pages</h1>
      <PageTable :pages="filteredPages" />
    </v-col>
  </v-row>
</template>

<script>
import PageTable from '~/components/PageTable.vue'

export default {
  components: {
    PageTable
  },

  data () {
    return {
      nestedChilds: true,
    }
  },

  created() {
    this.$store.commit('CHANGE_PAGE_TITLE',"Settings")
  },

  computed: {
    filteredPages() {
      if(!this.pages) return [];

      if(this.nestedChilds) {
        return this.pages
          // get only level 1 pages
          .filter((page) => page.parentId === null)
          // add childs
          .map((page) => {
            page.children = this.pages.filter((child) => child.parentId === page.id);
            return page;
          })
      }

      return this.pages.map((page) => {
            page.children = [];
            return page;
          });
    }
  },

  async asyncData({ $axios, $config }) {
    const pages = await $axios.$get(`/api/pages-with-scores`);

    return { pages }
  }
}
</script>