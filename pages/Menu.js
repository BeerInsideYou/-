/* eslint-disable */
import React, {Component} from 'react';
import {View, ActivityIndicator, StyleSheet, SafeAreaView, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors, common} from '../styles'
import {connect} from "react-redux";
import {getRecipient, RESET_STATE} from '../store/actions';
import {Text, Icon, MenuItem, Menu as Nav, Card} from '@ui-kitten/components';
import CookieManager from '@react-native-cookies/cookies';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
    this.userData = {
      name: '',
      secondname: '',
      middlename: ''
    };
    this.getAsync()
  }
  async getAsync() {
    try{
      let user = await AsyncStorage.getItem('user');
      let userJson = await JSON.parse(user);
      console.log(userJson);
      this.userData = {
        name: userJson.name,
        secondname: userJson.secondname,
        middlename: userJson.middlename
      };
    } catch (e) {
      console.log(e)
    }
  }

  async getData() {
    try {
      await this.props.getRecipient();
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({isLoading: false});
    }
  }
  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      if (!Object.prototype.hasOwnProperty.call(this.props.recipient, 'SYS_GUID')) {
        this.setState({isLoading: true});
        this.getData()
      }
    });
  }

  render() {
    return (
      <SafeAreaView style={common.mainBody}>
        <View style={common.section}>
          <Card>
            <Icon name="person-outline" fill={Colors.muted} style={{ height: 180 }} />
            <View style={{ alignSelf: 'center'}}>
              <Text category="h6" style={{ color: Colors.primary }}>
                {this.userData.name} {this.userData.secondname} {this.userData.middlename}
              </Text>
            </View>
          </Card>
        </View>
        <View style={common.section}>
          <Nav>
            <MenuItem title={evaProps => <Text {...evaProps }>Календарь</Text>}
                      accessoryLeft={(props) => (<Icon {...props} name='calendar-outline'/>)}
                      onPress={() => this.props.navigation.navigate('Kalendar')}/>
            <MenuItem title={evaProps => <Text {...evaProps }>Карта</Text>}
                      accessoryLeft={(props) => (<Icon {...props} name='map-outline'/>)}
                      onPress={() => this.props.navigation.navigate('Map')}/>
            <MenuItem title={evaProps => <Text {...evaProps }>Выход</Text>}
                      accessoryLeft={(props) => (<Icon {...props} name='power-outline'/>)}
                      onPress={() => {
            Alert.alert(
              'Выход',
              'Вы хотите выйти из системы?',
              [
                {
                  text: 'Отмена',
                  onPress: () => {
                    return null;
                  },
                },
                {
                  text: 'Да',
                  onPress: () => {
                    this.props.reset()
                    AsyncStorage.clear();
                    this.props.navigation.navigate('Login');
                  },
                },
              ],
              {cancelable: false},
            );
           }}/>
          </Nav>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  const recipient = state.recipientReducer.recipient
  return {recipient}
};

const mapDispatchToProps = dispatch => ({
  getRecipient: (payload) => dispatch(getRecipient(payload)),
  reset: async () => {
    await CookieManager.clearAll();
    return dispatch({type: RESET_STATE})
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
