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

const ITEM_HEIGHT = 48;
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
	isExpanded,
	isReceded,
	onExpandToggle,
	filterText,
	onFilterChange,
}: {
	unitList: Unit[];
	selectedIndex: number;
	onSelect: (index: number) => void;
	getDisplayValue: (unit: Unit) => string;
	align: "left" | "right";
	isExpanded: boolean;
	isReceded: boolean;
	onExpandToggle: () => void;
	filterText: string;
	onFilterChange: (text: string) => void;
}) {
	const wheelRef = useRef<HTMLDivElement>(null);
	const filterRef = useRef<HTMLInputElement>(null);
	const isProgrammatic = useRef(false);
	const scrollTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
	const lastReported = useRef(selectedIndex);
	const wasExpanded = useRef(false);

	// Filter units when expanded
	const displayUnits =
		isExpanded && filterText
			? unitList.filter(
					(u) =>
						u.name.toLowerCase().includes(filterText.toLowerCase()) ||
						u.symbol.toLowerCase().includes(filterText.toLowerCase()),
				)
			: unitList;

	// Focus filter input when expanded
	useEffect(() => {
		if (isExpanded) {
			const t = setTimeout(() => filterRef.current?.focus(), 50);
			return () => clearTimeout(t);
		}
	}, [isExpanded]);

	// Scroll to selected position when collapsing from expanded
	useEffect(() => {
		const wasExp = wasExpanded.current;
		wasExpanded.current = isExpanded;

		if (wasExp && !isExpanded && wheelRef.current) {
			isProgrammatic.current = true;
			lastReported.current = selectedIndex;
			wheelRef.current.scrollTop = selectedIndex * ITEM_HEIGHT;
			const t = setTimeout(() => {
				isProgrammatic.current = false;
			}, 150);
			return () => clearTimeout(t);
		}
	}, [isExpanded, selectedIndex]);

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
		if (!wheelRef.current || isProgrammatic.current || isExpanded) return;

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
	}, [unitList.length, onSelect, isExpanded]);

	const maskGradient =
		"linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.06) 4%, rgba(0,0,0,0.2) 12%, rgba(0,0,0,0.5) 24%, black 38%, black 62%, rgba(0,0,0,0.5) 76%, rgba(0,0,0,0.2) 88%, rgba(0,0,0,0.06) 96%, transparent 100%)";

	return (
		<div
			className={`relative flex-1 transition-all duration-300 ${
				isReceded
					? "opacity-15 pointer-events-none scale-[0.98]"
					: "opacity-100 scale-100"
			}`}
		>
			{/* Filter input — overlays top of wheel when expanded */}
			<div
				className={`absolute top-0 inset-x-0 z-30 bg-panel/95 backdrop-blur-sm border-b border-rule transition-all duration-300 ${
					isExpanded
						? "opacity-100 translate-y-0"
						: "opacity-0 -translate-y-1 pointer-events-none"
				}`}
			>
				<input
					ref={filterRef}
					type="text"
					value={filterText}
					onChange={(e) => onFilterChange(e.target.value)}
					placeholder="Filter…"
					className={`w-full text-xs font-body tracking-wide px-3 sm:px-5 py-3 bg-transparent outline-none text-ink placeholder:text-muted/60 ${
						align === "right" ? "text-right" : "text-left"
					}`}
					onClick={(e) => e.stopPropagation()}
				/>
			</div>

			{/* Wheel */}
			<div
				ref={wheelRef}
				onScroll={handleScroll}
				className="overflow-y-auto hide-scrollbar will-change-scroll"
				style={{
					height: WHEEL_HEIGHT,
					scrollSnapType: isExpanded ? "none" : "y mandatory",
					WebkitOverflowScrolling: "touch",
					maskImage: isExpanded ? "none" : maskGradient,
					WebkitMaskImage: isExpanded ? "none" : maskGradient,
				}}
			>
				<div style={{ height: SPACER_HEIGHT }} aria-hidden="true" />

				{displayUnits.map((unit) => {
					const originalIndex = unitList.indexOf(unit);
					const isSelected = originalIndex === selectedIndex;
					const isCenter = !isExpanded && isSelected;
					const value = getDisplayValue(unit);

					return (
						<div
							key={unit.id}
							onClick={() => {
								if (isExpanded) {
									onSelect(originalIndex);
									onExpandToggle();
								} else if (isCenter) {
									onExpandToggle();
								}
							}}
							className={`flex items-center gap-1.5 sm:gap-2 transition-all duration-300 ease-out border-b border-rule/40 ${
								isExpanded
									? `cursor-pointer ${
											isSelected
												? "bg-accent/[0.06]"
												: "hover:bg-ink/[0.02]"
										}`
									: isCenter
										? "cursor-pointer"
										: ""
							} ${
								align === "right"
									? "justify-end pr-3 sm:pr-5"
									: "justify-start pl-3 sm:pl-5"
							}`}
							style={{
								height: ITEM_HEIGHT,
								scrollSnapAlign: isExpanded ? undefined : "center",
							}}
						>
							<span
								className={`font-mono tabular-nums whitespace-nowrap transition-all duration-300 ${
									isExpanded
										? isSelected
											? "text-sm sm:text-base font-semibold text-ink"
											: "text-sm sm:text-base text-ink/60"
										: isCenter
											? "text-xl sm:text-2xl md:text-3xl font-semibold text-ink"
											: "text-xs sm:text-sm text-ink/20"
								}`}
							>
								{value}
							</span>
							<span
								className={`font-body uppercase transition-all duration-300 min-w-0 truncate ${
									isExpanded
										? isSelected
											? "text-[10px] sm:text-xs tracking-[0.12em] font-medium text-accent"
											: "text-[10px] sm:text-xs tracking-[0.10em] text-ink/40"
										: isCenter
											? "text-[9px] sm:text-[11px] tracking-[0.14em] font-medium text-accent"
											: "text-[7px] sm:text-[9px] tracking-[0.08em] text-ink/12"
								}`}
							>
								{isExpanded ? (
									unit.name
								) : (
									<>
										<span className="hidden sm:inline">
											{unit.name}
										</span>
										<span className="sm:hidden">
											{unit.symbol}
										</span>
									</>
								)}
							</span>
						</div>
					);
				})}

				{displayUnits.length === 0 && isExpanded && (
					<div
						className="flex items-center justify-center text-xs text-muted font-body"
						style={{ height: ITEM_HEIGHT }}
					>
						No matches
					</div>
				)}

				<div style={{ height: SPACER_HEIGHT }} aria-hidden="true" />
			</div>
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
		<nav className="flex justify-center gap-3 sm:gap-5 overflow-x-auto hide-scrollbar px-4">
			{categories.map((cat) => (
				<button
					key={cat.id}
					ref={active === cat.id ? activeRef : undefined}
					onClick={() => onChange(cat.id)}
					className={`text-[10px] sm:text-xs font-body tracking-[0.14em] uppercase whitespace-nowrap pb-1.5 border-b transition-all duration-200 ${
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
	const [expandedWheel, setExpandedWheel] = useState<"from" | "to" | null>(
		null,
	);
	const [filterText, setFilterText] = useState("");
	const panelRef = useRef<HTMLDivElement>(null);

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

	// Click-outside handler to collapse expanded wheel
	useEffect(() => {
		if (!expandedWheel) return;
		function handleClickOutside(e: MouseEvent) {
			if (
				panelRef.current &&
				!panelRef.current.contains(e.target as Node)
			) {
				setExpandedWheel(null);
				setFilterText("");
			}
		}
		const t = setTimeout(() => {
			document.addEventListener("mousedown", handleClickOutside);
		}, 10);
		return () => {
			clearTimeout(t);
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [expandedWheel]);

	function handleCategoryChange(newCategory: Category) {
		setCategory(newCategory);
		const newUnits = getUnitsByCategory(newCategory);
		setFromId(newUnits[0]?.id ?? "");
		setToId(newUnits[1]?.id ?? newUnits[0]?.id ?? "");
		setInputValue("");
		setExpandedWheel(null);
		setFilterText("");
	}

	function handleFromSelect(index: number) {
		const unit = categoryUnits[index];
		if (unit) setFromId(unit.id);
	}

	function handleToSelect(index: number) {
		const unit = categoryUnits[index];
		if (unit) setToId(unit.id);
	}

	function handleExpandToggle(wheel: "from" | "to") {
		if (expandedWheel === wheel) {
			setExpandedWheel(null);
			setFilterText("");
		} else {
			setExpandedWheel(wheel);
			setFilterText("");
		}
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
			<div
				className={`text-center transition-opacity duration-300 ${
					expandedWheel ? "opacity-30" : "opacity-100"
				}`}
			>
				<input
					type="number"
					inputMode="decimal"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder="0"
					autoFocus
					className="w-40 sm:w-48 text-center font-mono text-3xl sm:text-4xl font-medium bg-transparent outline-none placeholder:text-subtle text-ink [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
					style={{ caretColor: "var(--color-accent)" }}
				/>
			</div>

			{/* Tuning Window */}
			<div
				ref={panelRef}
				className="relative bg-panel rounded-sm overflow-hidden"
				style={{
					boxShadow:
						"inset 0 1px 4px rgba(0,0,0,0.06), inset 0 0 1px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)",
				}}
			>
				{/* Single accent indicator line — the tuning line */}
				<div
					className={`absolute inset-x-0 pointer-events-none z-10 transition-opacity duration-300 ${
						expandedWheel ? "opacity-0" : "opacity-100"
					}`}
					style={{
						top: SPACER_HEIGHT + ITEM_HEIGHT / 2 - 0.5,
					}}
				>
					<div className="h-px bg-accent/50 mx-3 sm:mx-5" />
				</div>

				{/* Equals sign — positioned at center row */}
				<div
					className={`absolute left-1/2 -translate-x-1/2 z-20 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
						expandedWheel ? "opacity-0" : "opacity-100"
					}`}
					style={{ top: SPACER_HEIGHT, height: ITEM_HEIGHT }}
				>
					<span className="text-base sm:text-lg font-display italic text-accent select-none">
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
						isExpanded={expandedWheel === "from"}
						isReceded={expandedWheel === "to"}
						onExpandToggle={() => handleExpandToggle("from")}
						filterText={
							expandedWheel === "from" ? filterText : ""
						}
						onFilterChange={setFilterText}
					/>

					{/* Spacer for equals sign */}
					<div
						className={`flex-shrink-0 transition-all duration-300 overflow-hidden ${
							expandedWheel ? "w-0" : "w-6 sm:w-10"
						}`}
						style={{ height: WHEEL_HEIGHT }}
					/>

					{/* Right wheel (TO) */}
					<ScrollWheel
						unitList={categoryUnits}
						selectedIndex={toIndex}
						onSelect={handleToSelect}
						getDisplayValue={getDisplayValue}
						align="left"
						isExpanded={expandedWheel === "to"}
						isReceded={expandedWheel === "from"}
						onExpandToggle={() => handleExpandToggle("to")}
						filterText={
							expandedWheel === "to" ? filterText : ""
						}
						onFilterChange={setFilterText}
					/>
				</div>
			</div>

			{/* Sentence */}
			<div
				className={`transition-opacity duration-300 ${
					expandedWheel ? "opacity-0" : "opacity-100"
				}`}
			>
				{result !== null && fromUnit && toUnit && (
					<p className="text-center font-display italic text-sm sm:text-base text-muted">
						{inputValue} {fromUnit.name.toLowerCase()} ={" "}
						{formatResult(result)} {toUnit.name.toLowerCase()}
					</p>
				)}
			</div>
		</div>
	);
}
