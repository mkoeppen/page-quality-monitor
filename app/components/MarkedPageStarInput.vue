<template>
  <div class="m-marked-star">
    <input class="m-marked-star__input" type="checkbox" :id="`page_marked_${pageId}`" :checked="isChecked" @input="onInput">
    <label class="m-marked-star__label" :for="`page_marked_${pageId}`">
      <v-icon class="m-marked-star__icon m-marked-star__icon--star">mdi-star</v-icon>
      <v-icon class="m-marked-star__icon m-marked-star__icon--star-outline">mdi-star-outline</v-icon>
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
    pageId: {
      type: Number,
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
      let markedPages = JSON.parse(localStorage.getItem('markedPages') || '[]');     
      markedPages = markedPages.filter((mp) => mp !== this.pageId); 
      if(e.target.checked) {
        markedPages.push(this.pageId);
      }
      localStorage.setItem('markedPages', JSON.stringify(markedPages))

      this.$emit('input', e.target.checked);
      this.$emit('change', this.pageId, e.target.checked);
    },
  }

}
</script>

<style lang="scss" scope>

 .m-marked-star {
   font-size: 0px;
   position: relative;
   overflow: hidden;
   width: 24px;
   height: 24px;

   &:focus-within {
      box-shadow: 0 0 0 3px #dfdfdf;
    }
 }

 .m-marked-star__input {
    width: 1px;
    height: 1px;
    appearance: none;
    opacity: 0;
    position: absolute;
  }

  .m-marked-star__label {
    cursor: pointer;
  }

  .m-marked-star__icon {
    position: absolute;
    top: 0;
    left: 0;
  }

  .v-icon.m-marked-star__icon--star {
    display: none;
  }

  .m-marked-star__label:hover,
  .m-marked-star__input:checked + .m-marked-star__label {
    .m-marked-star__icon--star {
      display: flex;
    }
    .m-marked-star__icon--star-outline {
      display: none;
    }
  }

</style>