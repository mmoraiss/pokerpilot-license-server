export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*")

  if (req.method !== "POST") {
    return res.status(200).send("ok")
  }

  try {

    const body = req.body

    console.log("Webhook recebido:", body)

    return res.status(200).send("ok")

  } catch (error) {

    console.log("Erro webhook:", error)

    return res.status(500).send("erro")

  }

}
