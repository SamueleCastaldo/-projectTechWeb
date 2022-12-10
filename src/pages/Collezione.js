import React, { useEffect, useState } from 'react'
import {collection, deleteDoc, doc, onSnapshot ,addDoc ,updateDoc} from 'firebase/firestore';
import { auth, db } from "../firebase-config";
import Button from 'react-bootstrap/Button';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { notifyError } from '../components/Notify';

function Collezione({ getColId }) {
    const[colle, setColle] = useState([]); //collezione
    const colleCollectionRef = collection(db, "collezione"); //riferimeto alla collezione posts

    const [nome, setNome] = useState("");

    let navigate = useNavigate();

    const [popupActive, setPopupActive] = useState(false);  //popup che si attiva quando premiamo il pulsante aggiungi
    const [popupRem, setPopupRem] = useState(false); 


   //_________________________________________________________________________________________________________________
    const setClear = () => {
      setNome("");
      setPopupActive(false);
      toast.dismiss();
      toast.clearWaitingQueue();}
   //_________________________________________________________________________________________________________________
     //notifica conferma per rimuovere la collezione
    const Msg = () => (
      <div>
        Sei sicuro di voler eliminare la collezione?
        <button className='buttonSabbia ms-4 mt-2 me-1 rounded-4' onClick={Remove}>Yes</button>
        <button className='buttonClose mt-2 rounded-4'>No</button>
      </div>
    )

      const Remove = () => {
          deleteCol(localStorage.getItem("ColId"));
          toast.clearWaitingQueue(); 
               }

    const displayMsg = () => {
      toast.warn(<Msg/>, {
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
        })}
  //_________________________________________________________________________________________________________________
    useEffect(() => { 
      onSnapshot(colleCollectionRef, onSnapshot => {      
        setColle(onSnapshot.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data()
          }
        }))
      })
    }, [])
  //_________________________________________________________________________________________________________________

    const deleteCol = async (id) => { //funzione per eliminare il post, id documento
        const colDoc = doc(db, "collezione", id);  //variablie per prendere in riferiemnto quel documento
        await deleteDoc(colDoc);  //elimina il documento selezionato
    }
  //_________________________________________________________________________________________________________________
    const updateCol = async (e) => {
      e.preventDefault(); 
      if(!nome) {
        notifyError();
        toast.clearWaitingQueue(); 
        return
      } 
    const ColDoc = doc(db, "collezione", localStorage.getItem("ColId"));   //riferimento al documento specifico
       await updateDoc(ColDoc, {nome});
        setClear();
    }; 
  //_________________________________________________________________________________________________________________
  const createCol = async (e) => {    // funzione crea  collezione
    e.preventDefault();  //previene il ricaricamento della pagina
    if(!nome) {            //nome non definito, si attiva la notifica
      notifyError();
      toast.clearWaitingQueue(); 
      return
    }
    await addDoc(colleCollectionRef, {
      nome,
      author: { name: auth.currentUser.displayName, id: auth.currentUser.uid }
    });
      setClear();
  };

//*************************************************************** */
//************************************************************** */
//          INTERFACCIA                                           /
//************************************************************** */
    return ( 
    <> <div className='Page'>
            <div className="container">
              <div><ToastContainer limit={1} /></div>
  {/***************************************************************************************************************************************/}
          {/* POPUP AGGIUNGI COLLEZIONE     Condizione tramite chiudi ritorna false, quindi scompare, non visualizza tutto il form aggiungi */}
          {popupActive && <div className="popup">
        <div className="popup-inner bg-dark rounded-4">
          {!popupRem ? <h2 className='text-white'>Add a Collection</h2> :
            <h2 className='text-white'>Edit a Collection</h2>}
          {/* quando si preme il plusante crea di tipo submit si attiva la funzione handleSubmit  */}
         { <form >
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
                        {!popupRem? <button className='buttonSabbia me-1' type="submit"  onClick={createCol} > Create</button>:
                        <button className='buttonSabbia me-1' type="submit" onClick={updateCol} > Edit</button>}
                        <button className='buttonClose' onClick={setClear}>Close</button>
                    </div>
                  </div>
                  </div>
          </form>    }  
        </div>
      </div>}
  {/***************************************************************************************************************************************/}
              <div className="row">
                <div className="col"> <h3></h3></div>

                <div className="col">
                <h2 className='text-center'> <b>Collection</b> </h2>
                </div>

                <div className="col">
                  <button className='buttonBlack float-end mb-4' onClick={() => {
                    setPopupActive(!popupActive)
                    setPopupRem(false);
                    }}>Add</button>              
                </div>
              </div>

        {/* Visualizza tutte le collezioni create dall'utente che ha effettuato l'accesso*/}
                {colle.map((col) => (
                  <div key={col.id}>
                  {col.author.id === auth.currentUser.uid && (
                    <>
                    <div className="form-control shadow mb-2 bg-body rounded-4" > 
                      <div className="row">
                        <div className="col-9">
                        <h1 onClick={() => {
                            getColId(col.id, col.nome)
                            navigate("/categoria");
                            }}>{ col.nome }</h1>
                        </div>
                        <div className="col">                
                          <button className='buttonRemove mt-2 me-1 rounded-4 float-end' onClick={() => {
                            localStorage.setItem("ColId", col.id);
                            displayMsg();
                            toast.clearWaitingQueue(); 
                            }} >Remove</button>
                            <button className='buttonBlack mt-2 me-1 rounded-4 float-end' onClick={() => {
                              localStorage.setItem("ColId", col.id);
                              setNome(col.nome);
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
      )
}
export default Collezione;