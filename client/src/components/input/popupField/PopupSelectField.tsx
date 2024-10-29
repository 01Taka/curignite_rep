import React from 'react';
import { SelectItem } from '../../../types/util/componentsTypes';
import { Menu, MenuItem } from '@mui/material';

interface PopupSelectFieldProps<T extends string | number, K extends string> {
  open: boolean;
  name: K;
  selectItems: SelectItem<T>[];
  updateField?: (fieldName: K, value: T) => void;
  onSelected: (value: T | null) => void;
}

const PopupSelectField = <T extends string | number, K extends string>({
  open,
  name,
  selectItems,
  updateField,
  onSelected,
}: PopupSelectFieldProps<T, K>) => {
  return (
    <div>
      <Menu
        open={open}
        onClose={() => onSelected(null)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {selectItems && selectItems.map((item, index) => (
          <MenuItem
            key={index}
            value={item.value}
            onClick={() => {
              if (updateField) updateField(name, item.value);
              onSelected(item.value); // 項目がクリックされたら閉じる
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default PopupSelectField;
