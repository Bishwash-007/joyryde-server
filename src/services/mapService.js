import { geocodeAddress } from '../config/googleMaps.js';

export async function geocode(address) {
  return geocodeAddress(address);
}
