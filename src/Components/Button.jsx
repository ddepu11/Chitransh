import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Button = ({
  type,
  children,
  padding,
  margin,
  fs,
  color,
  bgColor,
  handleClick,
  transition,
  transform,
  bSh,
  borderRadius,
  cursor,
  width,
  height,
  dataVal,
  positionVal,
  fromTop,
  fromRight,
  fromBottom,
  fromLeft,
  isDisabled,
}) => {
  useEffect(() => {});

  return (
    <ButtonWrapper
      onClick={handleClick}
      type={type}
      data-value={dataVal}
      disabled={isDisabled}
      padding={padding}
      margin={margin}
      fontSize={fs}
      bgColor={bgColor}
      color={color}
      transition={transition}
      transform={transform}
      boxShadow={bSh}
      width={width}
      height={height}
      borderRadius={borderRadius}
      cursor={cursor}
      position={positionVal}
      top={fromTop}
      bottom={fromBottom}
      left={fromLeft}
      right={fromRight}
    >
      {children}
    </ButtonWrapper>
  );
};

Button.propTypes = {
  type: PropTypes.string,
  handleClick: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.element,
  ]),
  padding: PropTypes.string,
  margin: PropTypes.string,
  fs: PropTypes.string,
  color: PropTypes.string,
  bgColor: PropTypes.string,
  transition: PropTypes.string,
  transform: PropTypes.string,
  bSh: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  borderRadius: PropTypes.string,
  cursor: PropTypes.string,
  dataVal: PropTypes.string,
  positionVal: PropTypes.string,
  fromBottom: PropTypes.string,
  fromTop: PropTypes.string,
  fromLeft: PropTypes.string,
  fromRight: PropTypes.string,
  isDisabled: PropTypes.bool,
};

Button.defaultProps = {
  type: 'button',
  handleClick: () => {},
  children: 'XYZ',
  padding: '0px',
  margin: '0px',
  fs: '1em',
  color: 'white',
  bgColor: '#222',
  transition: 'transform 0.5s ease',
  transform: 'scale(1.1)',
  bSh: 'rgba(0, 0, 0, 0.4) 0px 30px 90px',
  width: 'auto',
  height: 'auto',
  borderRadius: '0px',
  cursor: 'pointer',
  dataVal: '',
  positionVal: 'static',
  fromRight: '',
  fromLeft: '',
  fromBottom: '',
  fromTop: '',
  isDisabled: false,
};

const ButtonWrapper = styled.button`
  width: ${({ width }) => width && width};
  height: ${({ height }) => height && height};
  padding: ${({ padding }) => padding && padding};
  margin: ${({ margin }) => margin && margin};
  font-size: ${({ fontSize }) => fontSize && fontSize};
  background-color: ${({ bgColor }) => bgColor && bgColor};

  color: ${({ color }) => color && color};

  box-shadow: ${({ boxShadow }) => boxShadow && boxShadow};
  border-radius: ${({ borderRadius }) => borderRadius && borderRadius};
  cursor: ${({ cursor }) => cursor && cursor};
  position: ${({ positionVal }) => positionVal && positionVal};

  top: ${({ fromTop }) => fromTop && fromTop};
  bottom: ${({ fromBottom }) => fromBottom && fromBottom};
  left: ${({ fromLeft }) => fromLeft && fromLeft};
  right: ${({ fromRight }) => fromRight && fromRight};

  transition: ${({ transition }) => transition && transition};

  :hover {
    transform: ${({ transform }) => transform && transform};
  }
`;

export default Button;
