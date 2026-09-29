import os
import sys
from huggingface_hub import HfApi

def main():
    if len(sys.argv) > 1:
        token = sys.argv[1].strip()
    else:
        token = input("Enter your Hugging Face Access Token (hf_...): ").strip()

    if not token:
        print("Error: No token provided.")
        sys.exit(1)

    repo_id = "Silentgoat/techjob-backend"
    print(f"Uploading files to Hugging Face Space: {repo_id}...")

    api = HfApi(token=token)
    current_dir = os.path.dirname(os.path.abspath(__file__))

    api.upload_folder(
        folder_path=current_dir,
        repo_id=repo_id,
        repo_type="space",
        ignore_patterns=[
            ".git",
            ".git/**",
            "__pycache__",
            "__pycache__/**",
            "*.pyc",
            ".pytest_cache/**",
            ".ruff_cache/**",
            ".benchmarks/**",
            "upload_to_hf.py"
        ]
    )

    print("\n=======================================================")
    print("SUCCESS: All files and Parquet tables uploaded to Hugging Face!")
    print(f"Space URL: https://huggingface.co/spaces/{repo_id}")
    print("=======================================================")

if __name__ == "__main__":
    main()
