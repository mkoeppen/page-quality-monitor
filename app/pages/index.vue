<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" lg="6">
      <PageTable :items="pages" />
    </v-col>
  </v-row>
</template>

<script>
import PageTable from '~/components/PageTable.vue'

export default {
  components: {
    PageTable
  },

  created() {
    this.$store.commit('CHANGE_PAGE_TITLE',"Settings")
  },

  async asyncData({ $axios, $config }) {
    const pages = await $axios.$get(`/api/pages-with-scores`);
    return { pages }
  }
}
</script>