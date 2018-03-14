import React, { Component } from 'react';

import { StyleSheet, View, TextInput, TouchableOpacity, Text, AsyncStorage } from 'react-native';

export default class AddNewWordSection extends Component {

	state = { foreignWord: '', nativeWord: '' }

	onPress = async () => {

		if (this.state.foreignWord === '' || this.state.nativeWord === '') {
			this.props.onButtonPress();
			return;
		}

		let newWords = await AsyncStorage.getItem('Your Words');

		newWord = JSON.parse(newWords);

		foreign = this.state.foreignWord.replace(/  +/g, ' ');
		native = this.state.nativeWord.replace(/  +/g, ' ');

		if (newWord === null) {
			newWord = [{ foreignWord: foreign.trim(), nativeWord: native.trim(), view: 0 }]
		}else if (-1 !== newWord.map((d) => d['foreignWord']).indexOf(foreign.trim())) {
			alert('This word already exists.')
			return;
		}else {
			newWord.unshift({ foreignWord: foreign.trim(), nativeWord: native.trim(), view: 0 })
		}

		await AsyncStorage.setItem('Your Words', JSON.stringify(newWord));
		this.props.onButtonPress();
		return;

	}


	render() {
		return (
			<View style={styles.container}>

				<TextInput
					style={styles.textInput}
					placeholder="Foreign Word"
					autoFocus={true}
					onChangeText={(text) => { this.setState({ foreignWord: text }) }}
					returnKeyType={'next'}
					onSubmitEditing={(event) => {
						this.refs.SecondInput.focus();
					}}
				/>
				<TextInput
					ref='SecondInput'
					style={styles.textInput}
					placeholder="Native Word"
					onChangeText={(text) => { this.setState({ nativeWord: text }) }}
				/>
				<TouchableOpacity style={styles.button} onPress={this.onPress}>
					<Text style={styles.buttonText}>
						Add Word
      				</Text>
				</TouchableOpacity>

			</View>
		);
	}
}

const styles = StyleSheet.create({

	container: {
		flexDirection: 'column',
		justifyContent: 'space-around',
		alignItems: 'center',
		alignSelf: 'stretch',
		backgroundColor: '#6C7A89',
	},
	textInput: {
		textAlign: 'center',
		alignSelf: 'stretch',
		height: 40,
		marginHorizontal: 15,
		marginTop: 25,
		backgroundColor: '#fafafa',
		borderColor: 'gray',
		borderWidth: 1,
		borderRadius: 20,
		elevation: 3,
	},
	button: {
		alignItems: 'center',
		paddingHorizontal: 70,
		paddingVertical: 5,
		backgroundColor: '#FFF',
		borderRadius: 20,
		marginVertical: 25,
		elevation: 3,
	},
	buttonText: {
		alignItems: 'center',
		fontWeight: '600',
		fontSize: 17,
	},

});
