import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono, DM_Sans, Jost } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
	weight: "400",
	style: ["normal", "italic"],
	subsets: ["latin"],
	variable: "--font-display",
	display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
	display: "swap",
});

const dmSans = DM_Sans({
	subsets: ["latin"],
	variable: "--font-body",
	display: "swap",
});

const jost = Jost({
	subsets: ["latin"],
	variable: "--font-logo",
	display: "swap",
});

export const metadata: Metadata = {
	title: "anything2anything — convert any unit to any unit",
	description:
		"The unit converter that does everything. Teaspoons to millilitres. Miles to moon distances. An eQuentin Experiment.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body
				className={`${instrumentSerif.variable} ${jetbrainsMono.variable} ${dmSans.variable} ${jost.variable} font-body antialiased bg-surface text-ink`}
			>
				{children}
			</body>
		</html>
	);
}
