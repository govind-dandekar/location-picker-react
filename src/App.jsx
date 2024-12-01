import { useRef, useState, useEffect, useCallback } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js'

// this / localstorage code runs synchronously
// does not need useEffect
// App comonent doesn't finish execution cycle before
// localStorage returns data.
// move out of App so it only runs once
const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];

const storedPlaces = storedIds.map((id) => 
  AVAILABLE_PLACES.find((place) => place.id === id)
);

function App() {
  const selectedPlace = useRef();
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);

  // first arg of useEffect is fx that wraps async fx
  // second arg of useEffect is array of dependencies
  // useEffect runs after component fx execution finishes
  // if dependencies array is defined, React looks at 
  // dependencies and only executes useEffect fx
  // if dependecy value changes
  // react will never re-excute uE w/o dependecies after
  // first uE execution; if dependencies omitted,
  // uE will execute after every component cycle (inf loop)
  useEffect(() => {
  // async function since getting location may take time
  // this code is side effect: need loc but not directly
  // related to main goal of App (return renderable JSX code)
  // callback will likely execute after App renders
  navigator.geolocation.getCurrentPosition((position) => {
    const sortedPlaces = 
      sortPlacesByDistance(
        AVAILABLE_PLACES, 
        position.coords.latitude, 
        position.coords.longitude);

      // could cause inf loop since App will re-render
      // when state updates
      setAvailablePlaces(sortedPlaces)
  });
  }, [] )
  
  function handleStartRemovePlace(id) {
    setModalIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    // storage code is a sideEffect - not directly related to 
    // rendering JSX code but needed to persist list of saved
    // places; dont need to wrap with useEffect and
    // cant add a hook in a nested fx
    // code does not enter inf loop because state isn't 
    // being updated and code only executes when 
    // user clicks and handleSelectPlace() executes
    const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    
    // will return -1 if not found
    if (storedIds.indexOf(id) === -1){
      localStorage.setItem('selectedPlaces',
         // stored data must be in string format
         JSON.stringify([id, ...storedIds]));
    }
  }

  // wrapped fx will not be recreated every time App renders
  // fx stored in memory and React reuses stored fx
  // should use useCallback when passing fx as useEffect dependencies
  // prop or state values in fx should be added as dependency
  const handleRemovePlace = useCallback(function handleRemovePlace() {
      setPickedPlaces((prevPickedPlaces) =>
        prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
      );
      setModalIsOpen(false);
      const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
      localStorage.setItem('selectedPlaces', 
        JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current)))
    }, []);
  

  return (
    <>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>
      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="Sorting places by distance..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
