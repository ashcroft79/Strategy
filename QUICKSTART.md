# Quick Start Guide

Get up and running with the Strategic Pyramid Builder in 5 minutes.

## Installation

```bash
# Install dependencies
pip install pydantic python-dateutil click rich

# Clone or navigate to the repository
cd Strategy
```

## Option 1: Run the Example

The fastest way to see the tool in action:

```bash
# Run the example script
PYTHONPATH=./src python examples/create_example_pyramid.py

# This creates:
# - examples/example_pyramid.json (full pyramid data)
# - examples/example_pyramid_executive.md (1-page summary)
# - examples/example_pyramid_leadership.md (3-5 page document)
# - examples/example_pyramid_detailed.md (10-15 page strategy pack)
```

## Option 2: Use the CLI

### Create a new pyramid

```bash
./pyramid-builder.sh new
```

This will prompt you for:
- Project name
- Organisation
- Your name

And create a `pyramid.json` file.

### Add content step by step

```bash
# Add vision
./pyramid-builder.sh vision add pyramid.json --statement "Your vision here"

# Add values
./pyramid-builder.sh value add pyramid.json --name "Trust" --description "We build confidence"

# Add strategic drivers
./pyramid-builder.sh driver add pyramid.json \
  --name "Experience" \
  --description "Deliver exceptional employee experiences"

# Add strategic intents
./pyramid-builder.sh intent add pyramid.json \
  --driver "Experience" \
  --statement "Employees say our systems are better than their personal apps" \
  --stakeholder-voice

# Add iconic commitments
./pyramid-builder.sh commitment add pyramid.json \
  --name "Deploy Workday globally" \
  --description "Complete Workday implementation" \
  --driver "Experience" \
  --horizon "H1" \
  --target-date "Q2 2026"
```

### Check your pyramid

```bash
# See summary
./pyramid-builder.sh info pyramid.json

# Validate structure and quality
./pyramid-builder.sh validate pyramid.json --show-all

# List commitments
./pyramid-builder.sh commitment list pyramid.json
```

### Export

```bash
# Export to Markdown (various audiences)
./pyramid-builder.sh export markdown pyramid.json --audience executive -o summary.md
./pyramid-builder.sh export markdown pyramid.json --audience leadership -o strategy.md
./pyramid-builder.sh export markdown pyramid.json --audience detailed -o full_strategy.md

# Export to JSON
./pyramid-builder.sh export json pyramid.json -o export.json
```

## Option 3: Python API

```python
from pyramid_builder.core.builder import PyramidBuilder

# Create pyramid
builder = PyramidBuilder()
pyramid = builder.start_new_project(
    project_name="My Strategy",
    organization="ACME Corp",
    created_by="Your Name"
)

# Add vision
builder.manager.set_vision("Transform the world")

# Add strategic driver
driver = builder.manager.add_strategic_driver(
    name="Excellence",
    description="Be the best at what we do"
)

# Add intent
builder.manager.add_strategic_intent(
    statement="Customers choose us first, every time",
    driver_id=driver.id,
    is_stakeholder_voice=True
)

# Add commitment
builder.quick_add_commitment(
    name="Launch new platform",
    description="Deploy customer portal by Q2",
    primary_driver_name="Excellence",
    horizon="H1",
    target_date="Q2 2026"
)

# Validate
from pyramid_builder.validation.validator import PyramidValidator
validator = PyramidValidator(builder.pyramid)
result = validator.validate_all()
print(result)

# Export
from pyramid_builder.exports.markdown_exporter import MarkdownExporter
exporter = MarkdownExporter(builder.pyramid)
exporter.export("strategy.md", audience="leadership")

# Save
builder.save_project("my_pyramid.json")
```

## Next Steps

1. **Read the full README.md** for detailed documentation
2. **Review the example files** in `examples/` to see what outputs look like
3. **Check the PRD** for the complete design philosophy and roadmap
4. **Start building your own pyramid!**

## Tips

- **Start with drivers**: Define your 3-5 strategic drivers first
- **Write from stakeholder perspective**: Strategic intents should be what THEY experience
- **Be bold**: Avoid vanilla corporate speak like "aim to enhance our partnership"
- **Force primary choices**: Every commitment needs ONE primary driver
- **Validate early and often**: Use `validate` to catch issues

## Common Commands Reference

```bash
# Project management
./pyramid-builder.sh new                    # Create new pyramid
./pyramid-builder.sh info <file>            # Show summary

# Content (replace <file> with your JSON file)
./pyramid-builder.sh vision add <file>
./pyramid-builder.sh value add <file>
./pyramid-builder.sh value list <file>
./pyramid-builder.sh driver add <file>
./pyramid-builder.sh driver list <file>
./pyramid-builder.sh intent add <file>
./pyramid-builder.sh commitment add <file>
./pyramid-builder.sh commitment list <file>

# Validation & Export
./pyramid-builder.sh validate <file> --show-all
./pyramid-builder.sh export markdown <file> --audience [executive|leadership|detailed|team]
./pyramid-builder.sh export json <file>
```

## Troubleshooting

**Problem**: Command not found
**Solution**: Make sure you're in the Strategy directory and the wrapper script is executable:
```bash
chmod +x pyramid-builder.sh
```

**Problem**: Import errors
**Solution**: Make sure dependencies are installed:
```bash
pip install pydantic python-dateutil click rich
```

**Problem**: Can't find file
**Solution**: Use full or relative paths, e.g., `./pyramid.json` or `examples/example_pyramid.json`

## Support

- Check README.md for full documentation
- Review examples/ directory for working code
- See the original PRD for design philosophy

Happy pyramid building! 🏗️
