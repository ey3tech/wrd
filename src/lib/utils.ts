const digits = "0123456789";
const ascii_uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ascii_lowercase = "abcdefghijklmnopqrstuvwxyz";
const basic_punctuation = "!@#$%^&*()_+ "; // numbers above the keyboard + space
const punctuation = `!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~`;
const complex_punctuation = punctuation
	.split("")
	.filter((char) => !basic_punctuation.includes(char))
	.join("");

export const one_day = 60 * 60 * 24;

export function randomChoice<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

function calculatePoolSize(password: string) {
	let pool_size = 0;
	const chars = password.split("");
	if (chars.some((char) => digits.includes(char))) pool_size += digits.length;
	if (chars.some((char) => ascii_uppercase.includes(char)))
		pool_size += ascii_uppercase.length;
	if (chars.some((char) => ascii_lowercase.includes(char)))
		pool_size += ascii_lowercase.length;
	if (chars.some((char) => basic_punctuation.includes(char)))
		pool_size += basic_punctuation.length;
	if (chars.some((char) => complex_punctuation.includes(char)))
		pool_size += complex_punctuation.length;
	return pool_size;
}
export function calculateEntropy(password: string) {
	if (password.length === 0) return 0; // entropy is 0 if there's no password

	const pool_size = calculatePoolSize(password);

	return password.length * Math.log2(pool_size);
}

export function calculateStrength(password: string) {
	// calculate the strength of a password based on entropy
	// the strength is a number between 0 and 1, where 0 is weak and 1 is strong
	const entropy = calculateEntropy(password);
	const ideal_entropy = 128; // maximum entropy for a password

	// account for other factors
	const poolSize = calculatePoolSize(password);
	const lengthFactor = Math.min(password.length / 10, 1); // consider longer passwords stronger
	const complexityFactor = Math.min(
		(new Set(password.split("")).size / (password.length || 1)) * 2.5,
		1,
	); // consider passwords with more character variety stronger

	return Math.min(
		(entropy * lengthFactor * complexityFactor) / ideal_entropy,
		1,
	);

	// return Math.min(entropy / max_entropy, 1);
	// return Math.min(entropy / max_entropy, 1);
}

export function intWord(num: number) {
	// convert a given float to a shorter version, containing a unit
	// e.g. 1000 -> 1 thousand

	// units
	const units = [
		"",
		"thousand",
		"million",
		"billion",
		"trillion",
		"quadrillion",
		"quintillion",
		"sextillion",
		"septillion",
		"octillion",
		"nonillion",
		"decillion",
		"undecillion",
		"duodecillion",
		"tredecillion",
		"quattuordecillion",
		"quindecillion",
		"sexdecillion",
		"septendecillion",
		"octodecillion",
		"novemdecillion",
		"vigintillion",
	];

	// get the number of digits
	const digits = Math.floor(Math.log10(num));

	// get the unit
	const unit = Math.floor(digits / 3);

	// get the number
	const number = num / 10 ** (unit * 3);

	return unit < units.length ? `${Math.round(number)} ${units[unit]}` : "???";
}

export function humanizeDuration(seconds: number) {
	// convert a given number of seconds to an imprecise human-readable string

	const millenia = Math.round(seconds / (3600 * 24 * 365 * 1000));
	const years = Math.round(seconds / (3600 * 24 * 365));
	const days = Math.round(seconds / (3600 * 24));
	const hours = Math.round((seconds % (3600 * 24)) / 3600);
	const minutes = Math.round((seconds % 3600) / 60);
	const secs = Math.round(seconds % 60);

	if (years > 0) {
		const yearString = intWord(years);
		return yearString !== "???" ? `${yearString} years` : "an eternity";
	}
	if (days > 0) {
		return `${days} days`;
	}
	if (hours > 0) {
		return `${hours} hours`;
	}
	if (minutes > 0) {
		return `${minutes} minutes`;
	}
	if (secs > 0) {
		return `${secs} seconds`;
	}
	return "an instant";
}
