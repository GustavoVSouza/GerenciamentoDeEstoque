<template>
    <main class="min-h-screen bg-bg-primary text-gray-800 dark:text-gray-100 p-4 md:p-5">
        <h1 class="text-2xl font-semibold text-gray-100 mb-4">StockSense - Pedidos</h1>

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

            <!-- Botão de Adicionar Pedido -->
            <button @click="toggleModal"
                class="bg-primary text-white font-medium rounded-lg text-sm px-4 py-2.5 hover:bg-green-400 transition-all focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800">
                Adicionar Pedido
            </button>
        </div>

        <!-- Botão de Filtrar -->
        <div class="mb-4">
            <button @click="filtrarProdutos"
                class="bg-primary hover:bg-green-400 transition-all text-white font-medium rounded-lg text-sm px-4 py-2">
                Filtrar
            </button>
        </div>

        <!-- Listagem de Pedidos -->
        <section class="space-y-4">
            <div v-for="pedido in Pedidos" :key="pedido.codigoPedido" @click="toggleModalOrder(pedido)"
                :style="{ backgroundColor: getStatusBackgroundColor(pedido.statusProduto) }"
                class="pedido-card rounded-lg p-4 md:p-5 shadow transition-all cursor-pointer">

                <div class="flex flex-col md:flex-row justify-between items-start md:items-center flex-wrap gap-3 mb-3">
                    <div class="flex flex-col md:flex-row gap-2 md:gap-5 items-start md:items-center">
                        <p class="font-bold text-white text-xl md:text-2xl">{{ pedido.codigoPedido }}</p>
                        <span class="border-r-2 h-5"></span>
                        <span class="text-gray-400 text-base md:text-lg">{{ pedido.nomePedido }} / x{{ pedido.quantidade
                            }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <p class="text-lg md:text-xl font-semibold text-white">{{ formatarPreco(pedido.precoPedido) }}
                        </p>
                        <span class="badge" :class="{
                            'bg-yellow-500': pedido.statusPedido === 'Pendente',
                            'bg-primary': pedido.statusPedido === 'Pago'
                        }">
                            {{ pedido.statusPedido }}
                        </span>
                    </div>
                </div>

                <!-- Informações do Cliente -->
                <div class="flex items-center flex-wrap gap-3 text-[#6d7a7c] mb-3">
                    <img class="w-8 h-8 rounded-full" src="../assets/img/profile-picture-5.jpg"
                        alt="Avatar do Cliente" />
                    <p>{{ pedido.nomeCliente }}</p>
                    <span class="dot-separator bg-primary"></span>
                    <i class="fa-solid fa-location-dot"></i>
                    <p>{{ pedido.enderecoCliente }}</p>
                </div>

                <!-- Linha de Status do Pedido -->
                <div class="bg-[#1e2b32] p-4 rounded-lg mt-4">
                    <div class="flex flex-col md:flex-row gap-4 items-center text-white mb-3">
                        <p class="text-lg font-bold text-[#f0f0f0]">{{ pedido.statusProduto }}</p>
                        <p class="text-gray-400 text-base md:text-xl">{{ pedido.dataPedido }}</p>
                    </div>

                    <!-- Barra de Progresso -->
                    <div class="flex justify-between items-center w-full gap-2">
                        <div :class="statusIconBgColor(pedido, 'Aguardando pagamento')" class="status-icon-bg">
                            <i class="fa-solid fa-money-bill-wave text-xl"></i>
                        </div>
                        <span :class="progressBarColor(pedido, 'Aguardando envio')"
                            class="progress-step h-2 rounded-full w-1/4"></span>

                        <div :class="statusIconBgColor(pedido, 'Aguardando envio')" class="status-icon-bg">
                            <i class="fa-solid fa-box text-xl"></i>
                        </div>
                        <span :class="progressBarColor(pedido, 'Produto enviado')"
                            class="progress-step h-2 rounded-full w-1/4"></span>

                        <div :class="statusIconBgColor(pedido, 'Produto enviado')" class="status-icon-bg">
                            <i class="fa-solid fa-truck-fast text-xl"></i>
                        </div>
                        <span :class="progressBarColor(pedido, 'Produto entregue')"
                            class="progress-step h-2 rounded-full w-1/4"></span>

                        <div :class="statusIconBgColor(pedido, 'Produto entregue')" class="status-icon-bg">
                            <i class="fa-solid fa-house text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <Modal :isOpen="isModalOpen" @close="toggleModal()"
            :title="isUpdating ? 'Atualizar Pedido' : 'Adicionar Pedido'">
            <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-white">Código do Pedido</label>
                        <input type="text" v-model="codigoPedido" placeholder="Ex: PO-123"
                            class="mt-1 block w-full text-white bg-bg-primary rounded-md shadow-sm focus:ring focus:ring-blue-400 focus:border-blue-500 transition duration-200" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-white">Nome do Pedido</label>
                        <input type="text" v-model="nomePedido" placeholder="Nome do produto"
                            class="mt-1 block w-full text-white bg-bg-primary rounded-md shadow-sm focus:ring focus:ring-blue-400 focus:border-blue-500 transition duration-200" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-white">Quantidade</label>
                        <input type="number" v-model="quantidade" min="1"
                            class="mt-1 block w-full text-white bg-bg-primary rounded-md shadow-sm focus:ring focus:ring-blue-400 focus:border-blue-500 transition duration-200" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-white">Preço do Pedido</label>
                        <input type="number" v-model="precoPedido" step="0.01" placeholder="R$ 0,00"
                            class="mt-1 block w-full text-white bg-bg-primary rounded-md shadow-sm focus:ring focus:ring-blue-400 focus:border-blue-500 transition duration-200" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-white">Status do Pedido</label>
                        <input type="text" v-model="statusPedido" placeholder="Ex: Pendente"
                            class="mt-1 block w-full text-white bg-bg-primary rounded-md shadow-sm focus:ring focus:ring-blue-400 focus:border-blue-500 transition duration-200" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-white">Status do Produto</label>
                        <select v-model="statusProduto"
                            class="mt-1 block w-full text-white bg-bg-primary rounded-md shadow-sm focus:ring focus:ring-blue-400 focus:border-blue-500 transition duration-200">
                            <option value="Aguardando pagamento">Aguardando pagamento</option>
                            <option value="Aguardando envio">Aguardando envio</option>
                            <option value="Produto enviado">Produto enviado</option>
                            <option value="Produto entregue">Produto entregue</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-white">Data do Pedido</label>
                        <input type="date" v-model="dataPedido"
                            class="mt-1 block w-full text-white bg-bg-primary rounded-md shadow-sm focus:ring focus:ring-blue-400 focus:border-blue-500 transition duration-200" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-white">Nome do Cliente</label>
                        <input type="text" v-model="nomeCliente" placeholder="Nome do cliente"
                            class="mt-1 block w-full text-white bg-bg-primary rounded-md shadow-sm focus:ring focus:ring-blue-400 focus:border-blue-500 transition duration-200" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-white">Endereço do Cliente</label>
                        <input type="text" v-model="enderecoCliente" placeholder="Endereço do cliente"
                            class="mt-1 block w-full text-white bg-bg-primary rounded-md shadow-sm focus:ring focus:ring-blue-400 focus:border-blue-500 transition duration-200" />
                    </div>
                </div>
            </div>
            <template #footer>
                <button @click="salvarPedido"
                    class="bg-primary text-white font-medium rounded-lg text-sm px-4 py-2.5 hover:bg-green-600">
                    {{ isUpdating ? 'Atualizar' : 'Adicionar' }} Pedido
                </button>
            </template>
        </Modal>
    </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Modal from '@/components/Modal.vue'

export default defineComponent({
    components: {
        Modal
    },

    setup() {
        const isModalOpen = ref(false);
        const isModalorderOpen = ref(false);
        const codigoPedido = ref("");
        const nomePedido = ref("");
        const quantidade = ref(1); // Default quantity
        const precoPedido = ref(0);
        const statusPedido = ref("");
        const statusProduto = ref("");
        const dataPedido = ref("");
        const nomeCliente = ref("");
        const enderecoCliente = ref("");
        const searchValue = ref("");
        const categoriaPedidos = ref("");
        const isUpdating = ref(false); // Adicione esta linha
        const Pedidos = ref([
            {
                codigoPedido: 'PO-652',
                nomePedido: 'Caderno Repilica',
                quantidade: 50,
                precoPedido: 15000,
                statusPedido: 'Pendente',
                statusProduto: 'Aguardando pagamento',
                dataPedido: 'Julho 18, 2024',
                nomeCliente: 'Gustavo Souza',
                enderecoCliente: 'Rua Exemplo, 15'
            },
            {
                codigoPedido: 'PO-653',
                nomePedido: 'Caixa de Ferramentas',
                quantidade: 10,
                precoPedido: 350,
                statusPedido: 'Pago',
                statusProduto: 'Aguardando envio',
                dataPedido: 'Junho 11, 2021',
                nomeCliente: 'Nicole Barreto',
                enderecoCliente: 'Av. Juscelino K. de Oliveira, 3000'
            },
            {
                codigoPedido: 'PO-654',
                nomePedido: 'Caneca Stanley',
                quantidade: 150,
                precoPedido: 5000,
                statusPedido: 'Pago',
                statusProduto: 'Produto enviado',
                dataPedido: 'Novembro 04, 2024',
                nomeCliente: 'Kauan Gomes',
                enderecoCliente: 'Rua Astronauta das Ostras, 36'
            },
            {
                codigoPedido: 'PO-655',
                nomePedido: 'Copo Stanley',
                quantidade: 100,
                precoPedido: 20000,
                statusPedido: 'Pendente',
                statusProduto: 'Produto entregue',
                dataPedido: 'Novembro 26, 2024',
                nomeCliente: 'Neymar Junior',
                enderecoCliente: 'Rua Marinheiro Popay Tchu Tchuu, 15'
            },
        ]);

        function toggleModal() {
            isModalOpen.value = !isModalOpen.value;
            if (isModalOpen.value) {
                // Reset fields when opening the modal
                codigoPedido.value = "";
                nomePedido.value = "";
                quantidade.value = 1;
                precoPedido.value = 0;
                statusPedido.value = "";
                statusProduto.value = "";
                dataPedido.value = "";
                nomeCliente.value = "";
                enderecoCliente.value = "";
            }
        }

        function adicionarPedido() {
            // Aqui você pode implementar a lógica para adicionar um novo pedido ao array de Pedidos
            const novoPedido = {
                codigoPedido: codigoPedido.value,
                nomePedido: nomePedido.value,
                quantidade: quantidade.value,
                precoPedido: precoPedido.value,
                statusPedido: statusPedido.value,
                statusProduto: statusProduto.value,
                dataPedido: dataPedido.value,
                nomeCliente: nomeCliente.value,
                enderecoCliente: enderecoCliente.value
            };
            Pedidos.value.push(novoPedido);
            toggleModal(); // Fechar o modal após adicionar
        }

        function pesquisarPedidos() {
            console.log(searchValue.value);
        }

        function filtrarProdutos() {
            console.log("Filtrar produtos");
        }

        function statusIconBgColor(pedido: { statusProduto: string }, status: string) {
            const statusOrder = ['Aguardando pagamento', 'Aguardando envio', 'Produto enviado', 'Produto entregue'];
            const index = statusOrder.indexOf(status);
            const currentStatusIndex = statusOrder.indexOf(pedido.statusProduto);
            return index <= currentStatusIndex ? 'bg-green-500 text-white' : 'bg-gray-500 text-white';
        }

        function progressBarColor(pedido: { statusProduto: string }, status: string) {
            const statusOrder = ['Aguardando pagamento', 'Aguardando envio', 'Produto enviado', 'Produto entregue'];
            const currentIndex = statusOrder.indexOf(pedido.statusProduto);
            const targetIndex = statusOrder.indexOf(status);
            return currentIndex >= targetIndex ? 'bg-green-500' : 'bg-gray-500';
        }

        function getStatusBackgroundColor(status: string) {
            switch (status) {
                case 'Aguardando pagamento':
                    return '#2d1a1a'; // Cor para Aguardando pagamento
                case 'Aguardando envio':
                    return '#2b2d1a'; // Cor para Aguardando envio
                case 'Produto enviado':
                    return '#012833'; // Cor para Produto enviado
                case 'Produto entregue':
                    return '#1a2d1b'; // Cor para Produto entregue
                default:
                    return '#202e36'; // Cor padrão
            }
        }

        const toggleModalOrder = (pedido: { codigoPedido: string, nomePedido: string, quantidade: number, precoPedido: number, statusPedido: string, statusProduto: string, dataPedido: string, nomeCliente: string, enderecoCliente: string }) => {
            codigoPedido.value = pedido.codigoPedido;
            nomePedido.value = pedido.nomePedido;
            quantidade.value = pedido.quantidade;
            precoPedido.value = pedido.precoPedido;
            statusPedido.value = pedido.statusPedido;
            statusProduto.value = pedido.statusProduto;
            dataPedido.value = pedido.dataPedido;
            nomeCliente.value = pedido.nomeCliente;
            enderecoCliente.value = pedido.enderecoCliente;

            isUpdating.value = true;
            isModalOpen.value = true;
        };

        const resetForm = () => {
            codigoPedido.value = '';
            nomePedido.value = '';
            quantidade.value = 1;
            precoPedido.value = 0;
            statusPedido.value = '';
            statusProduto.value = '';
            dataPedido.value = '';
            nomeCliente.value = '';
            enderecoCliente.value = '';
        };

        function formatarPreco(valor: number) {
            return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
        }

        const salvarPedido = () => {
            if (isUpdating.value) {
                // Atualizar pedido
                // Lógica para atualizar o pedido no banco de dados
            } else {
                // Adicionar novo pedido
                // Lógica para adicionar um novo pedido no banco de dados
            }
            toggleModal();
        };


        return {
            isModalOpen,
            isModalorderOpen,
            Pedidos,
            categoriaPedidos,
            searchValue,
            codigoPedido,
            nomePedido,
            quantidade,
            precoPedido,
            statusPedido,
            statusProduto,
            dataPedido,
            nomeCliente,
            enderecoCliente,
            isUpdating,
            resetForm,
            salvarPedido,
            toggleModal,
            statusIconBgColor,
            progressBarColor,
            toggleModalOrder,
            adicionarPedido,
            pesquisarPedidos,
            filtrarProdutos,
            getStatusBackgroundColor,
            formatarPreco
        };
    }
});
</script>

<style>
.pedido-card {
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.badge {
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 0.875rem;
    color: white;
}

.dot-separator {
    height: 6px;
    width: 6px;
    border-radius: 50%;
}

.progress-step {
    transition: background-color 0.3s ease;
}

.status-icon-bg {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: background-color 0.3s ease;
}
</style>
