# OS Project - ReadMe

---

## Prerequisites
Before you begin, ensure the following software and tools are installed on your system:

1. **Operating System:** Windows/Linux/MacOS (choose based on your environment).
2. **Python:** Version 3.7 or higher.
3. **Node.js and npm:** Required for front-end setup.
4. **Required Packages:** Listed in the `req.txt` file.

---

## Step-by-Step Instructions
Follow these steps to set up and run the project:

### 1. Back-End Setup
1. Create a virtual environment:
   ```bash
   virtualenv venv
   ```
2. Activate the virtual environment:
   - **For Linux/MacOS:**
     ```bash
     source venv/bin/activate
     ```
   - **For Windows:**
     ```bash
     venv\Scripts\activate
     ```
3. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

### 2. Front-End Setup
1. Navigate to the `client` directory:
   ```bash
   cd ~/client
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```

### 3. Running the Project
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Access the application in your web browser at:
   ```
   http://localhost:3000
   ```

---