import React, {Component} from 'react';
import {View, ActivityIndicator, FlatList, StyleSheet, Text, SafeAreaView} from 'react-native';
import DetailView from '../components/DetailView';
import {connect} from "react-redux";
import { common } from "../styles";

class Appeal extends Component {

  get fieldsToDisplay() {
    return Object.prototype.hasOwnProperty.call(this.props.meta, 'fields') ?
      this.props.meta.fields
        .filter(field => !field.NAME.startsWith('SYS_'))
        .map(field => {
          if (field.TYPE === 'lookup' || field.TYPE === 'multilookup')
            return {name: field.NAME + '_D', label: field.ALIAS}
          else
            return {name: field.NAME, label: field.ALIAS}
        })
      : {};

  }

  render() {
    return (
      <View style={ common.mainBody }>
      <SafeAreaView style={{ flex: 1}}>
        <DetailView
              item={this.props.appeal}
              fields={this.fieldsToDisplay}
        />
      </SafeAreaView>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const appeal = state.appealsReducer.appeals.find(item => item.SYS_GUID === ownProps.route.params.id)
  return {
    appeal,
    meta: state.metaReducer.appeals
  }
};

export default connect(mapStateToProps)(Appeal);


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
