"""
Main CLI interface for Strategic Pyramid Builder.

Provides commands for creating, editing, validating, and exporting strategic pyramids.
"""

import click
from pathlib import Path
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.markdown import Markdown

from ..core.pyramid_manager import PyramidManager
from ..core.builder import PyramidBuilder
from ..models.pyramid import Horizon
from ..validation.validator import PyramidValidator, ValidationLevel
from ..exports.json_exporter import JSONExporter
from ..exports.markdown_exporter import MarkdownExporter

console = Console()


@click.group()
@click.version_option(version="0.1.0")
def main():
    """
    Strategic Pyramid Builder CLI

    Build clear, coherent strategy pyramids that cascade from purpose
    through to individual objectives.
    """
    pass


# ============================================================================
# PROJECT COMMANDS
# ============================================================================

@main.command()
@click.option("--name", prompt="Project name", help="Name of the strategy project")
@click.option("--org", prompt="Organisation", help="Organisation or department")
@click.option("--created-by", prompt="Your name", help="Facilitator name")
@click.option("--output", "-o", default="pyramid.json", help="Output file path")
def new(name: str, org: str, created_by: str, output: str):
    """Create a new strategic pyramid project."""
    try:
        builder = PyramidBuilder()
        pyramid = builder.start_new_project(
            project_name=name,
            organization=org,
            created_by=created_by,
            description=f"Strategic pyramid for {org}"
        )

        builder.save_project(output)

        console.print()
        console.print(Panel.fit(
            f"[green]✓[/green] Created new pyramid: [bold]{name}[/bold]\n"
            f"Organisation: {org}\n"
            f"Saved to: {output}",
            title="Success",
            border_style="green"
        ))
        console.print()
        console.print("Next steps:")
        console.print("  1. Add your vision: [cyan]pyramid-builder vision add[/cyan]")
        console.print("  2. Add values: [cyan]pyramid-builder value add[/cyan]")
        console.print("  3. Define drivers: [cyan]pyramid-builder driver add[/cyan]")
        console.print()

    except Exception as e:
        console.print(f"[red]Error:[/red] {str(e)}")
        raise click.Abort()


@main.command()
@click.argument("filepath", type=click.Path(exists=True))
def info(filepath: str):
    """Show information about a pyramid project."""
    try:
        builder = PyramidBuilder()
        builder.load_existing_project(filepath)

        summary = builder.get_pyramid_summary()

        # Display summary
        console.print()
        console.print(Panel.fit(
            f"[bold]{summary['project_name']}[/bold]\n"
            f"{summary['organization']}",
            title="Strategic Pyramid",
            border_style="blue"
        ))
        console.print()

        # Create counts table
        table = Table(title="Pyramid Contents", show_header=True)
        table.add_column("Tier", style="cyan")
        table.add_column("Element", style="white")
        table.add_column("Count", justify="right", style="yellow")

        counts = summary['counts']
        table.add_row("1", "Vision", "✓" if summary['has_vision'] else "✗")
        table.add_row("2", "Values", str(counts['values']))
        table.add_row("3", "Behaviours", str(counts['behaviours']))
        table.add_row("5", "Strategic Drivers", str(counts['strategic_drivers']))
        table.add_row("4", "Strategic Intents", str(counts['strategic_intents']))
        table.add_row("6", "Enablers", str(counts['enablers']))
        table.add_row("7", "Iconic Commitments", str(counts['iconic_commitments']))
        table.add_row("8", "Team Objectives", str(counts['team_objectives']))
        table.add_row("9", "Individual Objectives", str(counts['individual_objectives']))

        console.print(table)
        console.print()

        # Distribution
        if summary['distribution_by_driver']:
            console.print("[bold]Distribution by Driver:[/bold]")
            for driver, count in summary['distribution_by_driver'].items():
                console.print(f"  • {driver}: {count} commitments")
            console.print()

        # Next steps
        if summary['next_steps']:
            console.print("[bold]Suggested Next Steps:[/bold]")
            for step in summary['next_steps']:
                console.print(f"  {step}")
            console.print()

    except Exception as e:
        console.print(f"[red]Error:[/red] {str(e)}")
        raise click.Abort()


# ============================================================================
# VISION COMMANDS
# ============================================================================

@main.group()
def vision():
    """Manage vision/mission/belief statement."""
    pass


@vision.command()
@click.argument("filepath", type=click.Path(exists=True))
@click.option("--statement", prompt="Vision statement", help="Your vision/mission/belief")
def add(filepath: str, statement: str):
    """Add or update vision statement."""
    try:
        builder = PyramidBuilder()
        builder.load_existing_project(filepath)

        builder.manager.set_vision(statement)
        builder.save_project(filepath)

        console.print()
        console.print(Panel.fit(
            f"[green]✓[/green] Vision updated:\n\n[italic]{statement}[/italic]",
            title="Success",
            border_style="green"
        ))
        console.print()

    except Exception as e:
        console.print(f"[red]Error:[/red] {str(e)}")
        raise click.Abort()


# ============================================================================
# VALUE COMMANDS
# ============================================================================

@main.group()
def value():
    """Manage core values."""
    pass


@value.command()
@click.argument("filepath", type=click.Path(exists=True))
@click.option("--name", prompt="Value name", help="Name of the value (e.g., 'Trust')")
@click.option("--description", prompt="Description (optional)", default="", help="What this value means")
def add(filepath: str, name: str, description: str):
    """Add a core value."""
    try:
        builder = PyramidBuilder()
        builder.load_existing_project(filepath)

        value = builder.manager.add_value(
            name=name,
            description=description if description else None
        )
        builder.save_project(filepath)

        console.print()
        console.print(f"[green]✓[/green] Added value: [bold]{name}[/bold]")
        console.print()

    except Exception as e:
        console.print(f"[red]Error:[/red] {str(e)}")
        raise click.Abort()


@value.command(name="list")
@click.argument("filepath", type=click.Path(exists=True))
def list_values(filepath: str):
    """List all values."""
    try:
        builder = PyramidBuilder()
        builder.load_existing_project(filepath)

        if not builder.pyramid.values:
            console.print("[yellow]No values defined yet.[/yellow]")
            return

        console.print()
        console.print("[bold]Core Values:[/bold]")
        console.print()
        for value in builder.pyramid.values:
            console.print(f"  • [cyan]{value.name}[/cyan]")
            if value.description:
                console.print(f"    {value.description}")
        console.print()

    except Exception as e:
        console.print(f"[red]Error:[/red] {str(e)}")
        raise click.Abort()


# ============================================================================
# DRIVER COMMANDS
# ============================================================================

@main.group()
def driver():
    """Manage strategic drivers (themes/pillars)."""
    pass


@driver.command()
@click.argument("filepath", type=click.Path(exists=True))
@click.option("--name", prompt="Driver name (1-3 words)", help="Driver name")
@click.option("--description", prompt="Description", help="What this driver means")
@click.option("--rationale", default="", help="Why this driver was chosen")
def add(filepath: str, name: str, description: str, rationale: str):
    """Add a strategic driver."""
    try:
        builder = PyramidBuilder()
        builder.load_existing_project(filepath)

        driver = builder.manager.add_strategic_driver(
            name=name,
            description=description,
            rationale=rationale if rationale else None
        )
        builder.save_project(filepath)

        console.print()
        console.print(f"[green]✓[/green] Added strategic driver: [bold]{name}[/bold]")
        console.print()

    except Exception as e:
        console.print(f"[red]Error:[/red] {str(e)}")
        raise click.Abort()


@driver.command(name="list")
@click.argument("filepath", type=click.Path(exists=True))
def list_drivers(filepath: str):
    """List all strategic drivers."""
    try:
        builder = PyramidBuilder()
        builder.load_existing_project(filepath)

        if not builder.pyramid.strategic_drivers:
            console.print("[yellow]No strategic drivers defined yet.[/yellow]")
            return

        console.print()
        console.print("[bold]Strategic Drivers:[/bold]")
        console.print()
        for driver in builder.pyramid.strategic_drivers:
            console.print(f"  [cyan]■[/cyan] [bold]{driver.name}[/bold]")
            console.print(f"    {driver.description}")
            console.print()

    except Exception as e:
        console.print(f"[red]Error:[/red] {str(e)}")
        raise click.Abort()


# ============================================================================
# INTENT COMMANDS
# ============================================================================

@main.group()
def intent():
    """Manage strategic intents."""
    pass


@intent.command()
@click.argument("filepath", type=click.Path(exists=True))
@click.option("--driver", prompt="Driver name", help="Which driver this supports")
@click.option("--statement", prompt="Strategic intent statement", help="What success looks like")
@click.option("--stakeholder-voice", is_flag=True, help="Written from stakeholder perspective")
def add(filepath: str, driver: str, statement: str, stakeholder_voice: bool):
    """Add a strategic intent."""
    try:
        builder = PyramidBuilder()
        builder.load_existing_project(filepath)

        # Find driver by name
        driver_obj = next(
            (d for d in builder.pyramid.strategic_drivers if d.name == driver),
            None
        )
        if not driver_obj:
            console.print(f"[red]Error:[/red] Driver '{driver}' not found")
            console.print("Available drivers:")
            for d in builder.pyramid.strategic_drivers:
                console.print(f"  • {d.name}")
            raise click.Abort()

        intent = builder.manager.add_strategic_intent(
            statement=statement,
            driver_id=driver_obj.id,
            is_stakeholder_voice=stakeholder_voice
        )
        builder.save_project(filepath)

        console.print()
        console.print(f"[green]✓[/green] Added strategic intent to [bold]{driver}[/bold]")
        console.print()

    except Exception as e:
        console.print(f"[red]Error:[/red] {str(e)}")
        raise click.Abort()


# ============================================================================
# COMMITMENT COMMANDS
# ============================================================================

@main.group()
def commitment():
    """Manage iconic commitments."""
    pass


@commitment.command()
@click.argument("filepath", type=click.Path(exists=True))
@click.option("--name", prompt="Commitment name", help="Name of the commitment")
@click.option("--description", prompt="Description", help="What will be delivered")
@click.option("--driver", prompt="Primary driver", help="Primary strategic driver")
@click.option("--horizon", type=click.Choice(["H1", "H2", "H3"]), prompt="Horizon", help="Time horizon")
@click.option("--target-date", default="", help="Target date (e.g., 'Q2 2026')")
@click.option("--owner", default="", help="Who is accountable")
def add(filepath: str, name: str, description: str, driver: str, horizon: str, target_date: str, owner: str):
    """Add an iconic commitment."""
    try:
        builder = PyramidBuilder()
        builder.load_existing_project(filepath)

        commitment = builder.quick_add_commitment(
            name=name,
            description=description,
            primary_driver_name=driver,
            horizon=horizon,
            target_date=target_date if target_date else None,
            owner=owner if owner else None
        )
        builder.save_project(filepath)

        console.print()
        console.print(Panel.fit(
            f"[green]✓[/green] Added iconic commitment:\n"
            f"[bold]{name}[/bold]\n"
            f"Primary: {driver} | {horizon}",
            border_style="green"
        ))
        console.print()

    except Exception as e:
        console.print(f"[red]Error:[/red] {str(e)}")
        raise click.Abort()


@commitment.command(name="list")
@click.argument("filepath", type=click.Path(exists=True))
@click.option("--horizon", type=click.Choice(["H1", "H2", "H3"]), help="Filter by horizon")
def list_commitments(filepath: str, horizon: str):
    """List iconic commitments."""
    try:
        builder = PyramidBuilder()
        builder.load_existing_project(filepath)

        commitments = builder.pyramid.iconic_commitments
        if horizon:
            commitments = [c for c in commitments if c.horizon.value == horizon]

        if not commitments:
            console.print("[yellow]No iconic commitments defined yet.[/yellow]")
            return

        # Group by horizon
        by_horizon = {"H1": [], "H2": [], "H3": []}
        for c in commitments:
            by_horizon[c.horizon.value].append(c)

        console.print()
        for h in ["H1", "H2", "H3"]:
            if by_horizon[h]:
                console.print(f"[bold]{h}:[/bold]")
                for commitment in by_horizon[h]:
                    driver = builder.pyramid.get_driver_by_id(commitment.primary_driver_id)
                    driver_name = driver.name if driver else "Unknown"
                    target = f" ({commitment.target_date})" if commitment.target_date else ""

                    console.print(f"  • {commitment.name}{target}")
                    console.print(f"    Primary: [cyan]{driver_name}[/cyan]")
                console.print()

    except Exception as e:
        console.print(f"[red]Error:[/red] {str(e)}")
        raise click.Abort()


# ============================================================================
# VALIDATION COMMANDS
# ============================================================================

@main.command()
@click.argument("filepath", type=click.Path(exists=True))
@click.option("--show-all", is_flag=True, help="Show all issues including info")
def validate(filepath: str, show_all: bool):
    """Validate pyramid structure and quality."""
    try:
        builder = PyramidBuilder()
        builder.load_existing_project(filepath)

        validator = PyramidValidator(builder.pyramid)
        result = validator.validate_all()

        console.print()
        if result.passed:
            console.print(Panel.fit(
                f"[green]✓ VALIDATION PASSED[/green]\n"
                f"{len(result.issues)} suggestions for improvement",
                border_style="green"
            ))
        else:
            console.print(Panel.fit(
                f"[red]✗ VALIDATION FAILED[/red]\n"
                f"{len(result.get_errors())} errors, "
                f"{len(result.get_warnings())} warnings",
                border_style="red"
            ))

        console.print()

        # Show errors
        errors = result.get_errors()
        if errors:
            console.print("[bold red]ERRORS:[/bold red]")
            for issue in errors:
                console.print(f"  ✗ {issue.message}")
                if issue.suggestion:
                    console.print(f"    [dim]{issue.suggestion}[/dim]")
            console.print()

        # Show warnings
        warnings = result.get_warnings()
        if warnings:
            console.print("[bold yellow]WARNINGS:[/bold yellow]")
            for issue in warnings:
                console.print(f"  ⚠ {issue.message}")
                if issue.suggestion:
                    console.print(f"    [dim]{issue.suggestion}[/dim]")
            console.print()

        # Show info if requested
        if show_all:
            info_issues = result.get_info()
            if info_issues:
                console.print("[bold blue]SUGGESTIONS:[/bold blue]")
                for issue in info_issues:
                    console.print(f"  ℹ {issue.message}")
                    if issue.suggestion:
                        console.print(f"    [dim]{issue.suggestion}[/dim]")
                console.print()

    except Exception as e:
        console.print(f"[red]Error:[/red] {str(e)}")
        raise click.Abort()


# ============================================================================
# EXPORT COMMANDS
# ============================================================================

@main.group()
def export():
    """Export pyramid to various formats."""
    pass


@export.command()
@click.argument("filepath", type=click.Path(exists=True))
@click.option("--output", "-o", help="Output file path")
def json(filepath: str, output: str):
    """Export to JSON format."""
    try:
        builder = PyramidBuilder()
        builder.load_existing_project(filepath)

        if not output:
            output = filepath.replace(".json", "_export.json")

        exporter = JSONExporter(builder.pyramid)
        output_path = exporter.export(output)

        console.print(f"[green]✓[/green] Exported to: {output_path}")

    except Exception as e:
        console.print(f"[red]Error:[/red] {str(e)}")
        raise click.Abort()


@export.command()
@click.argument("filepath", type=click.Path(exists=True))
@click.option("--output", "-o", help="Output file path")
@click.option(
    "--audience",
    type=click.Choice(["executive", "leadership", "detailed", "team"]),
    default="leadership",
    help="Target audience"
)
def markdown(filepath: str, output: str, audience: str):
    """Export to Markdown format."""
    try:
        builder = PyramidBuilder()
        builder.load_existing_project(filepath)

        if not output:
            base = Path(filepath).stem
            output = f"{base}_{audience}.md"

        exporter = MarkdownExporter(builder.pyramid)
        output_path = exporter.export(output, audience=audience)

        console.print(f"[green]✓[/green] Exported {audience} document to: {output_path}")

    except Exception as e:
        console.print(f"[red]Error:[/red] {str(e)}")
        raise click.Abort()


if __name__ == "__main__":
    main()
