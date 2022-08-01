import React, { Component } from 'react';

import { invert } from 'color-invert';
import { saveAs } from 'file-saver';
import Animated from 'react-animated-transitions';
import Paper from 'material-ui/Paper';
import styled from 'styled-components';

import Art from '../lib';
import IconBtn from './IconBtn';

import maps from './maps';
import palettes from './palettes';

import './app.css';

const isMobile = window.matchMedia('(max-width: 767px)').matches;

const getRandom = () => ({
  map: maps[Math.floor(Math.random() * maps.length)],
  palette: palettes[Math.floor(Math.random() * palettes.length)]
});

class Example extends Component {
  state = {
    custom: false,
    full: isMobile, // start in full screen if mobile
    map: getRandom().map,
    more: false,
    mounted: false,
    palette: ['#21242b', '#61dafb', '#6d6d6d', '#292c34', '#fff'], // react colors
    stopped: false
  };

  randomize = () => this.setState(getRandom(), () => this.drawArt());

  toggleMoreActions = () => this.setState({ more: !this.state.more });

  drawArt = () => {
    // just a trick for a smooth transition when re-drawing
    if (this.art.metadata().palette)
      document.body.style.background = this.art.metadata().palette[0];

    this.art.draw();

    this.setState({ palette: this.art.metadata().palette, stopped: false });
  };

  stopDrawing = () => {
    this.art.stop();

    this.setState({ stopped: true });
  };

  customizePalette = () => this.setState({ custom: !this.state.custom });

  updatePaletteColor = (i, color) => {
    const newPallete = this.state.palette;
    newPallete[i] = color;
    this.setState({ palette: newPallete });
  };

  applyPalette = () => this.setState({ custom: false }, () => this.drawArt());

  toggleFullMode = () =>
    this.setState({ full: !this.state.full }, () => this.drawArt());

  downloadArt = () => {
    this.stopDrawing();

    this.art
      .ref()
      .toBlob(blob => saveAs(blob, `${this.art.metadata().seed}.png`));
  };

  createRef = ref => {
    this.art = ref;

    if (!this.state.mounted)
      this.setState({ mounted: true }, () => this.drawArt());
  };

  renderArt = () => {
    // this.art = {
    //   metadata: () => ({ palette: this.state.palette }),
    //   draw: () => null,
    //   stop: () => null
    // };

    // return (
    //   <div
    //     style={{
    //       backgroundColor: this.state.palette[1], // #eee
    //       height: 512,
    //       width: 512
    //     }}
    //   />
    // );

    if (this.state.full) {
      return (
        <Art
          map={this.state.map}
          palette={this.state.palette}
          ref={this.createRef}
        />
      );
    }

    const size = 512;

    return (
      <Canvas {...{ size }}>
        <Art
          height={size}
          map={this.state.map}
          palette={this.state.palette}
          ref={this.createRef}
          width={size}
        />
      </Canvas>
    );
  };

  renderMoreActions = () => (
    <div>
      <IconBtn name="Shuffle" onClick={this.randomize} />

      <IconBtn
        name="Pause"
        onClick={this.stopDrawing}
        disabled={this.state.stopped}
      />

      <IconBtn name="ColorLens" onClick={this.drawArt} />
      <IconBtn name="FormatColorFill" onClick={this.customizePalette} />

      {!isMobile && <IconBtn name="Fullscreen" onClick={this.toggleFullMode} />}

      <IconBtn name="FileDownload" onClick={this.downloadArt} />
    </div>
  );

  renderPalette = () => {
    if (!this.state.palette) return null;

    return (
      <Palette>
        {this.state.palette.map((color, i) => (
          <Input
            onChange={e => this.updatePaletteColor(i, e.target.value)}
            style={{
              backgroundColor: this.state.palette[i],
              color: invert(this.state.palette[i])
            }}
            value={this.state.palette[i]}
          />
        ))}

        <IconBtn name="Check" onClick={this.applyPalette} />
      </Palette>
    );
  };

  render() {
    const { more, custom } = this.state;

    return (
      <Animated>
        <Container>
          {this.renderArt()}

          <Actions>
            <Row>
              <IconBtn name="Settings" onClick={this.toggleMoreActions} />

              <Animated items>
                {more && <Animated item>{this.renderMoreActions()}</Animated>}
              </Animated>
            </Row>

            <Animated items>
              {more &&
                custom && <Animated item>{this.renderPalette()}</Animated>}
            </Animated>
          </Actions>
        </Container>
      </Animated>
    );
  }
}

const Actions = styled.div`
  left: 10px;
  position: absolute;
  top: 10px;
`;

const Palette = styled.div`
  margin-left: 240px;
`;

const Canvas = styled(Paper).attrs({ square: true })`
  box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.1) !important;
  height: ${props => props.size}px;
`;

const Container = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
`;

const Input = styled.input`
  border-radius: 0;
  border: none;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
  font-family: 'Open Sans';
  height: 40px;
  margin: 10px;
  opacity: 0.75;
  outline: 0;
  padding-left: 10px;
  padding-right: 10px;
  text-align: center;
  width: 60px;

  &:hover {
    opacity: 1;
  }
`;

const Row = styled.div`
  display: flex;
`;

export default Example;
