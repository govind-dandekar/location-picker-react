import { useEffect } from 'react';

export default function DeleteConfirmation({ onConfirm, onCancel }) {
  useEffect(() => {
  // with original setup component is always rendered
  // so setTimeout fx will immediately run;
  // timer doesn't auto-stop when component isn't rendered
  // uE can fix time clean-up
    console.log('TIMER SET');
    const timer = setTimeout(() => {
      onConfirm();
    } , 3000)
    // define clean-up fx by returning it
    // runs when components re-executes again OR
    // when component dismounts
    return () => {
      console.log('Cleaning up timer');
      clearTimeout(timer);
    }
    // if dependency fx updates states, inf loop can trigger
    // in this app, state update leads to DeleteConfirmation 
    // being removed, so there is no inf loop.
  }, [onConfirm])

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
    </div>
  );
}
