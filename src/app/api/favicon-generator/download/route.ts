import { NextRequest, NextResponse } from "next/server";
import { faviconGeneratorRequestSchema } from "@/lib/validators/favicon-generator";
import { generateFaviconPack, createFaviconZip, validateFaviconImage } from "@/lib/services/favicon-generator";

/**
 * PUT /api/favicon-generator/download
 * Downloads favicon pack as ZIP file
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = faviconGeneratorRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues[0]?.message || "Invalid input",
        },
        { status: 400 }
      );
    }

    const { image, options } = validation.data;

    // Convert base64 to buffer and validate image
    const imageBuffer = Buffer.from(image.replace(/^data:image\/[a-z]+;base64,/, ''), 'base64');

    const imageValidation = await validateFaviconImage(imageBuffer);
    if (!imageValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: imageValidation.error || "Invalid image",
        },
        { status: 400 }
      );
    }

    // Generate favicon pack
    const faviconPack = await generateFaviconPack(validation.data);

    // Create ZIP file
    const zipBuffer = await createFaviconZip(faviconPack);

    // Return ZIP file as download
    return new NextResponse(new Uint8Array(zipBuffer), {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="favicon-pack-${Date.now()}.zip"`,
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create download",
      },
      { status: 500 }
    );
  }
}
