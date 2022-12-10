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
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth")); //legge il valore dell'indice 

  const [colId, setColId] = useState(localStorage.getItem("colId")); //variabile che prende l'id
  const [colNome, setColNome] = useState(localStorage.getItem("colNome")); //variabile che salva il nome della collezione

  const [catId, setCatId] = useState(localStorage.getItem("catId")); 
  const [catNome, setCatNome] = useState(localStorage.getItem("catNome")); 
  

  const { isInstalled, install } = usePWAInstall();  //variabile usata per installare l'app, sui device

  const getColIdHandler = (id, nome) => {
    localStorage.setItem("colId", id); //salva il valore localmente
    localStorage.setItem("colNome", nome); 
    setColId(id);
    setColNome(nome);
  };

  const getCatIdHandler = (id, nome) => {
    localStorage.setItem("catId", id); //modifica il valore localmente
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
      <Navbar.Brand > <Link className='linq text-white' to="/allarticoli">All Item</Link> </Navbar.Brand>
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

/*localStorage serve per salvare il valore anche dopo il ricaricamento della pagina, tramite indice
setItem(key, value): memorizza la coppia key/value.
getItem(key): lettura del valore dalla key.
removeItem(key): rimuove la key, ed il relativo value.
clear(): rimuove tutti gli elementi.
key(index): lettura della key all’indice index.
length: il numero di oggetti archiviati. */