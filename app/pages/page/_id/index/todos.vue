<template>
  <v-container fluid>

    <v-data-table
      dense
      :single-expand="false"
      :expanded.sync="expanded"
      :show-expand="true"
      :headers="headers"
      :items="todos"
      class="m-todos__table"
    >

      

      <template v-slot:item.data-table-expand="{ item, isExpanded, expand }">
        <v-btn @click="expand(true)" v-if="item.howto">Expand</v-btn>
        <v-btn @click="expand(false)" v-if="item.howto">close</v-btn>
      </template>

      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <code>{{item.howto}}</code>
        </td>
      </template>

      <template v-slot:item.priority="props">
        <span :class="`m-todos__priority-cell m-todos__priority-cell--${(props.item.priority||'low').toLowerCase()}`" :title="props.item.priority"></span>
      </template>
      <template v-slot:item.title="props">
        <div class="m-todo__title-wrapper">
          <strong class="m-todo__title">{{props.item.title}}</strong>
          <ul class="m-todos__tags">
            <li v-for="(tag, index) in props.item.tags" :key="index" class="m-todos__tag">{{tag}}</li>
          </ul>
        </div>
        <p class="m-todo__description">{{props.item.description}}</p>
      </template>

    </v-data-table>

  </v-container>
</template>

<script>
export default {

  data: function () {
    return {
      expanded: [],
      headers: [
        { text: '', value: 'priority', cellClass: 'pa-0', width: 10 },
        { text: '', value: 'checked' },
        { text: 'Todo', value: 'title' },
        { text: '', value: 'data-table-expand' },
      ],
    }
  },

 async asyncData({ $axios, $config, route }) {
    const { id } = route.params
    const todoDefinitions = await $axios.$get(`/api/todo-list/${id}`);

    let todos = [];

    for (const [todoId, todo] of Object.entries(todoDefinitions)) {
      todo.id = todoId;
      todos.push(todo);
    }
    
    return {
      todos
    }
  }
}
</script>

<style lang="scss" scoped>
  .m-todos__priority-cell {
    width: 10px;
    height: 100%;
    display: flex;
    background: gray;

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

  .m-todos__tags {
    display: flex;
    flex-wrap: wrap;
    padding: 4px 0;
    margin: 0;
    list-style-type: none;
  }

  .m-todos__tag {
    background: purple;
    padding: 4px 8px;
    font-size: 10px;
    color: white;
    border-radius: 4px;
    font-weight: bold;
    letter-spacing: 1px;
    margin-right: 4px;
  }

  .m-todo__title-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .m-todo__title {
    font-size: 20px;
  }
</style>