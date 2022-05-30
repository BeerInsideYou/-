import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet, ActivityIndicator, SafeAreaView,
} from 'react-native';

import {connect} from "react-redux";

import {getAppeals, getMeta} from '../store/actions';

import TableView from '../components/TableView';
import {common} from "../styles";

class Appeals extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };
  }

  async getData() {
    try {
      await Promise.all([
        this.props.getAppeals(this.props.recipient.SYS_GUID),
        this.props.getMeta('INFO_STATEMENT_SERVICE')
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({isLoading: false});
    }
  }

  get fieldsToDisplay() {
    const toDisplay = ['STATEMENT_DATE', 'NUM', 'FORM_SOC_SERVICEFK', 'SOC_SERVICEFK_KEYS', 'PERIODFK'];
    return Object.prototype.hasOwnProperty.call(this.props.meta, 'fields') ?
      this.props.meta.fields
        .filter(field => toDisplay.includes(field.NAME))
        .map(field => {
          if (field.TYPE === 'lookup' || field.TYPE === 'multilookup')
            return {name: field.NAME + '_D', label: field.ALIAS}
          else
            return {name: field.NAME, label: field.ALIAS}
        })
      : {};

  }

  componentDidMount() {
    if (!Object.prototype.hasOwnProperty.call(this.props.recipient, 'SYS_GUID'))
      this.props.navigation.navigate('Menu');
      this.getData()
    if (this.props.appeals.length === 0) {
      this.setState({isLoading: true});
      this.getData()
    }
  }

  render() {
    return (
      <View style={common.mainBody}>
        <SafeAreaView style={common.container} forceInset={{ bottom: 'never' }}>
        {
          this.state.isLoading
            ? (
              <ActivityIndicator
                animating={this.state.isLoading}
                color="#007bff"
                size="large"
                style={styles.indicator}
              />
            )
            : (
              <View >
                <TableView
                  items={this.props.appeals}
                  fields={this.fieldsToDisplay}
                  navigation={this.props.navigation}
                  navTarget='Appeal'
                />
              </View>
            )
        }
        </SafeAreaView>
      </View>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f4f4',
  }
});


const mapStateToProps = state => {
  return {
    appeals: state.appealsReducer.appeals,
    recipient: state.recipientReducer.recipient,
    meta: state.metaReducer.appeals
  }
};

const mapDispatchToProps = dispatch => ({
  getAppeals: (payload) => dispatch(getAppeals(payload)),
  getMeta: (payload) => dispatch(getMeta(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Appeals);
