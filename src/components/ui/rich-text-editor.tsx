import React, { useState, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  rows?: number;
}

export function RichTextEditor({ value, onChange, placeholder, rows = 5 }: RichTextEditorProps) {
  const [ReactQuill, setReactQuill] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Dynamically import ReactQuill to avoid SSR issues
    import('react-quill').then((module) => {
      setReactQuill(() => module.default);
      setIsLoading(false);
    }).catch((error) => {
      console.error('Failed to load ReactQuill:', error);
      setIsLoading(false);
    });
  }, []);

  // Custom toolbar configuration with heading options
  const modules = {
    toolbar: [
      [{ 'header': [2, 3, false] }], // H2, H3, and normal text
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'link'
  ];

  // Fallback to textarea if ReactQuill fails to load
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="animate-pulse bg-gray-200 h-10 rounded-t-lg mb-1"></div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-3 py-2 border border-gray-300 rounded-b-lg focus:border-[#B20000] focus:ring-[#B20000] focus:outline-none resize-none"
        />
      </div>
    );
  }

  if (!ReactQuill) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000] focus:outline-none resize-none"
      />
    );
  }

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          height: `${rows * 1.5}rem`,
          marginBottom: '2.5rem'
        }}
      />
      
      <style jsx global>{`
        .ql-toolbar.ql-snow {
          border: 1px solid #d1d5db;
          border-bottom: none;
          border-radius: 0.5rem 0.5rem 0 0;
        }
        
        .ql-container.ql-snow {
          border: 1px solid #d1d5db;
          border-top: none;
          border-radius: 0 0 0.5rem 0.5rem;
          font-family: inherit;
        }
        
        .ql-editor {
          min-height: ${rows * 1.5}rem;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        
        .ql-toolbar .ql-stroke {
          stroke: #6b7280;
        }
        
        .ql-toolbar .ql-fill {
          fill: #6b7280;
        }
        
        .ql-toolbar .ql-picker-label {
          color: #6b7280;
        }
        
        .ql-toolbar button:hover .ql-stroke,
        .ql-toolbar button.ql-active .ql-stroke {
          stroke: #B20000;
        }
        
        .ql-toolbar button:hover .ql-fill,
        .ql-toolbar button.ql-active .ql-fill {
          fill: #B20000;
        }
        
        .ql-toolbar button:hover .ql-picker-label,
        .ql-toolbar button.ql-active .ql-picker-label {
          color: #B20000;
        }
        
        .ql-picker-options {
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .ql-picker-item:hover {
          background: #fef2f2;
          color: #B20000;
        }
        
        .ql-snow .ql-picker.ql-header .ql-picker-label::before,
        .ql-snow .ql-picker.ql-header .ql-picker-item::before {
          content: 'Normal';
        }
        
        .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
        .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
          content: 'Heading 2';
        }
        
        .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
        .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
          content: 'Heading 3';
        }
        
        .ql-editor h2 {
          font-size: 1.5em;
          font-weight: 600;
          margin: 0.83em 0;
          line-height: 1.2;
        }
        
        .ql-editor h3 {
          font-size: 1.17em;
          font-weight: 600;
          margin: 1em 0;
          line-height: 1.2;
        }
        
        .rich-text-editor .ql-container {
          font-family: inherit;
        }
        
        .rich-text-editor:focus-within .ql-toolbar {
          border-color: #B20000;
        }
        
        .rich-text-editor:focus-within .ql-container {
          border-color: #B20000;
          box-shadow: 0 0 0 1px #B20000;
        }
      `}</style>
    </div>
  );
}