import React, { useId, useState, useEffect } from "react";
import useCurrencyInfo from "../customHooks/useCurrencyInfo";

export default function App({
  label = "Amount",
  onAmountChange,
  onCurrencyChange,
  currencyOption = [],
  selectCurrency,
  amountDisabled,
  currencyDisable,
}) {
  const amountInputIdFrom = useId();
  const amountInputIdTo = useId();

  const [from, setFrom] = useState("usd");
  const [to, setTo] = useState("inr");

  const [convertedAmount, setConvertedAmount] = useState(0);
  const [amount, setAmount] = useState(0);

  const currencyInfo = useCurrencyInfo((from || "usd").toLowerCase());
  const options = Object.keys(currencyInfo || {});

  const [currentRate, setCurrentRate] = useState(1);

  useEffect(() => {
    const rate = (currencyInfo && currencyInfo[to]) || 1;
    setCurrentRate(rate);
  }, [currencyInfo, to]);

  const swap = () => {
    const prevFrom = from;
    const prevTo = to;
    const prevAmount = amount;
    const prevConverted = convertedAmount;

    setFrom(prevTo);
    setTo(prevFrom);

    setAmount(prevConverted);
    setConvertedAmount(prevAmount);

    if (onCurrencyChange) onCurrencyChange({ from: prevTo, to: prevFrom });
  };

  const convert = () => {
    const rate = currencyInfo && currencyInfo[to] ? currencyInfo[to] : 1;
    const result = Number((amount * rate).toFixed(6));
    setConvertedAmount(result);
  };

  useEffect(() => {
    const id = setTimeout(() => {
      if (amount > 0) convert();
    }, 450);
    return () => clearTimeout(id);
  }, [amount, from, to]);

  const optionList = options.length ? options : currencyOption;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-rose-900 p-8">
      <div className="max-w-3xl w-full">
        <div className="relative rounded-2xl bg-white/6 backdrop-blur-md border border-white/20 shadow-2xl overflow-hidden">
          <div className="absolute -left-40 -top-28 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-purple-500/30 to-pink-500/20 blur-3xl pointer-events-none" />

          <div className="p-8">
            <header className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-white">Currency Converter</h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-white/70">Rate</div>
                  <div className="text-sm font-medium text-white">1 {from.toUpperCase()} = {currentRate} {to.toUpperCase()}</div>
                </div>

                <button
                  aria-label="swap currencies"
                  onClick={swap}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg shadow-sm transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h9.69l-2.72-2.72a.75.75 0 111.06-1.06l3.99 3.99a.75.75 0 010 1.06l-3.99 3.99a.75.75 0 11-1.06-1.06L13.44 10H3.75A.75.75 0 013 9.25z" clipRule="evenodd" />
                  </svg>
                  Swap
                </button>
              </div>
            </header>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                convert();
              }}
              className="grid grid-cols-1 gap-6"
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-5 bg-white/10 rounded-xl p-4 flex flex-col gap-2">
                  <label htmlFor={amountInputIdFrom} className="text-sm text-white/80">
                    FROM ({from.toUpperCase()})
                  </label>
                  <input
                    id={amountInputIdFrom}
                    type="number"
                    min="0"
                    step="any"
                    disabled={amountDisabled}
                    value={amount}
                    onChange={(e) => {
                      const v = Number(e.target.value || 0);
                      setAmount(v);
                      if (onAmountChange) onAmountChange(v);
                    }}
                    placeholder="0"
                    className="mt-1 w-full bg-white/80 text-slate-900 rounded-lg p-3 outline-none text-lg font-medium shadow-inner"
                  />
                </div>

                <div className="col-span-4 flex flex-col gap-2">
                  <label className="text-sm text-white/80">Currency</label>
                  <select
                    value={from}
                    onChange={(e) => {
                      setFrom(e.target.value);
                      if (onCurrencyChange) onCurrencyChange({ from: e.target.value, to });
                    }}
                    disabled={currencyDisable}
                    className="mt-1 rounded-lg p-3 bg-white/80 text-slate-900 font-medium outline-none"
                  >
                    {optionList.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-3 text-right hidden md:block">
                  <div className="text-xs text-white/70">Quick</div>
                  <div className="mt-1 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAmount(100);
                      }}
                      className="text-xs px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                    >
                      100
                    </button>
                    <button
                      type="button"
                      onClick={() => setAmount(1000)}
                      className="text-xs px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                    >
                      1000
                    </button>
                  </div>
                </div>
              </div>

              {/* To block */}
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-5 bg-white/10 rounded-xl p-4 flex flex-col gap-2">
                  <label htmlFor={amountInputIdTo} className="text-sm text-white/80">
                    TO ({to.toUpperCase()})
                  </label>
                  <input
                    id={amountInputIdTo}
                    type="number"
                    min="0"
                    step="any"
                    value={convertedAmount}
                    onChange={(e) => setConvertedAmount(Number(e.target.value || 0))}
                    className="mt-1 w-full bg-white/80 text-slate-900 rounded-lg p-3 outline-none text-lg font-medium shadow-inner"
                  />
                </div>

                <div className="col-span-4 flex flex-col gap-2">
                  <label className="text-sm text-white/80">Currency</label>
                  <select
                    value={to}
                    onChange={(e) => {
                      setTo(e.target.value);
                      if (onCurrencyChange) onCurrencyChange({ from, to: e.target.value });
                    }}
                    disabled={currencyDisable}
                    className="mt-1 rounded-lg p-3 bg-white/80 text-slate-900 font-medium outline-none"
                  >
                    {optionList.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-3 text-right hidden md:block">
                  <div className="text-xs text-white/70">Actions</div>
                  <div className="mt-1 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setConvertedAmount(0)}
                      className="text-xs px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard?.writeText(String(convertedAmount))}
                      className="text-xs px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="text-sm text-white/80">
                  Created By Hemant
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      convert();
                    }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:scale-[1.01] transition"
                  >
                    Convert
                  </button>

                  <button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      convert();
                    }}
                    className="hidden sm:inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg"
                  >
                    Preview
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <footer className="mt-6 text-center text-xs text-white/60">
        </footer>
      </div>
    </div>
  );
}
