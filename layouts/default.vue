<script setup lang="ts">
    useHead({
        title: 'EventPlanner MiniApp',
        script: [{ src: 'https://telegram.org/js/telegram-web-app.js', defer: true }],
    })
</script>

<template>
    <main>
        <ClientOnly>
            <slot />
        </ClientOnly>
    </main>
</template>