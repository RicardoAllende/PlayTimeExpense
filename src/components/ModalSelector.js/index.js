import React, {Component} from 'react'
import ModalSelector from 'react-native-modal-selector'
import {Text} from 'react-native-base'

const niveles = [
    { key: 0, section: true, label: 'Escoja el nivel a jugar' },
    { key: 1, label: 'Fácil', value: 1 },
    { key: 2, label: 'Medio', value: 2 },
    { key: 3, label: 'Difícil', value: 3 },
    { key: 4, label: 'Todos los niveles', value: '' }
  ];
export default class ModalSelector extends Component {

    constructor(props){
        super(props)
        this.state = {

        }
    }

    render(){
        <ModalSelector
            key={'mdlStr' + index}
            data={niveles}
            initValue="Seleccionar Nivel"
            supportedOrientations={['landscape']}
            accessible={true}
            // childrenContainerStyle={ styles.slide.btnWrapper }
            // overlayStyle={{ backgroundColor:'blue' }}
            touchableActiveOpacity={1}
            scrollViewAccessibilityLabel={'Scrollable options'}
            cancelButtonAccessibilityLabel={'Cancel Button'}
            // onChange={(level)=>{ this._goToCourse( item.id, level.value ) }}>
            onChange={(level)=>{ (option) => this.props.onChange(option.value) }}>
            {/* <View  > */}
            <Text
                style={styles.slide.btnText}
                >
                Jugar
            </Text>
            {/* </View> */}

        </ModalSelector>
    }
}