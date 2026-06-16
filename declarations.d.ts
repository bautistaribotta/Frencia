// Permite importar archivos .svg como componentes React (react-native-svg-transformer).
declare module '*.svg' {
  import type React from 'react';
  import type { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

// react-native-boring-avatars no incluye tipos propios.
declare module 'react-native-boring-avatars' {
  import type React from 'react';
  export interface BoringAvatarProps {
    variant?: 'pixel' | 'bauhaus' | 'ring' | 'beam' | 'sunset' | 'marble';
    colors?: string[];
    name?: string;
    square?: boolean;
    size?: number;
  }
  const Avatar: React.FC<BoringAvatarProps>;
  export default Avatar;
}
