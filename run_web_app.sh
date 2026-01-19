#!/bin/bash
#
# Run the Strategic Pyramid Builder Web UI
#

# Set Python path
export PYTHONPATH="${PYTHONPATH}:$(pwd)/src"

# Run Streamlit
streamlit run streamlit_app.py \
  --server.port 8501 \
  --server.address localhost \
  --browser.gatherUsageStats false \
  --theme.base "light" \
  --theme.primaryColor "#1f77b4"
