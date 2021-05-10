<template>
    <div class="m-circle-chart">
        <div class="m-circle-chart__inner-chart">
            <strong class="m-circle-chart__inner-value">123</strong>
            <span class="m-circle-chart__inner-label">Lorem</span>
        </div>
        <PieChart class="m-circle-chart__chart-glow" :data="this.data"></PieChart>
        <PieChart class="m-circle-chart__chart" :data="this.data"></PieChart>
    </div>
</template>

<script>

import PieChart from '~/components/PieChart.vue'

export default {

  components: {
    PieChart
  },
  props: ['data', 'options'],
}
</script>

<style lang="scss" scoped>
    .m-circle-chart {
        width: 200px;
        height: 200px;
        position: relative;
        z-index: 1;
    }

    .m-circle-chart__inner-chart {
        position: absolute;
        top: 1px;
        left: 1px;
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        display: flex;
        justify-content: center;
        align-items: center;
        border: 20px solid black;
        background: #1d1d1d;
        color: white;
        border-radius: 50%;
        box-sizing: border-box;
        z-index: 2;
    }

    .m-circle-chart__chart {
        z-index: 3;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }
    .m-circle-chart__chart-glow {
        z-index: 1;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        filter: blur(10px) contrast(10);
    }
</style>