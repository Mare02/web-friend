import type { Metadata } from "next";
import ApiTesterClient from "./api-tester-client";

export const metadata: Metadata = {
  title: "API Tester | REST API Testing Tool with Authentication Support",
  description: "Free API testing tool for developers. Test REST APIs with GET, POST, PUT, DELETE methods. Support for authentication, headers, query parameters, and request body. Save and organize your API calls.",
  keywords: ["API tester", "REST API testing", "API debugging", "HTTP client", "API development tool", "REST client", "API authentication", "developer tools", "free API tester"],
  openGraph: {
    title: "API Tester | REST API Testing Tool with Authentication Support",
    description: "Free API testing tool for developers. Test REST APIs with GET, POST, PUT, DELETE methods. Support for authentication, headers, query parameters, and request body.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "API Tester | REST API Testing Tool with Authentication Support",
    description: "Free API testing tool for developers. Test REST APIs with GET, POST, PUT, DELETE methods. Support for authentication, headers, query parameters, and request body.",
  },
};

export default function ApiTesterPage() {
  return <ApiTesterClient />;
}
