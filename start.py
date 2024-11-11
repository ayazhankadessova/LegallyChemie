import os
import subprocess
import sys
import time

# paths
project_dir = os.path.abspath(".")
backend_dir = os.path.join(project_dir, "backend")
frontend_dir = os.path.join(project_dir, "frontend")
venv_dir = os.path.join(backend_dir, "venv")

#create virtual environment if it doesn’t exist
if not os.path.exists(venv_dir):
    print("creating virtual environment...")
    subprocess.run([sys.executable, "-m", "venv", venv_dir])

#install backend dependencies
print("installing backend dependencies...")
subprocess.run([os.path.join(venv_dir, "bin", "pip"), "install", "-r", os.path.join(backend_dir, "requirements.txt")])

#install frontend dependencies
print("installing frontend dependencies...")
subprocess.run(["npm", "install"], cwd=frontend_dir)

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
