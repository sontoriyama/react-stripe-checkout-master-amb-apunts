import React, { useState } from "react";
import "bootswatch/dist/lux/bootstrap.min.css";
import "./App.css";

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import axios from "axios";

const stripePromise = loadStripe("<your public key here>");

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);

  //stripe consiste en dos cosas, uno obtener id de transaccion i otro registrarlo como un pago. Quan obtenim la id, la tornem a enviar per registrar-la com un pago
  //en el procés d'obtenir id, rebrem paymethod on rebem objecte que conté la id o rebem error
  //al tenir la id podem guardar altres coses pero en aquest cas guardem la id al backend, ja que hem estat operant per rebre-la des del front.
  //al back amb express hi hem d'instalar stripe del backend i cors per evitar problemes de conexió entre servers
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
    setLoading(true);

    if (!error) {
      // console.log(paymentMethod)
      const { id } = paymentMethod;
      try {
        const { data } = await axios.post(
          "http://localhost:3001/api/checkout",
          {
            id,
            amount: 10000, //cents
          }
        );
        console.log(data);

        //aquí fem un clear de l'input pero amb react-router podriem reenviar a una ruta on diguem pago correcte o una notificacio amb error etc...
        elements.getElement(CardElement).clear();
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
  };

  console.log(!stripe || loading);
//tb podriem afegir al boto que disable={!stripe} ja que amb conexió lenta si stripe no està carregat no puguin apretar comprar ja que donaria error

      {/* User Card Input */}
      <div className="form-group">
        <CardElement />
      </div>

      <button disabled={!stripe} className="btn btn-success">
        {loading ? (
          <div className="spinner-border text-light" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          "Buy"
        )}
      </button>
    </form>
  );
};

function App() {
  return (
    <Elements stripe={stripePromise}>
      <div className="container p-4">
        <div className="row h-100">
          <div className="col-md-4 offset-md-4 h-100">
            <CheckoutForm />
          </div>
        </div>
      </div>
    </Elements>
  );
}

export default App;
