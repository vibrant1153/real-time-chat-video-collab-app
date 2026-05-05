// frontend/components/chat/FileUpload.tsx
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
}

export const FileUpload = ({ onUpload }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await onUpload(file);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,video/*,.pdf,.doc,.docx"
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        variant="ghost"
        size="sm"
      >
        {uploading ? 'Uploading...' : '📎 Attach'}
      </Button>
    </div>
  );
};