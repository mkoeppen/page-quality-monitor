<template>
  <div class="m-checked-task">
    <input class="m-checked-task__input" type="checkbox" :id="`task_checked_${taskId}`" :checked="isChecked" @input="onInput">
    <label class="m-checked-task__label" :for="`task_checked_${taskId}`">
      <v-icon class="m-checked-task__icon m-checked-task__icon--checked">mdi-check-circle</v-icon>
      <v-icon class="m-checked-task__icon m-checked-task__icon--unchecked">mdi-checkbox-blank-circle-outline</v-icon>
    </label>
  </div>
</template>

<script>
export default {

  props: {
    value: {
      type: Boolean | Number,
      default: false
    },
    taskId: {
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
        id:  this.taskId,
        checked: e.target.checked
      });
    },
  }

}
</script>

<style lang="scss" scope>

 .m-checked-task {
   font-size: 0px;
   position: relative;
   overflow: hidden;
   width: 24px;
   height: 24px;

   &:focus-within {
      box-shadow: 0 0 0 3px #dfdfdf;
    }
 }

 .m-checked-task__input {
    width: 1px;
    height: 1px;
    appearance: none;
    opacity: 0;
    position: absolute;
  }

  .m-checked-task__label {
    cursor: pointer;
  }

  .m-checked-task__icon {
    position: absolute;
    top: 0;
    left: 0;
  }

  .v-icon.m-checked-task__icon--checked {
    display: none;
  }

  .m-checked-task__input + .m-checked-task__label:hover,
  .m-checked-task__input:checked + .m-checked-task__label {
    .m-checked-task__icon--checked {
      display: flex;
    }
    .m-checked-task__icon--unchecked {
      display: none;
    }
  }

  .m-checked-task__input:checked + .m-checked-task__label {
    .m-checked-task__icon--checked {
      color: rgb(245, 190, 10);
    }
  }

</style>