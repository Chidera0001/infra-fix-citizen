# Diagrams

This folder contains all architecture and UML diagrams for the Infrastructure Fix Citizen project.

## Files

### Scripts

- **`diagram.py`** - Generates the system architecture diagram showing the overall system structure, components, and data flow
- **`usecase_diagram.py`** - Generates the UML use case diagram showing all actors and their interactions with the system

### Generated Images

- **`infrastructure_fix_citizen_-_system_architecture.png`** - System architecture diagram
- **`infrastructure_fix_citizen_-_use_case_diagram.png`** - UML use case diagram

### Assets

- **`leaflet.png`** - Custom icon for Leaflet maps (used in architecture diagram)

## How to Generate Diagrams

### Prerequisites

1. Install Python 3.7 or higher
2. Install Graphviz:
   - Windows: `choco install graphviz` (requires admin) or download from [graphviz.org](https://graphviz.org/download/)
   - macOS: `brew install graphviz`
   - Linux: `sudo apt-get install graphviz`
3. Install the diagrams library:
   ```bash
   pip install diagrams
   ```

### Generate System Architecture Diagram

```bash
cd diagrams
python diagram.py
```

### Generate Use Case Diagram

```bash
cd diagrams
python usecase_diagram.py
```

The generated PNG files will be created in the same directory.

## Diagram Types

### System Architecture Diagram

Shows:

- User layers (Citizens, Admins, Moderators)
- Frontend application (React + Vite PWA)
- Offline storage (IndexedDB/Dexie)
- External services (Geoapify, Leaflet)
- Supabase backend (Auth, Database, Storage, Functions)
- Data flow and connections

### Use Case Diagram

Shows:

- Actors (Citizen, Administrator, Moderator, Guest)
- All use cases grouped by feature area
- Associations between actors and use cases
- Include and extend relationships
- System boundaries

## Updating Diagrams

When you make changes to the system architecture or add new features:

1. Update the corresponding Python script
2. Run the script to regenerate the diagram
3. Commit both the updated script and the new PNG file

## Notes

- The diagrams use the `diagrams` Python library which generates Graphviz DOT files
- Custom icons are downloaded automatically if not present
- Diagrams are generated in PNG format by default
- Use `show=True` in the Diagram constructor to automatically open the diagram after generation
