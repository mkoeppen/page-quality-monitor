<template>
  <div>

    <div>
      <a :href="reportUrl">Report</a>
      <a :href="todoUrl">Todos</a>
    </div>



  </div>
</template>

<script>
export default {

  data: function() {
    return {
      id: -1,
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
    this.id = this.$route.params.id;
  },

  async asyncData({ $axios, $config }) {
    const page = await $axios.$get(`/api/page/${this.id}`);
    console.log('#############page', page);
    return { page }
  }
}
</script>