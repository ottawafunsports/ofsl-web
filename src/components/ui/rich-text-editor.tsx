import React, { useState } from 'react';

interface RichTextEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  rows?: number;
}

export function RichTextEditor({ 
  value = '', 
  onChange, 
  placeholder = "Enter text...", 
  rows = 6 
}: RichTextEditorProps) {
  const [content, setContent] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (onChange) {
      onChange(newContent);
    }
  };

  return (
    <div className="w-full">
      <textarea
        value={content}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B20000] focus:ring-[#B20000] focus:outline-none resize-vertical"
      />
    </div>
  );
}