import { of, pipe } from 'rxjs'
import { ajax } from 'rxjs/ajax'
import { map, catchError } from 'rxjs/operators'

//RXJS IMPLEMENTATION 
//NOT USE 
const baseURL = 'https://api.jsonbin.io/v3/b/64aede3d9d312622a37e69ee/4'
export const CallApiService = () => {
  let tunnelUrl;

  const getTunnelUrl = () => {
    return 
  }

  const observable$ = ajax.getJSON(baseURL).pipe(
    map(response => response),
    catchError(error => of(error))
  ) 
}
