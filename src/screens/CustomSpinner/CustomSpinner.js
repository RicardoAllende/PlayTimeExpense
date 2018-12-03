import React, {Component} from 'react'
import Spinner from "react-native-loading-spinner-overlay";

export default class CustomSpinner extends Component {
    render (){
        return (
            <Spinner visible={this.props.visible} textContent={"Espere un momento, por favor"} textStyle={{ color: "white" }} />
        )
    }
}