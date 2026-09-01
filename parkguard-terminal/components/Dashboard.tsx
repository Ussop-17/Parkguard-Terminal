
import React, { useState, useRef } from 'react';
import { Camera, Shield, LogOut, AlertCircle, Database, Bell, Upload, Play, CheckCircle2, Download, Info, Settings } from 'lucide-react';
import { User, ProcessedVideo, Notification } from '../types';
import { analyzeFrames } from '../services/geminiService';

interface Props {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<Props> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'monitoring' | 'database' | 'notifications'>('monitoring');
  const [processedVideos, setProcessedVideos] = useState<ProcessedVideo[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('');
  const [showLiveMessage, setShowLiveMessage] = useState(false);
  const [simulationResult, setSimulationResult] = useState<ProcessedVideo | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const hiddenVideoRef = useRef<HTMLVideoElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);

  const addNotification = (message: string, type: 'info' | 'violation') => {
    const newNotification: Notification = {
      id: `NOTIF-${Date.now()}`,
      message,
      timestamp: new Date().toLocaleString(),
      type
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    processVideoFile(file);
  };

  const processVideoFile = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setSimulationResult(null);
    setProcessingStatus('Uploading footage...');

    const videoUrl = URL.createObjectURL(file);
    
    if (hiddenVideoRef.current) {
      const video = hiddenVideoRef.current;
      video.src = videoUrl;
      video.load(); // Force load

      video.onloadedmetadata = () => {
        setProcessingStatus('Calibrating AI sensors...');
        // Start simulating progress 
        let progress = 0;
        const interval = setInterval(() => {
          progress += 1;
          setUploadProgress(prev => {
            const next = prev + (Math.random() * 2);
            return next >= 95 ? 95 : next;
          });
          if (progress >= 30) clearInterval(interval);
        }, 300);

        captureFramesAndAnalyze();
      };

      video.onerror = () => {
        console.error("Video load error");
        setIsUploading(false);
        addNotification("Failed to load video file.", "violation");
      };

      // Safety timeout
      setTimeout(() => {
        if (isUploading && uploadProgress < 100) {
          setIsUploading(false);
          setUploadProgress(0);
          setProcessingStatus('');
        }
      }, 60000); 
    }
  };

  const captureFramesAndAnalyze = async () => {
    const video = hiddenVideoRef.current;
    if (!video) return;

    try {
      const duration = video.duration;
      const timestamps = [
        Math.min(1, duration * 0.1), // Near start
        duration * 0.5,             // Middle
        Math.max(duration - 1, duration * 0.9) // Near end
      ];

      const frames: string[] = [];
      
      for (const ts of timestamps) {
        setProcessingStatus(`Capturing viewpoint at ${Math.round(ts)}s...`);
        video.currentTime = ts;
        await new Promise(resolve => {
          video.onseeked = resolve;
        });
        
        const frame = captureCurrentFrame();
        if (frame) frames.push(frame);
      }

      setProcessingStatus('AI deep-analyzing multiple viewpoints...');
      const durationSec = Math.floor(duration);
      const result = await analyzeFrames(frames);

      if (result.plateDetected === "CONFIG_ERROR") {
        setSimulationResult({
          id: `ERR-${Date.now()}`,
          vehicleNumber: "CHECK API KEY",
          footageLabel: "Setup Required",
          dateTime: new Date().toLocaleString(),
          duration: formatDuration(durationSec),
          violationStatus: 'Error',
          challanStatus: 'None'
        });
        addNotification("Configuration Error: Please ensure you have a valid GEMINI_API_KEY.", "violation");
      } else if (result.plateDetected?.startsWith("ERR:")) {
        setSimulationResult({
          id: `ERR-${Date.now()}`,
          vehicleNumber: result.plateDetected,
          footageLabel: "API Error",
          dateTime: new Date().toLocaleString(),
          duration: formatDuration(durationSec),
          violationStatus: 'Failed',
          challanStatus: 'None'
        });
        addNotification(`AI Error: ${result.plateDetected}`, "violation");
      } else {
        const plate = result.plateDetected?.replace(/\s/g, '').toUpperCase() || "UNKNOWN";
        const isViolation = durationSec > 240;
        const formattedDuration = formatDuration(durationSec);
        
        const videoCount = processedVideos.length + 1;
        const label = result.makeModel ? `${result.makeModel} (${result.color})` : `CCTV Feed ${videoCount}`;

        const newResult: ProcessedVideo = {
          id: `VID-${Date.now()}`,
          vehicleNumber: plate,
          footageLabel: label,
          dateTime: new Date().toLocaleString(),
          duration: formattedDuration,
          violationStatus: isViolation ? 'Violation Detected' : 'No violation',
          challanStatus: isViolation ? 'Challan Applied' : 'None'
        };

        setSimulationResult(newResult);
        setProcessedVideos(prev => [...prev, newResult]);
        
        const detectionMsg = plate !== "UNKNOWN" 
          ? `Vehicle ${plate} (${result.makeModel || 'Unknown Model'}) detected` 
          : `Vehicle detected but plate unreadable in ${label}`;
          
        addNotification(detectionMsg, "info");
        if (isViolation) {
          addNotification(`Violation detected for ${plate} – Challan generated`, "violation");
        }
      }
    } catch (err) {
      console.error("AI Analysis failed:", err);
      addNotification("Video analysis failed. Please check network/API key.", "violation");
    } finally {
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setProcessingStatus('');
      }, 1000);
    }
  };

  const captureCurrentFrame = () => {
    if (!hiddenVideoRef.current || !hiddenCanvasRef.current) return null;
    const canvas = hiddenCanvasRef.current;
    const video = hiddenVideoRef.current;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white text-slate-900">
      {/* Hidden processing elements */}
      <video ref={hiddenVideoRef} className="hidden" muted playsInline crossOrigin="anonymous" />
      <canvas ref={hiddenCanvasRef} className="hidden" />

      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-slate-50 border-r border-slate-100 flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="bg-slate-900 p-2 rounded-xl shadow-lg shadow-slate-200">
            <Shield className="text-white w-6 h-6" />
          </div>
          <h1 className="font-bold text-xl leading-tight text-slate-900">ParkGuard<br/><span className="text-sm font-normal text-slate-400">Terminal</span></h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">Main Menu</div>
          <button 
            onClick={() => setActiveTab('monitoring')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all ${
              activeTab === 'monitoring' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Camera className="w-5 h-5" /> Live Monitoring
          </button>
          <button 
            onClick={() => setActiveTab('database')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all ${
              activeTab === 'database' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Database className="w-5 h-5" /> Database Search
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all ${
              activeTab === 'notifications' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Bell className="w-5 h-5" /> Notifications
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center gap-3 mb-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate text-slate-900">{user.username}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-slate-400 hover:text-red-500 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
          <div className="mt-4 pt-4 border-t border-slate-50 text-center">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">System v2.1.0-FIXED</p>
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 bg-white">
        {activeTab === 'monitoring' && (
          <div className="space-y-8">
            <header>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Live Monitoring</h2>
              <p className="text-slate-500 text-sm">Manage and monitor live CCTV feeds or add new footage for processing.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Option 1: Connect to Live CCTV */}
              <div 
                onClick={() => setShowLiveMessage(true)}
                className="group cursor-pointer bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform">
                  <Play size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Connect to Live CCTV Footage</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Stream real-time video from connected cameras for automated monitoring.</p>
              </div>

              {/* Option 2: Add CCTV Footage */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group cursor-pointer bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform">
                  <Upload size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Add CCTV Footage</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Upload recorded video files to simulate AI-powered violation detection.</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="video/*"
                  onChange={handleVideoUpload}
                />
              </div>
            </div>

            {/* Live Message Placeholder */}
            {showLiveMessage && (
              <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-slate-400">
                  <Camera size={32} />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">No Live Feed Available</h4>
                <p className="text-slate-500 max-w-md mx-auto">Currently, there is no live CCTV footage available. Please connect a camera or upload footage manually.</p>
                <button 
                  onClick={() => setShowLiveMessage(false)}
                  className="mt-6 text-sm font-bold text-slate-900 hover:underline"
                >
                  Close Message
                </button>
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-lg animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-slate-900">Processing Footage</h4>
                    <p className="text-xs text-slate-500">{processingStatus}</p>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{Math.round(uploadProgress)}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-slate-900 transition-all duration-700 ease-out" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Simulation Results */}
            {simulationResult && (
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl animate-in zoom-in-95 duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <div className={`p-3 rounded-2xl ${
                    simulationResult.violationStatus === 'Violation Detected' || simulationResult.violationStatus === 'Error' || simulationResult.violationStatus === 'Failed'
                      ? 'bg-red-50 text-red-500' 
                      : 'bg-green-50 text-green-500'
                  }`}>
                    {simulationResult.violationStatus === 'Violation Detected' || simulationResult.violationStatus === 'Error' || simulationResult.violationStatus === 'Failed' 
                      ? <AlertCircle size={24} /> 
                      : <CheckCircle2 size={24} />}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">{simulationResult.violationStatus}</h4>
                    <p className="text-slate-500 text-sm">AI Analysis Result for {simulationResult.footageLabel}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Detected Plate</p>
                    <p className="text-lg font-black font-mono text-slate-900">{simulationResult.vehicleNumber}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date & Time</p>
                    <p className="text-sm font-bold text-slate-900">{simulationResult.dateTime}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Duration Tracked</p>
                    <p className="text-sm font-bold text-slate-900">{simulationResult.duration}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Enforcement Status</p>
                    <p className={`text-sm font-bold ${simulationResult.challanStatus === 'Challan Applied' ? 'text-red-500' : 'text-green-500'}`}>
                      {simulationResult.challanStatus === 'Challan Applied' ? 'Challan Issued' : 'No Violation'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'database' && (
          <div className="space-y-8">
            <header>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Database Search</h2>
              <p className="text-slate-500 text-sm">View all processed video results and violation history.</p>
            </header>

            <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vehicle Number</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Footage Label</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {processedVideos.length > 0 ? (
                      processedVideos.map((video) => (
                        <tr key={video.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-slate-900">{video.vehicleNumber}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{video.footageLabel}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{video.dateTime}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{video.duration}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              video.violationStatus === 'Violation Detected' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'
                            }`}>
                              {video.violationStatus}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm italic">
                          No processed video records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-8">
            <header>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Notifications</h2>
              <p className="text-slate-500 text-sm">Stay updated with vehicle detections and violation alerts.</p>
            </header>

            <div className="space-y-4">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`flex items-start gap-4 p-6 rounded-[2rem] border transition-all ${
                      notif.type === 'violation' ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100'
                    }`}
                  >
                    <div className={`p-3 rounded-2xl ${notif.type === 'violation' ? 'bg-red-500 text-white' : 'bg-slate-900 text-white'}`}>
                      {notif.type === 'violation' ? <AlertCircle size={20} /> : <Bell size={20} />}
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold ${notif.type === 'violation' ? 'text-red-900' : 'text-slate-900'}`}>{notif.message}</p>
                      <p className="text-xs text-slate-400 mt-1">{notif.timestamp}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center text-slate-400">
                  <Bell className="w-12 h-12 mx-auto mb-4 opacity-10" />
                  <p className="text-sm font-bold">No notifications yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
