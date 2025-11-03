import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Scale,
  AlertTriangle,
  Users,
  Shield,
  ArrowLeft,
  CheckCircle,
  XCircle
} from "lucide-react";

export default function TermsPage() {
  return (
    <div>
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16 space-y-6 max-w-4xl mx-auto">
          <Badge variant="secondary" className="text-sm">
            Terms of Service
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Terms &
            <span className="block text-primary">Conditions</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            Please read these terms carefully before using Web Friend&apos;s services.
          </p>
          <div className="flex justify-center mt-6">
            <Link href="/" className="cursor-pointer">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-center mb-12">
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Terms Overview */}
        <div className="mb-12">
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Scale className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Agreement Overview</CardTitle>
              </div>
              <CardDescription className="text-base">
                By using Web Friend, you agree to these terms. These terms govern your use of our website analysis tools.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                  <span className="text-sm">Free to use analysis tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                  <span className="text-sm">No account required for basic use</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                  <span className="text-sm">Respectful use of services</span>
                </div>
                <div className="flex items-center gap-3">
                  <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                  <span className="text-sm">No malicious use allowed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Terms Content */}
        <div className="space-y-8">
          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              Acceptance of Terms
            </h2>
            <div className="space-y-6">
              <Card>
                <CardContent>
                  <p className="text-muted-foreground">
                    By accessing and using Web Friend, you accept and agree to be bound by the terms and provision
                    of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              Service Description
            </h2>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>What We Provide</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Web Friend provides website analysis tools including:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>AI-powered website analysis for SEO, performance, and accessibility</li>
                    <li>Text analysis for readability, SEO keywords, and content quality</li>
                    <li>Real-time analysis reports and recommendations</li>
                    <li>User account management and analysis history</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Service Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We strive to provide continuous service but do not guarantee uptime.
                    Services may be temporarily unavailable for maintenance or technical issues.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              User Responsibilities
            </h2>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Acceptable Use</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    You agree to use Web Friend only for lawful purposes and in accordance with these terms:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Analyze only websites you own or have permission to analyze</li>
                    <li>Respect website terms of service and robots.txt directives</li>
                    <li>Use analysis results responsibly and ethically</li>
                    <li>Do not attempt to circumvent service limitations</li>
                    <li>Do not use the service for competitive intelligence against others</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Prohibited Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    The following activities are strictly prohibited:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Analyzing websites without permission or for malicious purposes</li>
                    <li>Attempting to hack, damage, or disrupt our services</li>
                    <li>Using automated tools to access services excessively</li>
                    <li>Sharing false or misleading analysis results</li>
                    <li>Violating any applicable laws or regulations</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6">Privacy and Data</h2>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Data Ownership</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    You retain all rights to the websites and content you analyze.
                    Analysis results and reports generated by our tools are provided to you for your use.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-primary" />
              Disclaimers and Limitations
            </h2>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Accuracy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    While we strive for accuracy, analysis results are provided &quot;as is&quot; and may not be 100% accurate.
                    Results should be used as guidance rather than definitive assessments.
                    We recommend consulting professionals for critical decisions.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>No Warranties</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Web Friend is provided &quot;as is&quot; without warranty of any kind.
                    We do not guarantee that the service will be error-free or uninterrupted.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Limitation of Liability</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    In no event shall Web Friend be liable for any indirect, incidental, special, or consequential damages
                    arising out of or in connection with your use of our services.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6">Account Termination</h2>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Service Termination</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We reserve the right to terminate or suspend your access to our services immediately,
                    without prior notice, for violation of these terms or for any other reason we deem appropriate.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Deletion</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Upon account termination, we will delete your account data in accordance with our privacy policy.
                    Analysis results and temporary data will be permanently removed.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6">Changes to Terms</h2>
            <div className="space-y-6">
              <Card>
                <CardContent>
                  <p className="text-muted-foreground">
                    We reserve the right to modify these terms at any time. We will notify users of material changes
                    via email or through a notice on our website. Continued use of our services after changes
                    constitutes acceptance of the new terms.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6">Governing Law</h2>
            <div className="space-y-6">
              <Card>
                <CardContent>
                  <p className="text-muted-foreground">
                    These terms shall be governed by and construed in accordance with applicable laws.
                    Any disputes arising from these terms shall be resolved through appropriate legal channels.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
