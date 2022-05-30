import React, {Component} from 'react';
import {View} from 'react-native';
import { Text, Input, Select, IndexPath, SelectItem, Datepicker, CheckBox, NativeDateService } from '@ui-kitten/components';

const i18n = {
  dayNames: {
    short: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    long: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
  },
  monthNames: {
    short: ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    long: [
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
  },
};

const localeDateService = new NativeDateService('ru', { i18n, startDayOfWeek: 1, format: 'DD.MM.YYYY' });

class Field extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: new Date(),
      selectedIndex: null,
      multiSelectedIndex: [],
      text: ''
    };
  }

  onSelect(index) {
    const element = this.props.meta.item
    let value = '';
    let options = Object.prototype.hasOwnProperty.call(element, 'values') ? element.values : []
    switch (element.TYPE) {
      case 'lookup':
        this.setState({selectedIndex: index})
        value = Object.prototype.hasOwnProperty.call(index, 'row') ? options[index.row]['SYS_GUID'] : ''
        break;
      case 'multilookup':
        this.setState({multiSelectedIndex: index})
        const selected = index.map(i => i.row)
        value = options.filter((o, i) => selected.includes(i))
        break;
      case 'date':
        this.setState({ date : index })
        value = this.state.date;
        break;
      default:
        this.setState({ text: index })
        value = this.state.text;
    }
    if (Object.prototype.hasOwnProperty.call(this.props, 'onChange')) {
      this.props.onChange(element.NAME, value)
    }

  }

  get getOptions() {
    const element = this.props.meta.item
    if (Object.prototype.hasOwnProperty.call(element, 'values'))
      return element.values.map(i => i.DISPLAY)
    else
      return []
  }

  get getDisplayValue() {
    return this.state.selectedIndex !== null ? this.getOptions[this.state.selectedIndex.row] : ''
  }

  get getMultiDisplayValue() {
    return this.state.multiSelectedIndex.map(item => this.getOptions[item.row])
  }

  render() {
    const element = this.props.meta.item
    if (element.TYPE === 'lookup') {
      return (
        <Select
          label={element.ALIAS}
          placeholder="Выберите из списка"
          selectedIndex={this.state.selectedIndex}
          value={this.getDisplayValue}
          onSelect={index => { this.onSelect(index) }}
        >
          {
            Object.prototype.hasOwnProperty.call(element, 'values')
              ? this.getOptions.map((item, i) => ( <SelectItem title={item} key={i}/>) )
              : ''
          }
        </Select>
      );
    }
    else if (element.TYPE === 'multilookup') {
      return (
        <Select
          label={element.ALIAS}
          multiSelect={true}
          placeholder="Выберите из списка"
          selectedIndex={this.state.multiSelectedIndex}
          value={this.getMultiDisplayValue}
          onSelect={index => { this.onSelect(index) }}
        >
          {
            Object.prototype.hasOwnProperty.call(element, 'values')
              ? this.getOptions.map((item, i) => ( <SelectItem title={item} key={i} />) )
              : ''
          }
        </Select>
      );
    }
    else if (element.TYPE === 'date') {
      return (
        <View>
          <Datepicker {...this.props.inputProps } dateService={localeDateService} label={ element.ALIAS } date={this.state.date} onSelect={nd => this.onSelect(nd)}/>
        </View>
      );
    }
    else {
      return (
        <View>
          <Input {...this.props.inputProps } label={ element.ALIAS }  onChangeText={text => this.onSelect(text)} />
        </View>
      );
    }
  }

}

export default Field;
