import { initializeApp, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

let db

if (!global.firebase) {

  const app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
  })

  db = getFirestore(app)

  global.firebase = db

} else {

  db = global.firebase

}

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

        const clubId =
  payment.external_reference ||
  payment.metadata?.clubId ||
  null

        console.log("Pagamento aprovado do clube:", clubId)

        if (clubId) {

          const licenseRef = db.collection("licenses").doc(clubId)

          const snap = await licenseRef.get()

          const now = Date.now()
          const plus30days = now + (30 * 24 * 60 * 60 * 1000)

          if (snap.exists) {

            const data = snap.data()

            let newExpire = plus30days

            if (data.expiresAt && data.expiresAt > now) {
              newExpire = data.expiresAt + (30 * 24 * 60 * 60 * 1000)
            }

            await licenseRef.update({
              status: "ACTIVE",
              expiresAt: newExpire
            })

            console.log("Licença atualizada até:", newExpire)

          }

        }

      }

    }

    res.status(200).send("ok")

  } catch (error) {

    console.log("ERRO WEBHOOK:", error)

    res.status(200).send("erro")

  }

}
