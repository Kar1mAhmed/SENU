// Upload progress indicator component
'use client';
import React from 'react';
import { UploadProgress as UploadProgressType } from '@/lib/hooks/useUpload';

interface UploadProgressProps {
  progress: UploadProgressType;
  fileName?: string;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({ progress, fileName }) => {
  const { percentage, loaded, total, speed, timeRemaining } = progress;

  return (
    <div className="bg-blue-600/20 border border-blue-500/50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
          <span className="text-blue-400 font-medium">
            {fileName ? `Uploading ${fileName}...` : 'Uploading...'}
          </span>
        </div>
        <span className="text-blue-400 font-bold">{percentage}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2 mb-3 overflow-hidden">
        <div
          className="bg-blue-500 h-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Upload Stats */}
      <div className="grid grid-cols-3 gap-4 text-xs text-gray-400">
        <div>
          <div className="font-medium text-gray-300">Size</div>
          <div>{formatBytes(loaded)} / {formatBytes(total)}</div>
        </div>
        <div>
          <div className="font-medium text-gray-300">Speed</div>
          <div>{formatBytes(speed)}/s</div>
        </div>
        <div>
          <div className="font-medium text-gray-300">Time Left</div>
          <div>{formatTime(timeRemaining)}</div>
        </div>
      </div>

      {/* Warning for slow uploads */}
      {speed > 0 && speed < 100000 && ( // Less than 100 KB/s
        <div className="mt-3 text-xs text-yellow-400 flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Slow connection detected. This may take a while.
        </div>
      )}
    </div>
  );
};

// Utility functions
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return 'calculating...';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}
