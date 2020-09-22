<template>
  <div>
    test
  </div>
</template>

<script>
  const reportsModel = require("../../models/reports");
  export default {
    data: () => ({      
      id: null,
      report: null
    }),

    created() {
      this.id = this.$route.params.id;
      // this.report = reportsModel.getById(this.id);
    },

    methods: {      
      deleteItem() {
        debugger;
        this.$axios
          .delete(`/api/reports/${this.id}`)
          .then(response => {
            // TODO: go to list
          });
      },
    }
  }

</script>
