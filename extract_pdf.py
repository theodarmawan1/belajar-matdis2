import fitz
import os
import json

doc = fitz.open('notion-page_merged.pdf')

# Extract text from all pages
all_text = []
for i in range(doc.page_count):
    page = doc[i]
    text = page.get_text()
    all_text.append(f"=== PAGE {i+1} ===\n{text}")

# Write all text to a file
with open('pdf_text_full.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(all_text))

# Extract images
img_dir = 'pdf_images'
os.makedirs(img_dir, exist_ok=True)

img_count = 0
for i in range(doc.page_count):
    page = doc[i]
    images = page.get_images(full=True)
    for j, img in enumerate(images):
        xref = img[0]
        try:
            pix = fitz.Pixmap(doc, xref)
            if pix.n - pix.alpha > 3:  # CMYK
                pix = fitz.Pixmap(fitz.csRGB, pix)
            fname = f"{img_dir}/page{i+1}_img{j+1}.png"
            pix.save(fname)
            img_count += 1
            pix = None
        except Exception as e:
            print(f"Error extracting image from page {i+1}, img {j+1}: {e}")

print(f"Extracted text from {doc.page_count} pages")
print(f"Extracted {img_count} images")
doc.close()
