<template>
  <div class="loading-wrapper dark">
    <div class="loading">
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'loader',
  data: () => {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.loading-wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  &.dark {
    background-color: white;
    background-image: none;

    .loading > div {
      background-color: #29323c;
    }
  }
}
</style>
