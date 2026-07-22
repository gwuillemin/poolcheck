# Pool Check: Project Overview and Architecture

Pool Check is a small CAP-based project for monitoring pool-related readings and pump status. In practical terms, it listens for incoming measurements, stores them in the data model, and makes them available to the service and user interface layers.

This help document is meant to give a new contributor a quick, honest overview of what the repository currently does and how it is organized.

## What the project is able to do

Based on the repository contents, Pool Check currently supports these core functions:

- Receive ORP-related readings from a message source.
- Record ORP values, live ORP values, pump on/off state, and combined run values in the data layer.
- Expose the CAP service that handles these data interactions.
- Provide a Fiori UI module for viewing the pool monitoring experience.
- Publish updates to connected WebSocket clients when new values arrive.

What this document does **not** claim:

- It does not describe a full production deployment architecture.
- It does not add features that are not visible in the repository.
- It does not assume any external integrations beyond the MQTT endpoint and WebSocket usage already present in code.

## How the architecture is organized

The repository follows a standard CAP-style layout with a few practical additions.

### 1. Data model: `db/`

The `db/schema.cds` file defines the main entities used by the application:

- `Orp` — stores ORP measurements with a timestamp.
- `OrpLive` — stores live ORP readings with a timestamp.
- `RunValues` — stores combined run data, including ORP and pump on/off status.
- `ChlorinePump` — stores pump on/off events.

The model also uses automatic timestamp annotations so records get their date values when inserted.

### 2. Service layer: `srv/`

The service layer is where the application logic lives.

- `srv/poolcheck-service.js` subscribes to MQTT topics.
- It reacts to incoming messages by writing data into the CAP entities.
- It keeps an in-memory message snapshot and pushes updates to WebSocket clients.
- `srv/server.js` boots the CAP server and attaches the OData v2 adapter proxy.

At a practical level, this layer acts as the bridge between incoming pool readings and the persisted application data.

### 3. User interface: `app/poolmonitor/`

The `app/poolmonitor` folder contains the Fiori application for the monitoring experience.

The repository shows that this module is intended to present the pool monitoring UI, while the backend service supplies the data.

### 4. Project setup files

The root project files such as `package.json`, `build.sh`, and `run.sh` support the overall application lifecycle. They help with installing, running, and packaging the project in the expected CAP structure.

## Data flow in plain language

A simple way to understand the current architecture is:

1. A pool device or message source sends values to MQTT topics.
2. `srv/poolcheck-service.js` receives those messages.
3. The service stores the readings in the CAP entities defined in `db/schema.cds`.
4. The service updates connected WebSocket clients with the latest snapshot.
5. The Fiori app can read and display the stored data through the service layer.

## Practical notes for onboarding

- The project is centered on pool monitoring, especially ORP and pump status.
- The backend is event-driven: incoming MQTT messages trigger database writes and live updates.
- The current code is small and direct, so the fastest way to understand it is to read `db/schema.cds`, then `srv/poolcheck-service.js`, then the Fiori app module.
- The repository includes a sample getting-started README, but the code itself is the best source for the project’s actual behavior.

## Summary

Pool Check is organized as a straightforward CAP application with three main parts: a data model, a message-driven service layer, and a Fiori UI module. Its current purpose is to capture pool ORP and pump-related readings, persist them, and make them available for monitoring.

