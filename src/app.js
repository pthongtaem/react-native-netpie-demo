import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Dimensions,
} from 'react-native';
import Button from 'react-native-button';
import config from './config';

const windowWidth = Dimensions.get('window').width;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      waiting: false,
      lampStatus: false,
      topic: 'farm/led',
    }

    this.onSwitch = this.onSwitch.bind(this);
  }

  onSwitch(lampStatus) {
    const topic = this.state.topic;
    const auth = `/${topic}?auth=${config.appKey}:${config.appSecret}`
    const url = `https://api.netpie.io/topic/${config.appId}${auth}`;

    const reqOpts = {
        method: 'PUT',
        body: lampStatus ? 'ON' : 'OFF',
    };

    this.setState({ waiting: true });

    fetch(url, reqOpts)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.code == 200) {
          this.setState({ lampStatus, waiting: false })
        } else {
          alert(responseJson.message);
          this.setState({ waiting: false })
        }
      })
      .catch((error) => {
        alert('Something wrong!!');
        this.setState({ waiting: false })
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
        <View style={styles.body}>
          <Text style={styles.welcome}>
            Topic
          </Text>
          <TextInput
            style={ styles.aliastext }
            placeholder="topic"
            value={this.state.topic}
            onChangeText={(topic) => this.setState({topic})}
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
            }}
          >
            <Button
              style={styles.onbutton}
              styleDisabled={styles.disablebutton}
              disabled={this.state.lampStatus || this.state.waiting}
              onPress={() => this.onSwitch(true)}
            >
              ON
            </Button>
            <Button
              style={styles.offbutton}
              styleDisabled={styles.disablebutton}
              disabled={!this.state.lampStatus || this.state.waiting}
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
  onbutton: {
    borderRadius:10,
    backgroundColor: '#66cdaa',
    width: 120,
    paddingTop: 15,
    paddingBottom: 15,
    fontSize: 40,
    color: '#3d7b66',
    marginBottom: 5,
  },
  offbutton: {
    borderRadius:10,
    backgroundColor: '#ff9892',
    width: 120,
    paddingTop: 15,
    paddingBottom: 15,
    fontSize: 40,
    color: '#995b57',
  },
  disablebutton: {
    backgroundColor: '#b2b2b2',
    color: '#6a6a6a',
  },
});

export default App;
