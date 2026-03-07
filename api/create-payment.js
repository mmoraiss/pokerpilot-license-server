export default async function handler(req, res) {

res.setHeader("Access-Control-Allow-Origin", "*")
res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
res.setHeader("Access-Control-Allow-Headers", "Content-Type")

if (req.method === "OPTIONS") {
return res.status(200).end()
}

if (req.method !== "POST") {
return res.status(405).json({ error: "Method not allowed" })
}

try {

const accessToken = process.env.MP_ACCESS_TOKEN

const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body
const clubId = body?.clubId || "CLUBE"

const response = await fetch("https://api.mercadopago.com/v1/payments", {
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${accessToken}`
},
body: JSON.stringify({
transaction_amount: 97,
description: `Licença Poker Pilot - Clube ${clubId}`,
payment_method_id: "pix",
payer: {
email: "pagamento@pokerpilotmanager.com"
}
})
})

const data = await response.json()

return res.status(200).json({
qr: `data:image/png;base64,${data.point_of_interaction.transaction_data.qr_code_base64}`,
pix: data.point_of_interaction.transaction_data.qr_code
})

} catch (error) {

console.log("ERRO CREATE PAYMENT:", error)

return res.status(500).json({
error: "Erro ao criar pagamento",
details: error.message
})

}

}
