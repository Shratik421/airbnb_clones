import { Link, useParams } from "react-router-dom";
import PlacesFormPage from "./PlacesFormPage";
import AccountNav from "./AccountNav";
import axios from "axios";
import { useEffect, useState } from "react";

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get("/places").then(({ data }) => {
      setPlaces(data);
    });
  }, []);

  return (
    <div>
      <AccountNav />

      <div className="text-center">
        {/* List Of All added Places <br /> */}
        <Link
          className="inline-flex gap-1 mt-3 bg-primary text-white  py-2 px-6 rounded-full"
          to={"/account/places/new"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
              clipRule="evenodd"
            />
          </svg>
          Add New Place
        </Link>
      </div>
      <div className="mt-4">
        {places.length > 0 &&
          places.map((place,index) => (
            <Link to={'/account/places/'+ place._id} key={index} className="flex cursor-pointer bg-gray-200 p-2 gap-4 rounded-2xl">
              <div className="w-32 h-32 flex bg-gray-300 grow shrink-0">
                {place.photos.length && <img className="object-cover" src={'http://localhost:4000/uploads/'+ place.photos[0]} alt="" />}
              </div>
              <div className="grow-0 shrink">
                <h2 className="text-xl">{place.title} </h2>
                <p className="text-sm mt-2 "> {place.description}</p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
