import { useState, useEffect } from 'react'

// create seperate component so DeleteConfirmation 
// component doesn't have to re-execute every 10 ms
function ProgressBar({timer}){
	const [remainingTime, setRemainingTime]  = useState(timer);

	// call uE since setInterval updates state and 
  // causes inf loop
  useEffect(() => {
    // defines fx that will be executed every interval
    const interval = setInterval(() => {
      console.log('INTERVAL')
      setRemainingTime(previousTime => previousTime - 10)
    }, 10)

    // return clean-up function in callback
    return (() => {
      clearInterval(interval);
    })
  }, [])

	return (
		<progress value={remainingTime} max={timer}/>
	)
}

export default ProgressBar;

