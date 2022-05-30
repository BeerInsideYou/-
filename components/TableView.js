import React, {Component} from 'react';
import {FlatList, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, View} from "react-native";
import {List, ListItem, Card, Text} from '@ui-kitten/components';

import {common, Colors} from '../styles'

class TableCell extends Component {
  render() {

    return (
      <View>
        <View>
          <Text style={styles.label}>{this.props.label}</Text>
        </View>
        <View>
          <Text style={common.text}>{this.props.data !== '' && this.props.data !== null ? this.props.data : (<Text appearance="hint">не указано</Text>) }</Text>
        </View>
      </View>
    )
  }
}

class TableRow extends Component {
  render() {
    return (
      <Card onPress={this.props.onPress ? this.props.onPress : () => null}>
        <FlatList
          data={this.props.fields}
          renderItem={ ({item}) => <TableCell data={this.props.data[item.name]} label={item.label} /> }
        />
      </Card>
    )
  }
}

class TableView extends Component {

  render() {
    if (this.props.items && this.props.items.length > 0) {
      return (
        <List contentContainerStyle={styles.wrapper}
              data={this.props.items}
              keyExtractor={(item) => item.SYS_GUID}
              ItemSeparatorComponent={() => (
                <View style={styles.separator}/>
              )}
              renderItem={({item}) => <TableRow data={item} fields={this.props.fields}
                                                onPress={this.props.navigation ?
                                                  () => this.props.navigation.navigate(this.props.navTarget, {id: item.SYS_GUID})
                                                  : () => false}/>}
        />

      )
    } else {
      return (
        <View style={common.mainBody}>
          <View style={{ alignSelf: 'center' }}>
            <Text appearance="hint"> Ничего не найдено </Text>
          </View>
        </View>

      )
    }

  }
}

export default TableView;

const styles = StyleSheet.create({
  wrapper: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    paddingTop: 20
  },
  separator: {
    backgroundColor: 'transparent',
    height: 1,
    marginTop: 10,
    marginBottom: 10
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
