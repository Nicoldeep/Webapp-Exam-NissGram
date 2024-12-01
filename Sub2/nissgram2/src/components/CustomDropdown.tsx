import React from 'react';

interface CustomDropdownProps {
  icon: JSX.Element;
  menuItems: Array<{ label: string; action: () => void }>;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ icon, menuItems }) => {
  return (
    <div className="dropdown-container">
      <button
        className="btn btn-link"
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {icon}
      </button>
      <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
        {menuItems.map((item, index) => (
          <li key={index}>
            <button
              type="button"
              className={`dropdown-item ${index === 1 ? 'text-danger' : ''}`}
              onClick={item.action}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomDropdown;
