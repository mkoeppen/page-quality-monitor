<template>
  <div>

    <iframe class="m-report__iframe" :src="reportHtml"></iframe>

  </div>
</template>

<script>
export default {
 async asyncData({ $axios, $config, route }) {
    const { id } = route.params
    let reportHtml;
    try {
      reportHtml = await $axios.$get(`/api/last-report-for-page/${id}`);
    } catch(e) {

    }
    return {
      reportHtml: reportHtml ? "data:text/html;charset=utf-8," + encodeURIComponent(reportHtml) : null
    }
  }
}
</script>

<style lang="scss" scoped>
  .m-report__iframe {
    width: 100%;
    min-height: 80vh;
    border: 0;  
  }
  
</style>