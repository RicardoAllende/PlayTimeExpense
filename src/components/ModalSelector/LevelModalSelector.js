import React, {Component} from 'react'
import ModalSelector from 'react-native-modal-selector'
import theme from '@theme/variables/myexpense'
import {Text} from 'native-base'
import {modalLevels} from './levels'

export default class LevelModalSelector extends Component {

    constructor(props){
        super(props)
        this.state = {

        }
    }

    render(){
        return (
            <ModalSelector supportedOrientations={['portrait']} 
                // key={'mdlStr' + index}
                data={modalLevels}
                initValue="Seleccionar Nivel"
                supportedOrientations={['landscape']}
                accessible={true}

                // touchableStyle={{ backgroundColor: 'black' }}
                // style={{ backgroundColor: 'darkblue' }} // Elemento 
                // selectStyle={{ backgroundColor: 'cyan' }}
                // selectTextStyle={{ backgroundColor: 'green' }} // color texto opciones --
                // overlayStyle={{ backgroundColor: 'honeydew' }} // Detrás en transparencia
                // sectionStyle={{ backgroundColor: 'goldenrod' }} contenedor seleccionar nivel
                // sectionTextStyle={{ backgroundColor: 'aliceblue' }} // Seleccionar nivel
                // selectedItemTextStyle={{ backgroundColor: 'azure' }}
                // optionStyle={{ backgroundColor: 'beige' }} // dentro de contenedor style
                optionTextStyle={{ color: 'black' }} // contenedor de opciones
                overlayStyle={{ padding: "10%" }}

                optionContainerStyle={{ backgroundColor: 'rgba(230,230,250,1)' }} // contenedor opciones
                optionContainerStyle={{ backgroundColor: 'rgba(255,255,255,1)' }} // contenedor opciones                
                
                // cancelTextStyle={{ backgroundColor: 'brown' }}
                // cancelContainerStyle={{ backgroundColor: 'burlywood' }}

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