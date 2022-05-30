import React, { useState, useEffect } from 'react';
import {StyleSheet, View, Dimensions, Text, Image} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { x1rpc } from '../api/index';
MapboxGL.setAccessToken(
  'pk.eyJ1IjoidGFidWxhd2ViIiwiYSI6ImNrcGE2NDc4YzBxemMybm54amYxNWhkeHcifQ.wY90Me9rzVCWpdXBfpUdtQ',
);
const ANNOTATION_SIZE = 30;
export const Map = () =>{
    const [appState, setAppState] = useState({});
    const [marks, setMark] = useState([]);
    const [adress, setAdress] = useState('Адрес');
    useEffect(() => {
        x1rpc('client.data.secure', 'read', {
          model: 'INFO_RECIPIENT',
          msource: 'toop',
          withDisplay: true,
        }).then(response => {
          const allResponse = response;
          setAppState(allResponse)
        })
    }, [setAppState])

    for(var i = 0; i < appState.total; i++) {
        //console.log(appState.items[i].GEO_POSITION_LIVE);
        if (appState.items[i].GEO_POSITION_LIVE != null) {
            marks[i] = appState.items[i].GEO_POSITION_LIVE;
        } else {
            continue
        }
    }

  return (
    <View>
      <Text style={styles.adres}>{adress}</Text>
    
    <MapboxGL.MapView style={styles.map} logoEnabled={false}>
      <MapboxGL.Camera zoomLevel={11} centerCoordinate={[28.3493, 57.8136]} />
      <View>
      {marks.map((marker, i) => (
        <MapboxGL.PointAnnotation
          key={i}
          id={i.toString()}
          coordinate={[ +marker.split(',')[1], +marker.split(',')[0] ]}
          selected={false}
          onSelected={() =>setAdress('Адрес: ' + appState.items[i].STREET_WORK)}>
            <View style={styles.annotationContainer}>
          <Image
            source={require('../assets/marker.png') }
            style={{ width: ANNOTATION_SIZE, height: ANNOTATION_SIZE}}
          />
        </View>
          </MapboxGL.PointAnnotation>
      ))}
      </View>
    </MapboxGL.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    height: Dimensions.get('window').height,
  },
  adres: {
    marginTop: 30,
    paddingLeft: 10,
    fontSize: 20,
    color: 'black'
  },
  annotationContainer: {
    alignItems: 'center',
    height: ANNOTATION_SIZE,
    justifyContent: 'center',
    overflow: 'hidden',
    width: ANNOTATION_SIZE,
  },
});