<template>
  <v-container fluid class="pa-0 mt-10">

    <v-dialog v-model="priorityChange" max-width="500px">
      <v-card v-if="priorityChangeTaskItem">
        <p>Change task priority for this project.</p>
        <v-radio-group
          v-model="priorityChangeTaskItem.priority"
          column
          @change="savePriorityChange"
        >
          <v-radio
            label="high"
            color="high"
            value="high"
          ></v-radio>
          <v-radio
            label="medium"
            color="medium"
            value="medium"
          ></v-radio>
          <v-radio
            label="low"
            color="low"
            value="low"
          ></v-radio>
          <v-radio
            label="ignore"
            color="ignore"
            value="ignore"
          ></v-radio>
        </v-radio-group>
      </v-card>
    </v-dialog>

    <div class="m-task-group" v-for="(category, categoryIndex) in categories" :key="categoryIndex">

      <h2 class="m-task-group__headline">{{category.name}}</h2>

      <v-data-table
        dense
        :single-expand="false"
        :expanded.sync="category.expanded"
        :custom-sort="customSort"
        :sort-by="['priority']"
        :sort-desc="true"
        :show-expand="true"
        :headers="headers"
        :items="tasks.filter((t) => t.category === categoryIndex)"
        :item-class= "rowClasses" 
        hide-default-footer
        disable-pagination
        class="m-tasks__table"
      >
        <template v-slot:item.data-table-expand="{ item, isExpanded, expand }">
          <v-btn dark @click="expand(true)" v-if="item.html && !isExpanded"><v-icon>mdi-chevron-down</v-icon></v-btn>
          <v-btn dark @click="expand(false)" v-if="item.html && isExpanded"><v-icon>mdi-chevron-up</v-icon></v-btn>
        </template>

        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <pre v-if="item.html && item.html.length > 0">{{ item.html.join('\n') }}</pre>
          </td>
        </template>

        <template v-slot:item.priority="props">        
          <span 
            :class="`m-tasks__priority-cell m-tasks__priority-cell--${(props.item.priority||'low').toLowerCase()}`" 
            :title="props.item.priority" 
            @click="openPriorityDialog(props.item)"
            dark
          >
            <v-icon class="m-tasks__priority-cell-icon" dark>mdi-pencil</v-icon>
          </span>
        </template>

        <template v-slot:item.checked="props">
          <CheckedTaskInput v-model="props.item.checked" :taskId="props.item.id" @change="onChecked"></CheckedTaskInput>
        </template>

        <template v-slot:item.title="props">
          <div class="m-task__title-wrapper">
            <strong class="m-task__title">{{props.item.title}}</strong>
            <ul class="m-tasks__tags">
              <li v-for="(tag, index) in props.item.tags" :key="index" class="m-tasks__tag">{{tag}}</li>
            </ul>
          </div>
          <p class="m-task__description">{{props.item.description}}</p>
        </template>

      </v-data-table>
    </div>

    

  </v-container>
</template>

<script>
import CheckedTaskInput from '~/components/CheckedTaskInput.vue'

export default {

  components: {
    CheckedTaskInput
  },

  data: function () {
    return {
      priorityChange: false,
      priorityChangeTaskItem: null,
      priorityChangeTaskPriority: null,
      headers: [
        { text: '', value: 'priority', cellClass: 'pa-0', class: 'pa-0', width: 24 },
        { text: '', value: 'checked', width: 56 },
        { text: 'Task', value: 'title' },
        { text: '', value: 'data-table-expand', width: 100 },
      ],
    }
  },

 async asyncData({ $axios, $config, route }) {
    const { id } = route.params;
    let taskDefinitions;
    let tasksOverwrite
    try {
      taskDefinitions = await $axios.$get(`/api/task-list/${id}`);
    } catch(e) {
      taskDefinitions = {
        tasks: []
      };
    }
    try {
      tasksOverwrite = await $axios.$get(`/api/task-list-overwrites/${id}`) || [];
    } catch (error) {
      tasksOverwrite = [];
    }

    let tasks = [];

    for (const [taskId, task] of Object.entries(taskDefinitions.tasks)) {
      const overwrite = tasksOverwrite.find((to) => to.task_id === taskId) || {};
      task.id = taskId;
      task.checked = overwrite.checked || false;
      if(overwrite.priority) {
        task.priority = overwrite.priority;
      }
      tasks.push(task);
    }
    
    return {
      tasks,
      categories: taskDefinitions.categories,
      pageId: id
    }
  },

  methods: {
    customSort(items, index, isDesc) {
      items.sort((a, b) => {
        if (index[0] === "priority") {
          const aPriority = a.priority.toLowerCase() === 'high' ? 3 : (a.priority.toLowerCase() === 'medium' ? 2 : 1);
          const bPriority = b.priority.toLowerCase() === 'high' ? 3 : (b.priority.toLowerCase() === 'medium' ? 2 : 1);
          if (!isDesc[0]) {
            return aPriority < bPriority ? -1 : 1;
          } else {
            return bPriority < aPriority ? -1 : 1;
          }
        } else {
          if (!isDesc[0]) {
            return a[index[0]] < b[index[0]] ? -1 : 1;
          } else {
            return b[index[0]] < a[index[0]] ? -1 : 1;
          }
        }
      });
      return items;
    },
    rowClasses(item) {
      let classList = `m-tasks--${item.priority.toLowerCase()}`;
        if (item.checked) {
          classList = `m-task--checked ${classList}`;
        }
        return classList;
    },
    openPriorityDialog(item) {
      this.priorityChangeTaskItem = item;
      this.priorityChange = true;
    },
    async savePriorityChange() {
      await this.$axios.$post(`/api/page/${this.pageId}/change-task-priority/${this.priorityChangeTaskItem.id}/${this.priorityChangeTaskItem.priority}`);
      this.priorityChange = false;
      this.priorityChangeTaskItem = null;
    },
    async onChecked(data) {
      const url = data.checked ? `/api/page/${this.pageId}/check-task/${data.id}` : `/api/page/${this.pageId}/uncheck-task/${data.id}`;
      await this.$axios.$post(url);
    }
  },
}
</script>

<style lang="scss">
  .v-icon.m-tasks__priority-cell-icon {
    display: none;
    font-size: 18px;
    margin: auto;
  }
  .m-tasks__priority-cell {
    width: 12px;
    height: 100%;
    display: flex;
    background: gray;

    .v-icon.m-tasks__priority-cell-icon {
      display: none;
    }

    &:hover {
      cursor: pointer;
      width: 24px;

      .v-icon.m-tasks__priority-cell-icon {
        display: inline-flex;
      }
    }

    &--high {
      background: red;
    }

    &--medium {
      background: orange;
    }

    &--low {
      background: green;
    }
  }

  .m-tasks {
    &--high:not(.m-task--checked) {
      background: #ffe3e3;
    }
    &--medium:not(.m-task--checked) {
      background: rgb(255, 240, 212);
    }
    &--low:not(.m-task--checked) {
      background: rgb(218, 255, 218);
    }
  }

  .theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
    box-shadow: inset 0 -200px 0 0 rgba(204, 204, 204, .26);
    &.m-tasks--high:not(.m-task--checked) {
      background: #ffe3e3;
    }
    &.m-tasks--medium:not(.m-task--checked) {
      background: rgb(255, 240, 212);
    }
    &.m-tasks--low:not(.m-task--checked) {
      background: rgb(218, 255, 218);
    }
  }

  .m-task__title-wrapper {
    margin-top: 8px;
  }

  .v-application p.m-task__description {
    margin-bottom: 8px;
    max-width: 1060px;
  }

  .m-tasks__table tbody td {
    min-height: 70px;
  }

  .m-tasks__tags {
    display: flex;
    flex-wrap: wrap;
    padding: 4px 0;
    margin: 0;
    list-style-type: none;
  }

  .m-tasks__tag {
    background: purple;
    padding: 4px 8px;
    font-size: 10px;
    color: white;
    border-radius: 4px;
    font-weight: bold;
    letter-spacing: 1px;
    margin-right: 4px;
  }

  .m-task__title-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .m-task__title {
    font-size: 20px;
  }

  .m-task-group {
    margin-bottom: 60px;
  }

  .m-task-group__headline {
    font-size: 50px;
    color: #ff9800;
  }

  .v-data-table > .v-data-table__wrapper tbody tr.v-data-table__expanded__content {
    box-shadow: none;

    pre {   
      padding: 50px 30px;
    }

    td {
      background: #f3f3f3;
      border-left: 1px solid #e5e5e5;
      border-right: 1px solid #e5e5e5;
    }
  }
</style>