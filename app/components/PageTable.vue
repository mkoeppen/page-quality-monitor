<template>
    <v-data-table
      dense
      :single-expand="false"
      :expanded.sync="expanded"
      :show-expand="!isNested"
      :headers="headers"
      :items="preparedPages"
      :items-per-page="100"
      hide-default-footer
      disable-pagination
      class="m-pages__table fill-height"
      :style="`width: 100%;${isNested ? 'background: #f8f8f8; border-radius: 0' : ''}`"
    >

      <template v-slot:top>
        <v-toolbar flat v-if="!isNested" dark>
            <v-dialog
              v-model="dialog"
              max-width="500px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="light-blue darken-4"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon class="pr-3">mdi-plus</v-icon> Add
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
                    <div class="d-flex">
                      <v-select
                        class="m-page-edit__protocol"
                        :items="['https://', 'http://']"
                        v-model="editedItem.protocol"
                        label="Protocol"
                      ></v-select>
                      <v-text-field
                        class="flex-grow-1"
                        v-model="editedItem.url"
                        @paste="onUrlPaste"
                        label="url"
                      ></v-text-field>
                    </div>
                    <v-select
                      :items="possibleParents"
                      item-text="pagename"
                      item-value="id"
                      v-model="editedItem.parentId"
                      label="Parent"
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

            <v-spacer></v-spacer>

              <v-switch dense v-model="nestedChilds" label="Show childs nested" @change="changeNestedChildSwitch"></v-switch>
              <v-switch dense v-model="showOnlyMarked" label="Show Marked Only" @change="changeShowOnlyMarkedSwitch" class="pl-10"></v-switch>
        </v-toolbar>
      </template>
            
      <template v-slot:item.pagename="props">
        <div class="m-page__name-wrapper">
          <strong class="m-page__name">{{props.item.pagename}}</strong>
          <a class="m-page__url" :href="props.item.url" target="_blank" rel="noopener noreferrer" :title="props.item.url">{{props.item.url}}</a>
        </div>
      </template>

      <template v-slot:expanded-item="{ headers, item }">
        <td class="pl-7 pr-0" :colspan="headers.length" v-if="item.children && item.children.length > 0" style="background: #d3d3d3;">
          <PageTable :pages="item.children" :isNested="true" :forceOnlyMarked="showOnlyMarked" />       
        </td>
      </template>

      <template v-slot:item.data-table-expand="{ item, isExpanded, expand }">
        <v-btn dark @click="expand(true)" v-if="item.children && item.children.length > 0 && !isExpanded"><v-icon>mdi-chevron-down</v-icon></v-btn>
        <v-btn dark @click="expand(false)" v-if="item.children && item.children.length > 0 && isExpanded"><v-icon>mdi-chevron-up</v-icon></v-btn>
      </template>

      <template v-slot:item.marked="props">
        <MarkedPageStarInput v-model="props.item.marked" :pageId="props.item.id"></MarkedPageStarInput>        
      </template>      
      <template v-slot:item.score_average="props">
        <ScoreCircle :percentage="props.item.score_average"></ScoreCircle>
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

      <template v-slot:header.lcp_score="{ header }">
        <v-flex class="m-score-header__cwv">
          {{ header.text }}
          <v-tooltip bottom :max-width="460">
            <template v-slot:activator="{ on, attrs }">
              <v-icon class="m-page__info" title="" v-bind="attrs" v-on="on">mdi-information</v-icon>
            </template>
            <h3>Largest Contentful Paint</h3>
            <p>The amount of time to render the largest content element visible in the viewport, from when the user requests the URL. The largest element is typically an image or video, or perhaps a large block-level text element. This is important because it tells the reader that the URL is actually loading.</p>
          </v-tooltip>
        </v-flex>
      </template>

      <template v-slot:header.fid_score="{ header }">
        <v-flex class="m-score-header__cwv">
          {{ header.text }}
          <v-tooltip bottom :max-width="460">
            <template v-slot:activator="{ on, attrs }">
              <v-icon class="m-page__info" title="" v-bind="attrs" v-on="on">mdi-information</v-icon>
            </template>
            <h3>First Input Delay</h3>
            <p>The time from when a user first interacts with your page (when they clicked a link, tapped on a button, and so on) to the time when the browser responds to that interaction. This measurement is taken from whatever interactive element that the user first clicks. This is important on pages where the user needs to do something, because this is when the page has become interactive.</p>
          </v-tooltip>
        </v-flex>
      </template>

      <template v-slot:header.cls_score="{ header }">
        <v-flex class="m-score-header__cwv">
          {{ header.text }}
          <v-tooltip bottom :max-width="460">
            <template v-slot:activator="{ on, attrs }">
              <v-icon class="m-page__info" title="" v-bind="attrs" v-on="on">mdi-information</v-icon>
            </template>
            <h3>Comulative Layout Shift</h3>
            <p>CLS measures the sum total of all individual layout shift scores for every unexpected layout shift that occurs during the entire lifespan of the page. The score is zero to any positive number, where zero means no shifting and the larger the number, the more layout shift on the page. This is important because having pages elements shift while a user is trying to interact with it is a bad user experience. If you can't seem to find the reason for a high value, try interacting with the page to see how that affects the score.</p>
          </v-tooltip>
        </v-flex>
      </template>

      <template v-slot:item.actions="{ item }">
        
        <v-btn dark class="teal darken-4" :href="`/page/${item.id}`" title="Report"><v-icon>mdi-clipboard-text-search</v-icon></v-btn>
        <v-btn dark class="orange darken-4" :href="`/page/${item.id}/tasks`" title="Tasks"><v-icon>mdi-format-list-checks</v-icon></v-btn>
        <v-btn dark @click="editItem(item)"><v-icon>mdi-pencil</v-icon></v-btn>
        <v-btn dark @click="deleteItem(item)"><v-icon>mdi-delete</v-icon></v-btn>
        <v-btn dark @click="generateReport(item)"><v-icon>mdi-reload-alert</v-icon></v-btn>
      </template>
    </v-data-table>
</template>

<script>
import ScoreCircle from '~/components/ScoreCircle.vue'
import MarkedPageStarInput from '~/components/MarkedPageStarInput.vue'

export default {
  name: 'page-table-component',

  components: {
    ScoreCircle,
    MarkedPageStarInput,
    PageTable: () => import('~/components/PageTable.vue')
  },

  props: {
    pages: {
      type: Array,
      default: []
    },
    isNested: {
      type: Boolean,
      default: false
    },
    forceOnlyMarked: {
      type: Boolean,
      default: false
    },
  },

  data: function () {

    let headers = [
      { text: '', value: 'marked', width: 61 },
      { text: 'Average', value: 'score_average', cellClass: 'pa-2', class: 'm-score-header', width: 80 },
      { text: 'Perform- ance', value: 'score_performance', cellClass: 'pa-2', class: 'm-score-header', width: 80 },
      { text: 'Access- ibility', value: 'score_accessibility', cellClass: 'pa-2', class: 'm-score-header', width: 80 },
      { text: 'Best Practices', value: 'score_best_practices', cellClass: 'pa-2', class: 'm-score-header', width: 80 },
      { text: 'Seo', value: 'score_seo', cellClass: 'pa-2', class: 'm-score-header', width: 80 },
      { text: 'PWA', value: 'score_pwa', cellClass: 'pa-2', class: 'm-score-header', width: 80 },
      { text: 'LCP', value: 'lcp_score', cellClass: 'pa-2 text-center', class: 'm-score-header', width: 80 },
      { text: 'FID', value: 'fid_score', cellClass: 'pa-2 text-center', class: 'm-score-header', width: 80 },
      { text: 'CLS', value: 'cls_score', cellClass: 'pa-2 text-center', class: 'm-score-header', width: 80 },
      { text: 'Name', value: 'pagename' },
      { text: 'Actions', value: 'actions', sortable: false, width: 400 },
      { text: '', value: 'data-table-expand', sortable: false, width: 100 },
    ];

    if(!this.isNested) {
      headers.unshift({ text: '', width: 30, cellClass: 'pa-0' ,sortable: false, class: 'pa-0' })
    }

    return {
      dialog: false,
      dialogDelete: false,
      nestedChilds: false,
      showOnlyMarked: this.forceOnlyMarked || false,
      expanded: [],
      headers: headers,
      editedIndex: -1,
      editedItem: {
        id: undefined,
        url: '',
        pagename: '',
        protocol: 'https://',
        parentId: null
      },
      defaultItem: {
        id: undefined,
        url: '',
        pagename: '',
        parentId: null
      },
      preparedPages: []
    }
  },

  mounted() {
    this.nestedChilds = !this.isNested && JSON.parse(localStorage.getItem('PageSetting.NestedChilds') || 'false');
    this.showOnlyMarked = JSON.parse(localStorage.getItem('PageSetting.ShowOnlyMarked') || 'false');
    this.preparedPages = this.generatePreparedPages();
  },

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    
    possibleParents: function () {
      return [{ id: null, pagename: '-' }, ...this.pages.filter((item) => {
        return item.parentId === null && item.id !== this.editedItem.id; 
      })]
    },
  },
  
  watch: {
    pages () {
      this.preparedPages = this.generatePreparedPages();
    },
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },    
    nestedChilds (val) {
      this.preparedPages = this.generatePreparedPages()
    },
    showOnlyMarked (val) {
      this.preparedPages = this.generatePreparedPages()
    },
    forceOnlyMarked (val) {
      this.showOnlyMarked = this.forceOnlyMarked;
    },
  },

  methods: {
    onUrlPaste(event) {

      event.preventDefault();
      var clipboard = event.clipboardData,
      text = clipboard.getData('Text');
      console.log(text);
      if(text.indexOf('http://') >= 0) {
        this.editedItem.protocol = 'http://';
      }
      this.editedItem.url = text.replace(/^http(s)?:\/\//, '');
    },
    changeNestedChildSwitch(e) {
      localStorage.setItem('PageSetting.NestedChilds', this.nestedChilds);
    },
    changeShowOnlyMarkedSwitch(e) {
      localStorage.setItem('PageSetting.ShowOnlyMarked', this.showOnlyMarked);
    },

    editItem (item) {
      this.editedIndex = this.preparedPages.indexOf(item);
      const clone = Object.assign({}, item);
      clone.protocol = clone.url.indexOf('http://') >= 0 ? 'http://' : 'https://';
      clone.url = clone.url.replace(/^http(s)?:\/\//, '');
      this.editedItem = clone;
      this.dialog = true;
    },

    deleteItem (item) {
      this.editedIndex = this.preparedPages.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm () {
      await this.$axios.$delete(`/api/page/${this.editedItem.id}`);
      this.preparedPages.splice(this.editedIndex, 1)
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

    async save () {      
      const savedItem = await this.$axios.$post(`/api/page`, {
        id: this.editedItem.id,
        url: this.editedItem.protocol + this.editedItem.url,
        pagename: this.editedItem.pagename,
        parentId: this.editedItem.parentId
      });
      this.preparedPages = await this.$axios.$get(`/api/pages-with-scores`);
      this.generateReport(savedItem);

      this.close()
    },

    generatePreparedPages() {

      let preparedPages = this.pages ? this.pages.slice() : [];

      console.log('prepare pages 1 ', this.isNested, preparedPages.length);

      // prepare pages
      const markedPages = JSON.parse(localStorage.getItem('markedPages') || '[]');
      preparedPages = preparedPages.map((page) => {

        // AVERAGE SCORE
        const scoreValues = [
          page.score_performance,
          page.score_accessibility,
          page.score_best_practices,
          page.score_seo,
          page.score_pwa,
        ];
        page.score_average = Math.round(scoreValues.reduce((a,b) => a + b) / scoreValues.length * 100) / 100;

        // round scores
        page.score_performance = Math.round(page.score_performance * 100) / 100;
        page.score_accessibility = Math.round(page.score_accessibility * 100) / 100;
        page.score_best_practices = Math.round(page.score_best_practices * 100) / 100;
        page.score_seo = Math.round(page.score_seo * 100) / 100;
        page.score_pwa = Math.round(page.score_pwa * 100) / 100;

        // MARKED
        page.marked = markedPages.indexOf(page.id) >= 0;

        return page;
      }).filter((page) => !this.showOnlyMarked || this.showOnlyMarked && page.marked)


      console.log('prepare pages 2 ', this.isNested, preparedPages.length);

      // created nested structure if needed
      if (this.nestedChilds) {
        preparedPages = preparedPages
          // get only level 1 pages
          .filter((page) => page.parentId === null)
          // add childs
          .map((page) => {
            page.children = preparedPages.filter((child) => child.parentId === page.id);
            return page;
          })
      } else {
        preparedPages = preparedPages         
          .map((page) => {
            page.children = [];
            return page;
          });
      }
      console.log('prepare pages 3 ', this.isNested, preparedPages.length);

      return preparedPages;
    }
  },

}
</script>

<style lang="scss" scope>
  $c-average:  #FFA400;
  $c-pass:  #0CCE6B;
  $c-fail:  #FF4E42;

  .m-pages__table {
    width: 100%;
    display: flex;
    flex-direction: column;

    .v-data-table__wrapper {
      flex-grow: 1;
      height: 100%;
    }
  }

  .m-score-header {
    padding: 4px 5px!important;
  }

  .m-score-header > * {
    display: inline-flex;
    flex-direction: column;
    max-width: calc(100% - 18px);
    justify-content: center;
    align-items: center;
  }

  .m-score-header > .m-score-header__cwv {
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .m-score-header__cwv {
    padding-left: 28px;
    padding-right: 8px;

    i {
      margin-left: 4px;
    }
  }

  .m-score-header span {
    text-align: center;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .m-page__name-wrapper {
    display: flex;
    flex-direction: column;
  }

  .m-page__name {
    font-size: 20px;
  }

  .m-page__url {
    max-width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 25rem;
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

  .v-input--switch .v-messages {
    display: none;
  }
  .v-input--switch.v-input--dense > .v-input__control > .v-input__slot {
    margin-bottom: 0;
  }

  .m-page-edit__protocol {
    width: 90px;
    flex: none;
  }

</style>