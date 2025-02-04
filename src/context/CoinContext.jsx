import { createContext, useState, useEffect } from "react";

export const CoinContext = createContext();

const CoinContextProvider = ({ children }) => {
  const [allCoin, setAllCoin] = useState([]);
  const [currency, setCurrency] = useState({
    name: "usd",
    symbol: "$",
  });

 // ...existing code...
const fetchAllCoin = async (retries = 3, delay = 1000) => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd');
    if (!response.ok) {
      if (response.status === 429 && retries > 0) {
        // Wait for the specified delay and retry
        setTimeout(() => fetchAllCoin(retries - 1, delay * 2), delay);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } else {
      const data = await response.json();
      setAllCoin(data);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
// ...existing code...

  useEffect(() => {
    fetchAllCoin();
  }, [currency]);

  const contextValue = {
    allCoin,
    currency,
    setCurrency,
  };

  return (
    <CoinContext.Provider value={contextValue}>
      {children}
    </CoinContext.Provider>
  );
};

export default CoinContextProvider;
