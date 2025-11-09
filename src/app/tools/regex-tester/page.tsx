import type { Metadata } from 'next';
import RegexTesterClient from './regex-tester-client';
import { getCanonicalUrl } from '@/lib/config';

const toolTitle =
	'Regex Tester | Test Regular Expressions Online - Pattern Matching Tool';
const toolDescription =
	'Free online regex tester for developers and data analysts. Test regular expressions with real-time matching, find & replace, pattern validation, and comprehensive regex pattern library. Supports all major regex flags.';
const toolDescriptionShort =
	'Free online regex tester with real-time matching, pattern validation, and comprehensive regex pattern library. Perfect for developers and data analysts.';

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: toolTitle,
		description: toolDescription,
		keywords: [
			'regex tester',
			'regular expressions',
			'pattern matching',
			'regex validator',
			'regex patterns',
			'regex find replace',
			'online regex tool',
			'regex debugger',
			'regex library',
			'javascript regex',
			'free regex tester'
		],
		robots: 'index, follow',
		alternates: {
			canonical: getCanonicalUrl('/tools/regex-tester')
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

export default function RegexTesterPage() {
	return <RegexTesterClient />;
}
