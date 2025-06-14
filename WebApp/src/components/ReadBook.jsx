import React, { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";

const ReadBook = ({ title }) => {
    const [bookData, setBookData] = useState(null);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await fetch(`/api/get-user-book-by-title/${title}`);
        
                // Check if the response is OK
                if (!response.ok) {
                    const errorText = await response.text(); // Get the response as text
                    console.error("Error fetching book:", errorText);
                    return; // Exit the function if there's an error
                }
        
                const result = await response.json();
        
                if (result.data && result.data.pdf) {
                    const pdfBlob = base64ToBlob(result.data.pdf, "application/pdf");
                    const pdfUrl = URL.createObjectURL(pdfBlob);
                    setBookData({ title: result.data.title, url: pdfUrl });
                } else {
                    console.error("Failed to fetch book data");
                }
            } catch (error) {
                console.error("Error fetching book:", error);
            }
        };

        fetchBook();
    }, [title]);

    const base64ToBlob = (base64, contentType) => {
        const byteCharacters = atob(base64);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = Array.from(slice).map((char) => char.charCodeAt(0));
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, { type: contentType });
    };

    return (
        <div>
            {bookData ? (
                <>
                    <h1>{bookData.title}</h1>
                    <Document file={bookData.url}>
                        <Page pageNumber={1} />
                    </Document>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default ReadBook;
