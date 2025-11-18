import { NextRequest, NextResponse } from "next/server";
import { faviconGeneratorRequestSchema, faviconGeneratorResponseSchema } from "@/lib/validators/favicon-generator";
import { generateFaviconPack, createFaviconZip, validateFaviconImage } from "@/lib/services/favicon-generator";

/**
 * POST /api/favicon-generator
 * Generates a favicon pack from an uploaded image
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
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
    let faviconPack;
    try {
      faviconPack = await generateFaviconPack(validation.data);
    } catch (error) {
      console.error("Favicon generation error:", error);
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "Failed to generate favicons",
        },
        { status: 500 }
      );
    }

    // Return successful response
    const response = faviconGeneratorResponseSchema.parse({
      success: true,
      data: faviconPack,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/favicon-generator/download
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