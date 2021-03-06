import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Dimensions,
} from 'react-native';
import Button from 'apsl-react-native-button';
import config from './config';

const windowWidth = Dimensions.get('window').width;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      waiting: false,
      lampStatus: false,
    }

    this.onSwitch = this.onSwitch.bind(this);
  }

  componentDidMount() {
    this.setState({ waiting: true });
    this.getCurrentStatus();
    setInterval(() => {
      this.getCurrentStatus();
    },1500);
  }

  getCurrentStatus() {
    const topic = config.topic;
    const auth = `${topic}?auth=${config.appKey}:${config.appSecret}&retain`
    const url = `https://api.netpie.io/topic/${config.appId}/${auth}`;

    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.length === 1) {
        const lampStatus = responseJson[0].payload === 'ON' ? true : false;

        this.setState({
          lampStatus,
          waiting: false,
        });
      } else {
        this.setState({ waiting: false });
      }
    });
  }

  onSwitch(lampStatus) {
    const topic = config.topic;
    const auth = `${topic}?auth=${config.appKey}:${config.appSecret}&retain`
    const url = `https://api.netpie.io/topic/${config.appId}/${auth}`;

    const reqOpts = {
        method: 'PUT',
        body: lampStatus ? 'ON' : 'OFF',
    };

    this.setState({ waiting: true });

    fetch(url, reqOpts)
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.code == 200) {
        this.setState({ lampStatus, waiting: false });
      } else {
        alert(responseJson.message);
        this.setState({ waiting: false });
      }
    })
    .catch((error) => {
      alert('Something wrong!!');
      this.setState({ waiting: false });
    });
  }

  render() {
    const lampSource = this.state.lampStatus ? require('./image/on.png') : require('./image/off.png');

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            style={styles.logo}
            source={require('./image/netpie_logo.png')}
            resizeMode="contain"
          />
        </View>
        <View style={styles.footer}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              style={styles.lamp}
              source={lampSource}
              resizeMode="contain"
            />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 15,
            }}
          >
            <Button
              style={styles.onbuttonbg}
              textStyle={styles.onbutton}
              isDisabled={this.state.lampStatus || this.state.waiting}
              onPress={() => this.onSwitch(true)}
            >
              ON
            </Button>
            <Button
              style={styles.offbuttonbg}
              textStyle={styles.offbutton}
              isDisabled={!this.state.lampStatus || this.state.waiting}
              onPress={() => this.onSwitch(false)}
            >
              OFF
            </Button>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 20,
  },
  footer: {
    flex: 3,
    flexDirection: 'row',
  },
  welcome: {
    fontSize: 25,
    textAlign: 'center',
    margin: 10,
  },
  logo: {
    width: windowWidth * (70 / 100),
    height: (windowWidth * (70 / 100)) * (25 / 100),
  },
  lamp: {
    width: windowWidth / 2,
    height: (windowWidth / 2) * 1.2,
  },
  aliastext: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10
  },
  onbuttonbg: {
    borderRadius: 10,
    backgroundColor: '#66cdaa',
    borderColor: '#3d7b66',
    borderWidth: 2,
    height: 80,
  },
  onbutton: {
    fontSize: 40,
    color: '#3d7b66',
  },
  offbuttonbg: {
    borderRadius: 10,
    backgroundColor: '#ff9892',
    borderColor: '#995b57',
    borderWidth: 2,
    height: 80,
  },
  offbutton: {
    fontSize: 40,
    color: '#995b57',
  },
});

export default App;
