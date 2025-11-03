import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";

/**
 * Not Found page for analysis routes
 */
export default function AnalysisNotFound() {
  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-2 text-destructive mb-2">
            <AlertCircle className="h-6 w-6" />
            <CardTitle>Analysis Not Found</CardTitle>
          </div>
          <CardDescription>
            The analysis you&apos;re looking for doesn&apos;t exist or may have been deleted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/" className="cursor-pointer">
            <Button className="w-full gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

