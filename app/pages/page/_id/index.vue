<template>
  <div>

    <h1>{{  }}</h1>

    <div>
      <NuxtLink :to="reportUrl">Report</NuxtLink>
      <NuxtLink :to="todoUrl">Todos</NuxtLink>
    </div>

    <NuxtChild />

  </div>
</template>

<script>
export default {

  data: function() {
    return {
    }
  },

  computed: {
     reportUrl() {
         return `/page/${this.id}`;
     },
     todoUrl() {
         return `/page/${this.id}/todos`;
     }
  },


  created() {
    this.$store.commit('CHANGE_PAGE_TITLE',"Page");
  },

  async asyncData({ $axios, $config, route }) {
    const { id } = route.params
    const page = await $axios.$get(`/api/page/${id}`);
    return {
      id: id,
      pagename: page.pagename,
      url: page.url,
    }
  }
}
</script>