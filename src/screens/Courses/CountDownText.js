import React, { Component } from "react";

import * as Animatable from "react-native-animatable";

export default class CountDownText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countdown: this.props.seconds
    };
  }

  componentDidMount() {
    this.countdownInterval = setInterval(() => {
      this.countdown();
    }, 1000);
  }

  finished = false;
  countdown = () => {
    // if (finished) {
    //   console.log("Se terminó la cuenta regresiva");
    //   return false;
    // }
    if (this.finished) {
      this.props.callback();
      clearInterval(this.countdownInterval);
      return
      // this.setState(
      //     {
      //     countdown: "Se terminó el tiempo, llamando callback"
      //     },
      //     () => {
      //     this.animateText.fadeIn(1000);
      //     }
      // );
    }
    lastPosition = this.state.countdown;
    lastPosition--;
    if (lastPosition == 0) {
      lastPosition = "¿Listo?";
      this.finished = true;
    }
    this.setState(
      {
        countdown: lastPosition
      },
      () => {
        this.animateText.bounceInLeft(1000);
      }
    );

    // this.animateText.startAnimation(500, 0, () => {})
  };

  render() {
    return (
      <Animatable.Text
        ref={c => (this.animateText = c)}
        animation="bounceInLeft"
        iterationCount={1}
        style={{ backgroundColor: "blue" }}
        direction="alternate"
      >
        {this.state.countdown}
      </Animatable.Text>
    );
  }
}
