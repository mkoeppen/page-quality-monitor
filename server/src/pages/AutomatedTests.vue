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

        <v-btn color="primary" @click="addDummy">Dummy Test</v-btn>

    </v-toolbar>

    <v-data-table :headers="headers" :items="desserts" class="elevation-1">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.name }}</td>
        <td class="text-xs-right">{{ props.item.calories }}</td>
        <td class="text-xs-right">{{ props.item.fat }}</td>
        <td class="text-xs-right">{{ props.item.carbs }}</td>
        <td class="text-xs-right">{{ props.item.protein }}</td>
        <td class="justify-center layout px-0">
          <v-icon small class="mr-2" @click="editItem(props.item)">
            edit
          </v-icon>
          <v-icon small @click="deleteItem(props.item)">
            delete
          </v-icon>
        </td>
      </template>
      <template slot="no-data">
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
    const automatedTestService = require('../services/automatedTestsService');
    var elasticsearch = require('elasticsearch');

  export default {
    data: () => ({
      dialog: false,
      colorMenu: false,
      colorMask: '!#XXXXXXXX',
      headers: [{
          text: 'Dessert (100g serving)',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        {
          text: 'Calories',
          value: 'calories'
        },
        {
          text: 'Fat (g)',
          value: 'fat'
        },
        {
          text: 'Carbs (g)',
          value: 'carbs'
        },
        {
          text: 'Protein (g)',
          value: 'protein'
        },
        {
          text: 'Actions',
          value: 'name',
          sortable: false
        }
      ],
      desserts: [],
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

    created() {
      this.initialize()
    },

    methods: {
      initialize() {
        this.desserts = [{
            name: 'Frozen Yogurt',
            calories: 159,
            fat: 6.0,
            carbs: 24,
            protein: 4.0
          },
          {
            name: 'Ice cream sandwich',
            calories: 237,
            fat: 9.0,
            carbs: 37,
            protein: 4.3
          },
          {
            name: 'Eclair',
            calories: 262,
            fat: 16.0,
            carbs: 23,
            protein: 6.0
          },
          {
            name: 'Cupcake',
            calories: 305,
            fat: 3.7,
            carbs: 67,
            protein: 4.3
          },
          {
            name: 'Gingerbread',
            calories: 356,
            fat: 16.0,
            carbs: 49,
            protein: 3.9
          },
          {
            name: 'Jelly bean',
            calories: 375,
            fat: 0.0,
            carbs: 94,
            protein: 0.0
          },
          {
            name: 'Lollipop',
            calories: 392,
            fat: 0.2,
            carbs: 98,
            protein: 0
          },
          {
            name: 'Honeycomb',
            calories: 408,
            fat: 3.2,
            carbs: 87,
            protein: 6.5
          },
          {
            name: 'Donut',
            calories: 452,
            fat: 25.0,
            carbs: 51,
            protein: 4.9
          },
          {
            name: 'KitKat',
            calories: 518,
            fat: 26.0,
            carbs: 65,
            protein: 7
          }
        ]
      },

      removeTag(item) {
        this.editedItem.tags.splice(this.editedItem.tags.indexOf(item), 1)
        this.editedItem.tags = [...this.editedItem.tags]
      },

      editItem(item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem(item) {
        const index = this.desserts.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
      },

      close() {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      async addDummy() {
          const id = new Date().getTime();
        //   const result = await automatedTestService.create({
        //     name: `Test Project ${id}`,
        //     url: `url.de?t=${id}`,
        //     tags: `tag_${id}`,
        //     interval: 30000,
        //     color: '#00FF00FF'
        // });


        var client = new elasticsearch.Client({
            host: 'http://localhost:16662/',
            log: 'info'
        });
        const result = await client.index({
            index: 'automated_tests',
            body: {
              name: `Test Project ${id}`,
              url: `url.de?t=${id}`,
              tags: `tag_${id}`,
              interval: 30000,
              color: '#00FF00FF'
          }
        });
        console.log(result);
      },

      async save() {
        
        if (this.editedIndex > -1) {
          await automatedTestService.update(this.editedIndex, this.editedItem);
        } else {
          await automatedTestService.create(this.editedItem);
        }
        this.close()
      }
    }
  }

</script>
