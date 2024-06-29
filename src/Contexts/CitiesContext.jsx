import {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer,
  useCallback,
} from "react";
import axios from "axios";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };

    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };

    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities,action.payload],
        currentCity:action.payload,
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload ),
        currentCity: {}
      };


    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("Unknown action Type");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity ,error}, dispatch] = useReducer(
    reducer,
    initialState
  );


  useEffect(function fetchCities() {
    dispatch({ type: "loading" });
    axios
      .get("http://localhost:9000/cities")
      .then((response) => {
        dispatch({ type: "cities/loaded", payload: response.data });
      })
      .catch((error) => {
        dispatch({ type: "rejected", payload: error.response });
      })
     
  }, []);

  const getCity= useCallback( function getCity(id) {
    if (Number(id) === currentCity.id) return;

    dispatch({ type: "loading" });
    axios
      .get(`http://localhost:9000/cities/${id}`)
      .then((response) => {
        dispatch({type: "city/loaded" , payload:response.data});
      })
      .catch((error) => {
        dispatch({ type: "rejected", payload: error.response });
      })
 
  },[currentCity.id]
  )

  function createCity(newCity) {
    dispatch({ type: "loading" });
    axios
      .post(`http://localhost:9000/cities`, JSON.stringify(newCity), {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        dispatch({type:"city/created" , payload: response.data})
      })
      .catch((error) => {
        dispatch({ type: "rejected", payload: error.response });
      })
      
  }

  function deleteCity(id) {
    dispatch({ type: "loading" });
    axios
      .delete(`http://localhost:9000/cities/${id}`)
      .then(dispatch({type:"city/deleted" ,payload: id}))
      .catch((error) => {
        dispatch({ type: "rejected", payload: error.response });
      })
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        error,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) throw new Error("called out of context");
  return context;
}

export { CitiesProvider, useCities };
