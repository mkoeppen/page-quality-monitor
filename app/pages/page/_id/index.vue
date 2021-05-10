<template>
  <div>

    <h1>{{ pagename }}</h1>
    
<CircleChart :data="{
  labels: [
    'Red',
    'Blue',
    'Yellow'
  ],
  datasets: [{
    data: [300, 50, 100],
    borderWidth: 0,
    backgroundColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 205, 86)'
    ],
    hoverOffset: 4
  }]
}"></CircleChart>

    <div>
      <NuxtLink :to="reportUrl">Report</NuxtLink>
      <NuxtLink :to="todoUrl">Todos</NuxtLink>
    </div>

    <NuxtChild />

  </div>
</template>

<script>

import CircleChart from '~/components/CircleChart.vue'

export default {

  components: {
    CircleChart
  },

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