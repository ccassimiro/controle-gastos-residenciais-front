import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home.tsx";
import People from "./components/pages/People.tsx";
import Categories from "./components/pages/Home.tsx";
import Transactions from "./components/pages/Transactions.tsx";
import Container from './components/layout/Container.tsx';

import Navbar from './components/layout/Navbar.tsx';
import Footer from './components/layout/Footer.tsx';


function App() {

  return (
    <Router>
      <Navbar />

      <Container customClass="min-height">
        <Routes>
          <Route path="/" element={<Home />} > </Route>
          <Route path="/people" element={<People />} > </Route>
          <Route path="/categories" element={<Categories />} > </Route>
          <Route path="/transactions" element={<Transactions />} > </Route>
        </Routes>
      </Container>

      <Footer />
    </Router>
  )
}

export default App
