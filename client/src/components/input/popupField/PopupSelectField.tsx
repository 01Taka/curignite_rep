import React from 'react';
import { SelectItem, UpdateFieldFunc } from '../../../types/util/componentsTypes';
import { Menu, MenuItem } from '@mui/material';

interface PopupSelectFieldProps<T extends string | number, K extends string> {
  open: boolean;
  name: K;
  selectItems: SelectItem<T>[];
  updateField: UpdateFieldFunc<K>;
  onClose: () => void;
}

const PopupSelectField = <T extends string | number, K extends string>({
  open,
  name,
  selectItems,
  updateField,
  onClose,
}: PopupSelectFieldProps<T, K>) => {
  return (
    <div>
      <Menu
        open={open}
        onClose={onClose}
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
              updateField(name, item.value);
              onClose(); // 項目がクリックされたら閉じる
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
