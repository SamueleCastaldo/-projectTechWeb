import React, { useEffect, useState } from 'react'
import {collection, deleteDoc, doc, onSnapshot ,addDoc ,updateDoc} from 'firebase/firestore';
import { auth, db } from "../firebase-config";
import Button from 'react-bootstrap/Button';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { notifyError } from '../components/Notify';

function Collezione({ getColId }) {
    const[colle, setColle] = useState([]); 
    const colleCollectionRef = collection(db, "collezione"); 

    const [nome, setNome] = useState("");

    let navigate = useNavigate();

    const [popupActive, setPopupActive] = useState(false);  
    const [popupRem, setPopupRem] = useState(false); 


   //_________________________________________________________________________________________________________________
    const setClear = () => {
      setNome("");
      setPopupActive(false);
      toast.dismiss();
      toast.clearWaitingQueue();}
   //_________________________________________________________________________________________________________________
     //confirmation notification to remove the collection
    const Msg = () => (
      <div>
        Do you want to delete the collection?
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

    const deleteCol = async (id) => { 
        const colDoc = doc(db, "collezione", id); 
        await deleteDoc(colDoc);  
    }
  //_________________________________________________________________________________________________________________
    const updateCol = async (e) => {
      e.preventDefault(); 
      if(!nome) {
        notifyError();
        toast.clearWaitingQueue(); 
        return
      } 
    const ColDoc = doc(db, "collezione", localStorage.getItem("ColId"));   
       await updateDoc(ColDoc, {nome});
        setClear();
    }; 
  //_________________________________________________________________________________________________________________
  const createCol = async (e) => {    
    e.preventDefault();  
    if(!nome) {            
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
//          INTERFACE                                           /
//************************************************************** */
    return ( 
    <> <div className='Page'>
            <div className="container">
              <div><ToastContainer limit={1} /></div>
  {/***************************************************************************************************************************************/}
          {/* POPUP ADD COLLECTION */}
          {popupActive && <div className="popup">
        <div className="popup-inner bg-dark rounded-4">
          {!popupRem ? <h2 className='text-white'>Add a Collection</h2> :
            <h2 className='text-white'>Edit a Collection</h2>}

         { <form >
                <div className="form-outline form-white mb-4">
                  {!popupRem? <input className="form-control form-control-lg" type="text" placeholder='name collection' onChange={(event) => {
                    setNome(event.target.value);}}/>        :
                     <input className="form-control form-control-lg" type="text" placeholder={nome} onChange={(event) => {
                    setNome(event.target.value);}}/> }
                </div>
                  <div className="container ">
                    <div className='row'>
                      <div className='col'></div>
                      <div className='col-7'>
                        <button className='buttonClose me-1' onClick={setClear}>Close</button>
                        {!popupRem? <button className='buttonSabbia' type="submit"  onClick={createCol} > Create</button>:
                        <button className='buttonSabbia me-1' type="submit" onClick={updateCol} > Edit</button>}
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