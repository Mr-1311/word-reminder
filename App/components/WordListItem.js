import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, AsyncStorage, Alert, Button, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from "react-native-modal";

export default class ListItem extends Component {

	state = { open: false, isCopyWord: false }

	showNativeWord() {
		if (this.state.open) {
			return (
				<View>
					<View
						style={{
							alignSelf: 'stretch',
							height: 1,
							backgroundColor: '#636e72',
						}}
					/>
					<Text style={styles.text} >
						{this.props.item.nativeWord}
					</Text>
				</View>
			)
		}

	}

	showExpandIcon() {
		if (this.state.open) {
			return (
				<View style={{ justifyContent: 'center', alignItems: 'center' }}>
					<Icon name="chevron-up" size={19} color="#bdc3c7" />
					<Text style={{ fontSize: 9, color: '#bdc3c7' }}>collapse</Text>
				</View>
			)
		}
		return (
			<View style={{ justifyContent: 'center', alignItems: 'center' }}>
				<Icon name="chevron-down" size={19} color="#bdc3c7" />
				<Text style={{ fontSize: 9, color: '#bdc3c7' }}>expand</Text>
			</View>
		)
	}

	expandItem() {
		if (this.state.open) {
			return (
				<View>
					<TouchableOpacity style={styles.expandButtons} onPress={this.copyWordPress}>
						<Text style={styles.expandText}> Copy to Another Dict </Text>
						<Icon name="clone" size={20} color="#C5EFF7" />
					</TouchableOpacity>
					<View
						style={{
							alignSelf: 'stretch',
							height: 1,
							backgroundColor: '#E4F1FE',
						}}
					/>
					<TouchableOpacity style={styles.expandButtons} onPress={this.sendLearnedDict}>
						<Text style={styles.expandText}> Send Learned Dict </Text>
						<Icon name="check" size={25} color="#2ecc71" />
					</TouchableOpacity>
					<View
						style={{
							alignSelf: 'stretch',
							height: 1,
							backgroundColor: '#E4F1FE',
						}}
					/>
					<TouchableOpacity style={styles.expandButtons} onPress={this.deleteWord}>
						<Text style={styles.expandText}> Delete </Text>
						<Icon name="trash" size={25} color="#C0392B" />
					</TouchableOpacity>
				</View>
			)
		}
	}

	dictList = []
	copyWordPress = async () => {

		dictNames = await AsyncStorage.getItem('dictNames')
		dictNames = JSON.parse(dictNames)

		let index = dictNames.map((d) => d['dictName']).indexOf(this.props.dictName)
		dictNames.splice(index, 1)
		this.dictList = dictNames

		this.setState({ isCopyWord: true })
	}
	copyToAnotherDict = async (dictName) => {
		let words = await AsyncStorage.getItem(dictName);

		words = JSON.parse(words);

		if (words === null) {
			words = [{ foreignWord: this.props.item.foreignWord, nativeWord: this.props.item.nativeWord, view: this.view }]
		} else if (-1 !== words.map((d) => d['foreignWord']).indexOf(this.props.item.foreignWord)) {
			alert('This word already exists.')
			return
		} else {
			words.unshift({ foreignWord: this.props.item.foreignWord, nativeWord: this.props.item.nativeWord, view: this.view })
		}

		await AsyncStorage.setItem(dictName, JSON.stringify(words));

		Alert.alert(
			'Copy',
			'Copy completed!',
			[
				{ text: 'ok', onPress: () => this.setState({ isCopyWord: false }) },
			]
		)
	}


	sendLearnedDict = async () => {

		Alert.alert(

			'Send Learned Word Dictionary',
			'This word will be removed from this dictionary.',
			[
				{ text: 'Dismiss', onPress: () => { } },

				{
					text: 'SEND', onPress: async () => {
						stringData = await AsyncStorage.getItem('Learned Words')
						data = JSON.parse(stringData)

						if (data === null) {
							data = [{ foreignWord: this.props.item.foreignWord, nativeWord: this.props.item.nativeWord, view: this.view }]
						} else {
							data.unshift({ foreignWord: this.props.item.foreignWord, nativeWord: this.props.item.nativeWord, view: this.view })
						}

						await AsyncStorage.setItem('Learned Words', JSON.stringify(data));

						stringData = await AsyncStorage.getItem(this.props.dictName)
						data = JSON.parse(stringData)
						let index = data.map((d) => d['foreignWord']).indexOf(this.props.item.foreignWord)
						data.splice(index, 1)
						await AsyncStorage.setItem(this.props.dictName, JSON.stringify(data))
						this.props.onPress()
					}
				},

			]

		)


	}

	deleteWord = () => {

		Alert.alert(

			'Delete Word',
			'Are you sure to want to delete the word?',
			[
				{ text: 'Dismiss', onPress: () => { } },

				{
					text: 'YES', onPress: async () => {
						stringData = await AsyncStorage.getItem(this.props.dictName)
						data = JSON.parse(stringData)
						let index = data.map((d) => d['foreignWord']).indexOf(this.props.item.foreignWord)
						data.splice(index, 1)
						await AsyncStorage.setItem(this.props.dictName, JSON.stringify(data))
						this.props.onPress()
					}
				},

			]

		)

	}

	async onPress() {
		if (this.state.open) {
			this.props.onPress()
			this.setState({ open: false })
		}
		else {
			this.props.onPress()
			stringData = await AsyncStorage.getItem(this.props.dictName)
			data = JSON.parse(stringData)
			let index = data.map((d) => d['foreignWord']).indexOf(this.props.item.foreignWord)
			if (index === -1) {
				return
			}
			data[index].view = data[index].view + 1
			this.view = data[index].view
			await AsyncStorage.setItem(this.props.dictName, JSON.stringify(data));
			this.setState({ open: true })
		}
	}
	view = this.props.item.view;
	render() {
		return (
			<View>
				<TouchableOpacity style={styles.itemContainer} onPress={() => (this.onPress())}>

					{this.showExpandIcon()}

					<View style={styles.textContainer}>
						<Text style={styles.text}>
							{this.props.item.foreignWord}
						</Text>

						{this.showNativeWord()}
					</View>
					<View style={{ justifyContent: 'center', alignItems: 'center' }}>
						<Icon name="eye" size={19} color="#bdc3c7" />
						<Text style={{ fontSize: 14, color: '#bdc3c7' }}>{this.view}</Text>
					</View>

				</TouchableOpacity>

				{this.expandItem()}

				<Modal isVisible={this.state.isCopyWord}
					onBackdropPress={() => this.setState({ isCopyWord: false })}
					onBackButtonPress={() => this.setState({ isCopyWord: false })}>
					<View style={{ padding: 23, backgroundColor: 'white', borderRadius: 15, }}>
						<FlatList
							data={this.dictList}
							renderItem={({ item }) => (
								<TouchableOpacity style={{ padding: 15, }} onPress={() => this.copyToAnotherDict(item.dictName)}>
									<Text>{item.dictName}</Text>
								</TouchableOpacity>
							)}
							keyExtractor={item => item.dictName}
							ItemSeparatorComponent={() => {
								return (
									<View
										style={{
											alignSelf: 'stretch',
											height: 1,
											backgroundColor: '#7f8c8d',
										}}
									/>
								);
							}}
						/>
					</View>
				</Modal>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	itemContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'stretch',
		backgroundColor: '#34495E',
		padding: 10,
	},
	textContainer: {
		flex: 1,
		justifyContent: 'flex-start',
		alignSelf: 'stretch',
		paddingHorizontal: 20,
	},
	text: {
		fontSize: 23,
		color: '#ecf0f1',
	},
	expandButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#22313F',
		paddingVertical: 8,
		paddingHorizontal: 15,
	},
	expandText: {
		fontSize: 18,
		marginLeft: 10,
		color: 'white',
	},
});
