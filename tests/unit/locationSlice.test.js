import { configureStore } from '@reduxjs/toolkit';
import locationReducer, {
  setGeoLocation,
  setCurrentLocation,
  addSearchedLocation,
  removeSearchedLocation,
  setGeoLocationError,
  setSearchedLocation,
} from '@src/store/slices/locationSlice';

describe('locationSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        location: locationReducer,
      },
    });
  });

  it('should return the initial state', () => {
    expect(store.getState().location.geoLocation).toBeNull();
    expect(store.getState().location.currentLocation).toBeNull();
    expect(store.getState().location.searchedLocations).toEqual([]);
    expect(store.getState().location.searchedLocation).toBeNull();
    expect(store.getState().location.error).toBeNull();
  });

  it('should handle setGeoLocation', () => {
    const geoData = { lat: 10, lon: 20 };
    store.dispatch(setGeoLocation(geoData));
    expect(store.getState().location.geoLocation).toEqual(geoData);
    expect(store.getState().location.error).toBeNull();
  });

  it('should handle setCurrentLocation', () => {
    const currentLocData = { city: 'London' };
    store.dispatch(setCurrentLocation(currentLocData));
    expect(store.getState().location.currentLocation).toEqual(currentLocData);
  });

  it('should handle setGeoLocationError', () => {
    const error = 'Location access denied';
    store.dispatch(setGeoLocationError(error));
    expect(store.getState().location.error).toBe(error);
  });

  it('should handle setSearchedLocation', () => {
    const searchedLoc = { name: 'Paris' };
    store.dispatch(setSearchedLocation(searchedLoc));
    expect(store.getState().location.searchedLocation).toEqual(searchedLoc);
  });

  it('should handle addSearchedLocation', () => {
    const loc1 = { locationName: 'New York' };
    const loc2 = { locationName: 'Tokyo' };
    store.dispatch(addSearchedLocation(loc1));
    store.dispatch(addSearchedLocation(loc2));
    expect(store.getState().location.searchedLocations).toEqual([loc1, loc2]);
  });

  it('should handle removeSearchedLocation', () => {
    const loc1 = { locationName: 'New York' };
    const loc2 = { locationName: 'Tokyo' };
    store.dispatch(addSearchedLocation(loc1));
    store.dispatch(addSearchedLocation(loc2));
    store.dispatch(removeSearchedLocation('New York'));
    expect(store.getState().location.searchedLocations).toEqual([loc2]);
  });
});