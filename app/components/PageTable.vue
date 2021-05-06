<template>
  <div>
    <h1>Pages</h1>
    <v-data-table
      dense
      :headers="headers"
      :items="pages"
      class="m-pages__table"
    >

      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-dialog
            v-model="dialog"
            max-width="500px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                New Item
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-text-field
                    v-model="editedItem.pagename"
                    label="Name"
                  ></v-text-field>
                  <v-text-field
                    v-model="editedItem.url"
                    label="url"
                  ></v-text-field>
                  <v-select
                    :items="possibleParents"
                    item-text="pagename"
                    item-value="id"
                    v-model="editedItem.parentId"
                    label="Standard"
                  ></v-select>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="close"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="save"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
            
      <template v-slot:item.pagename="props">
        <div class="m-page__name-wrapper" @click="handleClick(props.item)">
          <strong class="m-page__name">{{props.item.pagename}}</strong>
          <span class="m-page__url" :title="props.item.url">{{props.item.url}}</span>
        </div>
      </template>

      <template v-slot:item.score_performance="props">
        <ScoreCircle :percentage="props.item.score_performance"></ScoreCircle>
      </template>      
      <template v-slot:item.score_accessibility="props">
        <ScoreCircle :percentage="props.item.score_accessibility"></ScoreCircle>
      </template>      
      <template v-slot:item.score_best_practices="props">
        <ScoreCircle :percentage="props.item.score_best_practices"></ScoreCircle>
      </template>      
      <template v-slot:item.score_seo="props">
        <ScoreCircle :percentage="props.item.score_seo"></ScoreCircle>
      </template>      
      <template v-slot:item.score_pwa="props">
        <ScoreCircle :percentage="props.item.score_pwa"></ScoreCircle>
      </template>
      <template v-slot:item.lcp_score="props">
        <v-chip :class="getCwvClass(props.item.lcp_score)">{{props.item.lcp_display_value === null ? '-' : props.item.lcp_display_value}}</v-chip>
      </template>
      <template v-slot:item.fid_score="props">
        <v-chip :class="getCwvClass(props.item.fid_score)">{{props.item.fid_display_value === null ? '-' : props.item.fid_display_value}}</v-chip>
      </template>
      <template v-slot:item.cls_score="props">
        <v-chip :class="getCwvClass(props.item.cls_score)">{{props.item.cls_display_value === null ? '-' : props.item.cls_display_value}}</v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        <v-icon small @click="generateReport(item)">mdi-reload-alert</v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import ScoreCircle from '~/components/ScoreCircle.vue'

export default {
  components: {
    ScoreCircle
  },

  props: {
    items: {
      type: Array,
      default: []
    }
  },

  data: function () {
    return {
      dialog: false,
      dialogDelete: false,
      headers: [
        { text: 'Name', value: 'pagename' },
        { text: 'Perform- ance', value: 'score_performance', cellClass: 'pa-2', class: 'pa-0 m-score-header', width: 61 },
        { text: 'Access- ibility', value: 'score_accessibility', cellClass: 'pa-2', class: 'pa-0 m-score-header', width: 61 },
        { text: 'Best Practices', value: 'score_best_practices', cellClass: 'pa-2', class: 'pa-0 m-score-header', width: 61 },
        { text: 'Seo', value: 'score_seo', cellClass: 'pa-2', class: 'pa-0 m-score-header', width: 61 },
        { text: 'PWA', value: 'score_pwa', cellClass: 'pa-2', class: 'pa-0 m-score-header', width: 61 },
        { text: 'LCP', value: 'lcp_score', cellClass: 'pa-2 text-center', class: 'pa-0 m-score-header', width: 61 },
        { text: 'FID', value: 'fid_score', cellClass: 'pa-2 text-center', class: 'pa-0 m-score-header', width: 61 },
        { text: 'CLS', value: 'cls_score', cellClass: 'pa-2 text-center', class: 'pa-0 m-score-header', width: 61 },
        { text: 'Actions', value: 'actions' }
      ],
      editedIndex: -1,
      editedItem: {
        id: undefined,
        url: '',
        pagename: '',
        parentId: null
      },
      defaultItem: {
        id: undefined,
        url: '',
        pagename: '',
        parentId: null
      },
      pages: JSON.parse(JSON.stringify(this.items))
    }
  },

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    
    possibleParents: function () {
      return this.items.filter((item) => {
        return item.parentId === null && item.id !== this.editedItem.id; 
      })
    }
  },
  
  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },

  // async asyncData({ $axios, $config }) {
  //   const pages = await $axios.$get(`/api/pages`);
  //   return { pages }
  // },

  methods: {

    editItem (item) {
      this.editedIndex = this.pages.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.pages.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm () {
      await this.$axios.$delete(`/api/page/${this.editedItem.id}`);
      this.pages.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    async generateReport(item) {
      await this.$axios.$get(`/api/page/${item.id}/generate-report`);
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    getCwvClass: function(score) {
      let resultClass = 'm-cwv--unknown';

      if(score === null) {
        resultClass = 'm-cwv--unknown';
      } else if(score < 0.50) {
        resultClass = 'm-cwv--fail';
      } else if(score < 0.90) {
        resultClass = 'm-cwv--average';
      } else if(score >= 0.90) {
        resultClass = 'm-cwv--pass';
      } 
      return resultClass;
    },

    getScorePercentage(score) {
      return score === null ? '-' : `${score * 100}%`;
    },

    handleClick(clickedPage, options) {
      this.$router.push({ path: `/page/${clickedPage.id}` })
    },

    async save () {      
      await this.$axios.$post(`/api/page`, {
        id: this.editedItem.id,
        url: this.editedItem.url,
        pagename: this.editedItem.pagename,
        parentId: this.editedItem.parentId
      });
      this.pages = await this.$axios.$get(`/api/pages`);

      this.close()
    },
  },

}
</script>

<style lang="scss" scope>
  $c-average:  #FFA400;
  $c-pass:  #0CCE6B;
  $c-fail:  #FF4E42;

  .m-score-header {
    padding: 0;
  }

  .m-score-header > * {
    display: flex;
    flex-direction: column;
  }

  .m-score-header span {
    text-align: center;
  }

  .m-page__name-wrapper {
    display: flex;
    flex-direction: column;
  }

  .m-page__name {
    font-size: 20px;
  }

  .m-page__url {
    max-width: 200px;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  
  .v-chip.theme--light:not(.v-chip--active) {
    color: #000000;
    font-weight: bold;

    &.m-cwv--pass {
      background: $c-pass;
      color: #ffffff;
    }

    &.m-cwv--average {
      background: $c-average;
      color: #ffffff;
    }

    &.m-cwv--fail {
      background: $c-fail;
      color: #ffffff;
    }    
  }

</style>