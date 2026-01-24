"use client";

import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import {
  FilesetResolver,
  HandLandmarker,
  DrawingUtils,
  HandLandmarkerResult
} from "@mediapipe/tasks-vision";
import { Loader2 } from "lucide-react";

export default function SignLanguageDetector() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [status, setStatus] = useState("Waiting for hands...");
  const [detectedGesture, setDetectedGesture] = useState<string | null>(null);

  // --- 1. Load MediaPipe Model ---
  useEffect(() => {
    let handLandmarker: HandLandmarker;
    let animationFrameId: number;

    const loadModel = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );

      handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
          // 👇 CRITICAL FIX: "CPU" is more stable for browser WebGL contexts
          delegate: "CPU", 
        },
        runningMode: "VIDEO",
        numHands: 2,
      });

      setIsModelLoaded(true);
      detectHands();
    };

    loadModel();

    // --- 2. Detection Loop ---
    const detectHands = () => {
      if (
        webcamRef.current &&
        webcamRef.current.video &&
        webcamRef.current.video.readyState === 4
      ) {
        const video = webcamRef.current.video;
        const nowInMs = Date.now();

        // Detect
        const results = handLandmarker.detectForVideo(video, nowInMs);

        // Draw & Analyze
        drawCanvas(results);
        recognizeGesture(results);
      }

      animationFrameId = requestAnimationFrame(detectHands);
    };

    return () => {
      if (handLandmarker) handLandmarker.close();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // --- 3. Draw Skeleton on Canvas ---
  const drawCanvas = (results: HandLandmarkerResult) => {
    const canvas = canvasRef.current;
    const video = webcamRef.current?.video;

    if (canvas && video && results.landmarks) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Match canvas size to video size
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const drawingUtils = new DrawingUtils(ctx);

      for (const landmarks of results.landmarks) {
        drawingUtils.drawConnectors(landmarks, HandLandmarker.HAND_CONNECTIONS, {
          color: "#0ea5e9", // Sky blue connections
          lineWidth: 5,
        });
        drawingUtils.drawLandmarks(landmarks, {
          color: "#ffffff", // White dots
          lineWidth: 2,
          radius: 3
        });
      }
    }
  };

  // --- 4. Enhanced Gesture Logic (Rule Based) ---
  const recognizeGesture = (results: HandLandmarkerResult) => {
    if (results.landmarks.length > 0) {
      const lm = results.landmarks[0]; // Get landmarks for the first hand

      // Helper: Is a finger extended? (Tip is higher than PIP joint)
      // Note: Y-axis increases downwards, so "lower value" means "higher on screen"
      const isFingerUp = (tipIdx: number, pipIdx: number) => {
        return lm[tipIdx].y < lm[pipIdx].y;
      };

      // 1. Check State of Each Finger
      const thumbUp = isFingerUp(4, 3);   // Thumb Tip vs IP
      const indexUp = isFingerUp(8, 6);   // Index Tip vs PIP
      const middleUp = isFingerUp(12, 10); // Middle Tip vs PIP
      const ringUp = isFingerUp(16, 14);   // Ring Tip vs PIP
      const pinkyUp = isFingerUp(20, 18);  // Pinky Tip vs PIP

      // 2. Count Extended Fingers (excluding thumb for some checks)
      const extendedFingers = [indexUp, middleUp, ringUp, pinkyUp].filter(Boolean).length;

      // 3. Match Patterns
      let gesture = "Unknown Gesture";
      let feedback = "Keep trying...";

      // --- PATTERN MATCHING ---

      // ROCK / FIST ✊ (All fingers down)
      // We check if 0 or 1 finger is up (sometimes pinky is tricky)
      if (extendedFingers === 0) {
        gesture = "Closed Fist ✊";
        feedback = "Solid as a rock!";
      }
      
      // THUMBS UP 👍 (Thumb up, others down)
      else if (thumbUp && extendedFingers === 0) {
        gesture = "Thumbs Up! 👍";
        feedback = "Great job!";
      }

      // VICTORY / PEACE ✌️ (Index & Middle up, others down)
      else if (indexUp && middleUp && !ringUp && !pinkyUp) {
        gesture = "Victory ✌️";
        feedback = "Peace and love.";
      }

      // POINTING ☝️ (Index up, others down)
      else if (indexUp && !middleUp && !ringUp && !pinkyUp) {
        gesture = "Pointing ☝️";
        feedback = "Look up there!";
      }

      // I LOVE YOU 🤟 (Thumb, Index, Pinky up. Middle & Ring down)
      // This is a specific ASL sign.
      else if (thumbUp && indexUp && pinkyUp && !middleUp && !ringUp) {
        gesture = "I Love You 🤟";
        feedback = "ASL: 'I Love You'";
      }

      // OPEN HAND ✋ (All fingers up)
      else if (extendedFingers >= 4) { // 4 or 5 fingers extended
        gesture = "Open Hand ✋";
        feedback = "High five!";
      }

      // Update State
      setDetectedGesture(gesture);
      setStatus(feedback);

    } else {
      setDetectedGesture(null);
      setStatus("Show your hand to the camera");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      
      {/* STATUS CARD */}
      <div className={`p-6 rounded-2xl border-2 w-full max-w-lg text-center transition-all ${
        detectedGesture && detectedGesture !== "Unknown Gesture"
          ? "bg-green-50 border-green-200" 
          : "bg-white border-slate-200"
      }`}>
        <h2 className="text-2xl font-black text-slate-700 mb-2">
           {detectedGesture || "Searching..."}
        </h2>
        <p className="text-slate-500 font-bold uppercase text-sm tracking-wide">
           {status}
        </p>
      </div>

      {/* CAMERA VIEWPORT */}
      <div className="relative rounded-[32px] overflow-hidden border-8 border-white shadow-2xl bg-black w-full max-w-lg aspect-video">
        {!isModelLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 bg-slate-900">
            <Loader2 className="animate-spin mb-4" size={48} />
            <p className="font-bold">Loading AI Model...</p>
          </div>
        )}

        <Webcam
          ref={webcamRef}
          className="absolute inset-0 w-full h-full object-cover mirror-mode"
          mirrored={true}
        />
        
        {/* OVERLAY CANVAS (Draws Skeleton) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none mirror-mode"
          style={{ transform: "scaleX(-1)" }} // Mirror canvas to match webcam
        />
      </div>

      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-4">
        Powered by Castpotro
      </p>
    </div>
  );
}