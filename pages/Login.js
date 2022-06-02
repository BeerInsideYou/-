import React, {Component} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  ScrollView,
  Image,
  Keyboard,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';
import { Input, Text, Button, Spinner } from '@ui-kitten/components';

import {AsyncStorage} from '@react-native-async-storage/async-storage'
import {auth} from '../api/authserv'

import {common} from '../styles'

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
      loading: false,
      error: ''
    }
    this.passwordRef = React.createRef()
  }

  handleSubmit = () => {
    this.setState({'error': ''})
    if (!this.state.login) {
      this.setState({'error': 'Введите логин'})
      return;
    }
    if (!this.state.password) {
      this.setState({'error': 'Введите пароль'})
      return;
    }
    this.setState({'loading': true})

    auth(this.state.login, this.state.password).then(response => {
      
      this.props.navigation.navigate('Menu')
    }).catch((error) => {
      this.setState({'loading': false})
      this.setState({'error': error.toString() })
      console.error(error);
    })
  }

  render() {
    return (
      <View style={ common.mainBody }>
        {
          this.state.loading
          ? (
              <View style={{alignItems: 'center'}}>
                <Spinner animating={true} color="#FFFFFF" size="large"/>
              </View>
            )
          : (
              <KeyboardAvoidingView enabled style={styles.mainBody} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <View style={{alignItems: 'center'}}>
                  <Image source={require('../assets/Logo.png')} style={styles.logo}/>
                </View>
                {this.state.error !== ''
                  ? (<Text style={styles.errorTextStyle}>{this.state.error}</Text>)
                  : null}
                <View style={styles.SectionStyle}>
                  <Input
                    style={{ flex: 1 }}
                    onChangeText={login =>
                      this.setState({'login': login})
                    }
                    value={this.state.login}
                    placeholder="Логин"
                    keyboardType="email-address"
                    returnKeyType="next"
                    onSubmitEditing={() =>
                      this.passwordRef.current &&
                      this.passwordRef.current.focus()
                    }
                    blurOnSubmit={false}
                  />
                </View>
                <View style={styles.SectionStyle}>
                  <Input
                    style={{ flex: 1 }}
                    onChangeText={password =>
                      this.setState({'password': password})
                    }
                    value={this.state.password}
                    placeholder="Пароль"
                    keyboardType="default"
                    onSubmitEditing={Keyboard.dismiss}
                    ref={this.passwordRef}
                    blurOnSubmit={false}
                    secureTextEntry={true}
                    returnKeyType="next"
                  />
                </View>
                <View style={styles.SectionStyle}>
                  <Button style={{ flex: 1}} activeOpacity={0.5} onPress={this.handleSubmit} size="small">
                    <Text>ВОЙТИ</Text>
                  </Button>
                </View>
                {/*<View style={styles.SectionStyle}>*/}
                {/*  <Button style={{ flex: 1}} activeOpacity={0.5} onPress={() => this.props.navigation.navigate('RegisterScreen')} appearance="ghost" size="small">*/}
                {/*    <Text>Нет учетной записи?</Text>*/}
                {/*  </Button>*/}
                {/*</View>*/}
              </KeyboardAvoidingView>
            )
        }
      </View>
    );
  }
}

export default Login;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    alignContent: 'center',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  logo: {
    width: '50%',
    height: 200,
    resizeMode: 'contain',
    margin: 30
  },
  buttonStyle: {
    backgroundColor: '#008cd5',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#014e76',
    height: 40,
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: 'black',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 0,
    borderColor: '#dadae8',
  },
  registerTextStyle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
});
