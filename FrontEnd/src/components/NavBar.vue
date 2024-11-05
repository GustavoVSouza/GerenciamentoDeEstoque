<template>
    <div
        class="fixed left-0 top-0 h-screen bg-bg-highlight shadow-lg w-20 flex flex-col justify-between transition-all duration-300 ease-in-out hover:shadow-xl">
        <div class="flex flex-col items-center mt-8 space-y-6">
            <!-- Logo -->
            <span class="text-3xl text-blue-600">
                <i class="text-text-primary fas fa-gem"></i>
            </span>
            <span class="h-1 w-1 rounded-full bg-primary"></span>

            <!-- Links de navegação com tooltips -->
            <router-link to="/home"
                class="nav-item flex flex-col items-center transition-colors duration-200 hover:text-blue-600">
                <i class="text-text-primary fas fa-home text-xl"></i>
                <span class="tooltip">Home</span>
            </router-link>

            <router-link to="/estoque"
                class="nav-item flex flex-col items-center transition-colors duration-200 hover:text-blue-600">
                <i class="text-text-primary fas fa-box text-xl"></i>
                <span class="tooltip">Estoque</span>
            </router-link>

            <router-link to="/clientes"
                class="nav-item flex flex-col items-center transition-colors duration-200 hover:text-blue-600">
                <i class="text-text-primary fas fa-users "></i>
                <span class="tooltip">Clientes</span>
            </router-link>

            <router-link to="/pedidos"
                class="nav-item flex flex-col items-center transition-colors duration-200 hover:text-blue-600">
                <i class="fa-solid fa-box text-text-primary text-xl"></i>
                <span class="tooltip">Pedidos</span>
            </router-link>
        </div>

        <button @click="handleLogout"
            class="mb-8 flex flex-col items-center text-gray-500 transition-colors duration-200 hover:text-red-600">
            <i class="text-text-primary fas fa-sign-out-alt text-xl"></i>
            <span class="tooltip">Logout</span>
            <span class="mt-1 text-xs text-text-primary">Logout</span>
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
    setup() {
        const router = useRouter();

        const handleLogout = () => {
            localStorage.removeItem('userToken');
            router.push('/');
        };

        return {
            handleLogout,
        };
    },
});
</script>

<style scoped>
.nav-item {
    position: relative;
    transition: transform 0.2s ease;
}

.nav-item:hover {
    transform: scale(1.1);
}

/* Estilo do tooltip */
.tooltip {
    position: absolute;
    bottom: -1.5rem;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
    visibility: hidden;
}

/* Mostrar o tooltip ao passar o mouse */
.nav-item:hover .tooltip {
    opacity: 1;
    visibility: visible;
}
</style>
