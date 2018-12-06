import React, { Component } from "react";

import { StyleSheet, View, TouchableOpacity } from "react-native";
import {Text} from 'native-base'
import Modal from 'react-native-modal'
import theme from '@theme/variables/myexpense';

export default class ConfirmModal extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <Modal
        isVisible={this.props.isVisible}
        // onSwipe={() => this.setState({ visibleModal: null })}
        
        animationIn="slideInLeft"
        animationOut="slideOutLeft"
        animationInTiming={300}
        animationOutTiming={300}
        
        swipeDirection="down"
        style={styles.bottomModal}
      >
        <View 
          style={{
            backgroundColor: "white",
            padding: 22,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 4,
            borderColor: "rgba(0, 0, 0, 0.1)",
            flexDirection: "column",
          }}
        >
          <Text style={styles.textStyle}>
            { this.props.message }
          </Text>
          <View style={{ flexDirection: 'row' }} >
              <TouchableOpacity // Cancel button
              onPress={this.props.onCancel}
              >
                  <View 
                    style={{
                      backgroundColor: theme.brandLight,
                      padding: 12,
                      margin: 16,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 4,
                      borderColor: "rgba(0, 0, 0, 0.1)"
                    }}
                  >
                    <Text>{ this.props.cancelText }</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity // Confirm button
              onPress={this.props.onConfirm}
              >
                  <View 
                  style={{
                      backgroundColor: theme.brandSuccess,
                      padding: 12,
                      margin: 16,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 4,
                      borderColor: "rgba(0, 0, 0, 0.1)"
                  }}
                  >
                      <Text>{ this.props.confirmText }</Text>
                  </View>
              </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: "Roboto_light",
    fontSize: 16,
    padding: "5%", // default 30
    paddingTop: 0
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    backgroundColor: "lightblue",
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0
  },
  scrollableModal: {
    height: 300
  },
  scrollableModalContent1: {
    height: 200,
    backgroundColor: "orange",
    alignItems: "center",
    justifyContent: "center"
  },
  scrollableModalContent2: {
    height: 200,
    backgroundColor: "lightgreen",
    alignItems: "center",
    justifyContent: "center"
  }
});
