<template>
  <div class="m-checked-todo">
    <input class="m-checked-todo__input" type="checkbox" :id="`todo_checked_${todoId}`" :checked="isChecked" @input="onInput">
    <label class="m-checked-todo__label" :for="`todo_checked_${todoId}`">
      <v-icon class="m-checked-todo__icon m-checked-todo__icon--checked">mdi-check-circle</v-icon>
      <v-icon class="m-checked-todo__icon m-checked-todo__icon--unchecked">mdi-checkbox-blank-circle-outline</v-icon>
    </label>
  </div>
</template>

<script>
export default {

  props: {
    value: {
      type: Boolean,
      default: false
    },
    todoId: {
      type: String,
      default: null
    }
  },

  data: function() {
    return {
      isChecked: this.value
    }
  },

  methods: {
    onInput(e) {
      this.$emit('input', e.target.checked);
      this.$emit('change', {
        id:  this.todoId,
        checked: e.target.checked
      });
    },
  }

}
</script>

<style lang="scss" scope>

 .m-checked-todo {
   font-size: 0px;
   position: relative;
   overflow: hidden;
   width: 24px;
   height: 24px;

   &:focus-within {
      box-shadow: 0 0 0 3px #dfdfdf;
    }
 }

 .m-checked-todo__input {
    width: 1px;
    height: 1px;
    appearance: none;
    opacity: 0;
    position: absolute;
  }

  .m-checked-todo__label {
    cursor: pointer;
  }

  .m-checked-todo__icon {
    position: absolute;
    top: 0;
    left: 0;
  }

  .v-icon.m-checked-todo__icon--checked {
    display: none;
  }

  .m-checked-todo__input + .m-checked-todo__label:hover,
  .m-checked-todo__input:checked + .m-checked-todo__label {
    .m-checked-todo__icon--checked {
      display: flex;
    }
    .m-checked-todo__icon--unchecked {
      display: none;
    }
  }

  .m-checked-todo__input:checked + .m-checked-todo__label {
    .m-checked-todo__icon--checked {
      color: rgb(245, 190, 10);
    }
  }

</style>