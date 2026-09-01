
export interface Vehicle {
  id: string;
  plateNumber: string;
  ownerName: string;
  vehicleType: string;
  color: string;
  detectedAt: Date;
  status: 'monitoring' | 'violation' | 'cleared';
  durationSeconds: number;
}

export interface Violation {
  id: string;
  vehicleId: string;
  plateNumber: string;
  ownerName: string;
  timestamp: string;
  fineAmount: number;
  status: 'Pending' | 'Paid';
  evidenceImage: string;
  location: string;
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'officer' | 'user';
  location: string;
  password?: string;
}

export interface DetectionResult {
  vehiclePresent: boolean;
  plateDetected: string | null;
  vehicleType?: string;
  makeModel?: string;
  color?: string;
  confidence: number;
}

export interface ProcessedVideo {
  id: string;
  vehicleNumber: string;
  footageLabel: string;
  dateTime: string;
  duration: string;
  violationStatus: 'Violation Detected' | 'No violation';
  challanStatus: 'Challan Applied' | 'None';
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  type: 'info' | 'violation';
}
