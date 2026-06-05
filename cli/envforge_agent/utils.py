from envforge_agent.schemas import DiagnosticReport

def _map_os_to_target(report: DiagnosticReport) -> str:
    """Map detected operating system to EnvForge target identifier."""
    if report.os.wsl_version:
        return "WSL"
    if "windows" in report.os.name.lower():
        return "WIN"
    return "LINUX"


def _extract_python_version(report: DiagnosticReport) -> str:
    """Extract major.minor Python version from DiagnosticReport."""
    if report.active_python:
        version = report.active_python.version
        parts = version.split(".")
        if len(parts) >= 2 and parts[0] and parts[1]:
            return f"{parts[0]}.{parts[1]}"
    return "3.11"  # safe default


def check_for_updates() -> None:
    """Check PyPI for a newer version of envforge-agent.

    Fails completely silently on any network, request, or parsing errors
    to prevent crashing the CLI command execution.
    """
    import sys
    import httpx
    import click
    from envforge_agent import __version__

    # Suppress update checks if quiet output is requested
    if "--quiet" in sys.argv or "-q" in sys.argv:
        return

    url = "https://pypi.org/pypi/envforge-agent/json"
    try:
        with httpx.Client(timeout=1.5) as client:
            response = client.get(url)
            response.raise_for_status()
            data = response.json()

            latest_version = data.get("info", {}).get("version")
            if not latest_version:
                return

            def parse_ver(v: str) -> tuple[int, ...]:
                parts = []
                for p in v.split("."):
                    digits = "".join(c for c in p if c.isdigit())
                    parts.append(int(digits) if digits else 0)
                return tuple(parts)

            if parse_ver(latest_version) > parse_ver(__version__):
                click.echo(
                    f"\n[!] A new version of envforge-agent is available: {latest_version} (Current: {__version__})\n"
                    f"    Run 'pip install --upgrade envforge-agent' to update.\n",
                    err=True,
                )
    except Exception:
        # Gracefully absorb all exceptions (JSONDecodeError, ConnectError, HTTPStatusError, etc.)
        pass


