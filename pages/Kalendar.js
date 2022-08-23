/* eslint-disable */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Image,
  TextInput,
  Alert
} from 'react-native';
import {x1rpc} from '../api/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';

LocaleConfig.locales['fr'] = {
  monthNames: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ],
  monthNamesShort: [
    'Janv.',
    'Févr.',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juil.',
    'Août',
    'Sept.',
    'Oct.',
    'Nov.',
    'Déc.',
  ],
  dayNames: [
    'Dimanche',
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
  ],
  dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
  today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = 'fr';

export const Kalendar = () => {
  const [data, setData] = useState({});
  const [input, setInput] = useState({});

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
            //console.log(response);
            const allResponse = response;
            setData(allResponse);
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

  const getDateObj = () => {
    let obj = {};
    for(var i = 0; i < data.length; i++) {
      obj[data[i].DATE_PLAN.split('.').reverse().join('-')] = {selected: true, marked: true, selectedColor: 'blue'}
    }
    //console.log(obj)
    return obj
  }


  return (
    <View>
      <Calendar
        markedDates={getDateObj()}
        onDayPress={day => {
          let dataObj = Object.assign({}, data)
          let musAdress = [];
          let dataOrder = [];
          //console.log(dataObj[0].DATE_PLAN.split('.').reverse().join('-'))

          for (var i = 0; i < data.length; i++) {
           if (dataObj[i].DATE_PLAN.split('.').reverse().join('-') == day.dateString) {
            musAdress.push(dataObj[i].concat);
            dataOrder.push(dataObj[i].NAME);
             console.log(musAdress)
           }
          }
          Alert.alert(
            'Информация по этому дню',
            `${musAdress.map((adress, i) => `Адрес: ${adress}\nСоциальная услуга: ${dataOrder[i]}\n\n`)}`.replace(/,Адрес/g, 'Адрес')
            )
        }}>
      </Calendar>
    </View>
  );
};
