import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  rows?: number;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = 'Enter text here...', 
  rows = 5 
}: RichTextEditorProps) {
  const [editorValue, setEditorValue] = useState(value || '');
  
  // Update internal state when prop value changes
  useEffect(() => {
    setEditorValue(value || '');
  }, [value]);

  // Handle editor content change
  const handleChange = (content: string) => {
    setEditorValue(content);
    onChange(content);
  };

  // Calculate editor height based on rows
  const editorHeight = `${Math.max(150, rows * 24)}px`;

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link'
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={editorValue}
        onChange={handleChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        style={{ height: editorHeight, marginBottom: '40px' }}
      />
    </div>
  );
}