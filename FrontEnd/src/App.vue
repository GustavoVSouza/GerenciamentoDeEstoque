<template>
  <div id="app" class="flex">
    <!-- Exibe a Sidebar apenas se o usuário não estiver na rota de login -->
    <Sidebar v-if="!isLoginRoute" />
    <div class="content-container flex-1 bg-bg-primary">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from './components/NavBar.vue'; // Ajuste o caminho conforme necessário

export default defineComponent({
  components: {
    Sidebar,
  },
  setup() {
    const route = useRoute();

    const isLoginRoute = computed(() => route.path === '/'); // Verifica se é a rota de login

    return {
      isLoginRoute,
    };
  },
});
</script>

<style>
/* Adicione esta classe para ajustar o layout do conteúdo */
.content-container {
  padding-left: 5rem;
  /* Ajusta conforme necessário; w-20 (5rem) é a largura da Sidebar */
}
</style>
