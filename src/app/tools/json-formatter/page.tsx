import type { Metadata } from 'next';
import JsonFormatterClient from './json-formatter-client';
import { getCanonicalUrl } from '@/lib/config';

const toolTitle =
	'JSON Formatter | Format, Validate & Minify JSON Online - Free JSON Tool';
const toolDescription =
	'Free online JSON formatter for developers. Format, validate, minify, and beautify JSON data with syntax highlighting, error detection, and advanced options. Perfect for API responses and data manipulation.';
const toolDescriptionShort =
	'Free online JSON formatter with validation, beautification, and minification. Perfect for developers working with JSON data and APIs.';

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: toolTitle,
		description: toolDescription,
		keywords: [
			'json formatter',
			'json validator',
			'json minifier',
			'json beautifier',
			'json pretty print',
			'online json tool',
			'json syntax checker',
			'json parser',
			'json lint',
			'json editor',
			'free json formatter',
			'json compression',
			'json formatting',
			'api json formatter'
		],
		robots: 'index, follow',
		alternates: {
			canonical: getCanonicalUrl('/tools/json-formatter')
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

export default function JsonFormatterPage() {
	return <JsonFormatterClient />;
}
