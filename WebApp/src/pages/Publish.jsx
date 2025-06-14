// import { useState } from "react";
// import axios from '../api/axios';

// const Publish = () => {
//     const [Data, setData] = useState({
//         title: "",
//         author: "",
//         price: "",x
//         description: "",
//         language: "",
//         pdfFile: null,
//         jpgFile: null,
//         vectorDB:'No',
//     });

//     const[isLoading, setIsLoading] = useState(false);

//     const headers = {
//         id: localStorage.getItem("id"),
//         authorization: `Bearer ${localStorage.getItem("token")}`,
//         "Content-Type": "multipart/form-data",
//     };

//     const change = (e) => {
//         const { name, value, type, files } = e.target;
//         if (type === "file") {
//             setData({ ...Data, [name]: files[0] }); // Handle file input
//         } else {
//             setData({ ...Data, [name]: value });
//         }
//     };


//   //   const submit = async () => {
//   //     try {
//   //         if (
//   //             Data.title === "" ||
//   //             Data.author === "" ||
//   //             Data.price === "" ||
//   //             Data.description === "" ||
//   //             Data.language === "" ||
//   //             !Data.pdfFile        || // Check if .pdf file is selected
//   //             !Data.jpgFile           // Check if .jpg file is selected
//   //         ) {
//   //             alert("All fields with (*) are required!");
//   //         } else {
//   //             // Prepare payload for publish-book API
//   //             const publishPayload = new FormData();

//   //             publishPayload.append("title"       , Data.title);
//   //             publishPayload.append("author"      , Data.author);
//   //             publishPayload.append("price"       , Data.price);
//   //             publishPayload.append("description" , Data.description);
//   //             publishPayload.append("language"    , Data.language);
//   //             publishPayload.append("file"        , Data.pdfFile); // Append .pdf file
//   //             publishPayload.append("cover"       , Data.jpgFile); // Append .pdf file
//   //             publishPayload.append("vectorDB"    , Data.vectorDB);
              
//   //             // Send to publish-book API
//   //             const publishResponse = await axios.post(
//   //                 "/books/add",
//   //                 publishPayload,
//   //                 { headers }
//   //             );

//   //             // Reset form data
//   //             setData({
//   //                 title: "",
//   //                 author: "",
//   //                 price: "",
//   //                 description: "",
//   //                 language: "",
//   //                 pdfFile: null,
//   //                 jpgFile:null,
//   //                 vectorDB:"No"
//   //             });

//   //             alert(publishResponse.data.message);
//   //         }
//   //     } catch (error) {
//   //         alert(error.response.data.error);
//   //     }
//   // };

// //   const submit = async () => {
// //     setIsLoading(true);
// //     try {
// //         if (
// //             Data.title === "" ||
// //             Data.author === "" ||
// //             Data.price === "" ||
// //             Data.description === "" ||
// //             Data.language === "" ||
// //             !Data.pdfFile ||
// //             !Data.jpgFile
// //         ) {
// //             alert("All fields with (*) are required!");
// //             return;
// //         }

// //         // Step 1: Process the PDF first
// //         const processFormData = new FormData();
// //         processFormData.append("file", Data.pdfFile);
        
// //         const processResponse = await axios.post(
// //           "http://localhost:8000/process-pdf",
// //           processFormData,
// //           { 
// //               headers: {
// //                   "Content-Type": "multipart/form-data",
// //               },
// //               responseType: 'blob',
// //               // REMOVE withCredentials unless you're actually using cookies/authentication
// //               withCredentials: true  // Only include if you need credentials
// //           } 
// //       );
// //         // Step 2: Prepare the processed PDF for publishing
// //         const processedPdfFile = new File(
// //             [processResponse.data],
// //             `processed_${Data.pdfFile.name}`,
// //             { type: Data.pdfFile.type }
// //         );

// //         // Step 3: Prepare payload for publish-book API
// //         const publishPayload = new FormData();
// //         publishPayload.append("title", Data.title);
// //         publishPayload.append("author", Data.author);
// //         publishPayload.append("price", Data.price);
// //         publishPayload.append("description", Data.description);
// //         publishPayload.append("language", Data.language);
// //         publishPayload.append("file", processedPdfFile);
// //         publishPayload.append("cover", Data.jpgFile);
// //         publishPayload.append("vectorDB", Data.vectorDB);

// //         // Step 4: If vector store is needed, create it
// //         if (Data.vectorDB === "Yes") {
// //             const vectorizeFormData = new FormData();
// //             vectorizeFormData.append("file", processedPdfFile);
            
// //             await axios.post(
// //                 "/vectorize",
// //                 vectorizeFormData,
// //                 { headers }
// //             );
// //         }

// //         // Step 5: Finally publish the book
// //         const publishResponse = await axios.post(
// //             "/books/add",
// //             publishPayload,
// //             { headers }
// //         );

// //         // Reset form data
// //         setData({
// //             title: "",
// //             author: "",
// //             price: "",
// //             description: "",
// //             language: "",
// //             pdfFile: null,
// //             jpgFile: null,
// //             vectorDB: "No"
// //         });

// //         alert("Book published successfully with index!");

// //     } catch (error) {
// //         console.error("Publishing failed:", error);
// //         alert(error.response?.data?.message || error.message || "Publishing failed");
// //     } finally {
// //       setIsLoading(false);
// //     }
// // };


// // Modified Version
// const submit = async () => {
//   setIsLoading(true);
//   try {
//       if (
//           Data.title === "" ||
//           Data.author === "" ||
//           Data.price === "" ||
//           Data.description === "" ||
//           Data.language === "" ||
//           !Data.pdfFile ||
//           !Data.jpgFile
//       ) {
//           alert("All fields with (*) are required!");
//           return;
//       }

//       // Prepare payload for publish-book API
//       const publishPayload = new FormData();
//       publishPayload.append("title", Data.title);
//       publishPayload.append("author", Data.author);
//       publishPayload.append("price", Data.price);
//       publishPayload.append("description", Data.description);
//       publishPayload.append("language", Data.language);
//       publishPayload.append("file", Data.pdfFile);  // Using original PDF file directly
//       publishPayload.append("cover", Data.jpgFile);
//       publishPayload.append("vectorDB", Data.vectorDB);

//       // If vector store is needed, create it
//       if (Data.vectorDB === "Yes") {
//           const vectorizeFormData = new FormData();
//           vectorizeFormData.append("file", Data.pdfFile);  // Using original PDF file
          
//           await axios.post(
//               "/vectorize",
//               vectorizeFormData,
//               { headers }
//           );
//       }

//       // Finally publish the book
//       const publishResponse = await axios.post(
//           "/books/add",
//           publishPayload,
//           { headers }
//       );

//       // Reset form data
//       setData({
//           title: "",
//           author: "",
//           price: "",
//           description: "",
//           language: "",
//           pdfFile: null,
//           jpgFile: null,
//           vectorDB: "No"
//       });

//       alert("Book published successfully with index!");

//   } catch (error) {
//       console.error("Publishing failed:", error);
//       alert(error.response?.data?.message || error.message || "Publishing failed");
//   } finally {
//       setIsLoading(false);
//   }
// };



// return (
//   <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 p-4 md:p-8">
//     <div className="max-w-3xl mx-auto">
//       {/* Header */}
//       <div className="mb-8 text-center md:text-left">
//         <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mb-3">
//           Publish Your Book
//         </h1>
//         <p className="text-zinc-400 text-lg">Fill in the details to share your work with readers</p>
//       </div>

//       {/* Form Container */}
//       <div className="bg-zinc-800/80 backdrop-blur-sm rounded-xl shadow-xl p-6 md:p-8 border border-zinc-700/50">
//         {/* Form Grid */}
//         <div className="space-y-6">
//           {/* Title */}
//           <div>
//             <label className="block text-zinc-300 mb-2 font-medium text-lg">Book Title *</label>
//             <input
//               type="text"
//               className="w-full bg-zinc-900/70 border border-zinc-700 focus:border-blue-500 text-zinc-100 p-3 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500/30 placeholder-zinc-500"
//               placeholder="Enter your book title"
//               name="title"
//               required
//               value={Data.title}
//               onChange={change}
//             />
//           </div>

//           {/* Author */}
//           <div>
//             <label className="block text-zinc-300 mb-2 font-medium text-lg">Author *</label>
//             <input
//               type="text"
//               className="w-full bg-zinc-900/70 border border-zinc-700 focus:border-blue-500 text-zinc-100 p-3 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500/30 placeholder-zinc-500"
//               placeholder="Author name"
//               name="author"
//               required
//               value={Data.author}
//               onChange={change}
//             />
//           </div>

//           {/* Language and Price */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Language */}
//             <div>
//               <label className="block text-zinc-300 mb-2 font-medium text-lg">Language *</label>
//               <input
//                 type="text"
//                 className="w-full bg-zinc-900/70 border border-zinc-700 focus:border-blue-500 text-zinc-100 p-3 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500/30 placeholder-zinc-500"
//                 placeholder="Book language"
//                 name="language"
//                 required
//                 value={Data.language}
//                 onChange={change}
//               />
//             </div>

//             {/* Price */}
//             <div>
//               <label className="block text-zinc-300 mb-2 font-medium text-lg">Price *</label>
//               <div className="relative">
//                 <span className="absolute left-3 top-3 text-zinc-400">$</span>
//                 <input
//                   type="number"
//                   className="w-full bg-zinc-900/70 border border-zinc-700 focus:border-blue-500 text-zinc-100 pl-8 p-3 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500/30 placeholder-zinc-500"
//                   placeholder="0.00"
//                   name="price"
//                   required
//                   value={Data.price}
//                   onChange={change}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Description */}
//           <div>
//             <label className="block text-zinc-300 mb-2 font-medium text-lg">Description *</label>
//             <textarea
//               className="w-full bg-zinc-900/70 border border-zinc-700 focus:border-blue-500 text-zinc-100 p-3 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500/30 placeholder-zinc-500 min-h-[150px]"
//               placeholder="Enter a detailed description of your book"
//               name="description"
//               required
//               value={Data.desc}
//               onChange={change}
//             />
//           </div>

//           {/* File Uploads */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Cover Image */}
//             <div>
//               <label className="block text-zinc-300 mb-2 font-medium text-lg">Book Cover *</label>
//               <div className="relative border-2 border-dashed border-zinc-700 rounded-lg p-4 transition-all duration-300 hover:border-blue-500">
//                 <input
//                   type="file"
//                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                   name="jpgFile"
//                   accept=".jpg,.jpeg"
//                   onChange={change}
//                   required
//                 />
//                 <div className="text-center">
//                   <svg className="mx-auto h-12 w-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
//                   </svg>
//                   <p className="mt-2 text-sm text-zinc-400">Upload JPG cover image</p>
//                   <p className="text-xs text-zinc-500 mt-1">Max size: 5MB</p>
//                 </div>
//               </div>
//             </div>

//             {/* PDF Upload */}
//             <div>
//               <label className="block text-zinc-300 mb-2 font-medium text-lg">Book PDF *</label>
//               <div className="relative border-2 border-dashed border-zinc-700 rounded-lg p-4 transition-all duration-300 hover:border-blue-500">
//                 <input
//                   type="file"
//                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                   name="pdfFile"
//                   accept=".pdf"
//                   onChange={change}
//                   required
//                 />
//                 <div className="text-center">
//                   <svg className="mx-auto h-12 w-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
//                   </svg>
//                   <p className="mt-2 text-sm text-zinc-400">Upload PDF file</p>
//                   <p className="text-xs text-zinc-500 mt-1">Max size: 50MB</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Vector DB Option */}
//           <div className="pt-2">
//             <label className="block text-zinc-300 mb-3 font-medium text-lg">Enable Semantic Search?</label>
//             <div className="flex space-x-6">
//               <label className="flex items-center space-x-2 cursor-pointer">
//                 <input
//                   type="radio"
//                   name="vectorDB"
//                   value="Yes"
//                   checked={Data.vectorDB === "Yes"}
//                   onChange={change}
//                   className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-zinc-600 bg-zinc-900"
//                 />
//                 <span className="text-zinc-300">Yes</span>
//               </label>
//               <label className="flex items-center space-x-2 cursor-pointer">
//                 <input
//                   type="radio"
//                   name="vectorDB"
//                   value="No"
//                   checked={Data.vectorDB === "No"}
//                   onChange={change}
//                   className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-zinc-600 bg-zinc-900"
//                 />
//                 <span className="text-zinc-300">No</span>
//               </label>
//             </div>
//             <p className="mt-2 text-sm text-zinc-500">Create vector store for enhanced search capabilities</p>
//           </div>

//           {/* Submit Button */}
//           <div className="pt-4">
//             <button
//               className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
//               onClick={submit} disabled={isLoading}
//             >
//               Publish Book
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// )
// }

// export default Publish





import { useState } from "react";
import axios from '../api/axios';

const Publish = () => {
    // Form state
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        price: "",
        description: "",
        language: "",
        pdfFile: null,
        jpgFile: null,
        vectorDB: 'No',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get auth headers
    const getHeaders = () => ({
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
    });

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "file" ? files[0] : value
        }));
    };

    // Validate form fields
    const validateForm = () => {
        const requiredFields = [
            'title', 'author', 'price', 
            'description', 'language'
        ];
        
        return requiredFields.every(field => formData[field]) && 
               formData.pdfFile && 
               formData.jpgFile;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        if (!validateForm()) {
            setError("All fields with (*) are required!");
            return;
        }

        setIsLoading(true);

        try {
            // Prepare form data
            const payload = new FormData();
            payload.append("title", formData.title);
            payload.append("author", formData.author);
            payload.append("price", formData.price);
            payload.append("description", formData.description);
            payload.append("language", formData.language);
            payload.append("file", formData.pdfFile);
            payload.append("cover", formData.jpgFile);
            payload.append("vectorDB", formData.vectorDB);

            // // Create vector store if needed
            // if (formData.vectorDB === "Yes") {
            //     const vectorData = new FormData();
            //     vectorData.append("file", formData.pdfFile);
            //     await axios.post("/vectorize", vectorData, { headers: getHeaders() });
            // }

            // Submit book data
            await axios.post("/books/add", payload, { headers: getHeaders() });

            // Reset form on success
            setFormData({
                title: "",
                author: "",
                price: "",
                description: "",
                language: "",
                pdfFile: null,
                jpgFile: null,
                vectorDB: "No"
            });

            alert("Book published successfully!");

        } catch (err) {
            console.error("Publishing error:", err);
            setError(err.response?.data?.message || err.message || "Failed to publish book");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mb-3">
                        Publish Your Book
                    </h1>
                    <p className="text-zinc-400 text-lg">Fill in the details to share your work with readers</p>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
                        {error}
                    </div>
                )}

                {/* Form Container */}
                <form onSubmit={handleSubmit} className="bg-zinc-800/80 backdrop-blur-sm rounded-xl shadow-xl p-6 md:p-8 border border-zinc-700/50">
                    <div className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-zinc-300 mb-2 font-medium text-lg">Book Title *</label>
                            <input
                                type="text"
                                className="w-full bg-zinc-900/70 border border-zinc-700 focus:border-blue-500 text-zinc-100 p-3 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500/30 placeholder-zinc-500"
                                placeholder="Enter your book title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>

                        {/* Author */}
                        <div>
                            <label className="block text-zinc-300 mb-2 font-medium text-lg">Author *</label>
                            <input
                                type="text"
                                className="w-full bg-zinc-900/70 border border-zinc-700 focus:border-blue-500 text-zinc-100 p-3 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500/30 placeholder-zinc-500"
                                placeholder="Author name"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>

                        {/* Language and Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Language */}
                            <div>
                                <label className="block text-zinc-300 mb-2 font-medium text-lg">Language *</label>
                                <input
                                    type="text"
                                    className="w-full bg-zinc-900/70 border border-zinc-700 focus:border-blue-500 text-zinc-100 p-3 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500/30 placeholder-zinc-500"
                                    placeholder="Book language"
                                    name="language"
                                    value={formData.language}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-zinc-300 mb-2 font-medium text-lg">Price *</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-zinc-400">$</span>
                                    <input
                                        type="number"
                                        className="w-full bg-zinc-900/70 border border-zinc-700 focus:border-blue-500 text-zinc-100 pl-8 p-3 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500/30 placeholder-zinc-500"
                                        placeholder="0.00"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-zinc-300 mb-2 font-medium text-lg">Description *</label>
                            <textarea
                                className="w-full bg-zinc-900/70 border border-zinc-700 focus:border-blue-500 text-zinc-100 p-3 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500/30 placeholder-zinc-500 min-h-[150px]"
                                placeholder="Enter a detailed description of your book"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>

                        {/* File Uploads */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Cover Image */}
                            <div>
                                <label className="block text-zinc-300 mb-2 font-medium text-lg">Book Cover *</label>
                                <div className={`relative border-2 border-dashed rounded-lg p-4 transition-all duration-300 ${
                                    isLoading ? "border-zinc-600 cursor-not-allowed" : "border-zinc-700 hover:border-blue-500 cursor-pointer"
                                }`}>
                                    <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0"
                                        name="jpgFile"
                                        accept=".jpg,.jpeg"
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                    <div className="text-center">
                                        <svg className="mx-auto h-12 w-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                        <p className="mt-2 text-sm text-zinc-400">
                                            {formData.jpgFile ? formData.jpgFile.name : "Upload JPG cover image"}
                                        </p>
                                        <p className="text-xs text-zinc-500 mt-1">Max size: 5MB</p>
                                    </div>
                                </div>
                            </div>

                            {/* PDF Upload */}
                            <div>
                                <label className="block text-zinc-300 mb-2 font-medium text-lg">Book PDF *</label>
                                <div className={`relative border-2 border-dashed rounded-lg p-4 transition-all duration-300 ${
                                    isLoading ? "border-zinc-600 cursor-not-allowed" : "border-zinc-700 hover:border-blue-500 cursor-pointer"
                                }`}>
                                    <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0"
                                        name="pdfFile"
                                        accept=".pdf"
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                    <div className="text-center">
                                        <svg className="mx-auto h-12 w-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                        </svg>
                                        <p className="mt-2 text-sm text-zinc-400">
                                            {formData.pdfFile ? formData.pdfFile.name : "Upload PDF file"}
                                        </p>
                                        <p className="text-xs text-zinc-500 mt-1">Max size: 50MB</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Vector DB Option */}
                        <div className="pt-2">
                            <label className="block text-zinc-300 mb-3 font-medium text-lg">Enable Semantic Search?</label>
                            <div className="flex space-x-6">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="vectorDB"
                                        value="Yes"
                                        checked={formData.vectorDB === "Yes"}
                                        onChange={handleChange}
                                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-zinc-600 bg-zinc-900"
                                        disabled={isLoading}
                                    />
                                    <span className="text-zinc-300">Yes</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="vectorDB"
                                        value="No"
                                        checked={formData.vectorDB === "No"}
                                        onChange={handleChange}
                                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-zinc-600 bg-zinc-900"
                                        disabled={isLoading}
                                    />
                                    <span className="text-zinc-300">No</span>
                                </label>
                            </div>
                            <p className="mt-2 text-sm text-zinc-500">Create vector store for enhanced search capabilities</p>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 ${
                                    isLoading 
                                        ? "opacity-70 cursor-not-allowed" 
                                        : "hover:from-blue-700 hover:to-blue-800 hover:scale-[1.02]"
                                }`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Publishing...
                                    </span>
                                ) : "Publish Book"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Publish;