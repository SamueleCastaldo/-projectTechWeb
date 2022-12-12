import { toast, Slide } from 'react-toastify';

export function notifyError () {
    toast.error('Please enter the name', {
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
export function notiUploadImage () {
    toast.success("Image uploaded successfully", {
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
    toast.error("Please insert and upload the image", {
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
        toast.error('Please enter all fields, or negative values ​​are not accepted', {
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
    toast.error("Account already registered or weak password", {
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
    toast.error("Wrong email or password", {
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
    toast.error("Email not found", {
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
    toast.success("Check your inbox, even spam", {
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