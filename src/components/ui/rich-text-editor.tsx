import React, { useRef, useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Enter text...", 
  rows = 5,
  className = ""
}: RichTextEditorProps) {
  const quillRef = useRef<any>(null);
  const ReactQuill = useRef<any>(null);

  useEffect(() => {
    // Dynamically import ReactQuill to avoid SSR issues
    import('react-quill').then((module) => {
      ReactQuill.current = module.default;
      // Force re-render after ReactQuill is loaded
      if (quillRef.current) {
        quillRef.current.forceUpdate?.();
      }
    });
  }, []);

  // Simple toolbar with basic formatting options
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'link'
  ];

  // Fallback to regular textarea if ReactQuill hasn't loaded yet
  if (!ReactQuill.current) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000] focus:outline-none resize-vertical ${className}`}
      />
    );
  }

  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill.current
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        style={{
          minHeight: `${rows * 1.5}rem`,
        }}
      />
      <style jsx global>{`
        .rich-text-editor .ql-toolbar {
          border: 1px solid #d1d5db;
          border-bottom: none;
          border-radius: 0.5rem 0.5rem 0 0;
        }
        .rich-text-editor .ql-container {
          border: 1px solid #d1d5db;
          border-radius: 0 0 0.5rem 0.5rem;
          font-family: inherit;
        }
        .rich-text-editor .ql-editor {
          min-height: ${rows * 1.5}rem;
          font-size: 14px;
          line-height: 1.5;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
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
        .rich-text-editor .ql-container.ql-snow {
          border-color: #d1d5db;
        }
        .rich-text-editor .ql-container:focus-within {
          border-color: #B20000;
          box-shadow: 0 0 0 1px #B20000;
        }
      `}</style>
    </div>
  );
}