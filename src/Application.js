import ResultsSection from './components/ResultsSection'
import { Autocomplete, useJsApiLoader} from '@react-google-maps/api';
import { useRef, useState } from 'react'
import './index.css';

function Application() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "", /*Add Your Google API Key Here*/
    libraries: ['places'],
  })
    const [passedOrigin, setPassedOrigin] = useState({lat:43.488870,lng:-79.648240})
    const [passedRadious, setPassedRadious] = useState(0)
    const [passedSteepness, setPassedSteepness] = useState(8)

    const originRef = useRef({lat:43.488870,lng:-79.648240})
    const radiousRef = useRef(0)
    const steepnessRef = useRef(8)

    const clickHandle = event => {
        event.preventDefault()
        let copyOriginRef = Object.assign({}, originRef.current);
        setPassedOrigin(copyOriginRef)
        setPassedRadious(radiousRef.current.value)
        setPassedSteepness(steepnessRef.current.value)
      }

    const [autocomplete,setAutocomplete]=useState()
    const onLoad = (autocomplete) =>{
        if(autocomplete){
            setAutocomplete(autocomplete)
        }
    }

    const onPlaceChanged = (event) => {
        if(autocomplete){
          const place = autocomplete
          originRef.current.lat = place.getPlace().geometry.location.lat()
          originRef.current.lng = place.getPlace().geometry.location.lng()
          console.log(originRef.current.lat);
        }else{
          console.log('not loaded autocomplete')
        }
    }

  return(
    isLoaded?
    <div className='application'>
        <div className = 'top-section'>
            <h1 className='main-title'>HillBomb.Com</h1>
            <form>
                <label className="input-lable" htmlFor="location">Location:</label>
                <Autocomplete className='autocompleter' onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <input type="text" id="location-input" name="location"/>
                </Autocomplete>

                <label className="input-lable" htmlFor="location">Radius:</label>
                <input ref={radiousRef} type="number" id="number-input" name="location"/>
                
                <label className="input-lable" htmlFor="location">Steepness:</label>
                <input ref={steepnessRef} type="number" id="number-input" name="location"/>

                <button className='find-button' onClick={clickHandle}>Find</button>
            </form>
        </div>
        <ResultsSection origin={passedOrigin} radious = {passedRadious} steepness={passedSteepness}/>
    </div>:<></>
  )
}

export default Application;
