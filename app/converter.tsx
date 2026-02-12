"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
	units,
	categories,
	getUnitsByCategory,
	convert,
	formatResult,
	type Category,
	type Unit,
} from "@/lib/units";

const ITEM_HEIGHT = 52;
const VISIBLE_ITEMS = 7;
const WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const SPACER_HEIGHT = (WHEEL_HEIGHT - ITEM_HEIGHT) / 2;

// ─── Scroll Wheel ────────────────────────────────────────────────────────────

function ScrollWheel({
	unitList,
	selectedIndex,
	onSelect,
	getDisplayValue,
	align,
}: {
	unitList: Unit[];
	selectedIndex: number;
	onSelect: (index: number) => void;
	getDisplayValue: (unit: Unit) => string;
	align: "left" | "right";
}) {
	const wheelRef = useRef<HTMLDivElement>(null);
	const isProgrammatic = useRef(false);
	const scrollTimer = useRef<ReturnType<typeof setTimeout>>();
	const lastReported = useRef(selectedIndex);

	// Scroll to position on mount
	useEffect(() => {
		if (!wheelRef.current) return;
		isProgrammatic.current = true;
		wheelRef.current.scrollTop = selectedIndex * ITEM_HEIGHT;
		const t = setTimeout(() => {
			isProgrammatic.current = false;
		}, 100);
		return () => clearTimeout(t);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Reset scroll when unit list changes (category change)
	useEffect(() => {
		if (!wheelRef.current) return;
		isProgrammatic.current = true;
		lastReported.current = selectedIndex;
		wheelRef.current.scrollTop = selectedIndex * ITEM_HEIGHT;
		const t = setTimeout(() => {
			isProgrammatic.current = false;
		}, 100);
		return () => clearTimeout(t);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [unitList]);

	const handleScroll = useCallback(() => {
		if (!wheelRef.current || isProgrammatic.current) return;

		clearTimeout(scrollTimer.current);
		scrollTimer.current = setTimeout(() => {
			if (!wheelRef.current) return;
			const idx = Math.round(wheelRef.current.scrollTop / ITEM_HEIGHT);
			const clamped = Math.max(0, Math.min(idx, unitList.length - 1));
			if (clamped !== lastReported.current) {
				lastReported.current = clamped;
				onSelect(clamped);
			}
		}, 60);
	}, [unitList.length, onSelect]);

	const maskGradient =
		"linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.08) 6%, rgba(0,0,0,0.25) 14%, rgba(0,0,0,0.5) 24%, black 40%, black 60%, rgba(0,0,0,0.5) 76%, rgba(0,0,0,0.25) 86%, rgba(0,0,0,0.08) 94%, transparent 100%)";

	return (
		<div
			ref={wheelRef}
			onScroll={handleScroll}
			className="overflow-y-auto hide-scrollbar flex-1 will-change-scroll"
			style={{
				height: WHEEL_HEIGHT,
				scrollSnapType: "y mandatory",
				WebkitOverflowScrolling: "touch",
				maskImage: maskGradient,
				WebkitMaskImage: maskGradient,
			}}
		>
			<div style={{ height: SPACER_HEIGHT }} aria-hidden="true" />

			{unitList.map((unit, i) => {
				const isCenter = i === selectedIndex;
				const value = getDisplayValue(unit);

				return (
					<div
						key={unit.id}
						className={`flex items-center gap-1.5 sm:gap-2 transition-all duration-300 ease-out ${
							align === "right"
								? "justify-end pr-3 sm:pr-4"
								: "justify-start pl-3 sm:pl-4"
						}`}
						style={{
							height: ITEM_HEIGHT,
							scrollSnapAlign: "center",
						}}
					>
						<span
							className={`font-mono tabular-nums whitespace-nowrap transition-all duration-300 ${
								isCenter
									? "text-2xl sm:text-3xl md:text-4xl font-semibold text-ink"
									: "text-sm sm:text-base text-ink/25"
							}`}
						>
							{value}
						</span>
						<span
							className={`font-body uppercase transition-all duration-300 min-w-0 truncate ${
								isCenter
									? "text-[10px] sm:text-xs tracking-[0.12em] font-medium text-accent"
									: "text-[8px] sm:text-[10px] tracking-[0.08em] text-ink/15"
							}`}
						>
							<span className="hidden sm:inline">
								{unit.name}
							</span>
							<span className="sm:hidden">{unit.symbol}</span>
						</span>
					</div>
				);
			})}

			<div style={{ height: SPACER_HEIGHT }} aria-hidden="true" />
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
	const activeRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		activeRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "nearest",
			inline: "center",
		});
	}, [active]);

	return (
		<nav className="flex justify-center gap-4 sm:gap-6 overflow-x-auto hide-scrollbar px-4">
			{categories.map((cat) => (
				<button
					key={cat.id}
					ref={active === cat.id ? activeRef : undefined}
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

	const categoryUnits = useMemo(
		() => getUnitsByCategory(category),
		[category],
	);

	const fromIndex = Math.max(
		0,
		categoryUnits.findIndex((u) => u.id === fromId),
	);
	const toIndex = Math.max(
		0,
		categoryUnits.findIndex((u) => u.id === toId),
	);
	const fromUnit = categoryUnits[fromIndex];

	const getDisplayValue = useCallback(
		(unit: Unit) => {
			const num = parseFloat(inputValue);
			if (isNaN(num) || !fromUnit) return "–";
			return formatResult(convert(num, fromUnit, unit));
		},
		[inputValue, fromUnit],
	);

	function handleCategoryChange(newCategory: Category) {
		setCategory(newCategory);
		const newUnits = getUnitsByCategory(newCategory);
		setFromId(newUnits[0]?.id ?? "");
		setToId(newUnits[1]?.id ?? newUnits[0]?.id ?? "");
		setInputValue("");
	}

	function handleFromSelect(index: number) {
		const unit = categoryUnits[index];
		if (unit) setFromId(unit.id);
	}

	function handleToSelect(index: number) {
		const unit = categoryUnits[index];
		if (unit) setToId(unit.id);
	}

	const toUnit = categoryUnits[toIndex];
	const result = useMemo(() => {
		const num = parseFloat(inputValue);
		if (isNaN(num) || !fromUnit || !toUnit) return null;
		return convert(num, fromUnit, toUnit);
	}, [inputValue, fromUnit, toUnit]);

	return (
		<div className="space-y-4 sm:space-y-6">
			<CategoryNav active={category} onChange={handleCategoryChange} />

			{/* Input */}
			<div className="text-center">
				<input
					type="number"
					inputMode="decimal"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder="0"
					autoFocus
					className="w-40 sm:w-56 text-center font-mono text-3xl sm:text-5xl font-medium bg-transparent outline-none placeholder:text-subtle text-ink [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
					style={{ caretColor: "var(--color-accent)" }}
				/>
			</div>

			{/* Dual Scroll Wheels */}
			<div className="relative">
				{/* Center row indicator lines */}
				<div
					className="absolute inset-x-0 pointer-events-none z-10"
					style={{ top: SPACER_HEIGHT, height: ITEM_HEIGHT }}
				>
					<div className="h-px bg-subtle absolute top-0 inset-x-4 sm:inset-x-8" />
					<div className="h-px bg-subtle absolute bottom-0 inset-x-4 sm:inset-x-8" />
				</div>

				{/* Equals sign — positioned at center row, above the mask */}
				<div
					className="absolute left-1/2 -translate-x-1/2 z-20 flex items-center justify-center pointer-events-none"
					style={{ top: SPACER_HEIGHT, height: ITEM_HEIGHT }}
				>
					<span className="text-xl sm:text-2xl font-display italic text-accent select-none">
						=
					</span>
				</div>

				<div className="flex items-start">
					{/* Left wheel (FROM) */}
					<ScrollWheel
						unitList={categoryUnits}
						selectedIndex={fromIndex}
						onSelect={handleFromSelect}
						getDisplayValue={getDisplayValue}
						align="right"
					/>

					{/* Spacer for equals sign */}
					<div
						className="flex-shrink-0 w-8 sm:w-12"
						style={{ height: WHEEL_HEIGHT }}
					/>

					{/* Right wheel (TO) */}
					<ScrollWheel
						unitList={categoryUnits}
						selectedIndex={toIndex}
						onSelect={handleToSelect}
						getDisplayValue={getDisplayValue}
						align="left"
					/>
				</div>
			</div>

			{/* Sentence */}
			{result !== null && fromUnit && toUnit && (
				<p className="text-center font-display italic text-base sm:text-lg text-muted">
					{inputValue} {fromUnit.name.toLowerCase()} ={" "}
					{formatResult(result)} {toUnit.name.toLowerCase()}
				</p>
			)}
		</div>
	);
}
