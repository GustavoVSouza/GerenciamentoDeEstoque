import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000'
});

// ----------------------------- Usuários ----------------------------- //
export const criarUsuario = (usuario: { nome: string, email: string, senha: string }) => api.post('/usuarios', usuario);
export const atualizarUsuario = (id: number, usuario: { nome: string, email: string, senha: string, nomeAntigo: string }) => api.put(`/usuarios/${id}`, usuario);
export const deletarUsuario = (id: number) => api.delete(`/usuarios/${id}`);
export const loginUsuario = (usuario: { email: string, senha: string }) => api.post('/usuarios/login', usuario);

// ----------------------------- Produtos ----------------------------- //
export const criarProduto = (produto: { nome: string, descricao: string, preco: number, quantidade: number }) => api.post('/produtos', produto);
export const buscarProdutos = () => api.get('/produtos');
export const deletarProduto = (id: number) => api.delete(`/produtos/${id}`);

// ----------------------------- Pedidos ----------------------------- //
export const criarPedido = (pedido: { usuario_id: number, produto_id: number, quantidade: number, status: string }) => api.post('/pedidos', pedido);
export const buscarPedidos = () => api.get('/pedidos');
export const deletarPedido = (id: number) => api.delete(`/pedidos/${id}`);

// ----------------------------- Estoque ----------------------------- //
export const adicionarAoEstoque = (produto_id: number, quantidade: number) => api.post('/estoque', { produto_id, quantidade });
export const buscarEstoque = (id: number) => api.get(`/estoque/${id}`);
export const deletarProdutoEstoque = (id: number) => api.delete(`/estoque/${id}`);

export default api;
