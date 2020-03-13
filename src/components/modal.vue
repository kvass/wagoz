<template>
    <div class="heyOverlay"></div>
</template>

<script>
</script>

<style lang="scss" scoped>
.heyOverlay {
  position: fixed;
  width: 100%;
  height: 100%;
  visibility: hidden;
  top: 0;
  left: 0;
  z-index: 9000;
  opacity: 0;
  background: rgba(0,0,0, 0.8);
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}
.heyOverlay {
  opacity: 1;
  visibility: visible;
}
</style>
