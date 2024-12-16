// frontend/src/components/protection/BatchProcessor.tsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader 
} from 'lucide-react';

interface BatchFile {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'success' | 'error';
  progress: number;
  result?: string;
}

export const BatchProcessor: React.FC = () => {
  const [files, setFiles] = useState<BatchFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'pending' as const,
      progress: 0
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: true
  });

  const processFiles = async () => {
    setIsProcessing(true);

    for (let fileData of files) {
      if (fileData.status !== 'pending') continue;

      // Update status to processing
      setFiles(prev => prev.map(f => 
        f.id === fileData.id ? { ...f, status: 'processing' } : f
      ));

      try {
        const formData = new FormData();
        formData.append('image', fileData.file);

        const response = await fetch('/api/watermark/batch-protect', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) throw new Error('Protection failed');

        // Update status to success
        setFiles(prev => prev.map(f => 
          f.id === fileData.id ? { ...f, status: 'success' } : f
        ));
      } catch (error) {
        // Update status to error
        setFiles(prev => prev.map(f => 
          f.id === fileData.id ? { ...f, status: 'error', result: error.message } : f
        ));
      }
    }

    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                   hover:border-neon-blue transition-colors"
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-300">
          Drag and drop multiple files here
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          or click to select files
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="bg-white dark:bg-dark-200 rounded-xl p-6">
          <div className="space-y-4">
            {files.map((fileData) => (
              <div
                key={fileData.id}
                className="flex items-center justify-between p-4 bg-gray-50 
                          dark:bg-dark-300 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  {/* Status Icon */}
                  <div className="w-10 h-10 flex items-center justify-center">
                    {fileData.status === 'pending' && (
                      <Upload className="w-6 h-6 text-gray-400" />
                    )}
                    {fileData.status === 'processing' && (
                      <Loader className="w-6 h-6 text-blue-500 animate-spin" />
                    )}
                    {fileData.status === 'success' && (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                    {fileData.status === 'error' && (
                      <AlertCircle className="w-6 h-6 text-red-500" />
                    )}
                  </div>

                  {/* File Info */}
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {fileData.file.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(fileData.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                {/* Action/Status */}
                <div className="flex items-center space-x-4">
                  {fileData.status === 'error' && (
                    <span className="text-sm text-red-500">
                      {fileData.result}
                    </span>
                  )}
                  <button
                    onClick={() => setFiles(prev => 
                      prev.filter(f => f.id !== fileData.id)
                    )}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-dark-400 rounded-lg"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setFiles([])}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 
                       hover:text-gray-800 dark:hover:text-white"
            >
              Clear All
            </button>
            <button
              onClick={processFiles}
              disabled={isProcessing || files.length === 0}
              className="px-6 py-2 bg-neon-blue text-white rounded-lg
                       hover:bg-blue-600 disabled:opacity-50 
                       disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Process All'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
