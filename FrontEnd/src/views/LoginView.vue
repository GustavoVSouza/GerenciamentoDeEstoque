<template>
  <main class="flex items-center justify-center min-h-screen bg-bg-primary">
    <div class="bg-bg-highlight p-8 rounded-lg shadow-lg w-96">
      <h1 class="text-2xl font-semibold mb-6 text-center text-white">StockSense</h1>
      <input v-model="usuario.email" type="email" placeholder="Email" required
        class="block w-full p-3 mb-4 rounded bg-bg-primary text-white" />
      <div class="relative mb-4">
        <input v-model="usuario.senha" :type="senhaVisivel ? 'text' : 'password'" placeholder="Senha" required
          class="block w-full p-3 border-bg-primary rounded focus:outline-none focus:ring focus:ring-blue-300 bg-bg-primary text-white" />
        <button @click="toggleSenhaVisivel" type="button"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary">
          <span v-if="senhaVisivel">
            <i class="fas fa-eye-slash"></i> <!-- Ícone de olho fechado -->
          </span>
          <span v-else>
            <i class="fas fa-eye"></i> <!-- Ícone de olho aberto -->
          </span>
        </button>
      </div>
      <button @click="fazerLogin"
        class="w-full p-3 bg-bg-primary text-white rounded hover:bg-primary transition duration-200">
        Login
      </button>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router'; // Importando useRouter
import { loginUsuario } from '../../api';

interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha: string;
}

export default defineComponent({
  setup() {
    const usuario = ref<Usuario>({
      nome: '',
      email: '',
      senha: '',
    });

    const senhaVisivel = ref(false);
    const router = useRouter(); // Usando useRouter para acessar o roteador

    function toggleSenhaVisivel() {
      senhaVisivel.value = !senhaVisivel.value;
    }

    async function fazerLogin() {
      try {
        const response = await loginUsuario(usuario.value);
        if (response.status === 200) {
          router.push('/home'); // Usando router para redirecionar
        }
      } catch (error) {
        console.error('Erro no login:', error);
      }
    }

    return {
      usuario,
      senhaVisivel,
      toggleSenhaVisivel,
      fazerLogin,
    };
  },
});
</script>
