export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(200).send("ok")
  }

  const body = req.body

  console.log("Webhook recebido:", body)

  if (body.type === "payment") {

    const paymentId = body.data.id

    console.log("Pagamento recebido:", paymentId)

    // aqui depois vamos consultar o pagamento
    // e ativar a licença

  }

  res.status(200).send("ok")

}
