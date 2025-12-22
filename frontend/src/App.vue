<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
/* Reset CSS Global */
body {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #0b0b2c; /* Ini warna background biru tua */
  color: #ffffff;
}

#app {
  min-height: 100vh;
}
</style>