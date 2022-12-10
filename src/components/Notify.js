import { toast, Slide } from 'react-toastify';

export function notifyError () {
    toast.error('Per favore inserisci il nome', {
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
        });
}
//________________________________________________________________________
            //NOTIFICHE PER ARTICOLI
export function notiUploadImage () {
    toast.success("Immagine caricata con successo", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        transition: Slide,
        progress: undefined,
        theme: "dark",
        className: "rounded-4"
        });
}
//_____________________________________________________________________________________
export function notifyErrorImage () {
    toast.error("Per favore inserisci e carica l'immagine", {
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
        });
}
//_____________________________________________________________________________________
export function notifyErrorArt () {
        toast.error('Per favore inserisci tutti i campi, oppure valori negativi non accettati', {
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
          });
}
//_____________________________________________________________________________________
export function errorRegi() {
    toast.error("Account già registrato o password debole", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        transition: Slide,
        theme: "dark",
        })
}
//_____________________________________________________________________________________
export function errorLogin() {
    toast.error("Email o password sbagliata", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        transition: Slide,
        theme: "dark",
        })
}
//_____________________________________________________________________________________
export function errorRecover() {
    toast.error("Email non trovata", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        transition: Slide,
        theme: "dark",
        })
}
//_____________________________________________________________________________________
export function successRecover () {
    toast.success("controlla la casella di posta, anche nello spam", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        transition: Slide,
        progress: undefined,
        theme: "dark",
        className: "rounded-4"
        });
}