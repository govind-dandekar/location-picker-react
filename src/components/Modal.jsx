import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

function Modal({ open, children, onClose }) {
  const dialog = useRef();

  // run code after component renders and ref is set
  // on dialog; dependencies are prop or state values
  // that are used inside of uE fx;
  // uE should run whenever comp fx runs if one of its
  // dependencies changed.
  useEffect(() => {
    if (open){
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [open])
  
  return createPortal(
    <dialog 
      className="modal" 
      ref={dialog}
      onClose={onClose}
    >
      {open ? children : null}
    </dialog>,
    document.getElementById('modal')
  );
};

export default Modal;
