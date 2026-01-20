"""
Visual pyramid diagram generator using Plotly.

Creates interactive pyramid visualizations showing the 9-tier strategic structure.
"""

import plotly.graph_objects as go
import plotly.express as px
from typing import Dict, List, Optional

from ..models.pyramid import StrategyPyramid


class PyramidDiagram:
    """Generate interactive visual pyramid diagrams."""

    def __init__(self, pyramid: StrategyPyramid):
        """
        Initialize diagram generator.

        Args:
            pyramid: StrategyPyramid to visualize
        """
        self.pyramid = pyramid

        # Color scheme
        self.colors = {
            "purpose": "#E8F4F8",  # Light blue
            "strategy": "#B3E5FC",  # Medium blue
            "execution": "#4FC3F7",  # Bright blue
            "text": "#1565C0",  # Dark blue
            "border": "#0D47A1"  # Very dark blue
        }

    def create_pyramid_diagram(self, show_counts: bool = True) -> go.Figure:
        """
        Create an interactive pyramid diagram showing the 9 tiers.

        Args:
            show_counts: Show item counts in each tier

        Returns:
            Plotly figure object
        """
        # Calculate counts for each tier
        counts = {
            "vision": len(self.pyramid.vision.statements) if self.pyramid.vision else 0,
            "values": len(self.pyramid.values),
            "behaviours": len(self.pyramid.behaviours),
            "strategic_intents": len(self.pyramid.strategic_intents),
            "strategic_drivers": len(self.pyramid.strategic_drivers),
            "enablers": len(self.pyramid.enablers),
            "iconic_commitments": len(self.pyramid.iconic_commitments),
            "team_objectives": len(self.pyramid.team_objectives),
            "individual_objectives": len(self.pyramid.individual_objectives),
        }

        # Define pyramid tiers (from bottom to top for visual pyramid)
        # Y positions (higher = top of pyramid)
        tiers = [
            # Section 3: Execution (bottom)
            {"name": "Individual\nObjectives", "y": 1, "width": 10, "key": "individual_objectives", "section": "execution"},
            {"name": "Team\nObjectives", "y": 2, "width": 9, "key": "team_objectives", "section": "execution"},
            {"name": "Iconic\nCommitments", "y": 3, "width": 8, "key": "iconic_commitments", "section": "execution"},

            # Section 2: Strategy (middle)
            {"name": "Enablers", "y": 4, "width": 7, "key": "enablers", "section": "strategy"},
            {"name": "Strategic\nDrivers", "y": 5, "width": 6, "key": "strategic_drivers", "section": "strategy"},
            {"name": "Strategic\nIntent", "y": 6, "width": 5, "key": "strategic_intents", "section": "strategy"},
            {"name": "Behaviours", "y": 7, "width": 4, "key": "behaviours", "section": "strategy"},

            # Section 1: Purpose (top)
            {"name": "Values", "y": 8, "width": 3, "key": "values", "section": "purpose"},
            {"name": "Vision", "y": 9, "width": 2, "key": "vision", "section": "purpose"},
        ]

        fig = go.Figure()

        # Add each tier as a shape
        for tier in tiers:
            x_left = -tier["width"] / 2
            x_right = tier["width"] / 2
            y = tier["y"]

            # Get color based on section
            color = self.colors[tier["section"]]

            # Add the tier box
            fig.add_shape(
                type="rect",
                x0=x_left,
                y0=y - 0.4,
                x1=x_right,
                y1=y + 0.4,
                line=dict(color=self.colors["border"], width=2),
                fillcolor=color,
            )

            # Add tier name and count
            count = counts[tier["key"]]
            label = tier["name"]
            if show_counts and count > 0:
                label += f"\n({count})"

            fig.add_annotation(
                x=0,
                y=y,
                text=label,
                showarrow=False,
                font=dict(size=12, color=self.colors["text"], family="Arial Black"),
                align="center",
            )

        # Add section labels on the side
        fig.add_annotation(
            x=-6,
            y=8.5,
            text="PURPOSE<br>(The Why)",
            showarrow=False,
            font=dict(size=10, color="#666", family="Arial"),
            align="right",
            xanchor="right"
        )

        fig.add_annotation(
            x=-6,
            y=5.5,
            text="STRATEGY<br>(The How)",
            showarrow=False,
            font=dict(size=10, color="#666", family="Arial"),
            align="right",
            xanchor="right"
        )

        fig.add_annotation(
            x=-6,
            y=2,
            text="EXECUTION<br>(The What)",
            showarrow=False,
            font=dict(size=10, color="#666", family="Arial"),
            align="right",
            xanchor="right"
        )

        # Update layout
        fig.update_layout(
            title={
                "text": f"<b>{self.pyramid.metadata.project_name}</b><br><sub>Strategic Pyramid Structure</sub>",
                "x": 0.5,
                "xanchor": "center",
                "font": {"size": 20, "color": self.colors["text"]}
            },
            showlegend=False,
            xaxis=dict(
                showgrid=False,
                zeroline=False,
                showticklabels=False,
                range=[-7, 7]
            ),
            yaxis=dict(
                showgrid=False,
                zeroline=False,
                showticklabels=False,
                range=[0, 10]
            ),
            plot_bgcolor="white",
            height=600,
            margin=dict(l=120, r=50, t=100, b=50)
        )

        return fig

    def create_distribution_sunburst(self) -> go.Figure:
        """
        Create a sunburst chart showing commitment distribution across drivers.

        Returns:
            Plotly figure object
        """
        if not self.pyramid.iconic_commitments or not self.pyramid.strategic_drivers:
            # Return empty figure
            fig = go.Figure()
            fig.add_annotation(
                text="Add Strategic Drivers and Iconic Commitments<br>to see distribution visualization",
                xref="paper",
                yref="paper",
                x=0.5,
                y=0.5,
                showarrow=False,
                font=dict(size=16, color="#999")
            )
            fig.update_layout(height=400)
            return fig

        # Build hierarchy data
        labels = ["Strategic Pyramid"]
        parents = [""]
        values = [len(self.pyramid.iconic_commitments)]
        colors_list = ["#1f77b4"]

        # Add drivers
        driver_colors = px.colors.qualitative.Set2
        for idx, driver in enumerate(self.pyramid.strategic_drivers):
            labels.append(driver.name)
            parents.append("Strategic Pyramid")

            # Count commitments for this driver
            commitment_count = len(self.pyramid.get_commitments_by_driver(driver.id, primary_only=True))
            values.append(commitment_count if commitment_count > 0 else 0.1)  # Minimum value for visibility
            colors_list.append(driver_colors[idx % len(driver_colors)])

        # Create sunburst
        fig = go.Figure(go.Sunburst(
            labels=labels,
            parents=parents,
            values=values,
            marker=dict(colors=colors_list),
            branchvalues="total",
        ))

        fig.update_layout(
            title="Commitment Distribution Across Strategic Drivers",
            height=500,
            margin=dict(t=50, l=0, r=0, b=0)
        )

        return fig

    def create_horizon_timeline(self) -> go.Figure:
        """
        Create a timeline view of iconic commitments by horizon.

        Returns:
            Plotly figure object
        """
        if not self.pyramid.iconic_commitments:
            fig = go.Figure()
            fig.add_annotation(
                text="Add Iconic Commitments<br>to see timeline",
                xref="paper",
                yref="paper",
                x=0.5,
                y=0.5,
                showarrow=False,
                font=dict(size=16, color="#999")
            )
            fig.update_layout(height=400)
            return fig

        # Group by horizon
        horizons = {"H1": [], "H2": [], "H3": []}
        for commitment in self.pyramid.iconic_commitments:
            horizons[commitment.horizon.value].append(commitment)

        # Create data for each horizon
        data = []
        colors = {"H1": "#4CAF50", "H2": "#2196F3", "H3": "#FF9800"}
        y_pos = {"H1": 3, "H2": 2, "H3": 1}

        for horizon, commitments in horizons.items():
            for idx, commitment in enumerate(commitments):
                driver = self.pyramid.get_driver_by_id(commitment.primary_driver_id)
                driver_name = driver.name if driver else "Unknown"

                data.append({
                    "Horizon": f"{horizon} (0-{12 if horizon == 'H1' else 24 if horizon == 'H2' else 36} months)",
                    "Commitment": commitment.name,
                    "Driver": driver_name,
                    "Target": commitment.target_date or "TBD",
                    "y": y_pos[horizon],
                    "x": idx,
                    "color": colors[horizon]
                })

        if not data:
            fig = go.Figure()
            fig.add_annotation(text="No commitments yet", x=0.5, y=0.5, showarrow=False)
            return fig

        # Create figure
        fig = go.Figure()

        for item in data:
            fig.add_trace(go.Scatter(
                x=[item["x"]],
                y=[item["y"]],
                mode="markers+text",
                marker=dict(size=20, color=item["color"]),
                text=item["Commitment"],
                textposition="top center",
                hovertemplate=f"<b>{item['Commitment']}</b><br>" +
                              f"Driver: {item['Driver']}<br>" +
                              f"Target: {item['Target']}<br>" +
                              f"<extra></extra>",
                showlegend=False
            ))

        # Add horizon labels
        fig.add_annotation(x=-0.5, y=3, text="<b>H1</b><br>0-12 months", showarrow=False, xanchor="right")
        fig.add_annotation(x=-0.5, y=2, text="<b>H2</b><br>12-24 months", showarrow=False, xanchor="right")
        fig.add_annotation(x=-0.5, y=1, text="<b>H3</b><br>24-36 months", showarrow=False, xanchor="right")

        fig.update_layout(
            title="Iconic Commitments Timeline",
            xaxis=dict(showticklabels=False, showgrid=False, zeroline=False),
            yaxis=dict(showticklabels=False, showgrid=False, zeroline=False, range=[0, 4]),
            height=500,
            hovermode="closest",
            plot_bgcolor="white"
        )

        return fig

    def create_network_diagram(self) -> go.Figure:
        """
        Create a network diagram showing relationships between elements.

        Returns:
            Plotly figure object
        """
        # This is a more complex visualization showing connections
        # between drivers, intents, and commitments

        if not self.pyramid.strategic_drivers:
            fig = go.Figure()
            fig.add_annotation(
                text="Add Strategic Drivers<br>to see network diagram",
                xref="paper",
                yref="paper",
                x=0.5,
                y=0.5,
                showarrow=False,
                font=dict(size=16, color="#999")
            )
            fig.update_layout(height=400)
            return fig

        # Simplified network for now - just show drivers and commitment counts
        driver_names = []
        commitment_counts = []
        intent_counts = []

        for driver in self.pyramid.strategic_drivers:
            driver_names.append(driver.name)
            commitment_counts.append(len(self.pyramid.get_commitments_by_driver(driver.id, primary_only=True)))

            intents = [i for i in self.pyramid.strategic_intents if i.driver_id == driver.id]
            intent_counts.append(len(intents))

        fig = go.Figure()

        # Add bars for intents
        fig.add_trace(go.Bar(
            name="Strategic Intents",
            x=driver_names,
            y=intent_counts,
            marker_color="#2196F3"
        ))

        # Add bars for commitments
        fig.add_trace(go.Bar(
            name="Iconic Commitments",
            x=driver_names,
            y=commitment_counts,
            marker_color="#4CAF50"
        ))

        fig.update_layout(
            title="Strategic Drivers: Intents & Commitments",
            xaxis_title="Strategic Driver",
            yaxis_title="Count",
            barmode="group",
            height=400
        )

        return fig
