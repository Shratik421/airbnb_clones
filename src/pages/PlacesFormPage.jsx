import { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import Perks from "../Perks";
import axios from "axios";
import { data } from "autoprefixer";
import AccountNav from "./AccountNav";

export default function PlacesFormPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [photoLink, setPhotoLink] = useState("");
  const [description, setDescription] = useState("");
  const [perks, setPerk] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/places/" + id).then((response) => {
      const { data } = response;
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerk(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
    });
  }, [id]);

  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }
  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function addPhotoByLink(e) {
    e.preventDefault();
    try {
      const { data: filename } = await axios.post("/upload-by-link", {
        link: photoLink,
      });
      setAddedPhotos((prev) => [...prev, filename]);
      setPhotoLink("");
    } catch (error) {
      console.error("Error adding photo by link:", error);
    }
  }

  //image is uploading but the imgae not showing in the page image is return in the array form and  passing the object of object error solve it later
  function uploadPhoto(e) {
    e.preventDefault();
    const files = e.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }
    axios
      .post("/upload", data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then((response) => {
        const { data: filenames } = response;
        setAddedPhotos((prev) => {
          return [...prev, ...filenames];
        });
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error uploading photo:", error);
      });
  }

  async function savePlace(ev) {
    ev.preventDefault();
    const placeData = {
      title,
      address,
      addedPhotos: addedPhotos.map((photo) => photo.newName),
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
    };
    if (id) {
      //update
      await axios.put("/places/${id}", {
        id,
        ...placeData,
      });
      setRedirect(true);
    } else {
      //new place
      await axios.post("/places", placeData);
      setRedirect(true);
    }
  }

  
  if (redirect) return <Navigate to={"/account/places"} />;

  function removePhoto(filename) {
    onChange([...addedPhotos.filter((photos) => photos !== filename)]);
  }

  return (
    <div className="p-2">
      <AccountNav />
      <form onSubmit={savePlace}>
        {preInput("Title", "Title For Your place .")}
        <h2 className="text-2xl mt-4"></h2>
        <input
          className="text-gray-500 text-sm"
          type="text"
          placeholder="title, for exmaple : My Lovely Place"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {preInput("Address", "Address to this place  .")}
        <h2 className="text-2xl mt-4"></h2>
        <input
          type="text"
          placeholder="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        {preInput("Photos", " Add Photos")}
        <h2 className="text-2xl mt-4"></h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={"Add using  a link... jpg"}
            value={photoLink}
            onChange={(e) => setPhotoLink(e.target.value)}
          />
          <button
            onClick={addPhotoByLink}
            className="bg-gray-200 px-4 rounded-2xl"
          >
            Add&nbsp;Photos
          </button>
        </div>
        <div className="mt-2 gap-2 grid grid-col-3 md:grid-cols-4 lg:cols-6 text-gray-600">
          {addedPhotos.length > 0 &&
            addedPhotos.map((link) => (
              <div key={link} className="h-32 flex relative">
                <img
                  key={link.filename}
                  className="rounded-2xl w-full object-cover"
                  src={"http://localhost:4000/uploads/" + link}
                  alt={link.newName}
                />
                <button
                  onClick={() => removePhoto(link)}
                  className="cursor-pointer absolute bottom-1 right-1 text-white bg-opacity-50 rounded-2xl bg-black py-2 px-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => selectAsMainPhoto(link)}
                  className="cursor-pointer absolute bottom-1 left-1 text-white bg-opacity-50 rounded-2xl bg-black py-2 px-3"
                >
                  {link == addedPhotos[0] && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                      />
                    </svg>
                  )}
                  {link !== addedPhotos[0] && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
            ))}
          <label
            className="h-32 cursor-pointer flex items-center justify-center gap-1
           border bg-transparent rounded-2xl p-4"
          >
            <input
              type="file"
              multiple
              className="hidden"
              onChange={uploadPhoto}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8"
            >
              <path d="M11.47 1.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1-1.06 1.06l-1.72-1.72V7.5h-1.5V4.06L9.53 5.78a.75.75 0 0 1-1.06-1.06l3-3ZM11.25 7.5V15a.75.75 0 0 0 1.5 0V7.5h3.75a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h3.75Z" />
            </svg>
            Upload from Device
          </label>
        </div>
        {preInput("Description", "Description of place")}
        <h2 className="text-2xl mt-4"></h2>
        <p className="text-gray-500 text-sm"> </p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <h2 className="text-2xl mt-4">Perks</h2>
        <p className="text-gray-500 text-sm">Select all the perk of place</p>
        <div className="grid mt-2 gap-2 grid-cols-2 md:grid:grid -cols-3 lg:grid-cols-6">
          <Perks selected={perks} onChange={setPerk} />
        </div>
        {preInput("Extra Info", "What TYpe of House , House Rules")}
        <h2 className="text-2xl mt-4"></h2>
        <p className="text-gray-500 text-sm"></p>
        <textarea
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
        />
        {preInput(
          "Check IN & OUT Times",
          "Add check in and out times , rember to have some time window for cleaning the roo between guests"
        )}
        <h2 className="text-2xl mt-4"> </h2>
        <p className="text-gray-500 text-sm"></p>
        <div className="grid gap-2 sm:grid-cols-3">
          <div className="mt-2  -mb-1 ">
            <h3> Check In time</h3>
            <input
              type="text"
              placeholder="14"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
          <div className="mt-2 -mb-1">
            <h3>Check Out Time</h3>
            <input
              type="text"
              placeholder="11"
              alue={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
          <div className="mt-2 -mb-1">
            <h3>Max Number Of guests</h3>
            <input
              type="number"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
            />
          </div>
        </div>
        <div>
          <button className="primary my-4">Save</button>
        </div>
      </form>
    </div>
  );
}
