import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import logo from './logo.svg';
import './App.css';

const socket = openSocket(window.location.href);

class App extends Component {
  constructor() {
    super();
    this.state = { messages: [], message: '' };
    socket.on('message', this.addMessage.bind(this));
  }
  addMessage({ sender, message }) {
    this.setState({ messages: this.state.messages.concat([{ sender, message }]) });
  }
  sendMessage() {
    socket.emit('message', this.state.message);
    this.setState({ message: '' });
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">React Chat</h1>
        </header>
        <div className="App-intro">
          {this.state.messages.map(({ sender, message }, index) => <div id={index}>{sender}: {message}</div>)}
        </div>
        <div>
          <input type='text' 
            value={this.state.message} 
            onChange={(evt) => this.setState({ message: evt.target.value })} 
            onKeyPress={(evt) => (evt.key === 'Enter') ? this.sendMessage() : null } />
        </div>
      </div>
    );
  }
}

export default App;
