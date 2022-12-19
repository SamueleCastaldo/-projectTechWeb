import './App.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "./firebase-config"
import {signOut} from "firebase/auth";
import Login from "./pages/Login";
import SignUp from './pages/SignUp';
import RecoverPassword from './pages/RecoverPassword';
import Collezione from "./pages/Collezione";
import Categoria from "./pages/Categoria";
import Articoli from './pages/Articoli';
import AllArticoli from './pages/AllArticoli';
import {PrivateRoutes, PrivateCate, PrivateArte} from './components/PrivateRoutes';
import usePWAInstall from 'use-pwa-install';


function App() {  
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth")); //read the value of the index

  const [colId, setColId] = useState(localStorage.getItem("colId")); //variable that takes the collection id
  const [colNome, setColNome] = useState(localStorage.getItem("colNome")); //variable that stores the name of the collection

  const [catId, setCatId] = useState(localStorage.getItem("catId"));  //variable that takes the category id
  const [catNome, setCatNome] = useState(localStorage.getItem("catNome")); //variable that stores the category name
  

  const { isInstalled, install } = usePWAInstall();  //variable used to install the app, on devices

  const getColIdHandler = (id, nome) => {
    localStorage.setItem("colId", id); //save the value locally
    localStorage.setItem("colNome", nome); 
    setColId(id);
    setColNome(nome);
  };

  const getCatIdHandler = (id, nome) => {
    localStorage.setItem("catId", id); //edit the value locally
    localStorage.setItem("catNome", nome);
    setCatId(id);
    setCatNome(nome);
  };

//______________________________________________________________________________________________________________
    //signOut
    const signUserOut = () => {
      signOut(auth).then(() => {
        localStorage.clear();
        setIsAuth(false);
      })
    };
//______________________________________________________________________________________________________________
  return (
    
    <Router>

<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
    <Container>
      <Navbar.Brand > <Link className='linq text-white' to="/allarticoli">All Items</Link> </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
        </Nav>
        <Nav>
        {isAuth  && <Nav.Link onClick={signUserOut}> <Link className='linq text-white-50' to="/login">Log Out</Link> </Nav.Link>}
        <Nav.Link onClick={install}> <Link className='linq text-white-50'>Install</Link> </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>

        <Routes>
          <Route element={<PrivateRoutes isAuth={isAuth}/>}>
              <Route path="/" element={<Collezione getColId={getColIdHandler}/>} />
              <Route path="/allarticoli" element={<AllArticoli  catId={catId} catNome={catNome}/>} />
              <Route element={<PrivateCate colId={colId}/>}>
                  <Route path="/categoria" element={<Categoria  colId={colId} colNome={colNome} getCatId={getCatIdHandler}/>} />
                  <Route element={<PrivateArte catId={catId}/>}>
                    <Route path="/categoria/articoli" element={<Articoli  catId={catId} catNome={catNome}/>} />
                  </Route>
              </Route>
          </Route>
          <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
          <Route path="/signup" element={<SignUp setIsAuth={setIsAuth} />} />
          <Route path="/recoverpassword" element={<RecoverPassword/>} />
          {isAuth ? <Route path="*" element={<Collezione getColId={getColIdHandler}/> }/> :
                    <Route path="*" element={<Login setIsAuth={setIsAuth} />}/>    }
      </Routes>
    </Router>

  );
}   

export default App;

/* localStorage is used to save the value even after reloading the page, via index
setItem(key, value): stores the key/value pair.
getItem(key): reading the value from the key.
removeItem(key): removes the key, and its value.
clear(): remove all elements.
key(index): reading the key at index index.
length: The number of items stored. */