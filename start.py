import os
import subprocess
import sys
import time

# paths
project_dir = os.path.abspath(".")
backend_dir = os.path.join(project_dir, "backend")
frontend_dir = os.path.join(project_dir, "frontend")
venv_dir = os.path.join(backend_dir, "venv")

"""
@file start.py
@brief script to automate environment setup, dependency installation, and parallel server startup with sequential order for backend and frontend
"""

"""
@brief creates a virtual environment for the backend if it doesn’t exist
@param venv_dir the directory path for the virtual environment
"""

#create virtual environment if it doesn’t exist
if not os.path.exists(venv_dir):
    print("creating virtual environment...")
    subprocess.run([sys.executable, "-m", "venv", venv_dir])


"""
@brief installs backend dependencies listed in requirements.txt
@param venv_dir the directory path for the virtual environment
@param backend_dir the directory containing the backend code and requirements.txt
"""

#install backend dependencies
print("installing backend dependencies...")
subprocess.run([os.path.join(venv_dir, "bin", "pip"), "install", "-r", os.path.join(backend_dir, "requirements.txt")])

"""
@brief installs frontend dependencies listed in package.json
@param frontend_dir the directory containing the frontend code and package.json
"""

#install frontend dependencies
print("installing frontend dependencies...")
subprocess.run(["npm", "install"], cwd=frontend_dir)


"""
@brief starts the backend server first, waits for initialization, then starts the frontend server
       prints confirmation messages for each stage to avoid race conditions or conflicts
@param backend_dir the directory containing the backend server code
@param frontend_dir the directory containing the frontend server code
"""

# run backend server first
#then frontend after confirming backend start
print("starting backend server...")
backend_process = subprocess.Popen([os.path.join(venv_dir, "bin", "python"), "server.py"], cwd=backend_dir)

# give backend some time to initialize
time.sleep(5)  

# check if backend is still running
if backend_process.poll() is None:  
    print("starting frontend server...")
    frontend_process = subprocess.Popen(["npm", "run", "dev"], cwd=frontend_dir)

    print("backend and frontend servers running...")

    try:
        # wait for both processes to run until interrupted
        backend_process.wait()
        frontend_process.wait()
    except KeyboardInterrupt:
        print("shutting down backend and frontend servers...")
        backend_process.terminate()
        frontend_process.terminate()
else:
    print("failed to start backend server. frontend will not start.")
