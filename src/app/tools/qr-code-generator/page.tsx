import type { Metadata } from 'next';
import QRCodeGeneratorClient from './qr-code-generator-client';
import { getCanonicalUrl } from '@/lib/config';

const toolTitle = 'QR Code Generator | Create Custom QR Codes Online Free';
const toolDescription =
	'Free QR code generator for URLs, text, email, phone numbers, and WiFi networks. Create custom QR codes with colors, logos, and advanced settings. Download in PNG, SVG formats.';
const toolDescriptionShort =
	'Free QR code generator for URLs, text, email, phone numbers, and WiFi networks. Create custom QR codes with colors, logos, and advanced settings.';

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: toolTitle,
		description: toolDescription,
		keywords: [
			'QR code generator',
			'free QR code',
			'custom QR code',
			'QR code maker',
			'URL to QR',
			'text to QR',
			'WiFi QR code',
			'contact QR code',
			'download QR code'
		],
		robots: 'index, follow',
		alternates: {
			canonical: getCanonicalUrl('/tools/qr-code-generator')
		},
		openGraph: {
			title: toolTitle,
			description: toolDescriptionShort,
			type: 'website'
		},
		twitter: {
			card: 'summary_large_image',
			title: toolTitle,
			description: toolDescriptionShort
		}
	};
}

export default function QRCodeGeneratorPage() {
	return <QRCodeGeneratorClient />;
}
