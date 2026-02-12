export type Category =
	| "length"
	| "mass"
	| "volume"
	| "temperature"
	| "time"
	| "area"
	| "speed"
	| "data"
	| "energy"
	| "angle"
	| "typography";

export type Mode = "all" | "kitchen" | "newsroom" | "fun" | "workshop" | "dev";

export interface Unit {
	id: string;
	name: string;
	symbol: string;
	category: Category;
	/** Ratio to base unit. For temperature, this is unused — handled by formula. */
	toBase: number;
	mode: Mode;
}

// ─── Length (base: metre) ────────────────────────────────────────────────────

const length: Unit[] = [
	// All (small → large)
	{ id: "hair-width", name: "Human hair widths", symbol: "hairs", category: "length", toBase: 0.00007, mode: "all" },
	{ id: "mm", name: "Millimetres", symbol: "mm", category: "length", toBase: 0.001, mode: "all" },
	{ id: "cm", name: "Centimetres", symbol: "cm", category: "length", toBase: 0.01, mode: "all" },
	{ id: "in", name: "Inches", symbol: "in", category: "length", toBase: 0.0254, mode: "all" },
	{ id: "ft", name: "Feet", symbol: "ft", category: "length", toBase: 0.3048, mode: "all" },
	{ id: "yd", name: "Yards", symbol: "yd", category: "length", toBase: 0.9144, mode: "all" },
	{ id: "m", name: "Metres", symbol: "m", category: "length", toBase: 1, mode: "all" },
	{ id: "km", name: "Kilometres", symbol: "km", category: "length", toBase: 1000, mode: "all" },
	{ id: "mi", name: "Miles", symbol: "mi", category: "length", toBase: 1609.344, mode: "all" },
	{ id: "nmi", name: "Nautical miles", symbol: "nmi", category: "length", toBase: 1852, mode: "all" },
	{ id: "au", name: "Astronomical units", symbol: "AU", category: "length", toBase: 1.496e11, mode: "all" },
	{ id: "light-year", name: "Light-years", symbol: "ly", category: "length", toBase: 9.461e15, mode: "all" },
	// Newsroom (small → large)
	{ id: "grain-of-rice", name: "Grains of rice", symbol: "grains", category: "length", toBase: 0.006, mode: "newsroom" },
	{ id: "bus", name: "Double-decker buses", symbol: "buses", category: "length", toBase: 11, mode: "newsroom" },
	{ id: "nelsons-column", name: "Nelson's Columns", symbol: "columns", category: "length", toBase: 51.6, mode: "newsroom" },
	{ id: "football-pitch", name: "Football pitches", symbol: "pitches", category: "length", toBase: 105, mode: "newsroom" },
	{ id: "eiffel-tower", name: "Eiffel Towers", symbol: "towers", category: "length", toBase: 330, mode: "newsroom" },
	{ id: "london-moscow", name: "London to Moscow", symbol: "trips", category: "length", toBase: 2_500_000, mode: "newsroom" },
	{ id: "around-the-world", name: "Times around the world", symbol: "laps", category: "length", toBase: 40_075_000, mode: "newsroom" },
	{ id: "moon-distance", name: "Trips to the Moon", symbol: "moons", category: "length", toBase: 384_400_000, mode: "newsroom" },
	{ id: "earth-sun", name: "Trips to the Sun", symbol: "suns", category: "length", toBase: 149_597_870_700, mode: "newsroom" },
	// Fun (small → large)
	{ id: "sausage-dog", name: "Sausage dogs", symbol: "dachshunds", category: "length", toBase: 0.5, mode: "fun" },
	{ id: "hobbit-height", name: "Hobbit heights", symbol: "hobbits", category: "length", toBase: 1.0668, mode: "fun" },
	{ id: "bfg-height", name: "BFG heights", symbol: "BFGs", category: "length", toBase: 7.3152, mode: "fun" },
];

// ─── Mass (base: kilogram) ───────────────────────────────────────────────────

const mass: Unit[] = [
	// All (small → large)
	{ id: "grain-of-sand", name: "Grains of sand", symbol: "grains", category: "mass", toBase: 0.0000044, mode: "all" },
	{ id: "mg", name: "Milligrams", symbol: "mg", category: "mass", toBase: 0.000001, mode: "all" },
	{ id: "g", name: "Grams", symbol: "g", category: "mass", toBase: 0.001, mode: "all" },
	{ id: "oz", name: "Ounces", symbol: "oz", category: "mass", toBase: 0.0283495, mode: "all" },
	{ id: "lb", name: "Pounds", symbol: "lb", category: "mass", toBase: 0.453592, mode: "all" },
	{ id: "kg", name: "Kilograms", symbol: "kg", category: "mass", toBase: 1, mode: "all" },
	{ id: "st", name: "Stone", symbol: "st", category: "mass", toBase: 6.35029, mode: "all" },
	{ id: "ton-us", name: "Tons (US)", symbol: "ton", category: "mass", toBase: 907.185, mode: "all" },
	{ id: "tonne", name: "Tonnes", symbol: "t", category: "mass", toBase: 1000, mode: "all" },
	{ id: "ton-imperial", name: "Tons (imperial)", symbol: "ton", category: "mass", toBase: 1016.047, mode: "all" },
	// Kitchen
	{ id: "egg-medium", name: "Eggs (medium)", symbol: "eggs", category: "mass", toBase: 0.05, mode: "kitchen" },
	{ id: "egg-large", name: "Eggs (large)", symbol: "eggs", category: "mass", toBase: 0.06, mode: "kitchen" },
	{ id: "stick-of-butter", name: "Sticks of butter", symbol: "sticks", category: "mass", toBase: 0.113, mode: "kitchen" },
	{ id: "cup-of-flour", name: "Cups of flour", symbol: "cups", category: "mass", toBase: 0.13, mode: "kitchen" },
	{ id: "cup-of-sugar", name: "Cups of sugar", symbol: "cups", category: "mass", toBase: 0.2, mode: "kitchen" },
	// Newsroom (small → large)
	{ id: "bag-of-sugar", name: "Bags of sugar", symbol: "bags", category: "mass", toBase: 1, mode: "newsroom" },
	{ id: "elephant", name: "African elephants", symbol: "elephants", category: "mass", toBase: 6000, mode: "newsroom" },
	{ id: "double-decker-bus", name: "Double-decker buses", symbol: "buses", category: "mass", toBase: 8000, mode: "newsroom" },
	{ id: "blue-whale", name: "Blue whales", symbol: "whales", category: "mass", toBase: 150_000, mode: "newsroom" },
	// Fun
	{ id: "house-cat", name: "House cats", symbol: "cats", category: "mass", toBase: 4.5, mode: "fun" },
];

// ─── Volume (base: litre) ────────────────────────────────────────────────────

const volume: Unit[] = [
	// All (small → large)
	{ id: "ml", name: "Millilitres", symbol: "ml", category: "volume", toBase: 0.001, mode: "all" },
	{ id: "cl", name: "Centilitres", symbol: "cl", category: "volume", toBase: 0.01, mode: "all" },
	{ id: "fl-oz-uk", name: "Fluid ounces (UK)", symbol: "fl oz", category: "volume", toBase: 0.0284131, mode: "all" },
	{ id: "fl-oz-us", name: "Fluid ounces (US)", symbol: "fl oz", category: "volume", toBase: 0.0295735, mode: "all" },
	{ id: "cup-metric", name: "Cups (metric)", symbol: "cups", category: "volume", toBase: 0.25, mode: "all" },
	{ id: "pint-us", name: "Pints (US)", symbol: "pt", category: "volume", toBase: 0.473176, mode: "all" },
	{ id: "pint-uk", name: "Pints (UK)", symbol: "pt", category: "volume", toBase: 0.568261, mode: "all" },
	{ id: "l", name: "Litres", symbol: "L", category: "volume", toBase: 1, mode: "all" },
	{ id: "gal-us", name: "Gallons (US)", symbol: "gal", category: "volume", toBase: 3.78541, mode: "all" },
	{ id: "gal-uk", name: "Gallons (UK)", symbol: "gal", category: "volume", toBase: 4.54609, mode: "all" },
	{ id: "cubic-metre", name: "Cubic metres", symbol: "m³", category: "volume", toBase: 1000, mode: "all" },
	// Kitchen
	{ id: "tsp", name: "Teaspoons", symbol: "tsp", category: "volume", toBase: 0.00492892, mode: "kitchen" },
	{ id: "tbsp", name: "Tablespoons", symbol: "tbsp", category: "volume", toBase: 0.0147868, mode: "kitchen" },
	{ id: "cup", name: "Cups (US)", symbol: "cups", category: "volume", toBase: 0.236588, mode: "kitchen" },
	// Newsroom (small → large)
	{ id: "shot-glass", name: "Shot glasses", symbol: "shots", category: "volume", toBase: 0.044, mode: "newsroom" },
	{ id: "wine-bottle", name: "Wine bottles", symbol: "bottles", category: "volume", toBase: 0.75, mode: "newsroom" },
	{ id: "pint-of-beer", name: "Pints of beer", symbol: "pints", category: "volume", toBase: 0.568261, mode: "newsroom" },
	{ id: "bathtub", name: "Bathtubs", symbol: "baths", category: "volume", toBase: 300, mode: "newsroom" },
	{ id: "olympic-pool", name: "Olympic swimming pools", symbol: "pools", category: "volume", toBase: 2_500_000, mode: "newsroom" },
	{ id: "lake-windermere", name: "Lake Windermeres", symbol: "lakes", category: "volume", toBase: 314_500_000_000, mode: "newsroom" },
	// Fun
	{ id: "thimble", name: "Thimbles", symbol: "thimbles", category: "volume", toBase: 0.001, mode: "fun" },
	{ id: "cup-of-tea", name: "Cups of tea", symbol: "cuppas", category: "volume", toBase: 0.35, mode: "fun" },
];

// ─── Temperature (special: uses formulas) ────────────────────────────────────

const temperature: Unit[] = [
	{ id: "c", name: "Celsius", symbol: "°C", category: "temperature", toBase: 1, mode: "all" },
	{ id: "f", name: "Fahrenheit", symbol: "°F", category: "temperature", toBase: 1, mode: "all" },
	{ id: "k", name: "Kelvin", symbol: "K", category: "temperature", toBase: 1, mode: "all" },
];

// ─── Time (base: second) ────────────────────────────────────────────────────

const time: Unit[] = [
	// All (small → large)
	{ id: "ms", name: "Milliseconds", symbol: "ms", category: "time", toBase: 0.001, mode: "all" },
	{ id: "s", name: "Seconds", symbol: "s", category: "time", toBase: 1, mode: "all" },
	{ id: "min", name: "Minutes", symbol: "min", category: "time", toBase: 60, mode: "all" },
	{ id: "hr", name: "Hours", symbol: "hr", category: "time", toBase: 3600, mode: "all" },
	{ id: "day", name: "Days", symbol: "days", category: "time", toBase: 86400, mode: "all" },
	{ id: "week", name: "Weeks", symbol: "weeks", category: "time", toBase: 604800, mode: "all" },
	{ id: "month", name: "Months (avg)", symbol: "months", category: "time", toBase: 2_629_746, mode: "all" },
	{ id: "year", name: "Years", symbol: "years", category: "time", toBase: 31_556_952, mode: "all" },
	// Fun (small → large)
	{ id: "blink", name: "Blinks of an eye", symbol: "blinks", category: "time", toBase: 0.3, mode: "fun" },
	{ id: "microcentury", name: "Microcenturies", symbol: "µcentury", category: "time", toBase: 3155.6952, mode: "fun" },
	{ id: "dog-year", name: "Dog years", symbol: "dog yrs", category: "time", toBase: 220_898_664, mode: "fun" },
	{ id: "time-since-dinosaurs", name: "Times since the dinosaurs", symbol: "dino eras", category: "time", toBase: 2_082_758_832_000_000, mode: "fun" },
];

// ─── Area (base: square metre) ───────────────────────────────────────────────

const area: Unit[] = [
	// All (small → large)
	{ id: "sqmm", name: "Square millimetres", symbol: "mm²", category: "area", toBase: 0.000001, mode: "all" },
	{ id: "sqcm", name: "Square centimetres", symbol: "cm²", category: "area", toBase: 0.0001, mode: "all" },
	{ id: "sqin", name: "Square inches", symbol: "in²", category: "area", toBase: 0.00064516, mode: "all" },
	{ id: "sqft", name: "Square feet", symbol: "ft²", category: "area", toBase: 0.092903, mode: "all" },
	{ id: "sqyd", name: "Square yards", symbol: "yd²", category: "area", toBase: 0.836127, mode: "all" },
	{ id: "sqm", name: "Square metres", symbol: "m²", category: "area", toBase: 1, mode: "all" },
	{ id: "acre", name: "Acres", symbol: "acres", category: "area", toBase: 4046.86, mode: "all" },
	{ id: "hectare", name: "Hectares", symbol: "ha", category: "area", toBase: 10000, mode: "all" },
	{ id: "sqkm", name: "Square kilometres", symbol: "km²", category: "area", toBase: 1_000_000, mode: "all" },
	{ id: "sqmi", name: "Square miles", symbol: "mi²", category: "area", toBase: 2_589_988, mode: "all" },
	// Newsroom (small → large)
	{ id: "parking-space", name: "Parking spaces", symbol: "spaces", category: "area", toBase: 12, mode: "newsroom" },
	{ id: "tennis-court", name: "Tennis courts", symbol: "courts", category: "area", toBase: 260.87, mode: "newsroom" },
	{ id: "football-field", name: "Football fields", symbol: "fields", category: "area", toBase: 7140, mode: "newsroom" },
	{ id: "wembley-stadium", name: "Wembley Stadiums", symbol: "stadiums", category: "area", toBase: 90_000, mode: "newsroom" },
	{ id: "hyde-park", name: "Hyde Parks", symbol: "parks", category: "area", toBase: 1_420_000, mode: "newsroom" },
	{ id: "wales", name: "Wales", symbol: "Wales", category: "area", toBase: 20_779_000_000, mode: "newsroom" },
	{ id: "belgium", name: "Belgiums", symbol: "Belgiums", category: "area", toBase: 30_689_000_000, mode: "newsroom" },
	{ id: "manhattan", name: "Manhattans", symbol: "Manhattans", category: "area", toBase: 59_100_000, mode: "newsroom" },
];

// ─── Speed (base: metres per second) ─────────────────────────────────────────

const speed: Unit[] = [
	// All (small → large)
	{ id: "kph", name: "Kilometres per hour", symbol: "km/h", category: "speed", toBase: 0.277778, mode: "all" },
	{ id: "mph", name: "Miles per hour", symbol: "mph", category: "speed", toBase: 0.44704, mode: "all" },
	{ id: "knot", name: "Knots", symbol: "kn", category: "speed", toBase: 0.514444, mode: "all" },
	{ id: "mps", name: "Metres per second", symbol: "m/s", category: "speed", toBase: 1, mode: "all" },
	{ id: "speed-of-sound", name: "Speed of sound", symbol: "Mach", category: "speed", toBase: 343, mode: "all" },
	{ id: "speed-of-light", name: "Speed of light", symbol: "c", category: "speed", toBase: 299_792_458, mode: "all" },
	// Newsroom (small → large)
	{ id: "walking-pace", name: "Walking pace", symbol: "walks", category: "speed", toBase: 1.38889, mode: "newsroom" },
	{ id: "usain-bolt", name: "Usain Bolt sprints", symbol: "Bolts", category: "speed", toBase: 12.2222, mode: "newsroom" },
	{ id: "cheetah", name: "Cheetah speed", symbol: "cheetahs", category: "speed", toBase: 33.3333, mode: "newsroom" },
	// Fun (small → large)
	{ id: "continental-drift", name: "Continental drift", symbol: "drifts", category: "speed", toBase: 7.927e-10, mode: "fun" },
	{ id: "snail-speed", name: "Garden snail speed", symbol: "snails", category: "speed", toBase: 0.001, mode: "fun" },
];

// ─── Data (base: byte) ──────────────────────────────────────────────────────

const data: Unit[] = [
	// All (small → large)
	{ id: "bit", name: "Bits", symbol: "b", category: "data", toBase: 0.125, mode: "all" },
	{ id: "byte", name: "Bytes", symbol: "B", category: "data", toBase: 1, mode: "all" },
	{ id: "kb", name: "Kilobytes", symbol: "KB", category: "data", toBase: 1024, mode: "all" },
	{ id: "mb", name: "Megabytes", symbol: "MB", category: "data", toBase: 1_048_576, mode: "all" },
	{ id: "gb", name: "Gigabytes", symbol: "GB", category: "data", toBase: 1_073_741_824, mode: "all" },
	{ id: "tb", name: "Terabytes", symbol: "TB", category: "data", toBase: 1_099_511_627_776, mode: "all" },
	{ id: "pb", name: "Petabytes", symbol: "PB", category: "data", toBase: 1_125_899_906_842_624, mode: "all" },
	// Newsroom (small → large)
	{ id: "floppy", name: "Floppy disks", symbol: "floppies", category: "data", toBase: 1_474_560, mode: "newsroom" },
	{ id: "cd", name: "CDs", symbol: "CDs", category: "data", toBase: 734_003_200, mode: "newsroom" },
	{ id: "dvd", name: "DVDs", symbol: "DVDs", category: "data", toBase: 5_046_586_573, mode: "newsroom" },
	{ id: "wikipedia-text", name: "Copies of Wikipedia (text)", symbol: "Wikipedias", category: "data", toBase: 23_622_320_128, mode: "newsroom" },
	{ id: "library-of-congress", name: "Libraries of Congress", symbol: "libraries", category: "data", toBase: 18_691_697_672_192, mode: "newsroom" },
];

// ─── Energy (base: joule) ────────────────────────────────────────────────────

const energy: Unit[] = [
	// All (small → large)
	{ id: "j", name: "Joules", symbol: "J", category: "energy", toBase: 1, mode: "all" },
	{ id: "cal", name: "Calories", symbol: "cal", category: "energy", toBase: 4.184, mode: "all" },
	{ id: "kj", name: "Kilojoules", symbol: "kJ", category: "energy", toBase: 1000, mode: "all" },
	{ id: "kcal", name: "Kilocalories", symbol: "kcal", category: "energy", toBase: 4184, mode: "all" },
	{ id: "kwh", name: "Kilowatt-hours", symbol: "kWh", category: "energy", toBase: 3_600_000, mode: "all" },
	// Newsroom
	{ id: "lightning-bolt", name: "Lightning bolts", symbol: "bolts", category: "energy", toBase: 1_000_000_000, mode: "newsroom" },
	// Fun
	{ id: "mars-bar", name: "Mars bars", symbol: "Mars bars", category: "energy", toBase: 968_560, mode: "fun" },
];

// ─── Angle (base: radian) ────────────────────────────────────────────────────

const angle: Unit[] = [
	{ id: "degree", name: "Degrees", symbol: "°", category: "angle", toBase: 0.0174533, mode: "all" },
	{ id: "radian", name: "Radians", symbol: "rad", category: "angle", toBase: 1, mode: "all" },
	{ id: "turn", name: "Turns", symbol: "turns", category: "angle", toBase: 6.283185, mode: "all" },
];

// ─── Typography (base: pixel) ────────────────────────────────────────────────

const typography: Unit[] = [
	{ id: "pixel", name: "Pixels", symbol: "px", category: "typography", toBase: 1, mode: "dev" },
	{ id: "point", name: "Points", symbol: "pt", category: "typography", toBase: 1.333333, mode: "dev" },
	{ id: "tailwind-unit", name: "Tailwind units", symbol: "tw", category: "typography", toBase: 4, mode: "dev" },
	{ id: "rem", name: "Rems", symbol: "rem", category: "typography", toBase: 16, mode: "dev" },
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
	...angle,
	...typography,
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
	{ id: "angle", label: "Angle" },
	{ id: "typography", label: "Typography" },
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
