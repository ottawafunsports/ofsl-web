import React, { useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  rows?: number;
}

export function RichTextEditor({ value, onChange, placeholder, rows = 5 }: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill>(null);

  // Calculate editor height based on rows
  const editorHeight = `${Math.max(150, rows * 24)}px`;

  // Define toolbar options
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  // Define formats that should be retained
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'ordered',
    'link'
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height: editorHeight }}
      />
      <style jsx global>{`
        .rich-text-editor .ql-container {
          font-size: 16px;
          font-family: inherit;
          min-height: ${editorHeight};
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }
        
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          background-color: #f9fafb;
        }
        
        .rich-text-editor .ql-editor {
          min-height: ${editorHeight};
        }
        
        .rich-text-editor .ql-editor p {
          margin-bottom: 0.5rem;
        }
        
        /* Fix for bullet points and ordered lists */
        .league-description ul, 
        .league-additional-info ul,
        .ql-editor ul {
          list-style-type: disc !important;
          padding-left: 1.5rem !important;
          margin-bottom: 1rem !important;
        }
        
        .league-description ol, 
        .league-additional-info ol,
        .ql-editor ol {
          list-style-type: decimal !important;
          padding-left: 1.5rem !important;
          margin-bottom: 1rem !important;
        }
        
        .league-description li, 
        .league-additional-info li,
        .ql-editor li {
          margin-bottom: 0.25rem !important;
          display: list-item !important;
        }
        
        /* Fix for headers */
        .league-description h1, 
        .league-additional-info h1 {
          font-size: 1.5rem !important;
          font-weight: bold !important;
          margin-bottom: 0.75rem !important;
        }
        
        .league-description h2, 
        .league-additional-info h2 {
          font-size: 1.25rem !important;
          font-weight: bold !important;
          margin-bottom: 0.5rem !important;
        }
        
        .league-description h3, 
        .league-additional-info h3 {
          font-size: 1.125rem !important;
          font-weight: bold !important;
          margin-bottom: 0.5rem !important;
        }
        
        /* Fix for links */
        .league-description a, 
        .league-additional-info a {
          color: #B20000 !important;
          text-decoration: underline !important;
        }
      `}</style>
    </div>
  );
}