<template>
  <section>
    <div class="title d-flex justify-content-start">
      <i class="fa fa-user-plus" aria-hidden="true"></i>
      <div :class="{pd9: pd9}">
        <h4>Проверка физического лица</h4>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Top',
  props: [
    'title',
    'pd9'
  ]
}
</script>

<style lang="scss" scoped>
.title {
  color: #fff;
  font-weight: 700;
  background-color: #293fcc;
  margin: 0px;
  padding: 15px 15px;
  .pd9 {
    height: 100%;
    padding: 9px 0px;
  }
  i {
    font-size: 54px;
  }
  h4 {
    margin-left: 24px;
  }
}
</style>