<template>
  <v-container fluid class="pa-0">

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

    <v-data-table
      dense
      :single-expand="false"
      :expanded.sync="expanded"
      :show-expand="true"
      :headers="headers"
      :items="tasks"
      class="m-tasks__table"
    >
      <template v-slot:item.data-table-expand="{ item, isExpanded, expand }">
        <v-btn dark @click="expand(true)" v-if="item.howto && !isExpanded"><v-icon>mdi-chevron-down</v-icon></v-btn>
        <v-btn dark @click="expand(false)" v-if="item.howto && isExpanded"><v-icon>mdi-chevron-up</v-icon></v-btn>
      </template>

      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <code>{{item.howto}}</code>
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
      expanded: [],
      headers: [
        { text: '', value: 'priority', cellClass: 'pa-0', class: 'pa-0', width: 24 },
        { text: '', value: 'checked' },
        { text: 'Task', value: 'title' },
        { text: '', value: 'data-table-expand' },
      ],
    }
  },

 async asyncData({ $axios, $config, route }) {
    const { id } = route.params
    const taskDefinitions = await $axios.$get(`/api/task-list/${id}`);
    const tasksOverwrite = await $axios.$get(`/api/task-list-overwrites/${id}`) || [];

    console.log('tasksOverwrite', tasksOverwrite);
    let tasks = [];

    for (const [taskId, task] of Object.entries(taskDefinitions)) {
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
      pageId: id
    }
  },

  methods: {
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
</style>