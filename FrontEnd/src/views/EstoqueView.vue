<template>
    <main class="h-screen bg-bg-primary text-gray-800 dark:text-gray-100 p-5">
        <div class="">
            <h1 class="text-2xl font-semibold text-gray-100 mb-4">StockSense - Produtos</h1>
            <div class="flex justify-between flex-wrap gap-5 items-center mb-4">
                <!-- Input de Pesquisa -->
                <div class="relative w-3/4">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <i class="fa-solid fa-magnifying-glass text-xs text-white"></i>
                    </div>
                    <input type="text" id="simple-search"
                        class="bg-bg-highlight border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Pesquisar pedidos..." required />
                </div>
                <!-- Botão de Adicionar Produto -->
                <button @click="toggleModal"
                    class="bg-primary text-white font-medium rounded-lg text-sm px-4 py-2.5 hover:bg-green-400 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all">
                    Adicionar Produto
                </button>
            </div>

            <!-- Botão de Filtrar -->
            <div class="mb-4 ">
                <button @click="filtrarProdutos"
                    class="bg-primary text-white font-medium rounded-lg text-sm px-4 py-2 hover:bg-green-400 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all">
                    Filtrar
                </button>
            </div>
        </div>

        <!-- Listagem de Produtos -->
        <section class="space-y-4">
            <div v-for="produto in produtos" :key="produto.codigoProduto" @click="toggleModalProduct(produto)"
                class="bg-bg-highlight dark:bg-gray-800 border border-primary dark:border-gray-700 rounded-lg p-5 flex flex-col lg:flex-row lg:items-center gap-4 shadow-md cursor-pointer hover:shadow-lg transition-shadow">

                <div class="flex items-center gap-3 lg:w-1/3">
                    <div class="bg-primary p-3 px-4 rounded-full flex items-center justify-center">
                        <i class="fa-solid fa-box text-white text-lg"></i>
                    </div>
                    <div>
                        <p class="font-semibold text-white text-lg">{{ produto.nomeProduto }}</p>
                        <span class="text-sm text-gray-400">{{ produto.codigoProduto }}</span>
                    </div>
                </div>

                <div class="flex items-center justify-between flex-wrap lg:w-2/3 gap-4">
                    <span class="px-3 py-1 rounded-full bg-[#c6efce] text-[#006100] text-sm font-semibold">
                        {{ produto.categoria }}
                    </span>
                    <p class="text-primary font-bold text-xl">R$ {{ produto.valorProduto.toFixed(2) }}</p>
                    <span :class="{
                        'text-sm font-semibold rounded-2xl p-1 px-3': true,
                        'bg-[#adff9c] text-green-500': produto.status === 'Disponível',
                        'bg-[#acc2ff] text-blue-700': produto.status === 'Aguardando pagamento',
                        'bg-[#f1ecd1] text-yellow-500': produto.status === 'Aguardando envio',
                        'bg-[#e3d1f1] text-pink-600': produto.status === 'Produto enviado',
                        'bg-[#d7f8f8] text-primary': produto.status === 'Produto entregue'
                    }">
                        {{ produto.status }}
                    </span>
                </div>
            </div>
        </section>


        <!-- Adicionar Produto Modal -->
        <Modal :isOpen="isModalOpen" @close="toggleModal" title="Adicionar produto">
            <div class="grid gap-4 mb-4 grid-cols-2">
                <!-- Input para nome do produto -->
                <div class="col-span-2">
                    <label for="name" class="block mb-2 text-sm font-medium text-white dark:text-white">Nome</label>
                    <input type="text" placeholder="Nome do Produto" v-model="nomeProduto"
                        class="bg-bg-highlight border border-gray-300 text-white text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
                </div>

                <!-- Input para adicionar nova categoria -->
                <div class="col-span-2">
                    <label for="category" class="block mb-2 text-sm font-medium text-white dark:text-white">Adicionar
                        Categoria</label>
                    <input type="text" placeholder="Digite uma categoria e pressione Enter" v-model="novaCategoria"
                        @keyup.enter="adicionarCategoriaTemporaria"
                        class="bg-bg-highlight border border-gray-300 text-white text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
                </div>

                <!-- Listagem de categorias temporárias -->
                <div class="col-span-2">
                    <p class="mb-2 text-sm font-medium text-white dark:text-white">Categorias Adicionadas</p>
                    <div class="flex flex-wrap gap-2">
                        <span v-for="(categoria, index) in categoriasTemporarias" :key="index"
                            class="px-3 py-1 rounded-full bg-blue-600 text-white text-sm font-semibold cursor-pointer"
                            @click="removerCategoriaTemporaria(index)">
                            {{ categoria }}
                            <i class="fa-solid fa-times ml-1"></i>
                        </span>
                    </div>
                </div>

                <!-- Outros campos do formulário -->
                <div class="col-span-2">
                    <label for="name" class="block mb-2 text-sm font-medium text-white dark:text-white">Código</label>
                    <input type="text" placeholder="Código de armazenagem:" v-model="codigoProduto"
                        class="bg-bg-highlight border border-gray-300 text-white text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
                </div>

                <!-- Botão para salvar o produto e categorias -->
                <button @click="salvarProduto" class="col-span-2 bg-primary text-white font-medium rounded-lg text-sm px-4 py-2.5
                    hover:bg-green-600 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800">
                    Salvar Produto
                </button>
            </div>
        </Modal>

        <!-- Editar Produto Modal -->
        <Modal :isOpen="isModalProductOpen" @close="resetEditForm" title="Editar produto">
            <div class="grid gap-4 mb-4 grid-cols-2">
                <div class="col-span-2">
                    <label for="name" class="block mb-2 text-sm font-medium text-white dark:text-white">Nome</label>
                    <input type="text" placeholder="Nome do Produto" v-model="nomeProduto"
                        class="bg-bg-highlight border border-gray-300 text-white text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
                </div>

                <div class="col-span-2">
                    <label for="category"
                        class="block mb-2 text-sm font-medium text-white dark:text-white">Categoria</label>
                    <input type="text" placeholder="Digite uma categoria e pressione Enter" v-model="novaCategoria"
                        @keyup.enter="adicionarCategoriaTemporaria"
                        class="bg-bg-highlight border border-gray-300 text-white text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />

                    <div class="flex flex-wrap gap-2 mt-2">
                        <span v-for="(categoria, index) in categoriasTemporarias" :key="index"
                            class="px-3 py-1 bg-primary text-white text-sm rounded-full flex items-center gap-2">
                            {{ categoria }}
                            <button @click="removerCategoriaTemporaria(index)" class="text-red-500 ml-1">
                                <i class="fa-solid fa-times"></i>
                            </button>
                        </span>
                    </div>
                </div>

                <div class="col-span-2">
                    <label for="name" class="block mb-2 text-sm font-medium text-white dark:text-white">Código</label>
                    <input type="text" placeholder="Código de armazenagem:" v-model="codigoProduto"
                        class="bg-bg-highlight border border-gray-300 text-white text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
                </div>

                <div class="col-span-2 flex gap-2 align-middle justify-center">
                    <div class="w-1/2">
                        <label for="price"
                            class="block mb-2 text-sm font-medium text-white dark:text-white">Unidades:</label>
                        <input type="number" placeholder="Unidades:" v-model="unidadesProduto"
                            class="bg-bg-highlight border border-gray-300 text-white text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
                    </div>
                    <div class="w-1/2">
                        <label for="price" class="block mb-2 text-sm font-medium text-white dark:text-white">Preço por
                            unidade:</label>
                        <input type="number" id="price" placeholder="R$" v-model="valorProduto"
                            class="bg-bg-highlight border border-gray-300 text-white text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
                    </div>
                </div>

                <!-- Botão para atualizar o produto -->
                <button @click="atualizarProduto" class="col-span-2 bg-primary text-white font-medium rounded-lg text-sm px-4 py-2.5
                    hover:bg-green-600 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800">
                    Atualizar Produto
                </button>
            </div>
        </Modal>



    </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Modal from '@/components/Modal.vue';

export default defineComponent({
    components: { Modal },
    setup() {
        const isModalProductOpen = ref(false);
        const isModalOpen = ref(false);
        const nomeProduto = ref("");
        const codigoProduto = ref("");
        const unidadesProduto = ref(0);
        const valorProduto = ref(0);
        const searchValue = ref("");
        const novaCategoria = ref("");
        const categoriasTemporarias = ref<string[]>([]);
        const categoriaProduto = ref("");
        const categoriaTemporaria = ref("");
        const produtos = ref([
            { nomeProduto: 'Caderno Repilica', codigoProduto: 'A132F5', unidadesProduto: 30, valorProduto: 12.5, categoria: 'Papelaria', status: 'Aguardando pagamento' },
            // Outros produtos
        ]);

        function toggleModal() {
            isModalOpen.value = !isModalOpen.value;
        }

        function toggleModalProduct(product: { nomeProduto: string, codigoProduto: string, unidadesProduto: number, valorProduto: number }) {
            nomeProduto.value = product.nomeProduto
            codigoProduto.value = product.codigoProduto
            unidadesProduto.value = product.unidadesProduto
            valorProduto.value = product.valorProduto
            isModalProductOpen.value = !isModalProductOpen.value;
        }

        function pesquisarProduto() {
            console.log(searchValue.value);
        }

        function filtrarProdutos() {
            console.log("Filtrar produtos");
            // Implementação do filtro de produtos
        }

        function adicionarCategoriaTemporaria() {
            console.log("Tentando adicionar categoria:", novaCategoria.value);
            if (novaCategoria.value.trim() !== "" && !categoriasTemporarias.value.includes(novaCategoria.value.trim())) {
                categoriasTemporarias.value.push(novaCategoria.value.trim());
                novaCategoria.value = ""; // Limpar o campo após adicionar
            } else {
                alert("Categoria já existe ou está vazia");
            }
        }



        function removerCategoriaTemporaria(index: number) {
            categoriasTemporarias.value.splice(index, 1);
        }

        function salvarProduto() {
            const novoProduto = {
                nomeProduto: nomeProduto.value,
                codigoProduto: codigoProduto.value,
                categoria: categoriasTemporarias.value.join(', '), // Salvar as categorias
                status: 'Aguardando Pagamento', // Pode-se definir conforme necessário
                unidadesProduto: unidadesProduto.value, // Adicione isso
                valorProduto: valorProduto.value,       // E isso
            };
            produtos.value.push(novoProduto);
            toggleModal(); // Fechar modal após salvar
            resetForm();
        }


        function resetForm() {
            nomeProduto.value = "";
            codigoProduto.value = "";
            novaCategoria.value = "";
            categoriasTemporarias.value = [];
        }

        function resetEditForm() {
            nomeProduto.value = "";
            codigoProduto.value = "";
            unidadesProduto.value = 0;
            valorProduto.value = 0;
            categoriasTemporarias.value = [];
            isModalProductOpen.value = false; // Fechar o modal após reset
        }

        function atualizarProduto() {
            const produtoIndex = produtos.value.findIndex(produto => produto.codigoProduto === codigoProduto.value);
            if (produtoIndex !== -1) {
                produtos.value[produtoIndex] = {
                    nomeProduto: nomeProduto.value,
                    codigoProduto: codigoProduto.value,
                    unidadesProduto: unidadesProduto.value,
                    valorProduto: valorProduto.value,
                    categoria: categoriasTemporarias.value.join(', '), // Atualizar a categoria
                    status: 'Aguardando Pagamento', // Ou qualquer status que você quiser definir
                };
                resetEditForm(); // Resetar o formulário e fechar o modal
            }
        }



        return {
            isModalOpen,
            isModalProductOpen,
            produtos,
            searchValue,
            nomeProduto,
            codigoProduto,
            unidadesProduto,
            valorProduto,
            novaCategoria,
            categoriasTemporarias,
            categoriaProduto,
            categoriaTemporaria,
            adicionarCategoriaTemporaria,
            removerCategoriaTemporaria,
            toggleModal,
            toggleModalProduct,
            filtrarProdutos,
            pesquisarProduto,
            salvarProduto,
            atualizarProduto,
            resetEditForm
        };
    },
});
</script>