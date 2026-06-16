import fitz

doc = fitz.open('notion-page_merged.pdf')
for p_num in range(159, 191):
    page = doc[p_num]
    print(f"--- Page {p_num+1} ---")
    blocks = page.get_text("blocks")
    for b in blocks:
        # block structure: (x0, y0, x1, y1, "text", block_no, block_type)
        print(f"[{b[5]}]: {b[4].strip()}")
    images = page.get_images()
    print(f"Images count: {len(images)}")
doc.close()
