import { createContext, useEffect, useState } from 'react';

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    const getCities = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:9000/cities');
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.log('There was an error fetching cities');
      } finally {
        setIsLoading(false);
      }
    };
    getCities();
  }, []);

  async function getCity(id) {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:9000/cities/${id}`);
      const data = await response.json();
      setCurrentCity(data);
    } catch (error) {
      console.log('There was an error fetching city');
    } finally {
      setIsLoading(false);
    }
  }

  async function createCity(newCity) {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:9000/cities`, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setCities((cities) => [...cities, data]);
    } catch (error) {
      console.log('There was an error creating a city');
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteCity(id) {
    try {
      setIsLoading(true);
      await fetch(`http://localhost:9000/cities/${id}`, {
        method: 'DELETE',
      });

      setCities((cities) => cities.filter((city) => city.id !== id));
    } catch (error) {
      console.log('There was an error deleting city');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
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

export { CitiesProvider, CitiesContext };
