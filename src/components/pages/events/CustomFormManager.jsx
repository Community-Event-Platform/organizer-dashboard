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

  useEffect(() => {
    if (typeof onFieldsChange === 'function') {
      onFieldsChange(fields);
    }
  }, [fields, onFieldsChange]);

  const handleAddCustomField = () => {
    const trimmedName = newFieldName.trim();
    if (!trimmedName) return;

    setFields((prevFields) => [
      ...prevFields,
      { name: trimmedName, type: newFieldType },
    ]);
    setNewFieldName('');
    setNewFieldType('text');
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

          {fields.length > 0 && (
            <div className="added-fields-list">
              {fields.map((field, idx) => (
                <div key={idx} className="added-field-item">
                  <span className="field-name-type">
                    <strong>{field.name}</strong> ({field.type})
                  </span>
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
