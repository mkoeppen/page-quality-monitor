<template>
  <div>
    <h1>Pages</h1>
    <v-data-table
      :headers="headers"
      :items="pages"
      class="m-pages__table"
      @click:row="handleClick"
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
      
      <template v-slot:item.lcp_score="props">
        <span>{{props.item.lcp_display_value}}</span>
      </template>
      <template v-slot:item.fid_score="props">
        <span>{{props.item.fid_display_value}}</span>
      </template>
      <template v-slot:item.cls_score="props">
        <span>{{props.item.cls_display_value}}</span>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {

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
        { text: 'Url', value: 'url' },
        { text: 'Parent', value: 'parentId' },
        { text: 'Performance', value: 'score_performance' },
        { text: 'Accessibility', value: 'score_accessibility' },
        { text: 'Best Practices', value: 'score_best_practices' },
        { text: 'Seo', value: 'score_seo' },
        { text: 'PWA', value: 'score_pwa' },
        { text: 'LCP', value: 'lcp_score' },
        { text: 'FID', value: 'fid_score' },
        { text: 'CLS', value: 'cls_score' },
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

    handleClick(clickedPage) {
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

<style>

</style>