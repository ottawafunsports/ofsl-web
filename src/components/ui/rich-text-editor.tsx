import { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = 'Enter content here...', 
  rows = 6 
}: RichTextEditorProps) {
  const [editorValue, setEditorValue] = useState(value || '');
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    setEditorValue(value || '');
  }, [value]);

  const handleChange = (content: string) => {
    setEditorValue(content);
    onChange(content);
  };

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
        ref={quillRef}
        theme="snow"
        value={editorValue}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ 
          height: `${Math.max(150, rows * 24)}px`,
          marginBottom: '2.5rem' // Space for toolbar
        }}
      />
    </div>
  );
}