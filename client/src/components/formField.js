import { React, useState } from "react";
function FormField({ name, value, placeHolder, type, error, handleChange }) {
  return (
    <div className="form-group">
      <input
        type={type}
        onChange={handleChange}
        value={value}
        name={name}
        id={name}
        placeholder={placeHolder}
        className={error && " error"}
      ></input>
      <span className="form-field-error">{error}</span>
    </div>
  );
}

export default FormField;
