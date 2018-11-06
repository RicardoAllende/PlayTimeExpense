import React, {Component} from 'react'
import ModalSelector from 'react-native-modal-selector'
import {Text} from 'native-base'

const niveles = [
    { key: 0, section: true, label: 'Escoja el nivel a jugar' },
    { key: 1, label: 'Fácil', value: 1 },
    { key: 2, label: 'Medio', value: 2 },
    { key: 3, label: 'Difícil', value: 3 },
    { key: 4, label: 'Todos los niveles', value: '' }
  ];
export default class LevelModalSelector extends Component {

    constructor(props){
        super(props)
        this.state = {

        }
    }

    render(){
        return (
            <ModalSelector
                // key={'mdlStr' + index}
                data={niveles}
                initValue="Seleccionar Nivel"
                supportedOrientations={['landscape']}
                accessible={true}
                childrenContainerStyle={ this.props.childrenContainerStyle }
                // overlayStyle={{ backgroundColor:'blue' }}
                touchableActiveOpacity={1}
                scrollViewAccessibilityLabel={'Scrollable options'}
                cancelButtonAccessibilityLabel={'Cancel Button'}
                // onChange={(level)=>{ alert('Elemento Presionado') }}
                onChange={(level)=>{ this.props.onPress(this.props.courseId, level.value) }}
                >
                { this.props.content }

            </ModalSelector>
        );
    }
}