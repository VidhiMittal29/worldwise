import { useEffect, useState } from "react";
import axios from "axios";
import Message from "../Components/Message";
import Spinner from "../Components/Spinner";
import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useURLPosition } from "../hooks/useURLPosition";
import { useCities } from "../Contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [lat, lng] = useURLPosition();
  const {createCity, isLoading} =useCities();
  const navigate= useNavigate()

  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [isGeoLoading, setIsGeoLoading] = useState(false);
  const [emoji, setEmoji] = useState("");
  const [geoCodingError, setGeoCodingError] = useState("");

  useEffect(() => {
    if (!lat && !lng) return;

    setIsGeoLoading(true);
    setGeoCodingError("");
    axios
      .get(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
      )
      .then((response) => {
        if (!response.data.countryCode)
          throw new Error(
            "That doesn't seem to be a city!! Click somewhere else😉"
          );

        setCityName(response.data.city || response.data.locality || "");
        setCountry(response.data.country);
        setEmoji(convertToEmoji(response.data.countryCode));
      })
      .catch((err) => setGeoCodingError(err.message))
      .finally(setIsGeoLoading(false));
  }, [lat, lng]);

   function handleSubmit(e){

    e.preventDefault();
    if (!cityName || !date ) return ;

    const newCity={
      cityName,
      country,
      emoji,
      date,
      notes, position: {lat,lng},
    }

     createCity(newCity);
    navigate("/app/cities");
  }

  if (isGeoLoading) return <Spinner />;

  if (!lat && !lng) return <Message message={"Start by clicking on the map"} />;

  if (geoCodingError) return <Message message={geoCodingError} />;

  return (
    <form className={`${styles.form} ${isLoading? styles.loading : ''}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat={"dd/MM/yyyy"}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
