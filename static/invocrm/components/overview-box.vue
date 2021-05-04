<template>
    <div class="overview" :style="{backgroundColor: overview.color, width: width + '%'}">
        <div class="row jc-sb">
            <div class="overview-number">{{overview.sum}}</div>
            <div>
                <i  class="pi overview-icon" :class="overview.icon"></i>
            </div>
        </div>
        <div class="overview-status">
            {{overview.status}}
        </div>
    </div>
</template>


<script>
module.exports = {
  methods: {},
  components: {},
  computed: {},
  props: ["overview", "width"],
  data: function () {
    return {
    };
  },
  name: "overviewBox"
};
</script>
<style>
    .overview{
        color: #fff;
        padding: 16px;
        color: #ffffff;
        border-radius: 3px;
        box-shadow: 0 1px 3px rgb(0 0 0 / 12%);
        min-width: 90px;
        margin-bottom: 20px;
    }
    .overview-icon{
        font-size: 32px;
    opacity: 0.7;
    }
    .overview-number {
        margin-bottom: 12px;
        font-size: 18px;
        font-weight: 600;
    }

    .overview-status {
        margin-left: -16px;
        border-left: 3px solid #ffffff73;
        padding-left: 13px;
}
</style>