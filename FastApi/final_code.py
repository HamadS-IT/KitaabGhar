import re
import fitz  # PyMuPDF for PDF reading
import spacy
import pdfkit
from collections import defaultdict
from rake_nltk import Rake
from bs4 import BeautifulSoup
from CONSTANTS import stopwords, punctuations
from PyPDF2 import PdfMerger
import nltk

nltk.download('punkt_tab')
#nltk.data.path.append("/home/kitabghar/nltk_data")


# Load SpaCy model
nlp = spacy.load("en_core_web_lg")

# =r"C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe"

def lemmatize_phrase(phrase):
    doc = nlp(phrase)
    return " ".join([token.lemma_ for token in doc if token.is_alpha])

def extract_keywords(text):
    rake = Rake(stopwords=stopwords, punctuations=punctuations)
    rake.extract_keywords_from_text(text.translate(str.maketrans('', '', ''.join(punctuations).replace(',', '').replace('.', ''))))
    keywords = rake.get_ranked_phrases_with_scores()
    return sorted([phrase for _, phrase in keywords])

def read_pdf(filepath):
    doc = fitz.open(filepath)
    text_by_page = {}
    for page_number, page in enumerate(doc, start=1):
        text = page.get_text("text")
        clean_text = re.sub(r"[^a-zA-Z\s.,'\"\-!?()]", "", text)
        text_by_page[page_number] = clean_text
    return text_by_page

def convert_to_html(index, html_template_path, html_output_path):
    with open(html_template_path, "r", encoding="utf-8") as file:
        soup = BeautifulSoup(file, "html.parser")

    table = soup.find("table")

    # Clear existing table content
    for tr in table.find_all("tr"):
        tr.decompose()

    # Group phrases by their lemmatized form
    lemma_groups = defaultdict(list)
    for letter in sorted(index.keys()):
        for phrase, pages in sorted(index[letter]):
            lemma = lemmatize_phrase(phrase)
            lemma_groups[lemma].append((phrase, pages))

    # Create HTML entries for each lemma group
    for root_lemma, variations in sorted(lemma_groups.items()):
        # Use the shortest form as the root word
        variations.sort(key=lambda x: len(x[0]))
        root_word = variations[0][0]

        # Create entry for the root word
        new_entry = BeautifulSoup(f"""
            <tr><td class='indexTerm' colspan='2'><b>{root_word}</b></td></tr>
        """, "html.parser")
        table.append(new_entry)

        # Add all variations and their page numbers
        for phrase, pages in variations:
            variation_entry = BeautifulSoup(f"""
                <tr><td class='appearedAs'>{phrase}: {', '.join(map(str, pages))}</td><td class='pageNumbers'></td></tr>
            """, "html.parser")
            table.append(variation_entry)

    # Save the HTML file
    with open(html_output_path, "w", encoding="utf-8") as file:
        file.write(str(soup))

def convert_html_to_pdf(html_input, pdf_output):
    pdfkit.from_file(html_input, pdf_output)
    print(f"PDF generated successfully: {pdf_output}")

def merge_pdfs(index_pdf, content_pdf, final_pdf):
    merger = PdfMerger()
    merger.append(content_pdf)
    merger.append(index_pdf)
    merger.write(final_pdf)
    merger.close()
    print(f"✅ Final PDF with index page saved as: {final_pdf}")

def main(source_pdf_path, html_template, final_pdf_output):
    # Extract text from the PDF
    text_by_page = read_pdf(source_pdf_path)
    page_mapping = defaultdict(list)
    all_phrases = []
    
    # Process each page and extract keywords
    for page_num, text in text_by_page.items():
        if text:
            phrases = extract_keywords(text)
            for phrase in phrases:
                all_phrases.append((phrase.lower(), page_num))
    
    # Remove duplicate phrases while keeping the longest version
    unique_phrases = []
    all_phrases.sort(key=lambda x: len(x[0]), reverse=True)
    
    for phrase, page_num in all_phrases:
        if not any(phrase in existing[0] for existing in unique_phrases):
            unique_phrases.append((phrase, page_num))
    
    # Build page mapping
    for phrase, page_num in unique_phrases:
        page_mapping[phrase].append(page_num)
    
    # Generate index
    index = defaultdict(list)
    for phrase, pages in page_mapping.items():
        first_letter = phrase[0].upper()
        if first_letter.isalpha():
            index[first_letter].append((phrase, sorted(set(pages))))
    
    # Load HTML template and prepare for PDF generation
    with open(html_template, "r", encoding="utf-8") as file:
        soup = BeautifulSoup(file, "html.parser")

    table = soup.find("table")

    # Clear existing table content
    for tr in table.find_all("tr"):
        tr.decompose()

    # Group phrases by their lemmatized form
    lemma_groups = defaultdict(list)
    for letter in sorted(index.keys()):
        for phrase, pages in sorted(index[letter]):
            lemma = lemmatize_phrase(phrase)
            lemma_groups[lemma].append((phrase, pages))

    # Create HTML entries for each lemma group
    for root_lemma, variations in sorted(lemma_groups.items()):
        # Use the shortest form as the root word
        variations.sort(key=lambda x: len(x[0]))
        root_word = variations[0][0]

        # Create entry for the root word
        new_entry = BeautifulSoup(f"""
            <tr><td class='indexTerm' colspan='2'><b>{root_word}</b></td></tr>
        """, "html.parser")
        table.append(new_entry)

        # Add all variations and their page numbers
        for phrase, pages in variations:
            variation_entry = BeautifulSoup(f"""
                <tr><td class='appearedAs'>{phrase}: {', '.join(map(str, pages))}</td><td class='pageNumbers'></td></tr>
            """, "html.parser")
            table.append(variation_entry)

    # Generate temporary index PDF
    temp_index = "temp_index.pdf"
    pdfkit.from_string(str(soup), temp_index)
    
    # Merge the index PDF with the original content PDF and clean up
    merge_pdfs(temp_index, source_pdf_path, final_pdf_output)
    import os
    os.remove(temp_index)  # Clean up temporary file
    print(f"✅ Final PDF with index page saved as: {final_pdf_output}")

if __name__ == "__main__":
    source_pdf_path = r"/media/muhammad_ibrahim/D0FC2F0CFC2EED02/8thSem/Fyp 2/FYP-eBook-main/Apis/allfiles (1)/final_code/1. The Metamorphosis, Franz Kafka.pdf"
    html_template = r"/media/muhammad_ibrahim/D0FC2F0CFC2EED02/8thSem/Fyp 2/FYP-eBook-main/Apis/allfiles (1)/final_code/TafseerIbn-e-KathirIndexTEST.html"
    
    final_pdf_output = "./final_output.pdf"

    main(source_pdf_path, html_template, final_pdf_output)
