import os
import re
from bs4 import BeautifulSoup

# Directory containing your HTML files
HTML_DIR = './plan/'  # Change this if your HTML files are in a different directory

# Regular expression to extract phase number from filename
FILENAME_REGEX = re.compile(r'phase-(\d+)-detailed\.html$', re.IGNORECASE)

def get_phase_number(filename):
    match = FILENAME_REGEX.match(filename)
    if match:
        return match.group(1)
    return None

def process_html_file(file_path, phase_number):
    with open(file_path, 'r', encoding='utf-8') as file:
        soup = BeautifulSoup(file, 'lxml')

    # Find all .step-box sections
    step_boxes = soup.find_all('section', class_='step-box')

    for step_box in step_boxes:
        # Extract step number from data-step-number attribute
        step_number = step_box.get('data-step-number')
        if not step_number:
            print(f"Warning: 'data-step-number' not found in a .step-box in {file_path}. Skipping this step.")
            continue

        # **Update Hidden File Input**
        file_input = step_box.find('input', {'type': 'file'})
        if file_input:
            new_id = f"file-upload-{phase_number}-{step_number}"
            file_input['id'] = new_id
            file_input['data-phase'] = phase_number
            file_input['data-step'] = step_number
            print(f"Updated file input ID to {new_id}")

        # **Update Styled Label (Browse Button)**
        browse_label = step_box.find('label', {'class': 'browse-button'})
        if browse_label and file_input:
            browse_label['for'] = new_id
            print(f"Updated label 'for' attribute to {new_id}")

        # **Update Upload Button's onclick Handler**
        upload_button = step_box.find('button', text=re.compile(r'Upload', re.IGNORECASE))
        if upload_button:
            upload_button['onclick'] = f"uploadFile({phase_number}, {step_number})"
            print(f"Updated upload button onclick to uploadFile({phase_number}, {step_number})")

        # **Update Display Selected File Name Span**
        file_name_span = step_box.find('span', {'class': 'file-name'})
        if file_name_span:
            new_span_id = f"file-name-{phase_number}-{step_number}"
            file_name_span['id'] = new_span_id
            print(f"Updated file name span ID to {new_span_id}")

        # **Update Uploaded Files Div**
        uploaded_files_div = step_box.find('div', {'class': 'uploaded-files'})
        if uploaded_files_div:
            new_div_id = f"uploaded-files-{phase_number}-{step_number}"
            uploaded_files_div['id'] = new_div_id
            print(f"Updated uploaded files div ID to {new_div_id}")

    # Write the modified HTML back to the file
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(str(soup.prettify()))

    print(f"Processed and updated {file_path} successfully.\n")

def main():
    # Iterate through all files in the directory
    for filename in os.listdir(HTML_DIR):
        if not filename.lower().endswith('-detailed.html'):
            continue  # Skip non-detailed HTML files

        phase_number = get_phase_number(filename)
        if not phase_number:
            print(f"Warning: Could not extract phase number from filename {filename}. Skipping file.\n")
            continue

        file_path = os.path.join(HTML_DIR, filename)
        print(f"Processing file: {file_path} (Phase {phase_number})")

        process_html_file(file_path, phase_number)

    print("All applicable HTML files have been processed.")

if __name__ == "__main__":
    main()