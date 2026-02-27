import React, { useEffect, useState } from 'react';

const App = () => {
  const [data, setData] = useState([]);

  // Local Storage SSR Check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('data');
      if (storedData) {
        setData(JSON.parse(storedData));
      }
    }
  }, []);

  // Example useEffect for fetching data
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://api.example.com/data');
      const result = await response.json();
      setData(result);
      // Storing data in local storage
      if (typeof window !== 'undefined') {
        localStorage.setItem('data', JSON.stringify(result));
      }
    };
    fetchData();
  }, []);

  return (
    <div className="app">
      <h1 className="app-header">My Shop</h1>
      <div className="app-content">
        {/* Content goes here */}
        {data.map(item => (
          <div key={item.id} className="item">
            <h2 className="item-title">{item.title}</h2>
            <p className="item-description">{item.description}</p>
            <span className="item-price">${item.price.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;