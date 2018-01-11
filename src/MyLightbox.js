import React, { Component } from 'react';
import './MyLightbox.css'

class MyLightbox extends Component {

  constructor(props) {
    super(props);

    this.lastX = 0;

    this.state = {containerWidth: 0, 
                  images: props.images, 
                  x: 0, 
                  y: 0,
                  xVel: 0,
                  xClicked:0, 
                  yClicked:0, 
                  currentDragOffset:0, 
                  scrollOffsetDragStart: 0, 
                  dragging: false,
                  animating: false,
                  animationStartTime: 0,
                  currentPage: 0};
  }

  componentDidMount () {
    window.addEventListener('resize', this._handleWindowResize);

    window.addEventListener('mousedown', this._handleWindowMouseDown.bind(this));
    window.addEventListener('mouseup', this._handleWindowMouseUp.bind(this));
    window.addEventListener('mousemove', this._handleWindowMouseMove.bind(this));

    this.makeLayout();

  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._handleWindowResize);

    window.removeEventListener('mousedown', this._handleWindowMouseDown);
    window.removeEventListener('mouseup', this._handleWindowMouseUp);
    window.removeEventListener('mousemove', this._handleWindowMouseMove);
  }

  getLBDims() {
    let lb = this.refs.Lightbox;
    return [lb.offsetWidth, lb.offsetHeight];
  }

  makeLayout() {
    let pWidth = this.getLBDims()[0];
    let pHeight = this.getLBDims()[1];

    let sp = this.refs.ScrollPanel;
    sp.style['width'] = pWidth * this.props.images.length + 'px';
    sp.style['height'] = pHeight + 'px';

    this.layoutImages()
  }

  imageFrameForDims(dims, boundingDims) {
      let rLeft = 0;
      let rTop = 0;

      let width = dims[0];
      let height = dims[1];
      let aspect = width / height;

      let fWidth = boundingDims[0];
      let fHeight = boundingDims[1];
      let fAspect = fWidth / fHeight;

      let scale = fWidth / width; // assume wider
      if (aspect < fAspect) { // if taller
        scale = fHeight / height;
      }

      let rWidth = scale * width;
      let rHeight = scale * height;

      if (aspect > fAspect) { // if wider
        rTop = (fHeight - rHeight) / 2;
      } else {
        rLeft = (fWidth - rWidth) / 2;
      }

      return [rLeft, rTop, rWidth, rHeight]
  }

  layoutImages() {
    let lbDims = this.getLBDims();

    for (var i = 0; i < this.props.images.length; i ++) {
      let img = this.refs[this.refForImg(i)];
      let imgInfo = this.props.images[i];

      let frame = this.imageFrameForDims(imgInfo.dimensions, lbDims);

      img.style['left'] = (lbDims[0] * i + frame[0]) + 'px';
      img.style['top'] = frame[1] + 'px';

      img.style['width'] = frame[2] + 'px';
      img.style['height'] = frame[3] + 'px';
    }
  }

  animateToRest() {
    let pWidth = this.getLBDims()[0];

    let scrollOffset = -this.refs.ScrollPanel.offsetLeft;
    if (Math.abs(this.state.xVel) > 2) {
      if (this.state.xVel > 0) {
        this.animateToPage(Math.max(this.state.currentPage - 1, 0));
      } else {
        this.animateToPage(Math.min(this.state.currentPage + 1, this.props.images.length - 1));
      }
    } else {
      let restingPage = Math.floor((scrollOffset + pWidth / 2) / pWidth);
      if (scrollOffset < 0) {
        restingPage = 0;
      }
      if (restingPage >= this.props.images.length) {
        restingPage = this.props.images.length - 1;
      }
      this.animateToPage(restingPage);
    }
  }

  animateToPage(i) {
    let animLength = 500;
    this.setState({animating: true,
                   animationStartTime: new Date().getTime(),
                   animationStartOffset: -this.refs.ScrollPanel.offsetLeft,
                   animationTargetOffset: i * this.getLBDims()[0]});

    var myInt = setInterval(function () {
      let now = new Date().getTime();
      let elapsed = now - this.state.animationStartTime;

      let elapsedPortion = elapsed / animLength;
      let animOffset = (this.state.animationTargetOffset - this.state.animationStartOffset) * this.squaredOut(elapsedPortion) + this.state.animationStartOffset;
      this.refs.ScrollPanel.style['left'] = -animOffset + 'px';

      if (elapsedPortion >= 1) {
        clearInterval(myInt);
        this.setState({currentPage: i});
      }
    }.bind(this), 15);
  }

  squaredOut(i) {
    return Math.max(Math.min(1.0, (1.0 - (1.0 - i) * (1.0 - i))), 0.0);
  }

  _onMouseMove(e) {

  }

  _onMouseDown(e) {
  }

  _onMouseUp(e) {

  }


  _handleWindowMouseDown(e) {
    this.setState({xClicked: e.screenX, yClicked: e.screenY, scrollOffsetDragStart: this.refs.ScrollPanel.offsetLeft, dragging:true});
  }

  _handleWindowMouseUp(e) {
    this.setState({dragging: false})
    this.animateToRest();
  }

  _handleWindowMouseMove(e) {
    let mX = e.screenX;
    let velocity = mX - this.lastX;

    let currentDragOffset = e.screenX - this.state.xClicked;
    let newOffset = this.state.scrollOffsetDragStart + currentDragOffset

    this.setState({ x: mX, y: e.screenY, currentDragOffset: currentDragOffset, xVel: velocity });

    let sp = this.refs.ScrollPanel;
    if (this.state.dragging) {
      sp.style['left'] = newOffset + 'px';
    }

    this.lastX = mX;
  }

  refForImg(i) {
    return "imageref" + i;
  }

  render() {
    return (
      <div className="MyLightbox" ref="Lightbox">
        <div className="ScrollPanel" 
             ref="ScrollPanel" 
             onMouseMove={this._onMouseMove.bind(this)}
             onMouseUp={this._onMouseUp.bind(this)}
             onMouseDown={this._onMouseDown.bind(this)} >

          {
            this.props.images.map(function(item, i){
              return <img className="LightboxImage" src={item.src} alt={item.caption} key={this.refForImg(i)} ref={this.refForImg(i)}/>
            }.bind(this))
          }

        </div>
        <h1>Mouse coordinates: { this.state.xClicked } { this.state.yClicked } {this.state.currentDragOffset} {this.state.scrollOffsetDragStart}</h1>
      </div>
    );
  }
}


export default MyLightbox;
