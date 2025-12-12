import  { useContext, useEffect, useState } from 'react'
import './Home.css'
import { CoinContext } from '../../context/CoinContext';
import {Link} from 'react-router-dom';

const Home = () => {

  const {allCoin, currency} = useContext(CoinContext);
  const [displayCoin, setDisplayCoin] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

  const inputHandler = (event) => {
      setInput(event.target.value);
      if(event.target.value === '') {
        setDisplayCoin(allCoin);
      }
  }

  const searchHandler = async (event) => {
    event.preventDefault();
    const coins = await allCoin.filter((item) => {
        return item.name.toLowerCase().includes(input.toLowerCase());
    });
    setDisplayCoin(coins);
  }

  // Real-time search functionality
  useEffect(() => {
    if (input.trim() === '') {
      setDisplayCoin(allCoin);
    } else {
      const filteredCoins = allCoin.filter((item) =>
        item.name.toLowerCase().includes(input.toLowerCase()) ||
        item.symbol.toLowerCase().includes(input.toLowerCase())
      );
      setDisplayCoin(filteredCoins);
    }
  }, [input, allCoin]);

  useEffect(() => {
    if (allCoin.length > 0) {
      setLoading(false);
      setDisplayCoin(allCoin);
    }
  }, [allCoin]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.name.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(price);
  };

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    }
    return `$${marketCap.toLocaleString()}`;
  };

  return (
    <div className='home'>
      <div className='hero'>
        <h1>Largest <br /> Crypto Tracking Marketplace</h1>
        <form  onSubmit={searchHandler}>
          <input
            onChange={inputHandler}
            list='coinlist'
            value={input}
            type="text"
            placeholder='Search cryptocurrencies...'
            required
          />

          <datalist id="coinlist">
            {allCoin.map((item, index) => (<option key={index} value={item.name} />))}
          </datalist>

          <button type='submit'>Search</button>
        </form>
      </div>

      <div className='crypto-table'>
        <div className="table-layout table-header">
          <p>#</p>
          <p>Coins</p>
          <p>Price</p>
          <p style={{textAlign:"center"}}>24H Change</p>
          <p className='market-cap'>Market Cap</p>
        </div>

        {loading ? (
          <div className="loading-state">
            <p>Loading cryptocurrency data...</p>
          </div>
        ) : displayCoin.length === 0 ? (
          <div className="empty-state">
            <p>No cryptocurrencies found matching your search.</p>
          </div>
        ) : (
          displayCoin.slice(0,10).map((item, index) => (
            <Link to={`/coin/${item.id}`} className="table-layout" key={item.id}>
              <p>{item.market_cap_rank}</p>
              <div>
                <img src={item.image} alt={`${item.name} logo`} />
                <div>
                  <p className="coin-name">{item.name}</p>
                  <p className="coin-symbol">{item.symbol.toUpperCase()}</p>
                </div>
              </div>
              <p className="coin-price">{formatPrice(item.current_price)}</p>
              <p className={item.price_change_percentage_24h > 0 ? "green" : "red"}>
                {item.price_change_percentage_24h > 0 ? "+" : ""}
                {item.price_change_percentage_24h?.toFixed(2)}%
              </p>
              <p className='market-cap'>{formatMarketCap(item.market_cap)}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

export default Home