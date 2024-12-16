// frontend/src/components/protection/WatermarkTool.tsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Shield, Image as ImageIcon, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WatermarkOptions {
  text?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  opacity?: number;
}

export const WatermarkTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [options, setOptions] = useState<WatermarkOptions>({
    text: '',
    position: 'bottom-right',
    opacity: 0.5
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFile(file);
    setPreview(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxSize: 10485760, // 10MB
    multiple: false
  });

  const handleProtect = async () => {
    if (!file) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('options', JSON.stringify(options));

    try {
      const response = await fetch('/api/watermark/protect', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Protection failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `protected_${file.name}`;
      a.click();

    } catch (error) {
      console.error('Protection failed:', error);
      // Show error message
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display text-gray-800 dark:text-white">
          Protect Your Artwork
        </h1>
        
        <button
          onClick={handleProtect}
          disabled={!file || isProcessing}
          className={`
            px-6 py-2 rounded-lg flex items-center space-x-2
            ${!file || isProcessing
              ? 'bg-gray-300 dark:bg-dark-300 cursor-not-allowed'
              : 'bg-neon-blue hover:bg-blue-600 text-white'
            }
          `}
        >
          <Shield className="w-5 h-5" />
          <span>{isProcessing ? 'Processing...' : 'Protect'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg transition-colors
            ${isDragActive
              ? 'border-neon-blue bg-blue-50 dark:bg-dark-300'
              : 'border-gray-300 dark:border-dark-300'
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="p-8 text-center">
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-lg"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setPreview('');
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                >
                  ×
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                <p className="text-gray-600 dark:text-gray-300">
                  Drag and drop your image here
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  or click to select
                </p>
              </>
            )}
          </div>
        </div>

        {/* Options Panel */}
        <div className="bg-white dark:bg-dark-200 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
            Watermark Options
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Watermark Text
              </label>
              <input
                type="text"
                value={options.text}
                onChange={(e) => setOptions({ ...options, text: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border dark:border-dark-300 bg-white dark:bg-dark-300 text-gray-800 dark:text-white"
                placeholder="© Your Name"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Position
              </label>
              <select
                value={options.position}
                onChange={(e) => setOptions({ 
                  ...options, 
                  position: e.target.value as WatermarkOptions['position']
                })}
                className="w-full px-3 py-2 rounded-lg border dark:border-dark-300 bg-white dark:bg-dark-300 text-gray-800 dark:text-white"
              >
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="top-right">Top Right</option>
                <option value="top-left">Top Left</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Opacity
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={options.opacity}
                onChange={(e) => setOptions({ 
                  ...options, 
                  opacity: parseFloat(e.target.value)
                })}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
