<script lang="ts">
    export let src: string;
    export let alt: string = src;
</script>

<img class="h-8 w-8" fill="none" stroke="currentColor" src={`${src}.svg`} {alt}/>