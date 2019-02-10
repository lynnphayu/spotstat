<template>
  <div class="content">
    <p v-for="track in data.data" v-if="data.selected">{{track.name}}</p>
  </div>
</template>

<script>
export default {

  name: 'list',
  props: ['data']
}
</script>
<style>
</style>
