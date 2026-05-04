import React from 'react';

const ImageField = ({ field, onUpdateField }) => {
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('image', file);
      // const response = await fetch('https://jotform.gr8.com.np/GR8_JOTFORM/Backend/upload_image.php', {
      const response = await fetch('http://localhost/GR8_JOTFORM/Backend/upload_image.php', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to upload image');
      }

      handleSettingChange('image', result.url);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Image upload failed: ' + err.message);
    }
  };

  const handleSettingChange = (key, value) => {
    const updatedField = {
      ...field,
      settings: {
        ...(field.settings || {}),
        [key]: value,
      },
    };

    onUpdateField(field.id, updatedField);
  };

  // Get safe settings with defaults
  const settings = field.settings || {};
  const imageStyle = {
    width: settings.width || '100%',
    height: settings.height || 'auto',
    borderRadius: settings.borderRadius || '0px',
    objectFit: 'cover',
    display: 'block',
    marginLeft: settings.align === 'right' ? 'auto' : '0',
    marginRight: settings.align === 'left' ? 'auto' : '0',
  };

  return (
    <div className="space-y-4 mt-2">
      {!settings.image ? (
        <div className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full"
          />
          <p className="text-sm text-gray-500 mt-2">Click to upload an image</p>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-2">
          <div style={{ width: settings.width || '100%' }}>
            <img
              src={settings.image}
              alt="Uploaded content"
              style={imageStyle}
            />
          </div>
          <button
            onClick={() => handleSettingChange('image', null)}
            className="text-sm text-red-600 hover:underline"
          >
            Remove Image
          </button>
        </div>
      )}

      {/* Customization Controls */}
      {settings.image && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
          {/* Width Control */}
          <div>
            <label className="block font-medium mb-1">Width</label>
            <input
              type="text"
              value={settings.width || ''}
              onChange={(e) => handleSettingChange('width', e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="e.g. 200px or 50%"
            />
          </div>

          {/* Height Control */}
          <div>
            <label className="block font-medium mb-1">Height</label>
            <input
              type="text"
              value={settings.height || ''}
              onChange={(e) => handleSettingChange('height', e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="e.g. 200px"
            />
          </div>

          {/* Alignment Control */}
          <div>
            <label className="block font-medium mb-1">Alignment</label>
            <select
              value={settings.align || 'left'}
              onChange={(e) => handleSettingChange('align', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageField;