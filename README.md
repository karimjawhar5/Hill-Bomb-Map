# Hill-Bomb-Map
## Summary:
Find and mark steep downhills on rodes within a radious of an origin location, for the purpose of shreding down those hills.

## API:
- Utalizes the google maps API

## How it Works:
- User sets a 'Location' assisted by google's places api, 'Radious' in km (i.e 1 -> 1km), 'Steepness' thershold (7-8 For steep hills)
- Places Radiuos*10 points on the circumference of a circle originating at Location
- Calls google's Directions API from Location to every point on circumference, and store routes
- Calls google's Elivation API on lat lng points in each rout, stores elevations.
- Loops throught each route's elevation and saves lat lng locations of segments that satisfy Steepness threshold.

## Improvables:
- not all rode's within circle are explored as main rodes are preffered over neigborhood roads for google's directions api
- roads shared by multiple routes, may be marked multiple times as they statisfy the threshold more than once.
- if downhill starts at an intersection, perpendicular roads may be marked.

## Demo Video:

[![Watch the video](https://i.imgur.com/vKb2F1B.png)](https://youtu.be/qN4CdH92F-0)

## UI/UX:
- 3 input feilds for each user input
- Loading is Jake the dog skating
- Main Interface is Google's map
- Google Font: Metal Mania
![image](https://user-images.githubusercontent.com/41839742/205478192-0c225d24-2847-4384-b1e9-b6a06ab98963.png)
