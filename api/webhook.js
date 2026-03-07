export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(200).send("ok")
  }

  const body = req.body

  console.log("Webhook recebido:", body)

  if (body.type === "payment") {

    const paymentId = body.data.id

    console.log("Pagamento ID:", paymentId)

    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
      }
    })

    const payment = await response.json()

    console.log("Status pagamento:", payment.status)

    if (payment.status === "approved") {

      console.log("Pagamento aprovado!")

      const clubId = payment.metadata?.clubId

      console.log("Clube:", clubId)

      // aqui vamos ativar a licença depois

    }

  }

  res.status(200).send("ok")
}
