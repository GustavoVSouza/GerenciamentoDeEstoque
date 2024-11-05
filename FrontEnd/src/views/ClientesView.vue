<template>
    <main class="h-screen bg-bg-primary text-gray-800 dark:text-gray-100 p-5">
        <div>
            <h1 class="text-2xl font-semibold text-gray-100 mb-4">StockSense - Clientes</h1>

            <!-- Barra de pesquisa e botão de adicionar cliente -->
            <div class="flex justify-between items-center mb-6">
                <!-- Input de Pesquisa -->
                <div class="relative w-3/4">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <i class="fa-solid fa-magnifying-glass text-xs text-white"></i>
                    </div>
                    <input type="text" id="simple-search"
                        class="bg-bg-highlight border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Pesquisar pedidos..." required />
                </div>

                <!-- Botão de Adicionar Cliente -->
                <button @click="toggleModal"
                    class="bg-primary text-white font-medium rounded-lg text-sm px-4 py-2.5 hover:bg-green-400 transition-all focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800">
                    Adicionar Cliente
                </button>
            </div>

            <!-- Botão de Filtrar -->
            <div class="mb-4">
                <button @click="filtrarProdutos"
                    class="bg-primary hover:bg-green-400 transition-all text-white font-medium rounded-lg text-sm px-4 py-2">
                    Filtrar
                </button>
            </div>
        </div>

        <!-- Listagem de Clientes -->
        <section class="space-y-4">
            <div v-for="cliente in Clientes" :key="cliente.telefoneCliente" @click="toggleModalProduct(cliente)"
                class="bg-bg-highlight dark:bg-gray-800 border border-primary dark:border-gray-700 rounded-lg p-4 flex justify-between items-center shadow cursor-pointer transition-all hover:bg-bg-primary">
                <div class="flex gap-3 items-center">
                    <img class="w-10 h-10 rounded-full" src="../assets/img/profile-picture-5.jpg"
                        alt="Avatar do Cliente" />
                    <p class="font-bold text-white text-xl">{{ cliente.nomeCliente }}</p>
                </div>
                <span class="px-2 py-1 rounded-full bg-[#c6efce] text-[#006100]">{{ cliente.telefoneCliente }}</span>
                <p class="text-primary text-lg font-semibold">{{ cliente.emailCliente }}</p>
                <span class="text-sm text-yellow-500 bg-[#ffeb9c] p-1 px-3 rounded-2xl font-semibold">{{
                    cliente.cpfCliente }}</span>
            </div>
        </section>

        <!-- Adicionar Cliente Modal -->
        <Modal :isOpen="isModalOpen" @close="toggleModal" title="Adicionar Cliente">
            <div class="grid gap-4 mb-4 grid-cols-2">
                <div class="col-span-2">
                    <label class="block mb-2 text-sm font-medium text-white" for="file_input">Foto cliente</label>
                    <input
                        class="block w-full text-sm text-white border border-gray-300 rounded-lg cursor-pointer bg-bg-primary focus:outline-none"
                        type="file">
                </div>

                <div class="col-span-2" v-for="(value, key) in formFields" :key="key">
                    <label :for="key" class="block mb-2 text-sm font-medium text-white dark:text-white">{{
                        key.replace('Cliente', '') }}</label>
                    <input :type="key === 'emailCliente' ? 'email' : 'text'"
                        :placeholder="`Digite o ${key.replace('Cliente', '').toLowerCase()}`" v-model="formFields[key]"
                        class="bg-bg-highlight border border-gray-300 text-white text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
                </div>
            </div>

            <button class="col-span-2 bg-primary text-white font-medium rounded-lg text-sm px-4 py-2.5
                    hover:bg-green-600 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800">
                Adicionar cliente
            </button>
        </Modal>

        <!-- Editar Cliente Modal -->
        <Modal :isOpen="isModalProductOpen" @close="toggleModalProduct()" title="Editar Cliente">
            <div class="grid gap-4 mb-4 grid-cols-2">
                <div class="col-span-2" v-for="(value, key) in formFields" :key="key">
                    <label :for="key" class="block mb-2 text-sm font-medium text-white dark:text-white">{{
                        key.replace('Cliente', '') }}</label>
                    <input :type="key === 'emailCliente' ? 'email' : 'text'"
                        :placeholder="`Digite o ${key.replace('Cliente', '').toLowerCase()}`" v-model="formFields[key]"
                        class="bg-bg-highlight border border-gray-300 text-white text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
                </div>
            </div>

            <button class="col-span-2 bg-primary text-white font-medium rounded-lg text-sm px-4 py-2.5
                    hover:bg-green-600 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800">
                Atualizar cliente
            </button>
        </Modal>
    </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Modal from '@/components/Modal.vue';

export default defineComponent({
    components: { Modal },
    setup() {
        const formFields = ref<{
            nomeCliente: string;
            telefoneCliente: string;
            emailCliente: string;
            cpfCliente: string;
            enderecoCliente: string;
        }>({
            nomeCliente: '',
            telefoneCliente: '',
            emailCliente: '',
            cpfCliente: '',
            enderecoCliente: '',
        });

        const isModalOpen = ref(false);
        const isModalProductOpen = ref(false);

        const Clientes = ref([
            {
                nomeCliente: 'Cliente 1',
                telefoneCliente: '11912345678',
                emailCliente: 'cliente1@example.com',
                cpfCliente: '000.000.000-00',
                enderecoCliente: 'Rua Exemplo, 123',
            },
        ]);

        function toggleModal() {
            isModalOpen.value = !isModalOpen.value;
        }

        function toggleModalProduct(cliente = null) {
            isModalProductOpen.value = !isModalProductOpen.value;
            if (cliente) {
                for (const key in formFields.value) {
                    formFields.value[key as keyof typeof formFields.value] = cliente[key as keyof typeof cliente];
                }
            } else {
                Object.keys(formFields.value).forEach(
                    key => formFields.value[key as keyof typeof formFields.value] = ''
                );
            }
        }

        function filtrarProdutos() {
            console.log("Filtro aplicado!");
        }

        return {
            formFields,
            isModalOpen,
            isModalProductOpen,
            Clientes,
            toggleModal,
            toggleModalProduct,
            filtrarProdutos,
        };
    }
});
</script>