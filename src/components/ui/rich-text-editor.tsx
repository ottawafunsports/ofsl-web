import { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Enter text...", 
  className = "",
  rows = 4 
}: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill>(null);

  // Calculate height based on rows (approximate)
  const height = rows * 24 + 60; // 24px per row + toolbar height

  // Handle change with comparison to prevent infinite loops
  const handleChange = (content: string) => {
    // Only trigger onChange if content has actually changed
    if (content !== value) {
      onChange(content);
    }
  };
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link',
    'color', 'background',
    'align'
  ];

  return (
    <div className={`rich-text-editor ${className}`}>
      <style jsx global>{`
        .rich-text-editor .ql-editor {
          min-height: ${height - 42}px;
          font-family: inherit;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .rich-text-editor .ql-toolbar {
          border-top: 1px solid #d1d5db;
          border-left: 1px solid #d1d5db;
          border-right: 1px solid #d1d5db;
          border-bottom: none;
          border-radius: 8px 8px 0 0;
          background: #f9fafb;
        }
        
        .rich-text-editor .ql-container {
          border-bottom: 1px solid #d1d5db;
          border-left: 1px solid #d1d5db;
          border-right: 1px solid #d1d5db;
          border-top: none;
          border-radius: 0 0 8px 8px;
          font-family: inherit;
        }
        
        .rich-text-editor .ql-editor:focus {
          outline: none;
        }
        
        .rich-text-editor .ql-container.ql-snow {
          border: 1px solid #d1d5db;
          border-top: none;
        }
        
        .rich-text-editor .ql-toolbar.ql-snow {
          border: 1px solid #d1d5db;
          border-bottom: none;
        }
        
        .rich-text-editor:focus-within .ql-toolbar {
          border-color: #B20000;
        }
        
        .rich-text-editor:focus-within .ql-container {
          border-color: #B20000;
        }
        
        .rich-text-editor .ql-toolbar .ql-stroke {
          stroke: #6b7280;
        }
        
        .rich-text-editor .ql-toolbar .ql-fill {
          fill: #6b7280;
        }
        
        .rich-text-editor .ql-toolbar button:hover .ql-stroke {
          stroke: #B20000;
        }
        
        .rich-text-editor .ql-toolbar button:hover .ql-fill {
          fill: #B20000;
        }
        
        .rich-text-editor .ql-toolbar button.ql-active .ql-stroke {
          stroke: #B20000;
        }
        
        .rich-text-editor .ql-toolbar button.ql-active .ql-fill {
          fill: #B20000;
        }
        
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
      `}</style>
      
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
}