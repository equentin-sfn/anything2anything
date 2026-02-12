"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
	categories,
	getUnitsByCategoryAndMode,
	getAvailableModesForCategory,
	convert,
	formatResult,
	formatCompact,
	type Category,
	type Mode,
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
	isExpanded,
	isReceded,
	onExpandToggle,
	filterText,
	onFilterChange,
	align,
}: {
	unitList: Unit[];
	selectedIndex: number;
	onSelect: (index: number) => void;
	getDisplayValue?: (unit: Unit, isCenter: boolean) => string;
	isExpanded: boolean;
	isReceded: boolean;
	onExpandToggle: () => void;
	filterText: string;
	onFilterChange: (text: string) => void;
	align: "left" | "right";
}) {
	const wheelRef = useRef<HTMLDivElement>(null);
	const filterRef = useRef<HTMLInputElement>(null);
	const isProgrammatic = useRef(false);
	const scrollTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
	const lastReported = useRef(selectedIndex);
	const wasExpanded = useRef(false);

	const displayUnits =
		isExpanded && filterText
			? unitList.filter(
					(u) =>
						u.name.toLowerCase().includes(filterText.toLowerCase()) ||
						u.symbol.toLowerCase().includes(filterText.toLowerCase()),
				)
			: unitList;

	useEffect(() => {
		if (isExpanded) {
			const t = setTimeout(() => filterRef.current?.focus(), 50);
			return () => clearTimeout(t);
		}
	}, [isExpanded]);

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
		"linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.04) 4%, rgba(0,0,0,0.15) 12%, rgba(0,0,0,0.4) 22%, black 36%, black 64%, rgba(0,0,0,0.4) 78%, rgba(0,0,0,0.15) 88%, rgba(0,0,0,0.04) 96%, transparent 100%)";

	const expandedMaskGradient =
		"linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)";

	const showNumbers = !!getDisplayValue;

	return (
		<div
			className={`relative transition-all duration-300 ${
				isReceded
					? "opacity-15 pointer-events-none scale-[0.98]"
					: "opacity-100 scale-100"
			}`}
			style={{ flex: isExpanded ? "1 1 100%" : undefined }}
		>
			{/* Filter input when expanded */}
			<div
				className={`absolute top-0 inset-x-0 z-30 transition-all duration-300 ${
					isExpanded
						? "opacity-100 translate-y-0"
						: "opacity-0 -translate-y-2 pointer-events-none"
				}`}
			>
				<input
					ref={filterRef}
					type="text"
					value={filterText}
					onChange={(e) => onFilterChange(e.target.value)}
					placeholder="Filter…"
					className="w-full text-xs font-body tracking-[0.12em] uppercase px-4 py-3 bg-transparent outline-none text-ink placeholder:text-muted/40"
					onClick={(e) => e.stopPropagation()}
				/>
				<div className="h-px mx-4 bg-accent/25" />
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
					maskImage: isExpanded ? expandedMaskGradient : maskGradient,
					WebkitMaskImage: isExpanded ? expandedMaskGradient : maskGradient,
				}}
			>
				<div style={{ height: SPACER_HEIGHT }} aria-hidden="true" />

				{displayUnits.map((unit) => {
					const originalIndex = unitList.indexOf(unit);
					const isSelected = originalIndex === selectedIndex;
					const isCenter = !isExpanded && isSelected;

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
							className={`flex items-center transition-all duration-300 ease-out ${
								isExpanded
									? `cursor-pointer px-4 border-l-2 ${
											isSelected
												? "border-accent"
												: "border-transparent hover:border-ink/10"
										}`
									: isCenter
										? "cursor-pointer"
										: ""
							} ${
								showNumbers
									? align === "left"
										? "pl-4 pr-3 gap-2"
										: "pr-4 pl-3 gap-2 flex-row-reverse"
									: align === "left"
										? "pl-4 pr-3"
										: "pr-4 pl-3 justify-end"
							}`}
							style={{
								height: ITEM_HEIGHT,
								scrollSnapAlign: isExpanded ? undefined : "center",
							}}
						>
							{/* Number (only on TO wheel) */}
							{showNumbers && (
								<span
									className={`font-mono tabular-nums whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
										isExpanded
											? isSelected
												? "text-base font-semibold text-ink"
												: "text-base text-ink/60"
											: isCenter
												? "text-2xl sm:text-3xl md:text-4xl font-semibold text-ink"
												: "text-sm sm:text-base text-ink/20"
									}`}
								>
									{getDisplayValue(unit, isCenter)}
								</span>
							)}

							{/* Unit name */}
							<span
								className={`font-body uppercase transition-all duration-300 min-w-0 truncate ${
									isExpanded
										? isSelected
											? "text-sm tracking-[0.10em] font-medium text-accent"
											: "text-sm tracking-[0.08em] text-ink/40"
										: isCenter
											? showNumbers
												? "text-xs sm:text-sm tracking-[0.12em] font-medium text-accent"
												: "text-base sm:text-lg tracking-[0.12em] font-medium text-accent"
											: showNumbers
												? "text-[9px] sm:text-xs tracking-[0.06em] text-ink/15"
												: "text-xs sm:text-sm tracking-[0.06em] text-ink/20"
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
						className="flex items-center justify-center text-sm text-muted font-body"
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
		<nav className="flex gap-3 sm:gap-5 overflow-x-auto hide-scrollbar px-4">
			{categories.map((cat) => (
				<button
					key={cat.id}
					ref={active === cat.id ? activeRef : undefined}
					onClick={() => onChange(cat.id)}
					className={`text-xs sm:text-sm font-body tracking-[0.12em] uppercase whitespace-nowrap pb-1.5 border-b transition-all duration-200 ${
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

// ─── Mode Navigation ─────────────────────────────────────────────────────────

const MODE_LABELS: Record<Mode | "everything", string> = {
	everything: "All",
	all: "Standard",
	kitchen: "Kitchen",
	newsroom: "Newsroom",
	fun: "Fun",
	workshop: "Workshop",
	dev: "Dev",
};

function ModeNav({
	active,
	modes,
	onChange,
}: {
	active: Mode | "everything";
	modes: Mode[];
	onChange: (mode: Mode | "everything") => void;
}) {
	// Don't render if only one mode and it's "all"
	if (modes.length <= 1 && modes[0] === "all") return null;

	const options: (Mode | "everything")[] = ["everything", ...modes.filter((m) => m !== "all")];

	// Don't show if there are no extra modes beyond "all"
	if (options.length <= 1) return null;

	return (
		<div className="flex gap-2 sm:gap-3 overflow-x-auto hide-scrollbar px-4">
			{options.map((mode) => (
				<button
					key={mode}
					onClick={() => onChange(mode)}
					className={`text-[10px] sm:text-xs font-body tracking-[0.10em] uppercase whitespace-nowrap px-2.5 py-1 rounded-full transition-all duration-200 ${
						active === mode
							? "bg-ink text-[#F5F4F1]"
							: "text-muted hover:text-ink"
					}`}
				>
					{MODE_LABELS[mode]}
				</button>
			))}
		</div>
	);
}

// ─── Main Converter ──────────────────────────────────────────────────────────

export function Converter() {
	const [category, setCategory] = useState<Category>("length");
	const [mode, setMode] = useState<Mode | "everything">("everything");
	const [fromId, setFromId] = useState("km");
	const [toId, setToId] = useState("mi");
	const [inputValue, setInputValue] = useState("");
	const [expandedWheel, setExpandedWheel] = useState<"from" | "to" | null>(
		null,
	);
	const [filterText, setFilterText] = useState("");
	const panelRef = useRef<HTMLDivElement>(null);

	const availableModes = useMemo(
		() => getAvailableModesForCategory(category),
		[category],
	);

	const filteredUnits = useMemo(
		() => getUnitsByCategoryAndMode(category, mode),
		[category, mode],
	);

	const fromIndex = Math.max(
		0,
		filteredUnits.findIndex((u) => u.id === fromId),
	);
	const toIndex = Math.max(
		0,
		filteredUnits.findIndex((u) => u.id === toId),
	);
	const fromUnit = filteredUnits[fromIndex];

	const getDisplayValue = useCallback(
		(unit: Unit, isCenter: boolean) => {
			const num = parseFloat(inputValue);
			if (isNaN(num) || !fromUnit) return "–";
			const result = convert(num, fromUnit, unit);
			return isCenter ? formatResult(result) : formatCompact(result);
		},
		[inputValue, fromUnit],
	);

	// Click-outside to collapse
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
		// Reset mode if current mode has no units in new category
		const newModes = getAvailableModesForCategory(newCategory);
		const hasExtraModes = newModes.some((m) => m !== "all");
		if (!hasExtraModes) {
			setMode("everything");
		}
		const newUnits = getUnitsByCategoryAndMode(newCategory, hasExtraModes ? mode : "everything");
		setFromId(newUnits[0]?.id ?? "");
		setToId(newUnits[1]?.id ?? newUnits[0]?.id ?? "");
		setInputValue("");
		setExpandedWheel(null);
		setFilterText("");
	}

	function handleModeChange(newMode: Mode | "everything") {
		setMode(newMode);
		const newUnits = getUnitsByCategoryAndMode(category, newMode);
		// Keep current selections if they exist in the new set
		const fromStillExists = newUnits.some((u) => u.id === fromId);
		const toStillExists = newUnits.some((u) => u.id === toId);
		if (!fromStillExists) setFromId(newUnits[0]?.id ?? "");
		if (!toStillExists) setToId(newUnits[1]?.id ?? newUnits[0]?.id ?? "");
		setExpandedWheel(null);
		setFilterText("");
	}

	function handleFromSelect(index: number) {
		const unit = filteredUnits[index];
		if (unit) setFromId(unit.id);
	}

	function handleToSelect(index: number) {
		const unit = filteredUnits[index];
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

	const toUnit = filteredUnits[toIndex];
	const result = useMemo(() => {
		const num = parseFloat(inputValue);
		if (isNaN(num) || !fromUnit || !toUnit) return null;
		return convert(num, fromUnit, toUnit);
	}, [inputValue, fromUnit, toUnit]);

	// Format input for display in the number column
	const displayInput = useMemo(() => {
		if (!inputValue) return "0";
		const num = parseFloat(inputValue);
		if (isNaN(num)) return inputValue;
		return formatCompact(num);
	}, [inputValue]);

	return (
		<div className="space-y-4 sm:space-y-5">
			<CategoryNav active={category} onChange={handleCategoryChange} />

			<ModeNav
				active={mode}
				modes={availableModes}
				onChange={handleModeChange}
			/>

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
					className="w-40 sm:w-48 text-center font-mono text-4xl sm:text-5xl font-medium bg-transparent outline-none placeholder:text-subtle text-ink [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
					style={{ caretColor: "var(--color-accent)" }}
				/>
			</div>

			{/* Fruit Machine Tuning Window */}
			<div
				ref={panelRef}
				className="relative bg-panel rounded-sm overflow-hidden"
				style={{
					boxShadow:
						"inset 0 2px 8px rgba(0,0,0,0.09), inset 0 1px 2px rgba(0,0,0,0.07), 0 1px 0 rgba(255,255,255,0.45), 0 0 0 1px rgba(0,0,0,0.05)",
				}}
			>
				{/* Indicator lines — the pay line */}
				<div
					className={`absolute inset-x-0 pointer-events-none z-10 transition-opacity duration-300 ${
						expandedWheel ? "opacity-0" : "opacity-100"
					}`}
				>
					<div
						className="h-px bg-accent/40 mx-3 sm:mx-4"
						style={{ position: "absolute", top: SPACER_HEIGHT, left: 0, right: 0 }}
					/>
					<div
						className="h-px bg-accent/40 mx-3 sm:mx-4"
						style={{ position: "absolute", top: SPACER_HEIGHT + ITEM_HEIGHT, left: 0, right: 0 }}
					/>
				</div>

				<div className="flex items-start">
					{/* Column 1: Static input number */}
					<div
						className={`flex-shrink-0 relative transition-all duration-300 ${
							expandedWheel ? "w-0 opacity-0 overflow-hidden" : "w-16 sm:w-24 opacity-100"
						}`}
						style={{ height: WHEEL_HEIGHT }}
					>
						<div
							className="absolute inset-x-0 flex items-center justify-end pr-1 sm:pr-2"
							style={{ top: SPACER_HEIGHT, height: ITEM_HEIGHT }}
						>
							<span className="font-mono text-2xl sm:text-3xl md:text-4xl font-semibold text-ink tabular-nums whitespace-nowrap">
								{displayInput}
							</span>
						</div>
					</div>

					{/* Column 2: FROM unit wheel (names only) */}
					<div
						className={`transition-all duration-300 overflow-hidden ${
							expandedWheel === "from"
								? "flex-1"
								: expandedWheel === "to"
									? "w-0 opacity-0"
									: "w-28 sm:w-36 md:w-44"
						}`}
					>
						<ScrollWheel
							unitList={filteredUnits}
							selectedIndex={fromIndex}
							onSelect={handleFromSelect}
							isExpanded={expandedWheel === "from"}
							isReceded={expandedWheel === "to"}
							onExpandToggle={() => handleExpandToggle("from")}
							filterText={
								expandedWheel === "from" ? filterText : ""
							}
							onFilterChange={setFilterText}
							align="left"
						/>
					</div>

					{/* Column 3: Equals divider */}
					<div
						className={`flex-shrink-0 relative transition-all duration-300 ${
							expandedWheel ? "w-0 opacity-0 overflow-hidden" : "w-8 sm:w-10 opacity-100"
						}`}
						style={{ height: WHEEL_HEIGHT }}
					>
						<div
							className="absolute inset-x-0 flex items-center justify-center"
							style={{ top: SPACER_HEIGHT, height: ITEM_HEIGHT }}
						>
							<span className="text-lg sm:text-xl font-display italic text-accent select-none">
								=
							</span>
						</div>
						{/* Subtle vertical dividers */}
						<div
							className="absolute top-0 left-0 h-full w-px bg-rule/30"
							style={{
								maskImage: "linear-gradient(to bottom, transparent 10%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.5) 70%, transparent 90%)",
								WebkitMaskImage: "linear-gradient(to bottom, transparent 10%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.5) 70%, transparent 90%)",
							}}
						/>
						<div
							className="absolute top-0 right-0 h-full w-px bg-rule/30"
							style={{
								maskImage: "linear-gradient(to bottom, transparent 10%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.5) 70%, transparent 90%)",
								WebkitMaskImage: "linear-gradient(to bottom, transparent 10%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.5) 70%, transparent 90%)",
							}}
						/>
					</div>

					{/* Column 4: TO answer wheel (numbers + unit names) */}
					<div
						className={`transition-all duration-300 overflow-hidden ${
							expandedWheel === "to"
								? "flex-1"
								: expandedWheel === "from"
									? "w-0 opacity-0"
									: "flex-1"
						}`}
					>
						<ScrollWheel
							unitList={filteredUnits}
							selectedIndex={toIndex}
							onSelect={handleToSelect}
							getDisplayValue={getDisplayValue}
							isExpanded={expandedWheel === "to"}
							isReceded={expandedWheel === "from"}
							onExpandToggle={() => handleExpandToggle("to")}
							filterText={
								expandedWheel === "to" ? filterText : ""
							}
							onFilterChange={setFilterText}
							align="left"
						/>
					</div>
				</div>
			</div>

			{/* Sentence */}
			<div
				className={`transition-opacity duration-300 ${
					expandedWheel ? "opacity-0" : "opacity-100"
				}`}
			>
				{result !== null && fromUnit && toUnit && (
					<p className="text-center font-display italic text-base sm:text-lg text-muted">
						{inputValue} {fromUnit.name.toLowerCase()} ={" "}
						{formatResult(result)} {toUnit.name.toLowerCase()}
					</p>
				)}
			</div>
		</div>
	);
}
