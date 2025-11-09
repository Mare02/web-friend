import type { Metadata } from 'next';
import ApiTesterClient from './api-tester-client';
import { getCanonicalUrl } from '@/lib/config';

const toolTitle =
	'API Tester | REST API Testing Tool with Authentication Support';
const toolDescription =
	'Free API testing tool for developers. Test REST APIs with GET, POST, PUT, DELETE methods. Support for authentication, headers, query parameters, and request body. Save and organize your API calls.';
const toolDescriptionShort =
	'Free API testing tool for developers. Test REST APIs with GET, POST, PUT, DELETE methods. Support for authentication, headers, query parameters, and request body.';

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: toolTitle,
		description: toolDescription,
		keywords: [
			'API tester',
			'REST API testing',
			'API debugging',
			'HTTP client',
			'API development tool',
			'REST client',
			'API authentication',
			'developer tools',
			'free API tester'
		],
		robots: 'index, follow',
		alternates: {
			canonical: getCanonicalUrl('/tools/api-tester')
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

export default function ApiTesterPage() {
	return <ApiTesterClient />;
}
