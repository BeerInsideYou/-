import React, {Component} from 'react';
import {View, ActivityIndicator, FlatList, StyleSheet, Text, SafeAreaView} from 'react-native';
import TableView from '../components/TableView';
import {connect} from "react-redux";
import {getMeta} from '../store/actions';


class Services extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };
  }

  getMeta() {
    this.props.getMeta('INFO_SOC_SERVICE_IND_PROGRAME').then(() => { this.setState({isLoading : false}) })
  }

  componentDidMount() {
    if (!Object.prototype.hasOwnProperty.call(this.props.meta, 'SYS_GUID')) {
      this.setState({ 'isLoading' : true })
      this.getMeta()
    }
  }

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

      <SafeAreaView style={{flex: 1}}>
        {
          this.state.isLoading ? (
            <ActivityIndicator
              animating={this.state.isLoading}
              color="#007bff"
              size="large"
              style={styles.indicator}
            />
          ) : (
              <TableView
                items={this.props.program.services}
                fields={this.fieldsToDisplay}
              />
          )
        }

      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const program = state.programsReducer.programs.find(item => item.SYS_GUID === ownProps.route.params.id)
  return {
    program,
    meta: state.metaReducer.services
  }
};

const mapDispatchToProps = dispatch => ({
  getMeta: (payload) => dispatch(getMeta(payload))
});


export default connect(mapStateToProps, mapDispatchToProps)(Services);


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
