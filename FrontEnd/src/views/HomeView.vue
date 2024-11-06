<template>
    <main class="h-100% bg-bg-primary p-5 text-text-primary">
        <nav>
            <span class="text-3xl font-bold">Synthex</span>
        </nav>
        <div class="mt-10 flex flex-col gap-5">
            <div class="flex gap-4 primeiraSessao">
                <section class="bg-bg-highlight w-full xl:w-1/2 p-6 rounded-lg shadow-md">
                    <h2 class="text-2xl font-semibold mb-4">Status de Pedidos</h2>
                    <div class="flex flex-wrap gap-4">
                        <div class="flex-1 border border-primary rounded-2xl p-5 flex items-center">
                            <i class="fa-solid fa-money-check-dollar border rounded-full p-4 text-primary"></i>
                            <div class="ml-4">
                                <span class="font-medium text-lg">Aguardando Pagamento</span>
                                <div class="text-4xl font-bold">{{ aguardandoPagamento }}</div>
                                <p v-if="aguardandoPagamento === 0" class="text-sm text-gray-500">Nenhum pedido
                                    aguardando pagamento</p>
                            </div>
                        </div>

                        <div class="flex-1 border rounded-2xl p-5 flex items-center border-primary">
                            <i class="fa-solid fa-truck border rounded-full p-4 text-primary"></i>
                            <div class="ml-4">
                                <span class="font-medium text-lg">Aguardando Envio</span>
                                <div class="text-4xl font-bold">{{ aguardandoEnvio }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-5 flex-1 border border-primary rounded-2xl p-6 items-center text-center">
                        <h3 class="font-semibold mb-4 text-start text-2xl">Resumo dos Pedidos</h3>
                        <div class="flex justify-between items-center mb-3">
                            <div class="flex flex-col">
                                <span class="text-xl font-medium">Enviado:</span>
                                <span class="text-5xl font-bold">{{ produtoEnviado }}</span>
                            </div>
                            <div class="flex flex-col">
                                <span class="text-xl font-medium">Entregue:</span>
                                <span class="text-5xl font-bold">{{ produtoEntregue }}</span>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="bg-bg-highlight w-full xl:w-1/2 p-6 rounded-lg shadow-md">
                    <h2 class="text-2xl font-semibold mb-4">Resultado Atual</h2>
                    <canvas id="resultadoAtualChart" class="my-0 mx-auto"></canvas>
                </section>
            </div>
            <!-- ANALISAR UTILIZAÇÃO DESSA PARTE, TALVEZ SUBSTITUIR POR ALGO MAIS ÚTIL -->
            <section class="p-6 bg-bg-highlight rounded-lg shadow-md">
                <h2 class="text-2xl font-semibold mb-4">Armazenamento</h2>
                <div class="flex flex-col gap-4">
                    <div class="flex justify-between text-lg">
                        <span>Armazenamento Total:</span>
                        <span>1000</span>
                    </div>
                    <div class="relative w-full h-6 bg-bg-primary rounded-full">
                        <div class="absolute h-full bg-primary rounded-full" style="width: 80%;"></div>
                    </div>
                    <div class="flex justify-between text-lg">
                        <span>Armazenamento em Uso:</span>
                        <span>800</span>
                    </div>
                    <div class="relative w-full h-6 bg-bg-primary rounded-full">
                        <div class="absolute h-full bg-primary rounded-full" style="width: 15%;"></div>
                        <!-- 15% para armazenamento livre -->
                    </div>
                    <div class="flex justify-between text-lg">
                        <span>Armazenamento disponível:</span>
                        <span>200</span>
                    </div>
                    <div class="relative w-full h-6 bg-bg-primary rounded-full">
                        <div class="absolute h-full bg-primary rounded-full" style="width: 5%;"></div>
                        <!-- 5% para armazenamento disponível -->
                    </div>
                </div>
            </section>
        </div>
    </main>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { buscarProdutos } from "../../api";
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ChartDataLabels);


export default defineComponent({
    setup() {
        const aguardandoPagamento = ref(0);
        const aguardandoEnvio = ref(0);
        const produtoEnviado = ref(0);
        const produtoEntregue = ref(0);

        // Dados do gráfico de pizza
        const dadosGrafico = ref({
            gastosEstoque: 0,
            lucroEstoque: 0,
            quantidadeEstoque: 0,
            aguardandoPagamento: 0
        });

        let chartInstance: Chart<"pie", number[], string> | null = null;

        function configurarGrafico() {
            const ctx = document.getElementById('resultadoAtualChart') as HTMLCanvasElement;
            if (chartInstance) {
                chartInstance.destroy();
            }
            chartInstance = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Gastos com Estoque', 'Lucro do Estoque', 'Quantidade em Estoque', 'Aguardando Pagamento'], // Adicionado 'Aguardando Pagamento'
                    datasets: [{
                        data: [
                            dadosGrafico.value.gastosEstoque,
                            dadosGrafico.value.lucroEstoque,
                            dadosGrafico.value.quantidadeEstoque,
                            dadosGrafico.value.aguardandoPagamento // Certifique-se de que o valor correto está aqui
                        ],
                        backgroundColor: ['#f74044', '#39db7d', '#eed15a', '#3B82F6'],
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    const label = context.label || '';
                                    const value = context.raw || 0; // Asegure-se de que o valor é um número
                                    return `${label}: R$ ${value ? value.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}`;
                                }
                            }
                        }
                        ,
                        datalabels: {
                            formatter: (value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                            color: '#ffffff',
                            font: {
                                weight: 'bold'
                            }
                        }
                    }
                }
            });
        }

        async function verificaStatusPedidos() {
            try {
                let response = await buscarProdutos();
                let listaProdutos = response.data;

                aguardandoPagamento.value = 0
                aguardandoEnvio.value = 0
                produtoEnviado.value = 0
                produtoEntregue.value = 0

                for (let produto of listaProdutos) {
                    if (produto.status == "Aguardando pagamento") {
                        aguardandoPagamento.value++;
                    } else if (produto.status == "Aguardando envio") {
                        aguardandoEnvio.value++;
                    } else if (produto.status == "Produto enviado") {
                        produtoEnviado.value++;
                    } else if (produto.status == "Produto entregue") {
                        produtoEntregue.value++;
                    }
                }
            } catch (error) {
                console.error('Erro:', error);
            }
        }

        // TODO: VERIFICAR COMO FAZER OS CALCULOS CORRETAMENTE, SEPARAR AS FUNÇÕES
        async function resultadoAtualTotal() {
            try {
                let response = await buscarProdutos();
                let listaProdutos = response.data;

                dadosGrafico.value.gastosEstoque = 0
                dadosGrafico.value.lucroEstoque = 0
                dadosGrafico.value.quantidadeEstoque = 0
                dadosGrafico.value.aguardandoPagamento = 0

                for (let produto of listaProdutos) {
                    dadosGrafico.value.gastosEstoque += Number(produto.preco_compra);
                    if (produto.status != "Disponível") {
                        dadosGrafico.value.lucroEstoque += Number(produto.preco_venda);
                    }
                    if (produto.status == "Disponível") {
                        dadosGrafico.value.quantidadeEstoque += Number(produto.preco_compra);
                    }
                    if (produto.status == "Aguardando pagamento") {
                        dadosGrafico.value.aguardandoPagamento += Number(produto.preco_venda);
                    }
                }
                configurarGrafico();
            } catch (error) {
                console.error('Erro:', error);
            }
        }


        onMounted(() => {
            resultadoAtualTotal();
            configurarGrafico();
            verificaStatusPedidos();

            setInterval(() => {
                verificaStatusPedidos();
                resultadoAtualTotal();
            }, 60000);

        });

        return { aguardandoPagamento, aguardandoEnvio, produtoEnviado, produtoEntregue, buscarProdutos };
    }
});
</script>


<style scoped>
/* Estilos para o gráfico de pizza e responsividade */
#resultadoAtualChart {
    min-width: 350px;
    min-height: 350px;

    max-width: 350px;
    max-height: 350px;
}

.bar-container {
    width: 100%;
    background-color: #e0e0e0;
    border-radius: 8px;
    margin: 10px 0;
    position: relative;
}

.bar {
    width: 100%;
    border-radius: 8px 8px 0 0;
    position: relative;
}

.bar-label {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-weight: bold;
    padding: 5px;
}

@media (max-width: 910px) {
    .primeiraSessao {
        flex-wrap: wrap;
    }
}
</style>