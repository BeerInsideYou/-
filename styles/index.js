import { StyleSheet } from 'react-native';

export const Colors = {
    danger: '#dc3545',
    primary: '#1576bb',
    info: '#17a2b8',
    warning: '#ffc107',
    muted: '#dddddd'
}

export const FontSizes = {
    large: 18,
    normal: 16,
    small: 14
}

export const body = {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    alignContent: 'center',
}

export const section = {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
}

export const button = {
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#000000',
    height: 40,
    alignItems: 'center',
    borderRadius: 0,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
}

export const text = {
    color: '#000000',
    fontSize: FontSizes.normal,

}


export const common = StyleSheet.create({
     buttonPrimary: {
        ...button,
        backgroundColor: Colors.primary
     },
     buttonPrimaryText: {
        color: '#FFFFFF',
        paddingVertical: 8,
        fontSize: 18,
     },
     text: {
        ...text
     },
     textSmall: {
        ...text,
        fontSize: FontSizes.small
     },
     textError: {
         color: Colors.danger,
         textAlign: 'center',
         fontSize: FontSizes.small,
     },
     link: {
         color: Colors.primary,
         textAlign: 'center',
         fontSize: 16,
         alignSelf: 'center',
         padding: 10,
     },
     formControl: {
         flex: 1,
         color: 'black',
         paddingLeft: 15,
         paddingRight: 15,
         borderWidth: 1,
         borderRadius: 0,
         fontSize: 16,
         borderColor: '#dadae8',
     },
     mainBody: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        alignContent: 'center',
        height: 100+'%'
     },
     container: {
        backgroundColor: '#ffffff',
     },
     row: {
        flexDirection: 'row',
        height: 40,
        marginTop: 20,
        marginLeft: 35,
        marginRight: 35,
        margin: 10,
     },
     section: {
        marginTop: 20,
        marginLeft: 35,
        marginRight: 35,
     },
     sectionFlex: {
        flex: 1,
        marginTop: 20,
        marginLeft: 35,
        marginRight: 35,
        margin: 10,
     },
      tableRow: {
         flexDirection: 'row',
         height: 40,
         flexShrink: 1
      },
      tableCell: {
         height: 40,
         flexWrap: 'wrap',
         flexShrink: 1
      },
  separator: {
       margin: 5
  }

})
