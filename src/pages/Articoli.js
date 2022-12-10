import React, { useEffect, useState } from 'react'
import {collection, deleteDoc, doc, onSnapshot ,addDoc, updateDoc, Timestamp} from 'firebase/firestore';
import { auth, db } from "../firebase-config";
import Button from 'react-bootstrap/Button';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { storage } from '../firebase-config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import {v4} from "uuid"
import { notiUploadImage, notifyErrorImage, notifyErrorArt } from '../components/Notify';


function Articoli({ catId, catNome }) {
    const[arti, setArti] = useState([]); //collezione
    
    const artCollectionRef = collection(db, "articoli"); //riferimeto alla collezione categoria

    const [nome, setNome] = useState("");
    const [marca, setMarca] = useState("");
    const [descrizione, setDescrizione] = useState("");
    const [imageUrls, setImageUrls] = useState("");
    const [creatoIl, setCreatoIl] = useState(Timestamp.now().toDate())
    const [quantita, setQuantita] = useState(0);
    const [prezzo, setPrezzo] = useState(0);

    const [imageUpload, setImageUpload] = useState(null);
    const [flagUpImg, setFlagUpImg] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");

    let navigate = useNavigate();

    const [popupActive, setPopupActive] = useState(false);
    const [popupRem, setPopupRem] = useState(false);  

    const back = () => {
      console.log(localStorage.getItem("catId"));
        navigate("/categoria");
    }
  //_________________________________________________________________________________________________________________
    const setClear = () => {
      setNome("");
      setMarca("");
      setDescrizione("");
      setQuantita("");
      setPrezzo("");
      setImageUrls("");
      setImageUpload(null);
      setFlagUpImg(false);
      setPopupActive(false);
      toast.dismiss();
      toast.clearWaitingQueue(); }
  //_________________________________________________________________________________________________________________
    useEffect(() => {  //si attiva ogni volta che si ricarica la pagina
      onSnapshot(artCollectionRef, onSnapshot => {
        setArti(onSnapshot.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data()  
          }
        }))
      })
    }, [])
  //_________________________________________________________________________________________________________________
    const deleteImage = (imageId) => {
      const imageRef = ref(storage, imageId );
      deleteObject(imageRef).then(() => {     //funzione che permette l'eliminazione dell'immagine
        console.log("immagine eliminata, nice");
      });
    }
  //______________________________________________________________________________________________________________     
    const deleteArt = async (id) => { //funzione per eliminare il documento
      const postDoc = doc(db, "articoli", id);  
      await deleteDoc(postDoc);  
    }
    //_________________________________________________________________________________________________________________
    const updateArt = async (e) => {    //permette la modifica del documento
      e.preventDefault(); 
      if(!nome || !marca || !descrizione || !quantita || !prezzo || quantita<0 || prezzo<0) {  //uno di questi campi vuoti compare la notifica
        notifyErrorArt();
        toast.clearWaitingQueue(); 
        return; }
        if (imageUpload && !flagUpImg) {  //se l'immagine viene inserita, ma non caricata compare la notifica
          toast.dismiss();
          toast.clearWaitingQueue();
          notifyErrorImage();
          return; } 
    const ArtDoc = doc(db, "articoli", localStorage.getItem("ArtId"));
       await updateDoc(ArtDoc, {
        nome,
        marca,
        imageUrls,
        imageUpp: localStorage.getItem("imageId"),
        descrizione,
        quantita,
        prezzo,
        creatoIl,
      });
        setClear();
    }; 
    //_________________________________________________________________________________________________________________
      const uploadImage = (e) => {  //permette di caricare l'immagine nello storage, e setImageUrls prende come valore il suo url, viene attivata quando si preme carica immagine
        e.preventDefault();
        if (imageUpload == null) {  //immagine non inserita
          notifyErrorImage();
          toast.clearWaitingQueue(); 
          return; }
          localStorage.setItem("imageId", `images/${imageUpload.name + v4()}`) //mi serve dopo per eliminare l'immagine, quindi la salvo nella trupla (imageUpp)
        const imageRef = ref(storage, localStorage.getItem("imageId"));  //prende il riferimento
        uploadBytes(imageRef, imageUpload).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            setImageUrls(url);    //prende l'url dell'immagine
            toast.dismiss();
            notiUploadImage();
            setFlagUpImg(true);
          });
        });
      }
  //_________________________________________________________________________________________________________________
  const createArt = async (e) => {   //premette la creazione del documento
    e.preventDefault(); 
    if(!nome || !marca || !descrizione  || !quantita || !prezzo || quantita<0 || prezzo<0) {
      notifyErrorArt();
      toast.clearWaitingQueue(); 
      return; }
    if ( imageUpload == null || !flagUpImg) {
      toast.dismiss();
      toast.clearWaitingQueue();
      notifyErrorImage(); 
      return; }
    await addDoc(artCollectionRef, {
      nome,
      author: { name: auth.currentUser.displayName, id: auth.currentUser.uid },
      catId: catId,
      catNom: catNome,
      imageUrls,
      imageUpp: localStorage.getItem("imageId"),
      marca,
      descrizione,
      quantita,
      prezzo
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
          {/* POPUP FORM INSERIMENTO ARTICOLI     Condizione tramite chiudi ritorna false, quindi scompare, non visualizza tutto il form aggiungi */}
      {popupActive && <div className="popup">
        <div className="popup-inner bg-dark rounded-4">
          {!popupRem? <h2 className='text-white'>Add a Item</h2> :
            <h2 className='text-white'>Edit a Item</h2>}  
          {/* quando si preme il plusante crea di tipo submit si attiva la funzione handleSubmit  */}
          <form>
                <div className="form-outline form-white mb-4 ">
                  <label className='text-white'>Item</label>
                  {!popupRem? <input className="form-control form-control-lg" type="text" placeholder='nome collezione' onChange={(event) => {
                    setNome(event.target.value);}}/>        :
                     <input className="form-control form-control-lg" type="text" placeholder={nome} onChange={(event) => {
                    setNome(event.target.value);}}/> }
                </div>
                <div className="form-outline form-white mb-4">
                  <label className='text-white'>Descrizione</label>
                  {!popupRem? <textarea className="form-control form-control-lg" type="text" placeholder='descrizione' onChange={(event) => {
                    setDescrizione(event.target.value);}}/>        :
                     <textarea className="form-control form-control-lg" type="text" placeholder={descrizione} onChange={(event) => {
                    setDescrizione(event.target.value);}}/> }
                </div>
                <div className="form-outline form-white mb-4">
                  <label className='text-white'>Marca</label>
                  {!popupRem? <input className="form-control form-control-lg" type="text" placeholder='marca' onChange={(event) => {
                    setMarca(event.target.value);}}/>        :
                     <input className="form-control form-control-lg" type="text" placeholder={marca} onChange={(event) => {
                    setMarca(event.target.value);}}/> }
                </div>
                <div className="form-outline form-white mb-4">
                  <label className='text-white'>Prezzo unitario</label>
                  {!popupRem? <input className="form-control form-control-lg" type="number" placeholder='prezzo unitario' onChange={(event) => {
                    setPrezzo(event.target.value);}}/>        :
                     <input className="form-control form-control-lg" type="number" value={prezzo}  onChange={(event) => {
                    setPrezzo(event.target.value);}}/> }
                </div>
                <div className="form-outline form-white mb-4">
                  <label className='text-white'>Quantità</label>
                  {!popupRem? <input className="form-control form-control-lg" type="number" placeholder='quantità' onChange={(event) => {
                    setQuantita(event.target.value);}}/>        :
                     <input className="form-control form-control-lg" type="number" value={quantita} onChange={(event) => {
                    setQuantita(event.target.value);}}/> }
                </div>
                <div className="form-outline form-white mb-4">
                  <label className='text-white'>Image</label>
                    <input className="form-control form-control-lg" type="file" accept="image/png, image/jpeg" onChange={(event) => {
                    setImageUpload(event.target.files[0]);}}/>
                      <Button className='position-sticky' type="submit" variant="light me-2"  onClick={uploadImage}> Upload image</Button>
                </div>

                    <div className="container ">
                    <div className='row'>
                      <div className='col'></div>
                      <div className='col-7'>
                      {!popupRem? <button className='buttonSabbia me-1' type="submit" onClick={createArt} > Create</button>:
                        <button className='buttonSabbia me-1' type="submit" onClick={updateArt} > Edit</button>}
                        <button className='buttonClose' onClick={(setClear)} >Close</button>
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
                    <h3>{catNome}</h3>
                </div>
  
                <div className="col-5"> {/*COLONNA CENTRALE */}
                  <h2 className='text-center'><b>Articoli</b></h2>
                     <input className="form-control me-2 mb-4 rounded-4 shadow" type="search" placeholder="Search" aria-label="Search" onChange={event => {setSearchTerm(event.target.value)}}/>


                </div>     
      
                <div className="col">
                  <button className='buttonBlack float-end' onClick={() => {
                    setPopupRem(false);
                    setPopupActive(!popupActive)
                   }}>Add</button> 
                </div>
              </div>
  {/***************************************************************************************************************************************/}
                    {/* VISUALIZZA  TUTTI GLI ARTICOLI DI QUELLA SPECIFICA CATEGORIA*/}
              {arti.filter((val) => {       //search
                if(searchTerm == "") {
                  return val
                } else if (val.nome.toLowerCase().includes(searchTerm.toLowerCase()) || val.marca.toLowerCase().includes(searchTerm.toLowerCase())) {
                  return val
                }
              }).map((art) => (
                  <div key={art.id}>
                  {art.author.id === auth.currentUser.uid && art.catId === catId && (
                    <>
                    <div className="form-control shadow mb-2 bg-body rounded-4 "> 
                      <div className="row">
                        <div className='col'>
                          <img className='mt-1 rounded-3' src={art.imageUrls} style={{height: 185, width: 185}}/>
                        </div>
                        <div className="col">
                          <h2><b>{ art.nome }</b></h2>
                          <h4>Marca: <b>{art.marca}</b></h4>
                          <h4>Descrizione: {art.descrizione}</h4>
                          <h4>quantità: {art.quantita}</h4>
                          <h4>Prezzo unitario:{art.prezzo}€</h4>
                        </div>
                        <div className="col">                
                          <button className='buttonRemove mt-2 me-1 rounded-4 float-end' onClick={() => {
                            deleteImage(art.imageUpp);
                            deleteArt(art.id);
                            }} >Remove</button>

                          <button className='buttonBlack mt-2 me-1 rounded-4 float-end' onClick={() => {
                              setNome(art.nome);
                              setMarca(art.marca);
                              setDescrizione(art.descrizione);
                              setPrezzo(art.prezzo);
                              setQuantita(art.quantita);
                              setImageUrls(art.imageUrls);
                              localStorage.setItem("ArtId", art.id);
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
  {/***************************************************************************************************************************************/} 
            </div>
            </div>
    </>
}
export default Articoli;