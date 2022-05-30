import React, {Component} from 'react';
import {
  View,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from 'react-native';
import {connect} from "react-redux";
import { Input, Text, Button, Spinner, List} from '@ui-kitten/components';
import {common} from "../styles";
import Field from "../components/Field";
import {getMeta, addAppeal } from "../store/actions";
import _ from 'lodash';
import { format } from 'fecha'

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      statementDate: new Date(),
      formSocServicefk: {},
      socServicefk: [],
      circumstancefk: {},
      periodfk: '',
      orgSocfk: [],
      income: '',
      error: ''
    };
  }

  async getData() {
    try {
      await this.props.getMeta('INFO_STATEMENT_SERVICE')
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({isLoading: false});
    }
  }

  get fieldsToDisplay() {
    const toDisplay = ['STATEMENT_DATE', 'FORM_SOC_SERVICEFK', 'SOC_SERVICEFK', 'CIRCUMSTANCEFK', 'PERIODFK', 'ORG_SOCFK', 'INCOME'];
    return Object.prototype.hasOwnProperty.call(this.props.meta, 'fields')
      ? this.props.meta.fields.filter(field => toDisplay.includes(field.NAME))
      : {};

  }

  fieldChange = (name, value) => {
    let s = {}
    s[_.camelCase(name)] = value;
    this.setState(s)
    this.setState({ error: '' })
  }

  submitForm = () => {
    console.log(this.state)
    let error = this.state.error
    if (this.state.statementDate === '')
      error += 'Заполните дату заявления '
    if (this.state.formSocServicefk === {})
      error += 'Заполните форму предоставления услуг '
    if (this.state.socServicefk === [])
      error += 'Заполните социальные услуги '
    if (this.state.circumstancefk === {})
      error += 'Заполните основания предоставления социальных услуг '
    if (this.state.periodfk === "")
      error += 'Заполните периодичность предоставления '
    if (this.state.orgSocfk === [])
      error += 'Заполните поставщика услуг '
    if (this.state.income === "")
      error += 'Заполните доход '
    if (error) {
      this.setState({ error : error })
    }
    else {
      this.setState({ isLoading : true })
      setTimeout(() => {
        let data = {
          SYS_GUIDFK : this.props.recipient.SYS_GUID,
          STATEMENT_DATE : format(this.state.statementDate, 'german'),
          FORM_SOC_SERVICEFK: this.state.formSocServicefk,
          SOC_SERVICEFK_KEYS: this.state.socServicefk,
          CIRCUMSTANCEFK: this.state.circumstancefk,
          PERIODFK: this.state.periodfk,
          ORG_SOCFK: this.state.orgSocfk.map(i => { i.DISPLAY.replace('"', ''); return i }),
          INCOME: this.state.income
        }

        this.props.addAppeal(JSON.stringify(data))
          .then((r) => { console.log(r); })
          .catch(e => { console.log(e)})
          .finally(() => { this.setState({ isLoading : false }) })
      }, 50)
    }



  }

  componentDidMount() {
    if (!Object.prototype.hasOwnProperty.call(this.props.recipient, 'SYS_GUID'))
      this.props.navigation.navigate('Menu');
    if (!Object.prototype.hasOwnProperty.call(this.props.meta, 'SYS_GUID')) {
      this.setState({isLoading: true});
      this.getData()
    }
  }

  render() {
    return (
      <SafeAreaView style={common.mainBody}>
        {
          this.state.isLoading
            ? (
              <ActivityIndicator
                animating={this.state.isLoading}
                color="#007bff"
                size="large"
              />
            )
            : (

              <KeyboardAvoidingView enabled contentContainerStyle={common.mainBody} behavior={Platform.OS === "ios" ? "padding" : "height"}>
              <View style={common.section}>
                { this.state.error !== ''
                  ? (<Text>{this.state.error}</Text>)
                  : null }


                  <List style={common.container}
                        data={this.fieldsToDisplay}
                        ItemSeparatorComponent={() => (
                          <View style={common.separator}/>
                        )}
                        renderItem={ item => <Field meta={item} onChange={this.fieldChange} /> } />

                <View style={common.separator}/>
                <View style={common.separator}/>
                <View style={common.separator}/>
                <View>
                  <Button onPress={this.submitForm}>
                    Сохранить
                  </Button>
                </View>
              </View>
              </KeyboardAvoidingView>
            )
        }
      </SafeAreaView>

    )
  }
}

const mapStateToProps = state => {
  return {
    recipient: state.recipientReducer.recipient,
    meta: state.metaReducer.appeals
  }
};

const mapDispatchToProps = dispatch => ({
  getMeta: (payload) => dispatch(getMeta(payload)),
  addAppeal: (payload) => dispatch(addAppeal(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form);
