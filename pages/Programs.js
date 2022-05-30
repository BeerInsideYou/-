import React, {Component} from 'react';
import {View, ActivityIndicator, FlatList, StyleSheet, Text, ScrollView, SafeAreaView} from 'react-native';
import TableView from '../components/TableView';

import {connect} from "react-redux";

import {getPrograms, getMeta} from '../store/actions';

import {common} from '../styles'

class Programs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };
  }

  async getData() {
    try {
      await Promise.all([
        this.props.getPrograms(this.props.recipient.SYS_GUID),
        this.props.getMeta('INFO_IND_PROGRAME')
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({isLoading: false});
    }
  }

  get fieldsToDisplay() {
    const toDisplay = ['DATE', 'DATE_START', 'DATE_END', 'SERVICEFK', 'ORG_SOCFK', 'SERVICES_COUNT'];
    return Object.prototype.hasOwnProperty.call(this.props.meta, 'fields') ?
      this.props.meta.fields
        .filter(field => toDisplay.includes(field.NAME))
        .map(field => {
          return {name: field.NAME, label: field.ALIAS}
        })
      : {};

  }

  componentDidMount() {
      if (!Object.prototype.hasOwnProperty.call(this.props.recipient, 'SYS_GUID'))
        this.props.navigation.navigate('Menu');
      if (this.props.programs.length === 0 || !Object.prototype.hasOwnProperty.call(this.props.meta, 'fields')) {
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
              <TableView
                items={this.props.programs}
                fields={this.fieldsToDisplay}
                navigation={this.props.navigation}
                navTarget='Services'
              />
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
  },
  indicator: {
    alignItems: 'center',
    height: 80,
  },
});

const mapStateToProps = state => {
  return {
    programs: state.programsReducer.programs,
    recipient: state.recipientReducer.recipient,
    meta: state.metaReducer.programs
  }
};

const mapDispatchToProps = dispatch => ({
  getPrograms: (payload) => dispatch(getPrograms(payload)),
  getMeta: (payload) => dispatch(getMeta(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Programs);
