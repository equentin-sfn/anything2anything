export type Category =
	| "length"
	| "mass"
	| "volume"
	| "temperature"
	| "time"
	| "area"
	| "speed"
	| "data"
	| "energy";

export interface Unit {
	id: string;
	name: string;
	symbol: string;
	category: Category;
	/** Ratio to base unit. For temperature, this is unused — handled by formula. */
	toBase: number;
	playful?: boolean;
}

// ─── Length (base: metre) ────────────────────────────────────────────────────

const length: Unit[] = [
	{ id: "mm", name: "Millimetres", symbol: "mm", category: "length", toBase: 0.001 },
	{ id: "cm", name: "Centimetres", symbol: "cm", category: "length", toBase: 0.01 },
	{ id: "m", name: "Metres", symbol: "m", category: "length", toBase: 1 },
	{ id: "km", name: "Kilometres", symbol: "km", category: "length", toBase: 1000 },
	{ id: "in", name: "Inches", symbol: "in", category: "length", toBase: 0.0254 },
	{ id: "ft", name: "Feet", symbol: "ft", category: "length", toBase: 0.3048 },
	{ id: "yd", name: "Yards", symbol: "yd", category: "length", toBase: 0.9144 },
	{ id: "mi", name: "Miles", symbol: "mi", category: "length", toBase: 1609.344 },
	{ id: "nmi", name: "Nautical miles", symbol: "nmi", category: "length", toBase: 1852 },
	// Playful
	{ id: "bus", name: "Double-decker buses", symbol: "buses", category: "length", toBase: 12.2, playful: true },
	{ id: "football-pitch", name: "Football pitches", symbol: "pitches", category: "length", toBase: 105, playful: true },
	{ id: "moon-distance", name: "Trips to the Moon", symbol: "moons", category: "length", toBase: 384_400_000, playful: true },
	{ id: "earth-sun", name: "Trips to the Sun", symbol: "suns", category: "length", toBase: 149_597_870_700, playful: true },
	{ id: "hair-width", name: "Human hair widths", symbol: "hairs", category: "length", toBase: 0.00007, playful: true },
	{ id: "london-bus-length", name: "London buses (length)", symbol: "buses", category: "length", toBase: 11.23, playful: true },
];

// ─── Mass (base: kilogram) ───────────────────────────────────────────────────

const mass: Unit[] = [
	{ id: "mg", name: "Milligrams", symbol: "mg", category: "mass", toBase: 0.000001 },
	{ id: "g", name: "Grams", symbol: "g", category: "mass", toBase: 0.001 },
	{ id: "kg", name: "Kilograms", symbol: "kg", category: "mass", toBase: 1 },
	{ id: "tonne", name: "Tonnes", symbol: "t", category: "mass", toBase: 1000 },
	{ id: "oz", name: "Ounces", symbol: "oz", category: "mass", toBase: 0.0283495 },
	{ id: "lb", name: "Pounds", symbol: "lb", category: "mass", toBase: 0.453592 },
	{ id: "st", name: "Stone", symbol: "st", category: "mass", toBase: 6.35029 },
	// Playful
	{ id: "elephant", name: "African elephants", symbol: "elephants", category: "mass", toBase: 6000, playful: true },
	{ id: "blue-whale", name: "Blue whales", symbol: "whales", category: "mass", toBase: 150_000, playful: true },
	{ id: "grain-of-sand", name: "Grains of sand", symbol: "grains", category: "mass", toBase: 0.0000044, playful: true },
];

// ─── Volume (base: litre) ────────────────────────────────────────────────────

const volume: Unit[] = [
	{ id: "ml", name: "Millilitres", symbol: "ml", category: "volume", toBase: 0.001 },
	{ id: "cl", name: "Centilitres", symbol: "cl", category: "volume", toBase: 0.01 },
	{ id: "l", name: "Litres", symbol: "L", category: "volume", toBase: 1 },
	{ id: "tsp", name: "Teaspoons", symbol: "tsp", category: "volume", toBase: 0.00492892 },
	{ id: "tbsp", name: "Tablespoons", symbol: "tbsp", category: "volume", toBase: 0.0147868 },
	{ id: "cup", name: "Cups", symbol: "cups", category: "volume", toBase: 0.236588 },
	{ id: "pint-uk", name: "Pints (UK)", symbol: "pt", category: "volume", toBase: 0.568261 },
	{ id: "pint-us", name: "Pints (US)", symbol: "pt", category: "volume", toBase: 0.473176 },
	{ id: "gal-uk", name: "Gallons (UK)", symbol: "gal", category: "volume", toBase: 4.54609 },
	{ id: "gal-us", name: "Gallons (US)", symbol: "gal", category: "volume", toBase: 3.78541 },
	{ id: "fl-oz-uk", name: "Fluid ounces (UK)", symbol: "fl oz", category: "volume", toBase: 0.0284131 },
	{ id: "fl-oz-us", name: "Fluid ounces (US)", symbol: "fl oz", category: "volume", toBase: 0.0295735 },
	// Playful
	{ id: "olympic-pool", name: "Olympic swimming pools", symbol: "pools", category: "volume", toBase: 2_500_000, playful: true },
	{ id: "bathtub", name: "Bathtubs", symbol: "baths", category: "volume", toBase: 300, playful: true },
	{ id: "pint-of-beer", name: "Pints of beer", symbol: "pints", category: "volume", toBase: 0.568261, playful: true },
];

// ─── Temperature (special: uses formulas) ────────────────────────────────────

const temperature: Unit[] = [
	{ id: "c", name: "Celsius", symbol: "°C", category: "temperature", toBase: 1 },
	{ id: "f", name: "Fahrenheit", symbol: "°F", category: "temperature", toBase: 1 },
	{ id: "k", name: "Kelvin", symbol: "K", category: "temperature", toBase: 1 },
];

// ─── Time (base: second) ────────────────────────────────────────────────────

const time: Unit[] = [
	{ id: "ms", name: "Milliseconds", symbol: "ms", category: "time", toBase: 0.001 },
	{ id: "s", name: "Seconds", symbol: "s", category: "time", toBase: 1 },
	{ id: "min", name: "Minutes", symbol: "min", category: "time", toBase: 60 },
	{ id: "hr", name: "Hours", symbol: "hr", category: "time", toBase: 3600 },
	{ id: "day", name: "Days", symbol: "days", category: "time", toBase: 86400 },
	{ id: "week", name: "Weeks", symbol: "weeks", category: "time", toBase: 604800 },
	{ id: "month", name: "Months (avg)", symbol: "months", category: "time", toBase: 2_629_746 },
	{ id: "year", name: "Years", symbol: "years", category: "time", toBase: 31_556_952 },
	// Playful
	{ id: "blink", name: "Blinks of an eye", symbol: "blinks", category: "time", toBase: 0.3, playful: true },
	{ id: "microcentury", name: "Microcenturies", symbol: "μcentury", category: "time", toBase: 3155.6952, playful: true },
	{ id: "dog-year", name: "Dog years", symbol: "dog yrs", category: "time", toBase: 220_898_664, playful: true },
];

// ─── Area (base: square metre) ───────────────────────────────────────────────

const area: Unit[] = [
	{ id: "sqmm", name: "Square millimetres", symbol: "mm²", category: "area", toBase: 0.000001 },
	{ id: "sqcm", name: "Square centimetres", symbol: "cm²", category: "area", toBase: 0.0001 },
	{ id: "sqm", name: "Square metres", symbol: "m²", category: "area", toBase: 1 },
	{ id: "sqkm", name: "Square kilometres", symbol: "km²", category: "area", toBase: 1_000_000 },
	{ id: "sqft", name: "Square feet", symbol: "ft²", category: "area", toBase: 0.092903 },
	{ id: "sqmi", name: "Square miles", symbol: "mi²", category: "area", toBase: 2_589_988 },
	{ id: "acre", name: "Acres", symbol: "acres", category: "area", toBase: 4046.86 },
	{ id: "hectare", name: "Hectares", symbol: "ha", category: "area", toBase: 10000 },
	// Playful
	{ id: "wales", name: "Wales", symbol: "Wales", category: "area", toBase: 20_779_000_000, playful: true },
	{ id: "football-field", name: "Football fields", symbol: "fields", category: "area", toBase: 7140, playful: true },
	{ id: "tennis-court", name: "Tennis courts", symbol: "courts", category: "area", toBase: 260.87, playful: true },
];

// ─── Speed (base: metres per second) ─────────────────────────────────────────

const speed: Unit[] = [
	{ id: "mps", name: "Metres per second", symbol: "m/s", category: "speed", toBase: 1 },
	{ id: "kph", name: "Kilometres per hour", symbol: "km/h", category: "speed", toBase: 0.277778 },
	{ id: "mph", name: "Miles per hour", symbol: "mph", category: "speed", toBase: 0.44704 },
	{ id: "knot", name: "Knots", symbol: "kn", category: "speed", toBase: 0.514444 },
	// Playful
	{ id: "speed-of-light", name: "Speed of light", symbol: "c", category: "speed", toBase: 299_792_458, playful: true },
	{ id: "speed-of-sound", name: "Speed of sound", symbol: "Mach", category: "speed", toBase: 343, playful: true },
	{ id: "snail-speed", name: "Garden snail speed", symbol: "snails", category: "speed", toBase: 0.001, playful: true },
];

// ─── Data (base: byte) ──────────────────────────────────────────────────────

const data: Unit[] = [
	{ id: "bit", name: "Bits", symbol: "b", category: "data", toBase: 0.125 },
	{ id: "byte", name: "Bytes", symbol: "B", category: "data", toBase: 1 },
	{ id: "kb", name: "Kilobytes", symbol: "KB", category: "data", toBase: 1024 },
	{ id: "mb", name: "Megabytes", symbol: "MB", category: "data", toBase: 1_048_576 },
	{ id: "gb", name: "Gigabytes", symbol: "GB", category: "data", toBase: 1_073_741_824 },
	{ id: "tb", name: "Terabytes", symbol: "TB", category: "data", toBase: 1_099_511_627_776 },
	// Playful
	{ id: "floppy", name: "Floppy disks", symbol: "floppies", category: "data", toBase: 1_474_560, playful: true },
	{ id: "cd", name: "CDs", symbol: "CDs", category: "data", toBase: 734_003_200, playful: true },
];

// ─── Energy (base: joule) ────────────────────────────────────────────────────

const energy: Unit[] = [
	{ id: "j", name: "Joules", symbol: "J", category: "energy", toBase: 1 },
	{ id: "kj", name: "Kilojoules", symbol: "kJ", category: "energy", toBase: 1000 },
	{ id: "cal", name: "Calories", symbol: "cal", category: "energy", toBase: 4.184 },
	{ id: "kcal", name: "Kilocalories", symbol: "kcal", category: "energy", toBase: 4184 },
	{ id: "kwh", name: "Kilowatt-hours", symbol: "kWh", category: "energy", toBase: 3_600_000 },
	// Playful
	{ id: "mars-bar", name: "Mars bars", symbol: "Mars bars", category: "energy", toBase: 968_560, playful: true },
	{ id: "lightning-bolt", name: "Lightning bolts", symbol: "bolts", category: "energy", toBase: 1_000_000_000, playful: true },
];

// ─── All units ───────────────────────────────────────────────────────────────

export const units: Unit[] = [
	...length,
	...mass,
	...volume,
	...temperature,
	...time,
	...area,
	...speed,
	...data,
	...energy,
];

export const categories: { id: Category; label: string }[] = [
	{ id: "length", label: "Length" },
	{ id: "mass", label: "Mass" },
	{ id: "volume", label: "Volume" },
	{ id: "temperature", label: "Temperature" },
	{ id: "time", label: "Time" },
	{ id: "area", label: "Area" },
	{ id: "speed", label: "Speed" },
	{ id: "data", label: "Data" },
	{ id: "energy", label: "Energy" },
];

export function getUnitsByCategory(category: Category): Unit[] {
	return units.filter((u) => u.category === category);
}

// ─── Conversion ──────────────────────────────────────────────────────────────

function convertTemperature(value: number, from: string, to: string): number {
	// Convert to Celsius first
	let celsius: number;
	switch (from) {
		case "c":
			celsius = value;
			break;
		case "f":
			celsius = (value - 32) * (5 / 9);
			break;
		case "k":
			celsius = value - 273.15;
			break;
		default:
			return value;
	}

	// Convert from Celsius to target
	switch (to) {
		case "c":
			return celsius;
		case "f":
			return celsius * (9 / 5) + 32;
		case "k":
			return celsius + 273.15;
		default:
			return celsius;
	}
}

export function convert(value: number, from: Unit, to: Unit): number {
	if (from.category !== to.category) {
		throw new Error(`Cannot convert ${from.category} to ${to.category}`);
	}

	if (from.category === "temperature") {
		return convertTemperature(value, from.id, to.id);
	}

	// value in source unit → base unit → target unit
	const baseValue = value * from.toBase;
	return baseValue / to.toBase;
}

export function formatResult(value: number): string {
	if (value === 0) return "0";

	const abs = Math.abs(value);

	// Huge numbers: use compact notation
	if (abs >= 1_000_000_000_000) {
		return value.toLocaleString("en-GB", { maximumSignificantDigits: 4, notation: "compact" } as Intl.NumberFormatOptions);
	}

	// Large numbers
	if (abs >= 100) return value.toLocaleString("en-GB", { maximumFractionDigits: 2 });
	if (abs >= 1) return value.toLocaleString("en-GB", { maximumFractionDigits: 4 });
	if (abs >= 0.01) return value.toLocaleString("en-GB", { maximumFractionDigits: 6 });

	// Small numbers: use significant digits, never scientific notation
	return value.toLocaleString("en-GB", { maximumSignificantDigits: 4, minimumSignificantDigits: 2 });
}
