<template>
  <div id="app">
    <div class="container-fluid">
        <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
  },
  created(){
      this.$store.dispatch("beforeStart")
  }
}
</script>
