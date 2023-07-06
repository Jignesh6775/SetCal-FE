import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Add() {
  const [model, setModel] = useState("")
  const [brand, setBrand] = useState("")
  const [year, setYear] = useState("")
  const [image, setImage] = useState("")
  const navigate = useNavigate()
  
  return (<div>
    {/* Create the Form here  */}
    <form 
      onSubmit={(e) =>{
        e.preventDefault()
        fetch(`http://localhost:${process.env.REACT_APP_JSON_SERVER_PORT}/cars`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            brand,
            year,
            image,
          }),
        })
        .then((res)=> res.json())
        .then(()=>{
          navigate("/")
        })
        .catch(()=>{
          alert("Error Occured")
        })
      }}>

        <input 
          value={model}
          placeholder="Model"
          type="text"
          id="model"
          onChange={(e) => setModel(e.target.value)}
        />
        <input 
          value={brand}
          placeholder="Brand"
          type="text"
          id="brand"
          onChange={(e) => setBrand(e.target.value)}
        />
        <input 
          value={year}
          placeholder="Year"
          type="number"
          id="year"
          onChange={(e) => setYear(e.target.value)}
        />
        <input 
          value={image}
          placeholder="Image"
          type="text"
          id="image"
          onChange={(e) => setImage(e.target.value)}
        />
        <input type="submit" value="Submit" />
    </form>
  </div>);
}

export default Add;
