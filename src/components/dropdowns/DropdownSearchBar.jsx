import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

export const DropdownSearchBar = React.forwardRef(
  ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    const [value, setValue] = useState('');
    const getItems = () => {
      if ((children && children.length === 1)|| (children && children.length === 2 && children[1].key))
        return children;
      if (!children || !children[0] || !children[1])
        return "";
      if (children[0].key)
        return children.filter(
          (child) =>
            !value || !child.key || child.key.toLowerCase().startsWith(value.toLowerCase())
        );
      if (children[1].key)
        return children[1].filter(
          (child) =>
            !value || !child.key || child.key.toLowerCase().startsWith(value.toLowerCase())
        )
      return "";
    };
    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        {((children && children.length === 1)|| (children && children.length === 2 && children[1].key)) ? <div></div> : <Form.Control
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="Type to filter."
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />}
        <ul className="list-unstyled">
          {getItems()}
        </ul>
      </div>
    );
  },
);