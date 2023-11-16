// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`
import { useEffect } from "react";
import { useState } from "react";
export default function App() {
  const [error, setError] = useState("");
  const [from, setFrom] = useState("GBP");
  const [to, setTo] = useState("INR");
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [message, setMessage] = useState("eeeeek");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    function () {

      setMessage("READY");
      const controller = new AbortController();
      async function fetchConversion() {
        try {
          setIsLoading(true);
          const host = "api.frankfurter.app";
          const res = await fetch(
            `https://${host}/latest?amount=${amount}&from=${from}&to=${to}`
          ); //https://${host}/latest?amount=${amount}&from=${from}&to=${to}`

          console.log(res);
          console.log("res to data");
          const data = await res.json();
          console.log(data);
          console.log(data.message)
          if (!res.ok) {
            setError("THERE:" + data.message);
            setMessage("ANYWHERE:" + data.message);
            throw new Error(
              "Something went wrong with fetching the conversion"
            );
          }
          setConvertedAmount(data.rates[to]);
        } catch (err) {
          console.log("caught");
          console.log(err.message);
          if (err.name !== "AbortError") {
            setError(err.message);
          }
          setConvertedAmount(amount)
        } finally {
          setIsLoading(false);
        }
      }
      fetchConversion();
      return function () {
        controller.abort();
      };
    },
   // [amount, from, to, message, setMessage, error, setError]
   [amount, from, to, error]
  );

  return (
    <div>  
      <CurrencyEntry amount={amount} setAmount={setAmount} isLoading={isLoading} />
      <CurrencyDropdown currency={from} setWhich={setFrom} />
      <CurrencyDropdown currency={to} setWhich={setTo} />
      <Result convertedAmount={convertedAmount} to={to} />
      {console.log('lootitoo', error)}
      {message}
      { message && ( <Error error={message}/> )}
    </div>
  );
}

function CurrencyEntry({ amount, setAmount, isLoading }) {

  const handleInputChange = (event) => {
    const input = event.target.value;
    // Regex pattern to allow only numbers
    const regex = /^[0-9\b.]+$/;

    if (input === '' || regex.test(input)) {
      setAmount(Number(input));
    }
  };
  return(<input
        type="text"
        onChange={handleInputChange}
        value={amount} className="inline"
        disabled={isLoading}
      />) 
}

function CurrencyDropdown({ currency, setWhich }) {
  return (
    <select defaultValue={currency} onChange={(e) => setWhich(e.target.value)}>
      <option value="USD">USD</option>
      <option value="EUR">EUR</option>
      <option value="CAD">CAD</option>
      <option value="INR">INR</option>
    </select>)
}

function Result({ convertedAmount, to }) {
  return (
    <div>
      <p>RESULT: {convertedAmount} {to}</p>
    </div>
  );
}

function Error({ message }) {
  return (
    <p>{message}</p>
  )
}
