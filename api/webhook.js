export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(200).send("ok")
  }

  try {

    const body = req.body

    console.log("Webhook recebido:", body)

    if (body.type === "payment") {

      const paymentId = body.data.id

      const response = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
          }
        }
      )

      const payment = await response.json()

      console.log("Pagamento:", payment)

      if (payment.status === "approved") {

        const clubId = payment.metadata?.clubId

        console.log("Pagamento aprovado do clube:", clubId)

        // aqui depois vamos salvar a licença
        // por enquanto apenas confirma

      }

    }

    res.status(200).send("ok")

  } catch (error) {

    console.log("ERRO WEBHOOK:", error)

    res.status(200).send("erro")

  }

}
