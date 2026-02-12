import { Converter } from "./converter";

export default function Home() {
	return (
		<main className="min-h-svh flex flex-col">
			<div className="flex-1 flex flex-col items-center justify-center px-6 py-8 sm:py-12">
				<h1 className="mb-6 sm:mb-10 select-none flex flex-col items-center gap-2 sm:gap-3">
					{/* A2A Mark */}
					<img
						src="/logo-mark.png"
						alt="A2A"
						className="w-12 h-12 sm:w-16 sm:h-16"
					/>
					{/* Wordmark */}
					<span className="text-[10px] sm:text-xs tracking-[0.18em] text-muted lowercase" style={{ fontFamily: "var(--font-logo), sans-serif" }}>
						anything
						<span className="font-display italic text-accent mx-px">
							2
						</span>
						anything
					</span>
				</h1>

				<div className="w-full max-w-2xl">
					<Converter />
				</div>
			</div>

			<footer className="py-6 text-center space-y-1">
				<p className="text-[10px] font-body text-muted tracking-[0.25em] uppercase">
					An eQuentin Experiment
				</p>
				{process.env.NEXT_PUBLIC_COMMIT_SHA && (
					<p className="text-[9px] font-mono text-muted/50 tracking-wider">
						v{process.env.NEXT_PUBLIC_COMMIT_SHA}
					</p>
				)}
			</footer>
		</main>
	);
}
