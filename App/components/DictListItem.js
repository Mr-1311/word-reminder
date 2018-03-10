import React, { Component } from 'react';
import {  View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from "react-native-modal";

export default class DictListItem extends Component {

  

  render() {
    return (
      <TouchableOpacity style={styles.container} onPress={()=>this.props.onPress(this.props.item.dictName)}>
        <Text style={styles.textName}>{this.props.item.dictName}</Text>
        <Text style={styles.textDesc}>{this.props.item.dictDescription}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
    container : {
        padding: 20,
        backgroundColor: '#dddfd4',
    },
    textName : {
        marginBottom: 5,
        color: 'black',
        fontSize: 19,
        fontWeight: '600',
    },
    textDesc : {
        
        color: '#576574',
    }
});
