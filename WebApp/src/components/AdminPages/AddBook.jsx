import { useState } from "react";
import axios from '../../api/axios';

const AddBook = () => {
    const [Data, setData] = useState({
        title: "",
        author: "",
        price: "",
        description: "",
        language: "",
        pdfFile: null,
        jpgFile: null,
        vectorDB:'No',
    });

    const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
    };

    const change = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setData({ ...Data, [name]: files[0] }); // Handle file input
        } else {
            setData({ ...Data, [name]: value });
        }
    };
    const submit = async () => {
      try {
          if (
              Data.title === "" ||
              Data.author === "" ||
              Data.price === "" ||
              Data.description === "" ||
              Data.language === "" ||
              !Data.pdfFile        || // Check if .pdf file is selected
              !Data.jpgFile           // Check if .jpg file is selected
          ) {
              alert("All fields with (*) are required!");
          } else {
              // Prepare payload for publish-book API
              const publishPayload = new FormData();

              publishPayload.append("title"       , Data.title);
              publishPayload.append("author"      , Data.author);
              publishPayload.append("price"       , Data.price);
              publishPayload.append("description" , Data.description);
              publishPayload.append("language"    , Data.language);
              publishPayload.append("file"        , Data.pdfFile); // Append .pdf file
              publishPayload.append("cover"       , Data.jpgFile); // Append .pdf file
              publishPayload.append("vectorDB"    , Data.vectorDB);
              
              // Send to publish-book API
              const publishResponse = await axios.post(
                  "/books/add",
                  publishPayload,
                  { headers }
              );

              // Reset form data
              setData({
                  title: "",
                  author: "",
                  price: "",
                  description: "",
                  language: "",
                  pdfFile: null,
                  jpgFile:null,
                  vectorDB:"No"
              });

              alert(publishResponse.data.message);
          }
      } catch (error) {
          alert(error.response.data.error);
      }
  };

  return (
    <div className="h-[100%] p-0 md:p-4">
      <h1 className=" text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">
        Add Book
      </h1>
      <div className="p-4 bg-zinc-800 rounded">
        <div className="mt-4">
          <label htmlFor="" className="text-zinc-400">
            Title of book *
          </label>
          <input
            type="text"
            className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
            placeholder="title of book"
            name="title"
            required
            value={Data.title}
            onChange={change}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="" className="text-zinc-400">
            Author of book *
          </label>
          <input
            type="text"
            className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
            placeholder="author of book"
            name="author"
            required
            value={Data.author}
            onChange={change}
          />
        </div>
        <div className="mt-4 flex gap-4">
          <div className="w-3/6">
            <label htmlFor="" className="text-zinc-400">
              Language *
            </label>
            <input
              type="text"
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
              placeholder="language of book"
              name="language"
              required
              value={Data.language}
              onChange={change}
            />
          </div>
          <div className="w-3/6">
            <label htmlFor="" className="text-zinc-400">
              Price *
            </label>
            <input
              type="number"
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
              placeholder="price of book"
              name="price"
              required
              value={Data.price}
              onChange={change}
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="" className="text-zinc-400">
            Description of book *
          </label>
          <textarea
            className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none "
            rows="5"
            placeholder="description of book"
            name="description"
            required
            value={Data.desc}
            onChange={change}
          />
        </div>

        <div className="mt-4">
                    <label htmlFor="jpgFile" className="text-zinc-400">
                        Upload Book Cover (.jpg file) *
                    </label>
                    <input
                        type="file"
                        className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
                        name="jpgFile"
                        accept=".jpg"
                        onChange={change}
                        required
                    />
        
        </div>

        <div className="mt-4">
                    <label htmlFor="pdfFile" className="text-zinc-400">
                        Upload Book (.pdf file) *
                    </label>
                    <input
                        type="file"
                        className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
                        name="pdfFile"
                        accept=".pdf"
                        onChange={change}
                        required
                    />
        
        </div>

        <div className="mt-4">
            <label className="text-zinc-400">Want to create Vector Store for Semantic Search ?</label>
            <div className="flex flex-row justify-between mt-2 text-zinc-200">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="vectorDB"
                  value="Yes"
                  checked={Data.vectorDB === "Yes"}
                  onChange={change}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="vectorDB"
                  value="No"
                  checked={Data.vectorDB === "No"}
                  onChange={change}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>
               
        <button
          className=" mt-4 px-3 bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition-all duration-300"
          onClick={submit}
        >
          Publish Book
        </button>
      </div>
    </div>
  )
}

export default AddBook
