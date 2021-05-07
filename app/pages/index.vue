<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" lg="6">
      <v-switch v-model="nestedChilds" label="Nested Childs" @change="changeNestedChildSwitch"></v-switch>
      <v-switch v-model="showOnlyMarked" label="Show Only Marked" @change="changeShowOnlyMarkedSwitch"></v-switch>

      <h1>Pages</h1>
      <PageTable :pages="filteredPages" :showOnlyMarked="showOnlyMarked" />
    </v-col>
  </v-row>
</template>

<script>
  import PageTable from '~/components/PageTable.vue'

  export default {
    components: {
      PageTable
    },

    data() {
      return {
        nestedChilds: false,
        showOnlyMarked: false,
        filteredPages: [],
      }
    },

    created() {
      this.$store.commit('CHANGE_PAGE_TITLE', "Settings")
    },

    mounted() {
      this.nestedChilds = JSON.parse(localStorage.getItem('PageSetting.NestedChilds') || 'false');
      this.showOnlyMarked = JSON.parse(localStorage.getItem('PageSetting.ShowOnlyMarked') || 'false');
      this.filterPageList();
    },

    methods: {
      changeNestedChildSwitch(e) {
        localStorage.setItem('PageSetting.NestedChilds', this.nestedChilds);
      },
      changeShowOnlyMarkedSwitch(e) {
        localStorage.setItem('PageSetting.ShowOnlyMarked', this.showOnlyMarked);
      },
      filterPageList() {
        if (!this.pages) this.filteredPages = [];
        else if (this.nestedChilds) {
          this.filteredPages = this.pages
            // get only level 1 pages
            .filter((page) => page.parentId === null)
            // add childs
            .map((page) => {
              page.children = this.pages.filter((child) => child.parentId === page.id);
              return page;
            })
        } else {
          this.filteredPages = this.pages          
          .map((page) => {
            page.children = [];
            return page;
          });
        }
      }
    },

    watch: {
      nestedChilds (val) {
        this.filterPageList()
      },
      showOnlyMarked (val) {
        this.filterPageList()
      },
    },

    async asyncData({
      $axios,
      $config
    }) {
      const pages = await $axios.$get(`/api/pages-with-scores`);

      return {
        pages
      }
    }
  }

</script>
