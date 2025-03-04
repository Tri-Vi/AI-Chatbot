<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-400 to-purple-600">
    <h1 class="text-4xl font-bold text-white mb-6 animate-bounce">🤖 Chat with Botly!</h1>

    <div class="chat-window w-96 h-96 bg-white p-4 rounded-lg shadow-lg overflow-y-auto space-y-2">
      <transition-group name="fade">
        <div v-for="message in messages" :key="message.id" 
          class="flex items-center gap-2 p-3 rounded-lg max-w-xs"
          :class="message.type === 'user' ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-200 text-black'">
          <p>{{ message.text }}</p>
          <span v-if="message.type === 'bot'">🤖</span>
          <span v-else>😊</span>
        </div>
      </transition-group>

      <p v-if="isTyping" class="text-gray-500 italic animate-pulse">Botly is typing...</p>
    </div>

    <input 
      type="text" 
      v-model="userInput" 
      @keyup.enter="sendMessage"
      class="w-96 p-2 mt-4 border rounded-md text-black focus:ring focus:ring-blue-300 transition-all"
      placeholder="Type your message..."
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

export default {
  setup() {
    const store = useStore();
    const userInput = ref('');
    const messages = computed(() => store.getters.allMessages);
    const isTyping = ref(false);

    const speak = (text) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1
      utterance.pitch = 1
      window.speechSynthesis.speak(utterance);
    }
    const sendMessage = async () => {
      if (userInput.value.trim() !== '') {
        store.dispatch('addMessage', { text: userInput.value, type: 'user', id: Date.now() });
        const userMessage = userInput.value;
        userInput.value = '';

        isTyping.value = true;

        try {
          const response = await axios.post("http://localhost:5000/chat", { message: userMessage });

          const botResponse = response.data.reply;
          store.dispatch('addMessage', { text: botResponse, type: 'bot', id: Date.now() });
          speak(botResponse);
        } catch (error) {
          console.error("Error getting AI response:", error);
          store.dispatch('addMessage', { text: "Oops! Something went wrong. 😞", type: 'bot', id: Date.now() });
        }

        isTyping.value = false;
      }
    };

    return { userInput, messages, sendMessage, isTyping };
  },
};
</script>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
