import { useState, useEffect } from 'react';

const CustomFormManager = ({
  initialFields = [],
  requireAdditionalInfo,
  onRequireAdditionalInfoChange,
  onFieldsChange,
}) => {
  const [fields, setFields] = useState(Array.isArray(initialFields) ? initialFields : []);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');
  const [newFieldOptions, setNewFieldOptions] = useState([]);
  const [newOptionText, setNewOptionText] = useState('');

  useEffect(() => {
    if (typeof onFieldsChange === 'function') {
      onFieldsChange(fields);
    }
  }, [fields, onFieldsChange]);

  const handleAddCustomField = () => {
    const trimmedName = newFieldName.trim();
    if (!trimmedName) return;

    const field = { name: trimmedName, type: newFieldType };
    if (newFieldType === 'checkbox') {
      field.options = Array.isArray(newFieldOptions) ? newFieldOptions.filter(o => o && String(o).trim()) : [];
    }

    setFields((prevFields) => [
      ...prevFields,
      field,
    ]);
    setNewFieldName('');
    setNewFieldType('text');
    setNewFieldOptions([]);
    setNewOptionText('');
  };

  const handleRemoveCustomField = (index) => {
    setFields((prevFields) => prevFields.filter((_, i) => i !== index));
  };

  return (
    <div className="custom-form-requirements-box">
      <label className="inner-radio-label">
        <input
          type="radio"
          name="require_additional_info"
          checked={!requireAdditionalInfo}
          onChange={() => onRequireAdditionalInfoChange(false)}
        />
        <span className="custom-radio"></span>
        No requirements (One-click register)
      </label>

      <label className="inner-radio-label">
        <input
          type="radio"
          name="require_additional_info"
          checked={requireAdditionalInfo}
          onChange={() => onRequireAdditionalInfoChange(true)}
        />
        <span className="custom-radio"></span>
        Require Custom Form
      </label>

      {requireAdditionalInfo && (
        <div className="custom-fields-builder">
          <div className="builder-input-row">
            <input
              type="text"
              placeholder="Field name (e.g. Reason to attend)"
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
            />
            <select
              value={newFieldType}
              onChange={(e) => setNewFieldType(e.target.value)}
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="checkbox">Checkbox</option>
            </select>
            <button
              type="button"
              className="btn-add-field"
              onClick={handleAddCustomField}
            >
              + Add
            </button>
          </div>

          {newFieldType === 'checkbox' && (
            <div className="builder-options-row">
              <div className="options-input">
                <input
                  type="text"
                  placeholder="Option text (e.g. Vegetarian)"
                  value={newOptionText}
                  onChange={(e) => setNewOptionText(e.target.value)}
                />
                <button type="button" className="btn-add-option" onClick={() => {
                  const t = newOptionText.trim();
                  if (!t) return;
                  setNewFieldOptions(prev => [...prev, t]);
                  setNewOptionText('');
                }}>Add option</button>
              </div>

              {newFieldOptions.length > 0 && (
                <div className="options-preview">
                  {newFieldOptions.map((opt, idx) => (
                    <div key={idx} className="option-item">
                      <span>{opt}</span>
                      <button type="button" className="btn-remove-option" onClick={() => setNewFieldOptions(prev => prev.filter((_, i) => i !== idx))}>
                        <i className="bi bi-x"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {fields.length > 0 && (
            <div className="added-fields-list">
              {fields.map((field, idx) => (
                <div key={idx} className="added-field-item">
                  <span className="field-name-type">
                    <strong>{field.name}</strong> ({field.type})
                  </span>
                  {field.options && field.options.length > 0 && (
                    <div className="field-options-preview">
                      {field.options.map((o, i) => (
                        <span key={i} className="field-option-pill">{o}</span>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    className="btn-remove-field"
                    onClick={() => handleRemoveCustomField(idx)}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomFormManager;
