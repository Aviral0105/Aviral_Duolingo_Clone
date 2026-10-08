import zipfile, sys, xml.etree.ElementTree as ET

sys.stdout.reconfigure(encoding='utf-8')
docx_path = r'C:/Users/avira/.gemini/antigravity/brain/caa4d242-f6c2-4a59-b39f-4aa7b68336d8/.user_uploaded/media_1791481646191_366a6cfb.docx'

with zipfile.ZipFile(docx_path) as z:
    xml_content = z.read('word/document.xml')
    tree = ET.fromstring(xml_content)
    namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    texts = []
    for p in tree.iterfind('.//w:p', namespaces):
        p_text = ''.join(node.text for node in p.iterfind('.//w:t', namespaces) if node.text)
        if p_text.strip():
            print(p_text)
