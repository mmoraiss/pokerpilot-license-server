export default async function handler(req, res) {

const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN

const { clubId } = req.body

const payment = await fetch("https://api.mercadopago.com/v1/payments",{
method:"POST",
headers:{
"Content-Type":"application/json",
"Authorization":`Bearer ${ACCESS_TOKEN}`
},
body:JSON.stringify({

transaction_amount:97,
description:`Licença Poker Pilot - Clube ${clubId}`,
payment_method_id:"pix",

payer:{
email:"cliente@email.com"
}

})
})

const data = await payment.json()

res.status(200).json({

qr:`data:image/png;base64,${data.point_of_interaction.transaction_data.qr_code_base64}`,
pix:data.point_of_interaction.transaction_data.qr_code

})

}
