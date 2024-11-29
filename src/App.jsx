import { useRef, useState, useEffect } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js'

function App() {
  const modal = useRef();
  const selectedPlace = useRef();
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState([]);


  // first arg of useEffect is fx that wraps async fx
  // second arg of useEffect is array of dependencies
  // useEffect runs after component fx execution finishes
  // if dependencies array is defined, React looks at 
  // dependencies and only executes useEffect fx
  // if dependecy value changes
  // react will never re-excute uE w/o dependecies after
  // first uE execution; if dependencies omitted,
  // uE will execcute after every component cycle (inf loop)
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
    modal.current.open();
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    modal.current.close();
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });
  }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    modal.current.close();
  }

  return (
    <>
      <Modal ref={modal}>
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
          places={AVAILABLE_PLACES}
          fallbackText="Sorting places by distance..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
