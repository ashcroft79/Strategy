"""
Strategic Pyramid Builder - Setup Configuration
"""

from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="strategic-pyramid-builder",
    version="0.1.0",
    author="Rob (HR Transformation Specialist)",
    description="Interactive tool for building clear, coherent strategy pyramids",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/yourusername/strategic-pyramid-builder",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Business",
        "Topic :: Office/Business :: Strategy",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.9",
    install_requires=[
        "pydantic>=2.5.0",
        "python-dateutil>=2.8.2",
        "python-docx>=1.1.0",
        "python-pptx>=0.6.23",
        "reportlab>=4.0.7",
        "markdown>=3.5.1",
        "matplotlib>=3.8.0",
        "plotly>=5.18.0",
        "click>=8.1.7",
        "rich>=13.7.0",
        "questionary>=2.0.1",
    ],
    extras_require={
        "dev": [
            "pytest>=7.4.3",
            "pytest-cov>=4.1.0",
            "black>=23.12.0",
            "flake8>=6.1.0",
            "mypy>=1.7.1",
        ],
    },
    entry_points={
        "console_scripts": [
            "pyramid-builder=pyramid_builder.cli:main",
        ],
    },
)
