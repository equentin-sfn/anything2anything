import { Converter } from "./converter";

export default function Home() {
	return (
		<main className="min-h-svh flex flex-col">
			<div className="flex-1 flex flex-col items-center justify-center px-6 py-8 sm:py-12">
				<h1 className="mb-6 sm:mb-10 select-none">
					<span className="font-body text-xl sm:text-2xl font-light tracking-tight">
						anything
					</span>
					<span className="font-display text-2xl sm:text-3xl italic text-accent mx-px">
						2
					</span>
					<span className="font-body text-xl sm:text-2xl font-light tracking-tight">
						anything
					</span>
				</h1>

				<div className="w-full max-w-2xl">
					<Converter />
				</div>
			</div>

			<footer className="py-6 text-center">
				<p className="text-[10px] font-body text-muted tracking-[0.25em] uppercase">
					No ads · No sign-up · Just conversion
				</p>
			</footer>
		</main>
	);
}
