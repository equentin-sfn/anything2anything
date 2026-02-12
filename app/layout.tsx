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
	icons: {
		icon: [
			{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
			{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
		],
		apple: "/apple-touch-icon.png",
	},
	openGraph: {
		title: "anything2anything",
		description: "The unit converter that does everything.",
		images: [{ url: "/og-image.png", width: 1200, height: 630 }],
	},
	twitter: {
		card: "summary_large_image",
		title: "anything2anything",
		description: "The unit converter that does everything.",
		images: ["/og-image.png"],
	},
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
