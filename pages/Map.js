import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Dimensions, Text, Image, TextInput, Alert} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import {x1rpc} from '../api/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
MapboxGL.setAccessToken(
  'pk.eyJ1IjoidGFidWxhd2ViIiwiYSI6ImNrcGE2NDc4YzBxemMybm54amYxNWhkeHcifQ.wY90Me9rzVCWpdXBfpUdtQ',
);
const ANNOTATION_SIZE = 30;
export const Map = () => {
  const [data, serDaata] = useState([]);
  const [marks, setMark] = useState([]);
  const [input, setInput] = useState('');
  const [date, setDate] = useState({});
  const [userPosition, setuserPosition] = useState('')

  console.log(userPosition)
  const readData = async () => {
    try {
      const value = await AsyncStorage.getItem('userOrg');
      if (value !== null) {
        setInput(value);
        x1rpc('client.data.secure', 'getChartDataAndGeoPosition', {
          ORGFK: value,
          msource: 'toop',
          withDisplay: true,
        })
          .then(response => {
            console.log(response);
            const allResponse = response;
            serDaata(allResponse);
          })
          .catch(e => console.log(e));
      }
    } catch (e) {
      alert(e);
    }
  };
  useEffect(() => {
    readData();
  }, []);

  const setMarks = () => {
    //console.log(data[0].DATE_PLAN)
    if(date.length > 0) {
      marks.splice(0, marks.length);
      data.forEach((item, i) => {
        date == item.DATE_PLAN && item.GEO_POSITION_LIVE != null ? marks[i] = item.GEO_POSITION_LIVE : console.log('e')
      })
    } else {
      data.forEach((item, i) => {
        item.GEO_POSITION_LIVE != null ? marks[i] = item.GEO_POSITION_LIVE : console.log('e')
      })
    }
  }
  setMarks();


  return (
    <View>
      <TextInput style={styles.inputText} onChangeText={setDate} placeholder={'Введите запланированную дату'}/>
      <View>
        <MapboxGL.MapView style={styles.map} logoEnabled={false} showUserLocation={true} minDisplacement={10}>
          <MapboxGL.UserLocation onUpdate = {setuserPosition} />
          <MapboxGL.Camera zoomLevel={11} centerCoordinate={[28.3493, 57.8136]} />
          <View>
            {marks.map((marker, i) => (
              <MapboxGL.PointAnnotation
                key={i}
                id={i.toString()}
                coordinate={[+marker.split(',')[1], +marker.split(',')[0]]}
                selected={false}
                onSelected={() =>
                  Alert.alert('Адресс', 'Адрес: ' + data[i].concat,
                    [{
                      text: 'Отмена',
                      onPress: () => {
                        return null;
                      },
                    },
                    {
                      text: 'Выполнено',
                      onPress: () => {
                        
                    },
                  },
                ],)
              }/>
            ))}
          </View>
        </MapboxGL.MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    height: Dimensions.get('window').height - 105,
  },
  adres: {
    marginTop: 20,
    paddingLeft: 10,
    fontSize: 20,
    color: 'black',
  },
  annotationContainer: {
    alignItems: 'center',
    height: ANNOTATION_SIZE,
    justifyContent: 'center',
    overflow: 'hidden',
    width: ANNOTATION_SIZE,
  },
  inputText: {
    borderColor: 'black',
    borderWidth: 1,
  }
});
