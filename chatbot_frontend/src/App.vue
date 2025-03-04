<!-- src/App.vue -->
<template>
  <div class="app">
    <h1 class="text-center text-3xl font-bold my-4">Welcome to the Chatbot</h1>
    <Chatbot />
  </div>
</template>

<script>
import Chatbot from './components/Chatbot.vue';

export default {
  components: {
    Chatbot,
  },
};
</script>

<style>
.app {
  padding: 20px;
}
</style>
