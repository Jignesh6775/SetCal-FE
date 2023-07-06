import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Add from "./Pages/Add";
import Book from "./Pages/Book";
import Error from "./Pages/Error"

function App() {
  return (
    <div data-testid="car-rental-app">
      {/* All the Routes should be visible here  */}
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Add" element={<Add />} />
          <Route path="/Book" element={<Book />} />
          <Route path="Error" element={<Error/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
