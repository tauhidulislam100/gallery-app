<template>
    <div class="container mx-auto py-8 px-4">
        <h1 class="text-3xl font-bold mb-8 text-center">Image Gallery</h1>

        <!-- Image Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 lg:grid-cols-4 gap-6">
            <div v-for="(image, index) in files" :key="index"
                class="cursor-pointer hover:opacity-90 transition-opacity duration-300" @click="openModal(index)">
                <img :src="`/images/${image.pathname}?w=300`"
                    class="w-[300px] h-[300px] max-w-full object-cover rounded-lg shadow-md mx-auto" />
            </div>
        </div>

        <!-- Modal -->
        <div v-if="modalOpen" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            @click="closeModal">
            <div class="max-w-4xl max-h-full relative" @click.stop>
                <button @click="closeModal"
                    class="absolute top-4 right-4 bg-white rounded-full p-2 text-black hover:bg-gray-200 transition-colors z-50">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <!-- Loading Spinner -->
                <div v-if="isLoading"
                    class="absolute inset-0 flex items-center justify-center z-10 max-h-[90vh] max-w-full">
                    <div class="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-white"></div>
                </div>

                <!-- Full-size Image -->
                <img :src="`/images/${files[currentImageIndex].pathname}`"
                    class="max-h-[90vh] max-w-full object-contain relative z-0" @load="onImageLoad"
                    :class="{ 'opacity-0': isLoading, 'opacity-100 transition-opacity duration-300': !isLoading }" />

                <!-- Navigation buttons -->
                <button @click.stop="prevImage"
                    class="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 text-black hover:bg-gray-200 transition-colors z-50">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button @click.stop="nextImage"
                    class="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 text-black hover:bg-gray-200 transition-colors z-50">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRuntimeConfig } from 'nuxt/app';
const { data: files } = await useFetch('/api/images')
const config = useRuntimeConfig();


// Modal state
const modalOpen = ref(false);
const currentImageIndex = ref(0);
const isLoading = ref(false);

// Helper function to get image URL from our API
const getImageUrl = (id, width) => {
    const baseUrl = config.public.imageBaseUrl || '/api/images';
    // Use the new resizing endpoint with 'w' parameter
    return width ? `${baseUrl}/${id}?w=${width}` : `${baseUrl}/${id}`;
};

const onImageLoad = () => {
    isLoading.value = false;
}
// Modal functions
const openModal = (index) => {
    isLoading.value = true;
    currentImageIndex.value = index;
    modalOpen.value = true;
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
};

const closeModal = () => {
    modalOpen.value = false;
    // Restore scrolling when modal is closed
    document.body.style.overflow = 'auto';
};

const nextImage = () => {
    isLoading.value = true;
    currentImageIndex.value = (currentImageIndex.value + 1) % files.value.length;
};

const prevImage = () => {
    isLoading.value = true;
    currentImageIndex.value = (currentImageIndex.value - 1 + files.value.length) % files.value.length;
};

// Keyboard navigation
onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
});

const handleKeydown = (e) => {
    if (!modalOpen.value) return;

    if (e.key === 'Escape') {
        closeModal();
    } else if (e.key === 'ArrowRight') {
        nextImage();
    } else if (e.key === 'ArrowLeft') {
        prevImage();
    }
};
</script>