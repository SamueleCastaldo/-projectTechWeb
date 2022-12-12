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

function AllArticoli({ catId, catNome }) {
    const[arti, setArti] = useState([]); 
    
    const artCollectionRef = collection(db, "articoli"); 

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
//_________________________________________________________________________________________________________________
    const back = () => {
        navigate("/");
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
    useEffect(() => {  
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
      deleteObject(imageRef).then(() => {     
      });
    }
  //______________________________________________________________________________________________________________     
    const deleteArt = async (id) => { 
      const postDoc = doc(db, "articoli", id);  
      await deleteDoc(postDoc);  
    }
    //_________________________________________________________________________________________________________________
    const updateArt = async (e) => {    
      e.preventDefault(); 
      if(!nome || !marca || !descrizione  || !quantita || !prezzo || quantita<0 || prezzo<0) {  
        notifyErrorArt();
        toast.clearWaitingQueue(); 
        return; }
        if (imageUpload && !flagUpImg) {  
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
      const uploadImage = (e) => {  
        e.preventDefault();
        if (imageUpload == null) {  
          notifyErrorImage();           
          toast.clearWaitingQueue(); 
          return; }
          localStorage.setItem("imageId", `images/${imageUpload.name + v4()}`) 
        const imageRef = ref(storage, localStorage.getItem("imageId"));  
        uploadBytes(imageRef, imageUpload).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            setImageUrls(url);    
            toast.dismiss();
            notiUploadImage();
            setFlagUpImg(true);
          });
        });
      }
//******************************************************************** */
//******************************************************************** */
                             //INTERFACCIA 
//******************************************************************** */
//******************************************************************** */
    return  <><div className='Page'>
            <div className="container">
            <div> <ToastContainer limit={1} /> </div>
{/***************************************************************************************************************************************/}
          {/* POPUP FORM TO ENTER ALL ITEMS */}
      {popupActive && <div className="popup">
        <div className="popup-inner bg-dark rounded-4">

            <h2 className='text-white'>Edit Item</h2>
          <form>
                <div className="form-outline form-white mb-4 ">
                  <label className='text-white'>Item</label>     :
                     <input className="form-control form-control-lg" type="text" placeholder={nome} onChange={(event) => {
                    setNome(event.target.value);}}/> 
                </div>
                <div className="form-outline form-white mb-4">
                  <label className='text-white'>Description</label>
                     <textarea className="form-control form-control-lg" type="text" placeholder={descrizione} onChange={(event) => {
                    setDescrizione(event.target.value);}}/> 
                </div>
                <div className="form-outline form-white mb-4">
                  <label className='text-white'>Brand</label>
                     <input className="form-control form-control-lg" type="text" placeholder={marca} onChange={(event) => {
                    setMarca(event.target.value);}}/> 
                </div>
                <div className="form-outline form-white mb-4">
                  <label className='text-white'>Quantity</label>
                     <input className="form-control form-control-lg" type="number" value={quantita} onChange={(event) => {
                    setQuantita(event.target.value);}}/> 
                </div>
                <div className="form-outline form-white mb-4">
                  <label className='text-white'>Unit price</label>
                     <input className="form-control form-control-lg" type="number" value={prezzo}  onChange={(event) => {
                    setPrezzo(event.target.value);}}/> 
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
                      <div className='col'>
                      
                        <button className='buttonSabbia me-1' type="submit" onClick={updateArt} > Edit</button>
                        <button className='buttonClose' onClick={(setClear)} >close</button>
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
                </div>
  
                <div className="col-5"> {/* CENTRAL COLUMN */}
                  <h2 className='text-center'><b>All Item</b></h2>
                     <input className="form-control me-2 mb-4 rounded-4 shadow" type="search" placeholder="Search" aria-label="Search" onChange={event => {setSearchTerm(event.target.value)}}/>
                </div>     
      
                <div className="col"></div>
              </div>
  {/***************************************************************************************************************************************/}
    {/* VIEW ALL USER ARTICLES */}
              {arti.filter((val) => {       //search
                if(searchTerm == "") {
                  return val
                } else if (val.nome.toLowerCase().includes(searchTerm.toLowerCase()) || val.marca.toLowerCase().includes(searchTerm.toLowerCase()) || val.catNom.toLowerCase().includes(searchTerm.toLowerCase())) {
                  return val
                }
              }).map((art) => (
                  <div key={art.id}>
                  {art.author.id === auth.currentUser.uid && (
                    <>
                    <div className="form-control shadow mb-2 bg-body rounded-4 "> 
                      <div className="row">
                      <div className='col'>
                      <img className='mt-1 rounded-3' src={art.imageUrls} style={{height: 185, width: 185}}/>
                      </div>
                        <div className="col">
                        <h3><b>{ art.nome }</b></h3>
                        <h5>Marca: <b>{art.marca}</b></h5>
                        <h5>quantità: {art.quantita}</h5>
                        <h5>Prezzo unitario: {art.prezzo}€</h5>
                        <h5>Categoria: <b>{art.catNom}</b></h5>
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
export default AllArticoli;