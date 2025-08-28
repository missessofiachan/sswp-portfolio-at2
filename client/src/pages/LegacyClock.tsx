import React from 'react';
export default class LegacyClock extends React.Component<{}, { now: string }> {
  timer?: number;
  constructor(props: {}) {
    super(props);
    this.state = { now: new Date().toLocaleTimeString() };
  }
  componentDidMount() {
    this.timer = window.setInterval(() => {
      this.setState({ now: new Date().toLocaleTimeString() });
    }, 1000);
  }
  componentWillUnmount() {
    if (this.timer) clearInterval(this.timer);
  }
  render() {
    return <p>Legacy clock: {this.state.now}</p>;
  }
}
