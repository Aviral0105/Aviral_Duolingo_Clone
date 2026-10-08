import fitz, sys

doc = fitz.open(r'C:\Users\avira\Downloads\Assignment Duolingo Clone.pdf')
with open('scratch/assignment_pdf_text.txt', 'w', encoding='utf-8') as out:
    for i, page in enumerate(doc):
        out.write(f"\n=== PAGE {i+1} ===\n")
        out.write(page.get_text())

print("Assignment text saved, pages:", len(doc))
