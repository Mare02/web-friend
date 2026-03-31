import type { Metadata } from 'next';
import DeviceMockupClient from './device-mockup-client';
import { getCanonicalUrl } from '@/lib/config';

const toolTitle = 'App Screenshot Mockup Generator | Create Stunning Phone Frames';
const toolDescription = 'Free online device mockup generator. Wrap your app screenshots in beautiful, realistic iPhone and Android frames. Perfect for App Store and Google Play listings with vibrant gradient backgrounds.';
const toolDescriptionShort = 'Wrap your app screenshots in realistic smartphone frames with vibrant gradient backgrounds for app store listings.';
export async function generateMetadata(): Promise<Metadata> {
	return {
		title: toolTitle,
		description: toolDescription,
		keywords: [
			'device mockup generator',
			'app store screenshots',
			'google play screenshots',
			'app mockup generator',
			'phone frame generator',
			'iphone mockup',
			'android mockup',
			'app listing images',
			'screenshot beautiful',
			'free mockup generator'
		],
		robots: 'index, follow',
		alternates: {
			canonical: getCanonicalUrl('/tools/device-mockup-generator')
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

export default function DeviceMockupPage() {
	return <DeviceMockupClient />;
}
