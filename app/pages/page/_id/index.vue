<template>
  
  <v-container fluid class="pa-0" style="height: 100%">
    <v-toolbar flat dark>
      <v-btn dark color="light-blue darken-4" :href="`/`" title="Pages"><v-icon class="mr-3">mdi-chevron-left</v-icon>Back</v-btn>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-container style="height: 100%" dark>
      <v-row>
        <v-col cols="6">
          <h1 class="m-page__headline mb-4">{{ pagename }}</h1>
          <div v-if="parent">
            <strong>Parent:</strong>
            <a :href="`/page/${parent.id}`">{{ parent.pagename }}</a>
          </div>
          <div>
            <strong>URL:</strong>
            <a :href="url" target="_blank" rel="noopener noreferrer">{{ url }}</a>
          </div>
        </v-col>
        <!-- <v-col cols="3">
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
        </v-col>
        <v-col cols="3">
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
        </v-col> -->
        <v-col cols="12" class="pb-0">
          <v-tabs grow dark>
            <v-tab :to="reportUrl" class="teal" ><v-icon class="mr-3">mdi-clipboard-text-search</v-icon>Report</v-tab>
            <v-tab :to="todoUrl" class="orange" ><v-icon class="mr-3">mdi-format-list-checks</v-icon>Todos</v-tab>
          </v-tabs>
        </v-col>
        <v-col cols="12" class="pt-0">
          <NuxtChild />
        </v-col>
      </v-row>
    </v-container>
  </v-container>
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
    const pages = await $axios.$get(`/api/pages`);
    console.log('page.parentId', page);
    return {
      id: id,
      pagename: page.pagename,
      url: page.url,
      parent: page.parentId !== null ? pages.find((p) => p.id === page.parentId) : null,
      pages: pages
    }
  }
}
</script>

<style lang="scss" scoped>
  .m-page__headline {
    font-weight: 300;
    font-size: 50px;
    line-height: 1;
    color: #01579b;
  }
</style>