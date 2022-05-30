import React, {Component} from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'

class Splash extends Component {

  constructor(props) {
    super(props);
    this.state = {
      animating: true,
      loaded: false
    }
  }

  componentDidMount() {
    if (!this.state.loaded) {
      setTimeout(() => {
        this.setState({'animating': false});
        this.checkAuth().then(() => {
          this.setState({loaded: true})
        })
      }, 5000);
    } else {
      this.checkAuth()
    }
  }

  checkAuth() {
    return AsyncStorage.getItem('user').then((value) =>
      this.props.navigation.navigate(
        value === null ? 'Login' : 'Menu'
      ),
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('../assets/Logo.png')}
          style={{width: '90%', resizeMode: 'contain', margin: 30}}
        />
        <ActivityIndicator
          animating={this.state.animating}
          color="#007bff"
          size="large"
          style={styles.indicator}
        />
      </View>
    );
  }
}

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f4f4',
  },
  indicator: {
    alignItems: 'center',
    height: 80,
  },
});
