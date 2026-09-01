
export const NO_PARKING_ZONE_POLYGON = [
  { x: 0.2, y: 0.3 },
  { x: 0.8, y: 0.3 },
  { x: 0.9, y: 0.8 },
  { x: 0.1, y: 0.8 }
];

export const PENALTY_THRESHOLD_SECONDS = 120; // 2 minutes
export const SCAN_INTERVAL_MS = 10000; // Increased to 10 seconds to respect Rate Limits (429)
export const MOCK_LOCATION = "Central Business District - Zone A4";

export const MOCK_OWNERS: Record<string, string> = {
  "MH12AB1234": "John Doe",
  "KA01HH9999": "Sarah Connor",
  "DL3CAK4422": "Robert Miller",
  "UP16BE5566": "Amit Sharma",
  "UNKNOWN": "Registry Search Pending"
};
