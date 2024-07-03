<script lang="ts">
import { writable } from "svelte/store";
import { fade } from "svelte/transition";
import { onMount } from "svelte";
import {
	calculateEntropy,
	intWord,
	humanizeDuration,
	calculateStrength,
	randomChoice,
} from "$lib/utils";
import Unit from "../components/Unit.svelte";
import EyeOpen from "../svg/EyeOpen.svelte";
import EyeClosed from "../svg/EyeClosed.svelte";
import Footer from "../components/Footer.svelte";
import { positiveText, negativeText } from "$lib/data.json";
import FuzzySet from "fuzzyset";

// biome-ignore lint/style/useConst: it's needed for bindings
let password = "";

// biome-ignore lint/style/useConst: it's needed for bindings
let showPassword = false;

const passwordStrength = writable(0);
const passwordEntropy = writable(0);
const crackTime = writable("an instant");
const message = writable("");
const guesses_per_second = 800_000_000_000;

let wordlist: FuzzySet | null = null;
onMount(() => {
    if (wordlist) return;
	fetch("/wordlist.txt")
		.then((response) => response.text())
		.then((text) => {
			wordlist = FuzzySet(text.split("\n"));
		});
});

$: passwordEntropy.set(calculateEntropy(password));

$: passwordStrength.set(calculateStrength(password) * 100);

$: possibilities = Math.ceil(2 ** $passwordEntropy)
$: crackTime.set(humanizeDuration((Math.ceil(2 ** $passwordEntropy) / guesses_per_second) * ($passwordStrength/100)));

$: if (password.length > 50) {
	message.set("are you even going to remember this??");
} else if (new Set(password.split("")).size < password.length * 0.75) {
	message.set("try adding more diverse characters to your password");
} else if (wordlist?.get(password, null, 0.65)) {
	message.set("your password is a common one, try something else");
} else {
	if (password.length === 0) {
		message.set("enter a password");
	} else {
		message.set(
			randomChoice($passwordStrength > 60 ? positiveText : negativeText),
		);
	}
}
</script>

<section
    class="fullscreen relative bg-cover text-white"
    style="background-image: url('bg.svg')"
>
    <h1 class="text-6xl my-0 font-sans">oh wrd?</h1>
    {#key $message}
        <p
            class="text-lg font-sans w-2/3 text-center"
            in:fade={{ duration: 300 }}
        >
            {$message}
        </p>
    {/key}
    <div class="flex flex-row flex-gap-2 w-1/2">
        {#if showPassword}
            <input
                bind:value={password}
                placeholder="enter your password"
                class="input"
            />
        {:else}
            <input
                type="password"
                bind:value={password}
                placeholder="enter your password"
                class="input"
            />
        {/if}
        <button
            on:click={() => (showPassword = !showPassword)}
            class="text-md b-2 b-transparent b-solid min-w-12 h-12 rounded-lg p-2 bg-op-0 hover:backdrop-blur-sm hover:bg-op-25 bg-white hover:b-neutral-300 transition-100 color-white active:scale-90"
            aria-label="toggle password visibility"
            >{#if showPassword}
                <EyeOpen />
            {:else}
                <EyeClosed />{/if}</button
        >
    </div>
    <meter
        value={$passwordStrength}
        max="100"
        class="w-1/2"
        low="40"
        high="75"
        optimum="100"
    ></meter>
    <div
        class="flex flex-row flex-wrap items-center justify-center flex-gap-x-10 mt-10 md:mt-0 md:absolute md:bottom-16 bg-[#002233] rounded-2xl p-5 md:px-0 w-3/4"
    >
        <Unit
            unit={`${password.length < 25 ? "characters" : "characters??"}`}
            value={password.length}
        />
        <Unit
            unit="bits of raw entropy"
            value={`~${$passwordEntropy.toFixed(1)}`}
        />
        <Unit unit="crack time" value={$crackTime} />
        <div class="md:flex-br" />
        <Unit unit="possibilities" value={intWord(possibilities)} />
        <Unit unit="strength" value={`${Math.round($passwordStrength)}%`} />
    </div>
    <Footer />
</section>
