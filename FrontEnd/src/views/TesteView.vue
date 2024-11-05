<template>
    <main>
        <h1 class="text-black">Criar Usuário</h1>
        <form @submit.prevent="criarUsuario">
            <div>
                <label for="nome">Nome:</label>
                <input type="text" v-model="usuario.nome" required />
            </div>
            <div>
                <label for="email">Email:</label>
                <input type="email" v-model="usuario.email" required />
            </div>
            <div>
                <label for="senha">Senha:</label>
                <input type="password" v-model="usuario.senha" required />
            </div>
            <button type="submit">Criar Usuário</button>
        </form>

        <p v-if="mensagem" :class="{ 'success': sucesso, 'error': !sucesso }">{{ mensagem }}</p>
    </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { criarUsuario } from '../../api';

export default defineComponent({
    setup() {
        const usuario = ref({
            nome: '',
            email: '',
            senha: ''
        });

        const mensagem = ref('');
        const sucesso = ref(true);

        const criarUsuarioHandler = async () => {
            try {
                await criarUsuario(usuario.value);
                mensagem.value = 'Usuário criado com sucesso!';
                sucesso.value = true;
                // Limpar os campos após criar o usuário
                usuario.value.nome = '';
                usuario.value.email = '';
                usuario.value.senha = '';
            } catch (error) {
                mensagem.value = 'Erro ao criar usuário.';
                sucesso.value = false;
            }
        };

        return {
            usuario,
            mensagem,
            sucesso,
            criarUsuario: criarUsuarioHandler
        };
    },
});
</script>

<style scoped>
.success {
    color: green;
}

.error {
    color: red;
}
</style>
