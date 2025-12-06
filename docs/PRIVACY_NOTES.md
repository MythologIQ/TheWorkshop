# Privacy Notes

The Workshop keeps a few simple metrics around locally so families and developers can understand how it is used without ever sharing data with the network.

- **Telemetry stays on the device.** All counts—including session visits, station visits, guided tutorials completed, and projects created—are stored in `localStorage` under `workshop.telemetry`. Nothing is sent to remote servers or third-party analytics.
- **Opt-out is built in.** The diagnostics panel lets you turn telemetry off, which stops all new counts from being recorded while keeping existing totals readable.
- **You control when it resets.** Use the “Reset metrics” button in diagnostics to wipe every counter and start fresh. The last reset timestamp is also saved so you know how recently the values were cleared.
- **Sensitive content is never captured.** The telemetry model only records simple counts keyed by station name or action. It never stores project details, text, or personal identifiers.

Keeping telemetry local and transparent helps the Workshop stay privacy-respecting while still offering families insight into usage patterns.
