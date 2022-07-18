const express = require("express");
const Stripe = require("stripe");
//stripe en ves d'un modul obtenim una clase que intanciem i aquest objecte ja té metodes per registrar el pago
const stripe = new Stripe("mi-llave-secreta");
//la clau la farem amb .env i dotenv

const cors = require("cors");

const app = express();

//comuniquem el server de react amb el el backend, i pk ens deixi utilitzem cors
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.post("/api/checkout", async (req, res) => {
  // you can get more data to find in a database, and so on. 
  //aquí li pasariem tb el id del producte que consultariem a una base de datos i aquí li posariem la descripció del pdroducte de la base de datos. depen com fem l'app o botiga
  //aquí al server podem validar amb express validator o joi
  const { id, amount } = req.body;

  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "EUR",
      description: "Ratolí gaming",
      payment_method: id,
      confirm: true, //confirm the payment at the same time
    });

    console.log(payment);

    return res.status(200).json({ message: "Successful Payment" });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.raw.message });
  }
});
//a partir d'aquí ja és qüestió de interface de ue fer amb laesposta pk podriem enviar l'usuari a altres rutes des del front si teni reac-routre per exemple

app.listen(3001, () => {
  console.log("Server on port", 3001);
});
