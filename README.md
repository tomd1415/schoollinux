Classroom Linux Pilot
## Overview
The Classroom Linux Pilot is a web-based application designed to facilitate the transition of a classroom environment from traditional systems to Debian Linux. Integrated with Microsoft Active Directory (AD) and utilizing open-source tools, this pilot aims to streamline user authentication, file access, and cloud storage management across multiple machines. The project is structured into multiple phases, each providing detailed instructions, checklists, and comment sections to ensure a smooth and organized deployment.

## Features
- **Phase-Based Structure**: Organizes the pilot process into distinct phases, each with specific goals and steps.
- **Interactive Checklists**: Allows users to track progress through checkboxes for each step within a phase.
- **Comment Sections**: Enables users to add detailed notes and feedback for each phase and step.
- **Resource Toggles**: Provides expandable sections with additional information and helpful commands.
- **Persistent Storage**: Saves notes and comments to a PostgreSQL database for easy retrieval and management.

## Technologies Used
### Frontend:
- HTML5
- CSS3
- JavaScript (Vanilla)

### Backend:
- Node.js
- Express.js
- PostgreSQL

### Tools:
- Visual Studio Code
- Ansible (for automation)
- Rclone (for OneDrive integration)

## Installation
### Prerequisites
- Node.js (v14 or later)
- PostgreSQL (v12 or later)
- Git

### Steps
1. **Clone the Repository**
2. **Install Dependencies**
3. **Setup PostgreSQL Database**
    - Create a new PostgreSQL database:
    - Create the notes table with a unique constraint:
4. **Configure Environment Variables**
    - Update the database configuration in `server.js`:
5. **Run the Server**
6. **Access the Application**
    - Open your browser and navigate to `http://localhost:3000` to start using the Classroom Linux Pilot application.

## Usage
- **Navigate Through Phases**: Use the navigation bar to access detailed instructions for each phase.
- **Track Progress**: Mark completed steps using checkboxes.
- **Add Notes**: Write detailed notes in the comment sections provided.
- **View Additional Resources**: Click on "More Info" links to access helpful commands and troubleshooting tips.

## Current Status
The project currently supports the following functionalities:
- Phase-wise navigation with detailed steps.
- Interactive checklists for tracking completion.
- Comment sections for adding notes and feedback.
- Persistent storage of notes using PostgreSQL.
- Debounced saving of notes to prevent duplicate entries.

## Next Steps
### Implement File Upload Functionality
The next phase of development involves adding the ability to upload files associated with each step or phase. This feature will be handled through a dedicated upload box placed next to each respective step or phase. The implementation will include:

#### Frontend Enhancements:
- Add file input elements next to each step or phase.
- Create UI components to display uploaded files.

#### Backend Enhancements:
- Develop API endpoints to handle file uploads.
- Store uploaded files in a designated directory or cloud storage.
- Associate files with specific phases and steps in the PostgreSQL database.

#### Database Schema Updates:
- Modify the notes table or create a new table to store file metadata and associations.

#### Security Measures:
- Implement file validation to ensure only allowed file types are uploaded.
- Protect against common vulnerabilities such as file injection.

## Contributing
We welcome contributions from the community to help improve the Classroom Linux Pilot. To contribute, please follow these steps:

1. Fork the Repository
2. Create a New Branch
3. Make Your Changes
4. Commit Your Changes
5. Push to Your Branch
6. Create a Pull Request

Please ensure your code adheres to our coding standards and includes appropriate tests.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.

## Contact
For any questions or feedback, please contact the project maintainers at support@classroomlinuxpilot.com.

CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    phase_id INTEGER REFERENCES phases(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);