/**
 * Clerk Webhook Handler
 * Syncs user data from Clerk to D1 database
 */

import { headers } from "next/headers";
import { Webhook } from "svix";
import { syncUserFromClerk } from "@/lib/services/user-service";

// Clerk webhook event types
type WebhookEvent = {
  type: string;
  data: {
    id: string;
    email_addresses?: Array<{ email_address: string }>;
    first_name?: string | null;
    last_name?: string | null;
    image_url?: string | null;
  };
};

export async function POST(req: Request): Promise<Response> {
  // Get the webhook secret from environment
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("Missing CLERK_WEBHOOK_SECRET environment variable");
    return Response.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return Response.json(
      { error: "Missing svix headers" },
      { status: 400 }
    );
  }

  // Get the body
  const payload = await req.text();

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  // Verify the webhook signature
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return Response.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  // Handle the webhook event
  const { type, data } = evt;

  try {
    if (type === "user.created" || type === "user.updated") {
      // Extract user data
      const userId = data.id;
      const email = data.email_addresses?.[0]?.email_address || null;
      const firstName = data.first_name || null;
      const lastName = data.last_name || null;
      const profileImageUrl = data.image_url || null;

      // Sync to database
      await syncUserFromClerk(
        userId,
        email,
        firstName,
        lastName,
        profileImageUrl
      );

      console.log(`User ${type}: ${userId}`);
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(`Error processing ${type} webhook:`, error);
    return Response.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}
