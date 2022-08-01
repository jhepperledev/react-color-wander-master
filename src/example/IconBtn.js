import React, { PureComponent } from 'react';

import Button from 'material-ui/Button';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Check from '@material-ui/icons/Check';
import ColorLens from '@material-ui/icons/ColorLens';
import FileDownload from '@material-ui/icons/FileDownload';
import FormatColorFill from '@material-ui/icons/FormatColorFill';
import Fullscreen from '@material-ui/icons/Fullscreen';
import Pause from '@material-ui/icons/Pause';
import Settings from '@material-ui/icons/Settings';
import Shuffle from '@material-ui/icons/Shuffle';

const icons = {
  Check,
  ColorLens,
  FileDownload,
  FormatColorFill,
  Fullscreen,
  Pause,
  Settings,
  Shuffle
};

class Icon extends PureComponent {
  static propTypes = {
    color: PropTypes.string,
    name: PropTypes.string.isRequired,
    size: PropTypes.number
  };

  static defaultProps = {
    color: undefined,
    size: 16
  };

  render() {
    const I = icons[this.props.name];
    return <I style={{ color: this.props.color, width: this.props.size }} />;
  }
}

const IconBtn = styled(Button).attrs({
  children: props => <Icon {...props} />
})`
  background-color: #fff !important;
  border-radius: 0 !important;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
  height: 40px;
  margin: 10px !important;
  min-width: 40px !important;
  max-width: 40px !important;
  opacity: 0.75;

  &:hover {
    opacity: 1;
  }
`;

IconBtn.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default IconBtn;
