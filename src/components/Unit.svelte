<script lang="ts">
    export let unit: string;
    export let value: number | string;
</script>

<div class="flex flex-col justify-center items-center my-3 font-sans">
    <span class="text-4xl text-blue font-bold ">{value}</span>
    <span class="text-white">{unit}</span>
</div>