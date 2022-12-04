import {useEffect, useState} from 'react'

import { GoogleMap, Circle, Marker } from '@react-google-maps/api';
import jake from '../jake.gif'

const MapDisplay = ({origin, radious, downhills, loading}) => {

    let [newOrigin, setNewOrigin]=useState(origin)
    let [newRadious, setNewRadious]=useState(radious)
    let [newDownhills, setNewDownhills]=useState(downhills)
    let [newLoading, setNewLoading]=useState(loading)
    const [map, setMap] = useState(null)

    useEffect(()=>{
        setNewLoading(loading)
    },[loading])

    useEffect(() => {
        setNewOrigin(origin)
        setNewRadious(radious)
        if(map){
            map.panTo(origin)
        }
      }, [origin, radious]);

      useEffect(() => {
        setNewDownhills(get_top_hills(downhills))
      }, [downhills]);

      

      const circleOptions = {
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        clickable: false,
        draggable: false,
        editable: false,
        visible: true,
        radius: newRadious*1000,
        zIndex: 1
      }

      function get_top_hills(downhills){
        var result = []
        for(var i=0; i < downhills.length; i++){
            result.push({lat:downhills[i].lat(), lng:downhills[i].lng()})
          }
          const res2 = result.map(p=>{ return <Marker position={{lat:p.lat,lng:p.lng}}/>})
          return res2
        }

  return (
    <div className='map-display'>
      <GoogleMap
        mapContainerClassName='map-container'
        center={newOrigin}
        zoom={14}
        onLoad={(map)=>setMap(map)}
      >
        <Circle center={newOrigin} options={circleOptions} /> 
        {newDownhills}
    </GoogleMap>
    {newLoading?<></>
    : <div className='loading-screen'><img src={jake} alt='loading' className='loading-gif'/></div>}
    </div>
  )
}

export default MapDisplay
MapDisplay.defaultProps = {
    origin:{lat:43.488870,lng:-79.648240},
    radious: 0,
    downhills:[],
    loading:false
}