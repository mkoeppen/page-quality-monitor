<template>
  <div>
    <v-toolbar flat color="white">

      <v-dialog v-model="dialog" max-width="50%">
        

        <template v-slot:activator="{ on, attrs }">
            <v-btn
            v-bind="attrs"
            v-on="on"
            >
                <v-icon color="teal" dark>mdi-plus</v-icon>
            </v-btn>
        </template>

        <v-card>
          <v-card-title>
            <span class="headline">Add Automated Test</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.url" label="Url"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-combobox
                        v-model="editedItem.tags"
                        :items="existingTags"
                        chips
                        clearable
                        label="Tags"
                        multiple
                        solo
                    >
                        <template v-slot:selection="{ attrs, item, select, selected }">
                        <v-chip
                            v-bind="attrs"
                            :input-value="selected"
                            close
                            @click="select"
                            @click:close="removeTag(item)"
                        >
                            <strong>{{ item }}</strong>&nbsp;
                            <span>(interest)</span>
                        </v-chip>
                        </template>
                    </v-combobox>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.interval" label="Interval"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                    <v-text-field v-model="editedItem.color" hide-details class="ma-0 pa-0" solo label="Color">
                        <template v-slot:append>
                            <v-menu v-model="colorMenu" top nudge-bottom="105" nudge-left="16" :close-on-content-click="false">
                                <template v-slot:activator="{ on }">
                                    <div :style="swatchStyle" v-on="on" />
                                </template>
                                <v-card>
                                    <v-card-text class="pa-0">
                                        <v-color-picker v-model="editedItem.color" text />
                                    </v-card-text>
                                </v-card>
                            </v-menu>
                        </template>
                    </v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text v-on:click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" text v-on:click="save">Save</v-btn>
          </v-card-actions>


        </v-card>
      </v-dialog>

    </v-toolbar>

    <v-data-table :headers="headers" :items="automatedTests" class="elevation-1">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.color }}</td>
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.url }}</td>
        <td>{{ props.item.tags.join() }}</td>
        <td>{{ props.item.interval }}</td>
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
      dialog: false,
      colorMenu: false,
      colorMask: '!#XXXXXXXX',
      headers: [{
          text: '',
          value: 'color'
        },{
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },{
          text: 'Url',
          align: 'left',
          sortable: false,
          value: 'url'
        },{
          text: 'Tags',
          align: 'left',
          sortable: false,
          value: 'tags'
        },{
          text: 'Interval',
          align: 'left',
          sortable: false,
          value: 'interval'
        }
      ],
      automatedTests: [],
      existingTags: ['internal', 'external'],
      editedIndex: -1,
      editedItem: {
        name: '',
        url: '',
        tags: [],
        interval: 0,
        color: '#000000FF'
      },
      defaultItem: {
        name: '',
        url: '',
        tags: [],
        interval: 0,
        color: ''
      }
    }),

    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
      swatchStyle() {
        return {
            backgroundColor: this.editedItem.color,
            cursor: 'pointer',
            height: '30px',
            width: '30px',
            borderRadius: this.editedItem.menu ? '50%' : '4px',
            transition: 'border-radius 200ms ease-in-out'
        }
      }
    },

    watch: {
      dialog(val) {
        val || this.close()
      }
    },

    mounted() {
      this.loadAutomatedTests();
    },

    methods: {
      loadAutomatedTests() {
        this.$axios
        .get(`/api/automated-tests`)
        .then(response => {
          // TODO: fix if wrong nesting:
          this.automatedTests = response.data.data.values;
        });
      },
      removeTag(item) {
        this.editedItem.tags.splice(this.editedItem.tags.indexOf(item), 1)
        this.editedItem.tags = [...this.editedItem.tags]
      },

      editItem(item) {
        // this.editedIndex = this.automatedTests.indexOf(item)
        // this.editedItem = Object.assign({}, item)
        // this.dialog = true
      },

      deleteItem(item) {
        // const index = this.automatedTests.indexOf(item)
        // confirm('Are you sure you want to delete this item?') && this.automatedTests.splice(index, 1)
      },

      close() {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      async save() {
        this.$axios
        .post(`/api/automated-tests/create`, this.editedItem)
        .then(response => {       
          this.$nextTick(() => {
            this.loadAutomatedTests();
          })   
          console.log(response);
        });
        
        // if (this.editedIndex > -1) {
        //   await automatedTestService.update(this.editedIndex, this.editedItem);
        // } else {
        //   await automatedTestService.create(this.editedItem);
          
        //   const result = await model.insertNewAutomatedTest(body);
        //   console.log(result);
        // }
        this.close()
      }
    }
  }

</script>
