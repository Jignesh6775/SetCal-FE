import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"

function Home() {
  const [cards, setCards] = useState([])
  useEffect(() => {
    fetch(`http://localhost:${process.env.REACT_APP_JSON_SERVER_PORT}/cars`)
      .then((res) => res.json())
      .then((data) => {
        setCards(data)
      })
      .catch((err) => {
        alert("Error Occured")
      })
  }, [])

  return (<div id="car-container">
    {/* Show all the Car Cards here  */}
    {cards.map(({ image, brand, model, year, id }) => {
      return (
        <div>
          <img src={image} alt="Error" />
          <h2>{brand}</h2>
          <p>{model}</p>
          <p>Year: {year}</p>
          <Link to={`/Book/${id}`}>
            <button>Book Now</button>
          </Link>
        </div>
      )
    })}
  </div>)
}

export default Home;
