import React, { useEffect, useState } from 'react';
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
  rows = 6 
}: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);
  
  // This prevents hydration errors with ReactQuill
  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Calculate height based on rows
  const editorHeight = `${Math.max(150, rows * 24)}px`;

  if (!mounted) {
    return (
      <div 
        className="border border-gray-300 rounded-lg p-3 bg-white"
        style={{ minHeight: editorHeight }}
      >
        <div className="text-gray-400">{placeholder}</div>
      </div>
    );
  }

  return (
    <div className="rich-text-editor">
      <style jsx global>{`
        .rich-text-editor .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          background: white;
          min-height: ${editorHeight};
          font-family: inherit;
        }
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }
        .rich-text-editor .ql-editor {
          min-height: ${editorHeight};
          font-size: 0.875rem;
          line-height: 1.5;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        .rich-text-editor .ql-editor p {
          margin-bottom: 0.75rem;
        }
        .rich-text-editor .ql-editor ul, 
        .rich-text-editor .ql-editor ol {
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .rich-text-editor .ql-editor li {
          margin-bottom: 0.25rem;
        }
        .rich-text-editor .ql-editor h1, 
        .rich-text-editor .ql-editor h2, 
        .rich-text-editor .ql-editor h3 {
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        .rich-text-editor .ql-editor h1 {
          font-size: 1.5rem;
        }
        .rich-text-editor .ql-editor h2 {
          font-size: 1.25rem;
        }
        .rich-text-editor .ql-editor h3 {
          font-size: 1.125rem;
        }
      `}</style>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
}