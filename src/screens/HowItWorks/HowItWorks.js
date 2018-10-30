import React from 'react';
import { StyleSheet, Text } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

const tutorialStyles = StyleSheet.create({
    image: {
        width: 320,
        height: 320,
    }
});

const slides = [
    {
        key: 'somethun',
        title: 'Title s1',
        text: 'Description.\nSay something cool',
        image: require('@assets/images/Tutorial/1.jpg'),
        imageStyle: tutorialStyles.image,
        backgroundColor: '#59b2ab',
    },
    {
        key: 'somethun-dos',
        title: 'Title 2',
        text: 'Other cool stuff',
        image: require('@assets/images/Tutorial/2.jpg'),
        imageStyle: tutorialStyles.image,
        backgroundColor: '#febe29',
    },
    {
        key: 'somethun1',
        title: 'Rocket guy',
        text: 'I\'m already out of descriptions\n\nLorem ipsum bla bla bla',
        image: require('@assets/images/Tutorial/3.jpg'),
        imageStyle: tutorialStyles.image,
        backgroundColor: '#22bcb5',
    }
];

export default class HowItWorks extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showRealApp: false
        }
    }
    _onDone = () => {
        // User finished the introduction. Show real app through
        // navigation or simply by controlling state
        alert('Yendo hacia la página inicial');
        this.setState({ showRealApp: true });
    }
    render() {
        if (this.state.showRealApp) {
            return <Text>Mostrando aplicación original</Text>;
            return <HowItWorks />;
        } else {
            return <AppIntroSlider slides={slides} onDone={this._onDone} />;
        }
    }
}




// import React, {Component} from 'react'
// import { View, Text, Button } from 'react-native'
// // import { setInterval } from 'timers';

// export default class HowItWorks extends Component{
//     constructor(props){
//         super(props)
//         this.state = {
//             counter: 0,
//         }
//     }

//     componentWillMount(){
//         setInterval(()=>{
//             this.setState({
//                 counter: this.state.counter + 1,
//             })
//         }, 2000);
//     }

//     render(){
//         return (
//             <Text>
//                 Aquí se mostrará como trabaja la aplicación { this.state.counter }
//             </Text>
//         )
//     }

// }