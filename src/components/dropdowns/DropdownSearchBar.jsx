import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

export const DropdownSearchBar = React.forwardRef(
  ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    const [value, setValue] = useState('');
    const dropdown = (children[0].key) ? (children.filter(
      (child) =>
        !value || !child.key || child.key.toLowerCase().startsWith(value.toLowerCase())
    )) : (children[1].filter(
      (child) =>
        !value || !child.key || child.key.toLowerCase().startsWith(value.toLowerCase())
    ))
    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <Form.Control
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="Type to filter."
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <ul className="list-unstyled">
          {(children && children[0]) ? dropdown : ""}
        </ul>
      </div>
    );
  },
);