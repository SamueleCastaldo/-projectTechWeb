import React, { useEffect, useState } from 'react'
import {collection, deleteDoc, doc, onSnapshot ,addDoc, updateDoc} from 'firebase/firestore';
import { auth, db } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Slide } from 'react-toastify';
import { notifyError } from '../components/Notify';

function Categoria({ colId, colNome, getCatId }) {
    const[cate, setCate] = useState([]); //collezione
    
    const cateCollectionRef = collection(db, "categoria"); //riferimeto alla collezione categoria

    const [nome, setNome] = useState("");

    let navigate = useNavigate();

    const [popupActive, setPopupActive] = useState(false);  //popup che si attiva quando premiamo il pulsante aggiungi
    const [popupRem, setPopupRem] = useState(false); 


    const back = () => {
        navigate("/");
    }

    //_________________________________________________________________________________________________________________
    const setClear = () => {
      setNome("");
      setPopupActive(false);
      toast.dismiss();
      toast.clearWaitingQueue();
    }
    //_________________________________________________________________________________________________________________
     //notifica conferma per rimuovere la categoria
     const MsgCat = () => (
      <div>
        Sei sicuro di voler eliminare la categoria?
        <button className='buttonSabbia ms-4 mt-2 me-1 rounded-4' onClick={RemoveCat}>Yes</button>
        <button className='buttonClose mt-2 rounded-4' >No</button>
      </div>
    )

      const RemoveCat = () => {
          deleteCate(localStorage.getItem("CatId"));
          toast.clearWaitingQueue(); 
               }

    const displayMsgCat = () => {
      toast.warn(<MsgCat />, {
        position: "top-center",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        transition: Slide,
        theme: "dark",
        className: "rounded-4"
        })    }

  //_________________________________________________________________________________________________________________
    useEffect(() => {  
      onSnapshot(cateCollectionRef, onSnapshot => {
        setCate(onSnapshot.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data()  
          }
        }))
      })
      localStorage.removeItem("colId");
    }, [])
  //_________________________________________________________________________________________________________________

    const deleteCate = async (id) => { //funzione per eliminare il post, solo se è lo stesso id utente
      const postDoc = doc(db, "categoria", id);  //variablie per prendere in riferiemnto quel documento
      await deleteDoc(postDoc);  //elimina il documento selezionato
    }
      //_________________________________________________________________________________________________________________
      const updateCate = async (e) => {
        e.preventDefault();
        if(!nome) {   //nome non definito, non presente
          notifyError();
          toast.clearWaitingQueue(); 
          return
        } 
      const CatDoc = doc(db, "categoria", localStorage.getItem("CatId"));   //verifichiamo che il libro è presente nella collezione
         await updateDoc(CatDoc, {nome});
          setClear();
      };
  //_________________________________________________________________________________________________________________
  const createCate = async (e) => {
    e.preventDefault(); 
    if(!nome) {
      notifyError();
      toast.clearWaitingQueue(); 
      return
    }
    await addDoc(cateCollectionRef, {
      nome,
      author: { name: auth.currentUser.displayName, id: auth.currentUser.uid },
      colId: colId,
      colNom: colNome
    });
      setClear();
  };
//******************************************************************** */
//******************************************************************** */
                             //INTERFACCIA 
//******************************************************************** */

    return  <><div className='Page'>
            <div className="container">
            <div> <ToastContainer limit={1} /> </div>
  {/***************************************************************************************************************************************/}
          {/* POPUP AGGIUNGI CATEGORIA     Condizione tramite chiudi ritorna false, quindi scompare, non visualizza tutto il form aggiungi */}
          {popupActive && <div className="popup">
        <div className="popup-inner bg-dark rounded-4">
          {!popupRem? <h2 className='text-white'>Add a Category</h2> :
            <h2 className='text-white'>Edit a Category</h2>}  
          {/* quando si preme il plusante crea di tipo submit si attiva la funzione handleSubmit  */}
          <form >
                <div className="form-outline form-white mb-4">
                {!popupRem? <input className="form-control form-control-lg" type="text" placeholder='nome collezione' onChange={(event) => {
                    setNome(event.target.value);}}/>        :
                     <input className="form-control form-control-lg" type="text" placeholder={nome} onChange={(event) => {
                    setNome(event.target.value);}}/> }
                </div>

                  <div className="container ">
                    <div className='row'>
                      <div className='col'></div>
                      <div className='col-7'>
                      {!popupRem? <button className='buttonSabbia me-1' type="submit" onClick={createCate} > Create</button>:
                        <button className='buttonSabbia me-1' type="submit" onClick={updateCate} > Edit</button>}
                        <button className='buttonClose' onClick={setClear} >Close</button>
                    </div>
                  </div>
                  </div>
          </form>        
        </div>
      </div>}
  {/***************************************************************************************************************************************/}

              <div className="row">
                <div className="col">
                    <button className='buttonBlack' onClick={back}>Back</button>
                    <h3>{colNome}</h3>
                </div>
  
                <div className="col">
                  <h2 className='text-center'><b>Category</b></h2>
                </div>            

                <div className="col">
                <button className='buttonBlack float-end' onClick={() => {
                  setPopupActive(!popupActive)
                  setPopupRem(false);
                  }}>Add</button>    
                </div>
              </div>
              
          {/* Visualizza tutte le collezioni create dall'utente che ha effettuato l'accesso*/}
                {cate.map((cat) => (
                  <div key={cat.id}>
                  {cat.author.id === auth.currentUser.uid && cat.colId === colId && (
                    <>
                    <div className="form-control shadow mb-2 bg-body rounded-4  "> 
                      <div className="row">
                        <div className="col-9">
                        <h1 onClick={() => {
                            getCatId(cat.id, cat.nome)
                            navigate("articoli");
                        }}>{ cat.nome }</h1></div>
                        <div className="col">                
                          <button className='buttonRemove mt-2 me-1 rounded-4 float-end' onClick={() => {
                            localStorage.setItem("CatId", cat.id);
                            displayMsgCat();
                            toast.clearWaitingQueue(); 
                            }} >Remove</button>
                              <button className='buttonBlack mt-2 me-1 rounded-4 float-end' onClick={() => {
                              localStorage.setItem("CatId", cat.id);
                              setNome(cat.nome);
                              setPopupActive(!popupActive);
                              setPopupRem(true);
                              }}>Edit</button>
                        </div>
                      </div>
                    </div>
                  </>
                  )}
                  </div> 
                  ))}
            </div>
                      
    </div>
    </>
}
export default Categoria;