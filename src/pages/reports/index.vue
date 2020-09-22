<template>
  <div>
    <v-data-table :headers="headers" :items="reports" class="elevation-1">
      <template v-slot:item.createdDateTime="{ item }">
        <span>{{ new Date(item.createdDateTime).toLocaleString('de-DE') }}</span>
      </template>      
      <template v-slot:item.completedDateTime="{ item }">
        <span>{{ new Date(item.completedDateTime).toLocaleString('de-DE') }}</span>
      </template>      
      <template v-slot:item.actions="{ item }">
        <!-- <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon> -->
        
        <a :href="`/reports/${item.id}`"><v-icon small>mdi-file-search</v-icon></a>
        <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
      <template slot="no-data">
        No Data
      </template>
    </v-data-table>
  </div>
</template>

<script>
  export default {
    data: () => ({      
      headers: [{
          text: '',
          value: 'color'
        }, {
          text: 'url',
          align: 'left',
          sortable: false,
          value: 'url'
        }, {
          text: 'createdDateTime',
          align: 'left',
          sortable: false,
          value: 'createdDateTime'
        },{
          text: 'completedDateTime',
          align: 'left',
          sortable: false,
          value: 'completedDateTime'
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false
        },
      ],
      reports: []
    }),

    mounted() {
      this.loadReports();
    },

    methods: {
      loadReports() {
        this.$axios
          .get(`/api/reports`)
          .then(response => {
            // TODO: fix if wrong nesting:
            this.reports = response.data.data.values;
          });
      },
      deleteItem(item) {
        debugger;
        this.$axios
          .delete(`/api/reports/${item.id}`)
          .then(response => {
            this.reports

            for (var i = 0; i < this.reports.length; i++) {
              var obj = this.reports[i];

              if (obj.id == item.id) {
                this.reports.splice(i, 1);
              }
            }

          });
      },
    }
  }

</script>
