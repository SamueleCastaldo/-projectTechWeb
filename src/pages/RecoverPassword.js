//pagina di login
import React from 'react'
import { useRef } from 'react';
import {useNavigate} from "react-router-dom";
import { forgotPassword } from '../firebase-config';
import { ToastContainer, toast } from 'react-toastify';
import { errorRecover, successRecover } from '../components/Notify';

function RecoverPassword() {
  let navigate = useNavigate();  

  const emailRef = useRef();
//___________________________________________________________________________________________
async function handelRecoverPassword () {
    try {
    await forgotPassword(emailRef.current.value);
    successRecover();
    } catch {
      errorRecover();
      toast.clearWaitingQueue(); 
    }
    
  }
//___________________________________________________________________________________________
const navLogin = () => {
  navigate("/login");
}
//___________________________________________________________________________________________
  return (
    <>
    <div className='Page'>  
    <div className="ciao container">
    <div> <ToastContainer limit={1} /> </div> {/* It is used to show the toastify notification, with a limit of one at a time */}
  <section className="gradient-custom">
  <div className="container py-1">
    <div className="row d-flex justify-content-center align-items-center h-70">
      <div className="col-12 col-md-8 col-lg-6 col-xl-5">
        <div className="card bg-dark text-white" style={{borderRadius: "2rem"}}>
          <div className="card-body p-5 text-center">

            <div className="mb-md-5 mt-md-4 pb-5">

              <h2 className="fw-bold mb-5 text-uppercase">Recover Password</h2>

              <div className="form-outline form-white mb-4">
                <label class="form-label" htmlFor="typeEmailX">Email</label>
                <input ref={emailRef} type="email" id="typeEmailX" className="form-control form-control-lg" placeholder="Inserisci email"/>
              </div>

              <button className="btn btn-outline-light btn-lg px-5" type="submit" onClick={handelRecoverPassword}>Recover</button>

            </div>
            <div>
              <p className="mb-0">Do you already have an account? <a onClick={navLogin} className="text-white-50 fw-bold">Login</a>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</section>
    </div>
    </div>
    </>
  )

}

export default RecoverPassword