import React, { ReactNode, ReactElement } from 'react';
import Avatar, { AvatarProps } from '@mui/material/Avatar';
import { AvatarVariant } from '../../../types/module/mui/muiTypes';
import { IconProp } from '../../../types/util/componentsTypes';

const isReactNode = (icon: IconProp): icon is ReactElement => React.isValidElement(icon);

type IconDisplayProps = {
    icon: IconProp;
    size?: number;
    avatarProps?: AvatarProps;
    avatarVariant?: AvatarVariant;
};

const IconDisplay: React.FC<IconDisplayProps> = ({ icon, size, avatarProps, avatarVariant }) => {
    if (!icon) {
        return null;
    }

    // iconがReactElementの場合
    if (isReactNode(icon)) {
        return React.cloneElement(icon, {
            sx: { width: size, height: size },
        });
    }

    // iconがImage型の場合
    if (typeof icon === 'object' && 'src' in icon) {
        return (
            <Avatar
                alt={icon.alt}
                src={icon.src}
                variant={avatarVariant}
                sx={{ width: size, height: size }}
                {...avatarProps}
            />
        );
    }

    return null;
};

export default IconDisplay;
