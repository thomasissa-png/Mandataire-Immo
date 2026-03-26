import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { Webhook } from "svix"
import { query } from "@/lib/db"

interface ClerkWebhookEvent {
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
  type: "user.created" | "user.updated" | "user.deleted"
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

  let event: ClerkWebhookEvent

  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error(`Clerk webhook verification failed: ${message}`)
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    )
  }

  const { id, email_addresses, first_name, last_name } = event.data
  const primaryEmail = email_addresses[0]?.email_address

  if (event.type === "user.created") {
    if (!primaryEmail) {
      console.error("No email found for Clerk user:", id)
      return NextResponse.json({ received: true })
    }

    try {
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

  if (event.type === "user.updated") {
    if (!primaryEmail) {
      return NextResponse.json({ received: true })
    }

    try {
      // Find old email by clerk_user_id
      const { rows } = await query<{ email: string }>(
        "SELECT email FROM clients WHERE clerk_user_id = $1 LIMIT 1",
        [id]
      )
      const oldEmail = rows[0]?.email

      if (oldEmail && oldEmail !== primaryEmail) {
        // Email changed — update client + all deliverables
        await query(
          "UPDATE clients SET email = $1, first_name = $2, last_name = $3 WHERE clerk_user_id = $4",
          [primaryEmail, first_name || null, last_name || null, id]
        )
        await query(
          "UPDATE deliverables SET client_email = $1 WHERE client_email = $2",
          [primaryEmail, oldEmail]
        )
        console.log(`Clerk email updated: ${oldEmail} -> ${primaryEmail} (${id})`)
      } else {
        // Same email — just update name
        await query(
          "UPDATE clients SET first_name = $1, last_name = $2 WHERE clerk_user_id = $3",
          [first_name || null, last_name || null, id]
        )
        console.log(`Clerk user name updated: ${primaryEmail} (${id})`)
      }
    } catch (err) {
      console.error("Error updating Clerk user in database:", err)
    }
  }

  return NextResponse.json({ received: true })
}
