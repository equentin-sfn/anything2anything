"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
	units,
	categories,
	getUnitsByCategory,
	convert,
	formatResult,
	type Category,
	type Unit,
} from "@/lib/units";

// ─── Key-stable number splitting ─────────────────────────────────────────────

function splitNumberForAnimation(
	formatted: string,
): { char: string; key: string }[] {
	const result: { char: string; key: string }[] = [];
	const dotIndex = formatted.indexOf(".");

	if (dotIndex === -1) {
		const digitsOnly = formatted.replace(/[^0-9]/g, "");
		let digitPos = digitsOnly.length - 1;
		for (let i = 0; i < formatted.length; i++) {
			const ch = formatted[i];
			if (/\d/.test(ch)) {
				result.push({ char: ch, key: `i${digitPos}` });
				digitPos--;
			} else if (ch === "-") {
				result.push({ char: ch, key: "neg" });
			} else {
				result.push({ char: ch, key: `s${digitPos + 1}` });
			}
		}
	} else {
		const leftPart = formatted.slice(0, dotIndex);
		const leftDigits = leftPart.replace(/[^0-9]/g, "");
		let digitPos = leftDigits.length - 1;
		for (let i = 0; i < leftPart.length; i++) {
			const ch = leftPart[i];
			if (/\d/.test(ch)) {
				result.push({ char: ch, key: `i${digitPos}` });
				digitPos--;
			} else if (ch === "-") {
				result.push({ char: ch, key: "neg" });
			} else {
				result.push({ char: ch, key: `s${digitPos + 1}` });
			}
		}
		result.push({ char: ".", key: "dot" });
		for (let i = dotIndex + 1; i < formatted.length; i++) {
			result.push({ char: formatted[i], key: `d${i - dotIndex}` });
		}
	}

	return result;
}

// ─── Rolling Digit ───────────────────────────────────────────────────────────

function RollingChar({
	char,
	staggerIndex,
}: {
	char: string;
	staggerIndex: number;
}) {
	const isDigit = /\d/.test(char);
	const mounted = useRef(false);

	useEffect(() => {
		mounted.current = true;
	}, []);

	if (!isDigit) {
		const width =
			char === "." || char === ","
				? "0.32em"
				: char === "-"
					? "0.5em"
					: "0.35em";
		return (
			<span
				className="inline-block text-center animate-char-enter"
				style={{ width }}
			>
				{char}
			</span>
		);
	}

	const digit = parseInt(char);
	const delay = staggerIndex * 25;

	return (
		<span
			className="inline-block overflow-hidden relative animate-char-enter"
			style={{
				height: "1.4em",
				width: "0.62em",
				maskImage:
					"linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 8%, black 22%, black 78%, rgba(0,0,0,0.1) 92%, transparent 100%)",
				WebkitMaskImage:
					"linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 8%, black 22%, black 78%, rgba(0,0,0,0.1) 92%, transparent 100%)",
			}}
		>
			<span
				className="flex flex-col will-change-transform"
				style={{
					transform: `translateY(calc(0.2em + ${-digit}em))`,
					transition: mounted.current
						? `transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`
						: "none",
				}}
			>
				{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
					<span
						key={n}
						className="block text-center select-none"
						style={{ height: "1em", lineHeight: "1em" }}
					>
						{n}
					</span>
				))}
			</span>
		</span>
	);
}

// ─── Rolling Number ──────────────────────────────────────────────────────────

function RollingNumber({
	value,
	className,
}: {
	value: string;
	className?: string;
}) {
	const parts = splitNumberForAnimation(value);

	return (
		<span
			className={`inline-flex justify-center items-baseline ${className ?? ""}`}
			aria-label={value}
		>
			{parts.map(({ char, key }, i) => (
				<RollingChar key={key} char={char} staggerIndex={i} />
			))}
		</span>
	);
}

// ─── Unit Picker ─────────────────────────────────────────────────────────────

function UnitPicker({
	unitList,
	selected,
	onSelect,
}: {
	unitList: Unit[];
	selected: Unit | undefined;
	onSelect: (id: string) => void;
}) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		function handleClick(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, [open]);

	const standard = unitList.filter((u) => !u.playful);
	const playful = unitList.filter((u) => u.playful);

	return (
		<div ref={ref} className="relative inline-block">
			<button
				onClick={() => setOpen(!open)}
				className="group flex items-center gap-1.5 text-muted hover:text-accent transition-colors duration-200"
			>
				<span className="text-xs font-mono tracking-[0.15em] uppercase">
					{selected?.name ?? "Select unit"}
				</span>
				<svg
					className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
					viewBox="0 0 12 12"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
				>
					<path d="M3 4.5L6 7.5L9 4.5" />
				</svg>
			</button>

			{open && (
				<div className="absolute left-1/2 -translate-x-1/2 z-50 mt-3 w-64 bg-surface border border-subtle rounded-lg shadow-lg py-2 max-h-72 overflow-y-auto hide-scrollbar">
					{standard.map((u) => (
						<button
							key={u.id}
							onClick={() => {
								onSelect(u.id);
								setOpen(false);
							}}
							className={`w-full text-left px-4 py-2 text-sm font-mono transition-colors duration-150 ${
								selected?.id === u.id
									? "text-accent bg-accent/5"
									: "text-ink hover:bg-subtle/40"
							}`}
						>
							{u.name}
							<span className="ml-2 text-muted text-xs">{u.symbol}</span>
						</button>
					))}
					{playful.length > 0 && (
						<>
							<div className="mx-4 my-2 border-t border-subtle" />
							<div className="px-4 py-1 text-[10px] font-body text-muted tracking-[0.2em] uppercase">
								The fun ones
							</div>
							{playful.map((u) => (
								<button
									key={u.id}
									onClick={() => {
										onSelect(u.id);
										setOpen(false);
									}}
									className={`w-full text-left px-4 py-2 text-sm font-mono transition-colors duration-150 ${
										selected?.id === u.id
											? "text-accent bg-accent/5"
											: "text-ink hover:bg-subtle/40"
									}`}
								>
									{u.name}
									<span className="ml-2 text-muted text-xs">{u.symbol}</span>
								</button>
							))}
						</>
					)}
				</div>
			)}
		</div>
	);
}

// ─── Category Navigation ─────────────────────────────────────────────────────

function CategoryNav({
	active,
	onChange,
}: {
	active: Category;
	onChange: (cat: Category) => void;
}) {
	return (
		<nav className="flex justify-center gap-4 sm:gap-6 overflow-x-auto hide-scrollbar px-4">
			{categories.map((cat) => (
				<button
					key={cat.id}
					onClick={() => onChange(cat.id)}
					className={`text-xs font-body tracking-[0.1em] uppercase whitespace-nowrap pb-2 border-b transition-all duration-300 ${
						active === cat.id
							? "text-ink border-ink"
							: "text-muted border-transparent hover:text-ink"
					}`}
				>
					{cat.label}
				</button>
			))}
		</nav>
	);
}

// ─── Main Converter ──────────────────────────────────────────────────────────

export function Converter() {
	const [category, setCategory] = useState<Category>("length");
	const [fromId, setFromId] = useState("km");
	const [toId, setToId] = useState("mi");
	const [inputValue, setInputValue] = useState("");
	const [swapRotation, setSwapRotation] = useState(0);

	const categoryUnits = useMemo(
		() => getUnitsByCategory(category),
		[category],
	);
	const fromUnit = units.find((u) => u.id === fromId);
	const toUnit = units.find((u) => u.id === toId);

	const result = useMemo(() => {
		const num = parseFloat(inputValue);
		if (isNaN(num) || !fromUnit || !toUnit) return null;
		return convert(num, fromUnit, toUnit);
	}, [inputValue, fromUnit, toUnit]);

	function handleCategoryChange(newCategory: Category) {
		setCategory(newCategory);
		const newUnits = getUnitsByCategory(newCategory);
		setFromId(newUnits[0]?.id ?? "");
		setToId(newUnits[1]?.id ?? newUnits[0]?.id ?? "");
		setInputValue("");
	}

	function handleSwap() {
		setFromId(toId);
		setToId(fromId);
		setSwapRotation((r) => r + 180);
	}

	const formattedResult = result !== null ? formatResult(result) : null;

	return (
		<div className="space-y-12 sm:space-y-16">
			<CategoryNav active={category} onChange={handleCategoryChange} />

			<div className="space-y-6 sm:space-y-8">
				{/* From */}
				<div className="text-center">
					<input
						type="number"
						inputMode="decimal"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						placeholder="0"
						autoFocus
						className="w-full text-center font-mono text-6xl sm:text-7xl md:text-8xl font-medium bg-transparent outline-none placeholder:text-subtle text-ink [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
						style={{ caretColor: "var(--color-accent)" }}
					/>
					<div className="mt-3">
						<UnitPicker
							unitList={categoryUnits}
							selected={fromUnit}
							onSelect={setFromId}
						/>
					</div>
				</div>

				{/* Swap */}
				<div className="flex justify-center">
					<button
						onClick={handleSwap}
						className="p-3 text-muted hover:text-accent transition-colors duration-200"
						aria-label="Swap units"
					>
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="transition-transform duration-500 ease-out"
							style={{ transform: `rotate(${swapRotation}deg)` }}
						>
							<path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
						</svg>
					</button>
				</div>

				{/* To */}
				<div className="text-center">
					<div className="font-mono text-6xl sm:text-7xl md:text-8xl font-medium leading-none">
						{formattedResult ? (
							<RollingNumber value={formattedResult} />
						) : (
							<span className="text-subtle">0</span>
						)}
					</div>
					<div className="mt-3">
						<UnitPicker
							unitList={categoryUnits}
							selected={toUnit}
							onSelect={setToId}
						/>
					</div>
				</div>
			</div>

			{/* Sentence */}
			{result !== null && fromUnit && toUnit && (
				<p className="text-center font-display italic text-lg text-muted">
					{inputValue} {fromUnit.name.toLowerCase()} ={" "}
					{formatResult(result)} {toUnit.name.toLowerCase()}
				</p>
			)}
		</div>
	);
}
