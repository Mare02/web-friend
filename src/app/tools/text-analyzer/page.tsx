import type { Metadata } from 'next';
import TextAnalyzerClient from './text-analyzer-client';
import { getCanonicalUrl } from '@/lib/config';

const toolTitle =
	'Text Analyzer | Readability, SEO & Content Quality Analysis Tool';
const toolDescription =
	'Free text analyzer tool for writers, marketers, and content creators. Check readability scores, SEO keywords, content metrics, and grammar analysis. Improve your writing quality instantly.';
const toolDescriptionShort =
	'Free text analyzer tool for writers, marketers, and content creators. Check readability scores, SEO keywords, content metrics, and grammar analysis.';

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: toolTitle,
		description: toolDescription,
		keywords: [
			'text analyzer',
			'readability checker',
			'SEO content analysis',
			'content quality',
			'grammar checker',
			'writing tool',
			'keyword density',
			'text metrics',
			'free writing tool'
		],
		robots: 'index, follow',
		alternates: {
			canonical: getCanonicalUrl('/tools/text-analyzer')
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

export default function TextAnalyzerPage() {
	return <TextAnalyzerClient />;
}
