// uno.config.ts
import {
	defineConfig,
	presetAttributify,
	presetIcons,
	presetTypography,
	presetUno,
	transformerDirectives,
	transformerVariantGroup,
} from "unocss";

export default defineConfig({
	shortcuts: [
		{
			fullscreen:
				"w-screen h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900 m-0",
		},
		{
			input:
				"border-2 b-op-20 text-lg border-style-solid border-neutral-200 rounded-lg w-full p-2 px-4 bg-op-0 bg-black backdrop-blur-sm focus:bg-op-25 bg-white text-white active:scale-97 transition-100 font-sans",
		},
		{ "flex-br": "md:flex-basis-full h-0" },
	],
	theme: {
		colors: {
			// ...
		},
	},
	rules: [
		["font-sans", {'font-family': 'Clash Display, sans-serif'}],
	],
	presets: [
		presetUno(),
		presetAttributify(),
		presetIcons(),
		presetTypography(),
	],
	transformers: [transformerDirectives(), transformerVariantGroup()],
});
