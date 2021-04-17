<template>
  <div>
    <h1>Pages</h1>
    <v-data-table
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
                    v-model="editedItem.pageId"
                    label="pageId"
                  ></v-text-field>
                  <v-text-field
                    v-model="editedItem.pagename"
                    label="Name"
                  ></v-text-field>
                  <v-color-picker
                    v-model="editedItem.color"
                    dot-size="25"
                  ></v-color-picker>
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
      <template v-slot:item.color="{ item }">
        <span class="m-page__color" :style="`background-color: #${item.color}`"></span>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {

  props: {
    items: {
      type: Array,
      default: null
    }
  },

  data: function () {
    return {
      dialog: false,
      dialogDelete: false,
      headers: [
        { text: 'pageId', value: 'pageId' },
        { text: 'Name', value: 'pagename' },
        { text: 'Color', value: 'color' },
        { text: 'Actions', value: 'actions' }
      ],
      editedIndex: -1,
      editedItem: {
        id: undefined,
        pageId: 0,
        pagename: '',
        color: '000000',
      },
      defaultItem: {
        id: undefined,
        pageId: 0,
        pagename: '',
        color: '000000',
      },
      pages: JSON.parse(JSON.stringify(this.items))
    }
  },

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
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

    async save () {      
      const savedId = await this.$axios.$post(`/api/page`, {
        id: this.editedItem.id,
        pageId: this.editedItem.pageId,
        pagename: this.editedItem.pagename,
        color: this.editedItem.color.toString().match(/#[a-zA-Z0-9]{8}/) ? this.editedItem.color.toString().substr(1, 6) : this.editedItem.color,
      });
      this.pages = await this.$axios.$get(`/api/pages`);

      this.close()
    },
  },

}
</script>

<style>

  .m-page__color {
    width: 24px;
    height: 24px;
    display: inline-block;
  }

</style>