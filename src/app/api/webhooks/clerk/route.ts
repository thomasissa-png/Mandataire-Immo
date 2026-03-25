import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { Webhook } from "svix"
import { query } from "@/lib/db"

interface ClerkUserCreatedEvent {
  data: {
    id: string
    email_addresses: Array<{
      email_address: string
      id: string
    }>
    first_name: string | null
    last_name: string | null
    created_at: number
  }
  type: "user.created"
}

export async function POST(request: Request) {
  const headersList = await headers()
  const svixId = headersList.get("svix-id")
  const svixTimestamp = headersList.get("svix-timestamp")
  const svixSignature = headersList.get("svix-signature")

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 }
    )
  }

  const body = await request.text()

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)

  let event: ClerkUserCreatedEvent

  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkUserCreatedEvent
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error(`Clerk webhook verification failed: ${message}`)
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    )
  }

  if (event.type === "user.created") {
    const { id, email_addresses, first_name, last_name } = event.data
    const primaryEmail = email_addresses[0]?.email_address

    if (!primaryEmail) {
      console.error("No email found for Clerk user:", id)
      return NextResponse.json({ received: true })
    }

    try {
      // Upsert client — if already created by Stripe webhook, update with Clerk ID
      await query(
        `INSERT INTO clients (email, clerk_user_id, first_name, last_name)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (email) DO UPDATE SET
           clerk_user_id = EXCLUDED.clerk_user_id,
           first_name = EXCLUDED.first_name,
           last_name = EXCLUDED.last_name`,
        [primaryEmail, id, first_name || null, last_name || null]
      )

      console.log(`Clerk user synced: ${primaryEmail} (${id})`)
    } catch (err) {
      console.error("Error syncing Clerk user to database:", err)
    }
  }

  return NextResponse.json({ received: true })
}
