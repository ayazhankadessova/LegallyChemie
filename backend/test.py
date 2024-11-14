
import os
import subprocess
import sys
import venv

VENV_DIR = ".venv"  

def create_virtual_environment():
    """
    creates a virtual environment in the specified directory if it does not exist.
    """
    if not os.path.isdir(VENV_DIR):
        print("Creating virtual environment...")
        venv.create(VENV_DIR, with_pip=True)
    else:
        print("Virtual environment already exists.")

def get_python_executable():
    """
    returns the path to the Python executable within the virtual environment.
    """
    if os.name == "posix":
        return os.path.join(VENV_DIR, "bin", "python")
    else:
        return os.path.join(VENV_DIR, "Scripts", "python")

def install_dependencies():
    """
    installs dependencies listed in the testRequirements.txt file.
    """
    python_executable = get_python_executable()
    print("Installing dependencies from testRequirements.txt...")
    subprocess.check_call([python_executable, "-m", "pip", "install", "-r", "testRequirements.txt"])

def load_test_env():
    """
    loads environment variables from .env.test file.
    """
    python_executable = get_python_executable()
    print("Loading test environment variables from .env.test...")
    subprocess.check_call([
        python_executable, "-c", "from dotenv import load_dotenv; load_dotenv('.env.test')"
    ])

def run_tests():
    """
    runs all tests in the 'tests' directory using pytest.
    """
    python_executable = get_python_executable()
    print("Running tests with pytest...")
    result = subprocess.run([python_executable, "-m", "pytest", "-v"], check=False)
    if result.returncode == 0:
        print("All tests passed successfully!")
    else:
        print("Some tests failed.")
    return result.returncode

if __name__ == "__main__":
    create_virtual_environment()
    install_dependencies()
    load_test_env()
    exit_code = run_tests()
    sys.exit(exit_code)
