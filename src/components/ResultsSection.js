import {useEffect, useState} from 'react'
import MapDisplay from './MapDisplay';
//import ListDisplay from './ListDisplay';

//Usful Outside functions
function give_points(center, r, np){

    var radiusKm = r;
    var radiusLon = 1 / (111.319 * Math.cos(center.lat * (Math.PI / 180))) * radiusKm;
    var radiusLat = 1 / 110.574 * radiusKm;
  
    var dTheta = 2 * Math.PI / np;
    var theta = 0;
  
    var points = []
    for (var i = 0; i < np; i++)
    {
      var px = center.lat + radiusLat * Math.sin(theta)
      var py = center.lng + radiusLon * Math.cos(theta)
      points.push({lat:px, lng:py})
      theta += dTheta;
    }
              
  return points;
}

function ResultsSection({origin, radious, steepness}) {
    let [childOrigin, setChildOrigin] = useState(origin)
    let [childRadious, setChildRadious] = useState(radious)
    let [childSteepness, setChildSteepness] = useState(steepness)

    useEffect(() => {
        setChildOrigin(origin);
        setChildRadious(radious);
        setChildSteepness(steepness)
        setLoading(false)
      }, [origin,radious, steepness]);
    

    function generateRequests(origin,destinations){
        var requests = []
        if(origin == null || destinations == []){return}
        destinations.map(d=>{
            const request = {
                origin: origin,
                destination: d,
                //eslint-disable-next-line no-undef
                travelMode: google.maps.TravelMode.DRIVING,
            }
            requests.push(request)
        })
        return requests
      }

    let [allRoutes,setAllRoutes] = useState([])

    var delayFactor = 0;
    function get_directions_route (request) {
        //eslint-disable-next-line no-undef
        const directionsService = new google.maps.DirectionsService()
        directionsService.route(request, function(result, status) {
            //eslint-disable-next-line no-undef
            if (status === google.maps.DirectionsStatus.OK) {
            setAllRoutes(oldArray => [...oldArray, result]);
            //eslint-disable-next-line no-undef
            } else if (status === google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
                delayFactor++;
                setTimeout(function () {
                get_directions_route(request)
                }, delayFactor * 1000);
            } else {
                console.log("Route: " + status);
            }
        });
    } 

    let [allElevationPaths, setAllElevationPaths] = useState([])

    var delayFactor2 = 0;
    function get_elevations (path) {
        //eslint-disable-next-line no-undef
        const elevationsService = new google.maps.ElevationService()
        elevationsService.getElevationAlongPath({path:path, samples:(path.length/2)}, function(result, status) {
            //eslint-disable-next-line no-undef
            if (status === google.maps.DirectionsStatus.OK) {
            setAllElevationPaths(oldArray => [...oldArray, result]);
            //eslint-disable-next-line no-undef
            } else if (status === google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
                delayFactor++;
                setTimeout(function () {
                get_elevations(path)
                }, delayFactor2 * 1000);
            } else {
                console.log("elevation status: " + status);
            }
        });
    } 

  function get_all_routes(requests){
    requests.map(request => {
      get_directions_route(request);
    })
  }

  useEffect(() => {
    const givenPoints = give_points(childOrigin,childRadious,childRadious*10)
    const requests = generateRequests(childOrigin,givenPoints)
    setAllRoutes([])
    get_all_routes(requests)
  }, [childOrigin,childRadious]);

  useEffect(() => {
    if (allRoutes.length == childRadious*10){
      setAllElevationPaths([])
      for(var r=0; r < allRoutes.length; r++){
        get_elevations(allRoutes[r].routes[0].overview_path)
      }
    }
  }, [allRoutes]);


  const [downhills, setDownhills] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    if (allElevationPaths.length == childRadious*10){
      setDownhills([])
      get_downhills(allElevationPaths)
    }
  }, [allElevationPaths])

  const threshold = childSteepness;
  function get_downhills(elevationPaths){
    var result = []
    for(var ep=0; ep < elevationPaths.length; ep++){
      for(var i=0; i < elevationPaths[ep].length; i++){
        for(var j=i+1; j < elevationPaths[ep].length; j++){
          var pointA = elevationPaths[ep][i]
          var pointB = elevationPaths[ep][j]
          var distance = j-i
          var currElevDiff = Math.abs((pointA.elevation - pointB.elevation)/(distance));
          if(currElevDiff >= threshold){
            var topOfHill = null
            if(pointA.elevation >= pointB.elevation){topOfHill = pointA.location}else{topOfHill = pointB.location}
            result.push(topOfHill)
          }
        }
      }
    }
    setDownhills(result)
    setLoading(true)
    console.log(loading)
  }

  return(
    <div className='results-section'>
        <MapDisplay origin={childOrigin} radious={childRadious} downhills={downhills} loading={loading}/>
    </div>
  )
}
export default ResultsSection;

ResultsSection.defaultProps = {
    origin:{lat:43.488870,lng:-79.648240},
    radious: 1,
    steepness:8
}