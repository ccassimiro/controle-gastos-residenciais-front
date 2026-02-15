import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home.tsx";
import People from "./components/pages/People.tsx";
import Categories from "./components/pages/Categories.tsx";
import Transactions from "./components/pages/Transactions.tsx";
import Container from './components/layout/Container.tsx';
import CreatePerson from './components/people/CreatePerson.tsx';
import EditPerson from './components/people/EditPerson.tsx';

import Navbar from './components/layout/Navbar.tsx';
import Footer from './components/layout/Footer.tsx';


function App() {

  return (
    <Router>
      <Navbar />

      <Container customClass="min-height">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/people" element={<People />} />
          <Route path="/people/create" element={<CreatePerson />} />
          <Route path="/people/edit/:id" element={<EditPerson />} />

          <Route path="/categories" element={<Categories />} />

          <Route path="/transactions" element={<Transactions />} />
        </Routes>
      </Container>

      <Footer />
    </Router>
  )
}

export default App
