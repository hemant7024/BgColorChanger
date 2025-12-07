import { useState, useEffect } from "react";

function useCurrencyInfo(currency) {
  const [data, setData] = useState({});

  useEffect(() => {
    if (!currency) return;

    const formatted = currency.toLowerCase();

    fetch(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${formatted}.json`
    )
      .then((res) => res.json())
      .then((res) => {
        setData(res[formatted]);
      })
      .catch((err) => {
        console.error("Currency API Error:", err);
        setData({});
      });
  }, [currency]);

  return data;
}

export default useCurrencyInfo;
