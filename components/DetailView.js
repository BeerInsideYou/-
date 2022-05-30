import React, {Component} from 'react';
import { StyleSheet, View } from "react-native";
import {Text, List} from '@ui-kitten/components';

import {common, Colors} from '../styles'

class DetailRow extends Component {
    render() {
        return (
          <View>
              <View>
                  <Text style={styles.label}>{this.props.label}</Text>
              </View>
              <View>
                  <Text style={common.text}>{this.props.data ? this.props.data : (<Text appearance="hint">не указано</Text>) }</Text>
              </View>
          </View>
        )
    }
}

class DetailView extends Component {
    render() {
        return (
          <List
                contentContainerStyle={styles.wrapper}
                style={styles.wrapper}
                data={this.props.fields}
                ItemSeparatorComponent={() => (
                  <View style={styles.separator}/>
                )}
                renderItem={({item}) => <DetailRow data={this.props.item[item.name]} label={item.label} />  }
          />
        )
    }
}

export default DetailView;

const styles = StyleSheet.create({
    wrapper: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
        paddingTop: 20,
    },
    separator: {
        backgroundColor: '#dddddd',
        height: 1,
        marginTop: 20,
        marginBottom: 20
    },
    label: {
        fontSize: 12,
        color: '#aaaaaa'
    },
    item: {
        borderLeftWidth: 3,
        borderColor: Colors.primary
    }
})
