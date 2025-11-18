import type { Metadata } from 'next';
import FaviconGeneratorClient from './favicon-generator-client';
import { getCanonicalUrl } from '@/lib/config';

const toolTitle = 'Favicon Generator | Create Custom Favicon Packs Online Free';
const toolDescription = 'Free favicon generator for creating multi-size favicon packs from images. Generate PNG favicons, ICO files, and HTML link tags. Create custom favicons with background colors and quality settings. Download complete favicon packs.';
const toolDescriptionShort = 'Free favicon generator for creating multi-size favicon packs from images. Generate PNG favicons, ICO files, and HTML link tags.';

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: toolTitle,
		description: toolDescription,
		keywords: [
			'favicon generator',
			'free favicon',
			'favicon maker',
			'favicon creator',
			'ico generator',
			'favicon pack',
			'website icon',
			'favicon converter',
			'favicon online',
			'favicon tool'
		],
		robots: 'index, follow',
		alternates: {
			canonical: getCanonicalUrl('/tools/favicon-generator')
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

export default function FaviconGeneratorPage() {
	return <FaviconGeneratorClient />;
}