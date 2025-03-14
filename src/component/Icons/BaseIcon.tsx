import React from 'react';
import {SvgProps} from 'react-native-svg';
import * as Icons from './SVGIconList';
import {IconNames} from './SVGIconNames';

interface BaseIconProps extends SvgProps {
  name: IconNames;
  size?: number;
}
const BaseIcon = ({name, size = 24, ...rest}: BaseIconProps) => {
  const Icon = Icons[name];
  return <Icon width={size} height={size} {...rest} />;
};

export default BaseIcon;
