<template>
  <v-container fluid fill-height pa-0>
    <div class="pa-2 grey lighten-1 white--text flex">
      <b>Start: </b><span class="mr-4">{{new Date(createdDateTime).toLocaleString('de-DE')}}</span><b>Abgeschlossen: </b><span>{{new Date(completedDateTime).toLocaleString('de-DE')}}</span>
    </div>
    <iframe :src="`/static/reports/${filepath}.html`" class="container container--fluid fill-height pa-0"></iframe>
  </v-container>
</template>

<script>

  export default {
    data: () => ({      
      id: null
    }),

     asyncData({ route }) {
      const reportsModel = require("../../models/reports");
      const escape = require('escape-html');
      return reportsModel.getDetails(route.params.id).then(data => {
        return data
      })
    },

    methods: {      
      deleteItem() {
        this.$axios
          .delete(`/api/reports/${this.id}`)
          .then(response => {
            // TODO: go to list
          });
      },
    }
  }

</script>
