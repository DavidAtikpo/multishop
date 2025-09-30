import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, amount } = body

    const paypalResponse = await fetch(`${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getPayPalAccessToken()}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: orderId,
            amount: {
              currency_code: "EUR",
              value: amount.toFixed(2),
            },
            description: `Commande #${orderId.slice(-8)} - MultiShop`,
          },
        ],
        application_context: {
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?order_id=${orderId}`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel?order_id=${orderId}`,
        },
      }),
    })

    const order = await paypalResponse.json()
    return NextResponse.json(order)
  } catch (error) {
    console.error("Erreur lors de la création de la commande PayPal:", error)
    return NextResponse.json({ error: "Erreur lors de la création de la commande PayPal" }, { status: 500 })
  }
}

async function getPayPalAccessToken() {
  const response = await fetch(`${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
      ).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  })

  const data = await response.json()
  return data.access_token
}
