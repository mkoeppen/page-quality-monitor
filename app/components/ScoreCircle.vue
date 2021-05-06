<template>
  <div :class="[getScoreClass(percentage), 'm-score']">
    <svg viewBox="0 0 120 120" :class="['m-score__circle']">
      <circle class="m-score__base" r="56" cx="60" cy="60" stroke-width="8"></circle>
      <circle class="m-score__arc" r="56" cx="60" cy="60" stroke-width="8" :style="`transform: rotate(270deg); stroke-dasharray: ${ 360 * percentage }, ${ 360 };`"></circle>
    </svg>
    <span class="m-score__percentage">{{ getScorePercentage(percentage) }}</span>
  </div>
</template>

<script>
export default {

  props: {
    percentage: {
      type: Number,
      default: null
    }
  },

  methods: {
    getScoreClass: function(score) {
      let resultClass = 'm-score--unknown';

      if(score === null) {
        resultClass = 'm-score--unknown';
      } else if(score < 0.50) {
        resultClass = 'm-score--fail';
      } else if(score < 0.90) {
        resultClass = 'm-score--average';
      } else if(score >= 0.90) {
        resultClass = 'm-score--pass';
      } 
      return resultClass;
    },

    getScorePercentage(score) {
      return score === null ? '-' : `${score * 100}%`;
    },
  }

}
</script>

<style lang="scss" scope>

  $circle-size: 48px;
  $c-average:  #FFA400;
  $c-pass:  #0CCE6B;
  $c-fail:  #FF4E42;

  @keyframes load-gauge {
    from { stroke-dasharray: 0 352; }
  }

  .m-score {
    position: relative;
    width: $circle-size;
    height: $circle-size;
  }

  .m-score__percentage {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-weight: bold;

    .m-score--pass & {
      color: $c-pass;
    }

    .m-score--average & {
      color: $c-average;
    }

    .m-score--fail & {
      color: $c-fail;
    }
  }

  .m-score__circle {
    stroke-linecap: round;
    width: $circle-size;
    height: $circle-size;
  }

  .m-score__base {
    opacity: 0.1;

    .m-score--pass & {
      stroke: $c-pass;
      fill: $c-pass;
    }

    .m-score--average & {
      stroke: $c-average;
      fill: $c-average;
    }

    .m-score--fail & {
      stroke: $c-fail;
      fill: $c-fail;
    }
  }

  .m-score__arc {
    fill: none;
    transform-origin: 50% 50%;
    animation: load-gauge .3s ease forwards;
    animation-delay: 250ms;

    .m-score--pass & {
      stroke: $c-pass;
    }

    .m-score--average & {
      stroke: $c-average;
    }

    .m-score--fail & {
      stroke: $c-fail;
    }
  }

</style>