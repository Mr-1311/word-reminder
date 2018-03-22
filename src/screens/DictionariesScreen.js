import React, { Component } from 'react';
import { View, Text, AsyncStorage, FlatList, StyleSheet, Button, TextInput, TouchableOpacity, Alert } from 'react-native';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/MaterialIcons';
import DictListItem from '../components/DictListItem'

export default class DictionariesScreen extends Component {

	state = { dictNames: [], isCreateDictModalVisible: false, isDictPressModelVisible: false, inputDictName: '', inputDictDesc: '', currentDictName: '' }

	componentDidMount() {
		this.getDictNames()
	}

	async getDictNames() {
		data = await AsyncStorage.getItem('dictNames')
		parsedData = JSON.parse(data)
		if (parsedData === null) {
			parsedData = [{ dictName: 'Your Words', dictDescription: 'Your default dictionary' },
			{ dictName: 'Learned Words', dictDescription: 'The words you learned' }]

			await AsyncStorage.setItem('dictNames', JSON.stringify(parsedData))
		}
		this.setState({ dictNames: parsedData })
	}

	onCreateNewDictPress = async () => {

		if (this.state.inputDictName === '') {
			alert('Dictionary name cannot be empty!')
			//this.setState({ isCreateDictModalVisible: !this.state.isCreateDictModalVisible })
			return;
		}
		names = this.state.dictNames;

		for (let i = 0; i < names.length; i++) {
			if (names[i].dictName === this.state.inputDictName) {
				alert('Try another dictionary name.')
				return;
			}
		}

		names.push({ dictName: this.state.inputDictName, dictDescription: this.state.inputDictDesc })

		await AsyncStorage.setItem('dictNames', JSON.stringify(names))

		this.setState({ dictNames: names })
		this.setState({ isCreateDictModalVisible: !this.state.isCreateDictModalVisible })
	}

	onDictPress = (dictName) => {
		this.setState({ currentDictName: dictName })
		this.setState({ isDictPressModelVisible: true })
	}

	onDeletePress = () => {
		const currentName = this.state.currentDictName;
		if (currentName === 'Your Words' || currentName === 'Learned Words') {
			alert('You cannot delete this dictionary')
			return;
		}

		Alert.alert(

			'Delete Dictionary',
			'Are you sure to want to delete this dictionary, whole words will delete too?',
			[
				{ text: 'Dismiss', onPress: () => { } },

				{
					text: 'YES', onPress: async () => {
						let names = this.state.dictNames
						let index = names.map((d) => d['dictName']).indexOf(currentName)
						names.splice(index, 1)
						await AsyncStorage.removeItem(currentName)
						await AsyncStorage.setItem('dictNames', JSON.stringify(names));
						this.setState({dictNames: names, currentDictName: '', isDictPressModelVisible: false})
					}
				},

			]

		)

	}

	render() {
		return (
			<View style={styles.container}>
				<FlatList
					data={this.state.dictNames}
					renderItem={({ item }) => (
						<DictListItem item={item} onPress={this.onDictPress} />
					)}
					keyExtractor={item => item.dictName}
					ItemSeparatorComponent={() => {
						return (
							<View
								style={{
									alignSelf: 'stretch',
									height: 1,
									backgroundColor: 'gray',
								}}
							/>
						);
					}}
				/>

				<Button
					onPress={() => (this.setState({ isCreateDictModalVisible: true }))}
					title="Create New Dictionary"
					color="#2c3e50"
					accessibilityLabel="Learn more about this purple button"
				/>

				<Modal isVisible={this.state.isCreateDictModalVisible}
					onBackdropPress={() => this.setState({ isCreateDictModalVisible: false, inputDictName: '', inputDictDesc: '' })}
					onBackButtonPress={() => this.setState({ isCreateDictModalVisible: false, inputDictName: '', inputDictDesc: '' })}>
					<View style={{ flex: 0, padding: 23, backgroundColor: 'white', borderRadius: 15, }}>
						<Text style={{ color: 'black' }}>Create New Dictionary!</Text>
						<TextInput
							placeholder="Dictionary Name"
							autoFocus={true}
							onChangeText={(text) => { this.setState({ inputDictName: text }) }}
							returnKeyType={'next'}
							onSubmitEditing={(event) => {
								this.refs.SecondInput.focus();
							}}
						/>
						<TextInput
							ref='SecondInput'
							placeholder="Dictionary Description"
							onChangeText={(text) => { this.setState({ inputDictDesc: text }) }}
						/>
						<Button
							onPress={this.onCreateNewDictPress}
							title="Create New Dictionary"
							color="#2c3e50"
							accessibilityLabel="Learn more about this purple button"
						/>
					</View>
				</Modal>

				<Modal isVisible={this.state.isDictPressModelVisible}
					onBackdropPress={() => this.setState({ isDictPressModelVisible: false, currentDictName: '' })}
					onBackButtonPress={() => this.setState({ isDictPressModelVisible: false, currentDictName: '' })}>
					<View style={{ flex: 0, padding: 22, backgroundColor: 'white', justifyContent: 'flex-start', alignItems: 'flex-start', borderRadius: 15, }}>
						<Text style={{fontSize: 22, fontWeight: '700', color: 'black', marginBottom: 10, alignSelf: 'center'}}>{this.state.currentDictName}</Text>
						<TouchableOpacity style={styles.dictButtonContainer}>
							<Icon name="chrome-reader-mode" size={65} color="#222f3e" />
							<Text style={{ color: 'black', marginLeft: 10}}>Practice this dictionary</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.dictButtonContainer} onPress={() => {this.setState({isDictPressModelVisible: false})
																							 this.props.navigation.navigate('WordListScreen', {dictName: this.state.currentDictName})}}>
							<Icon name="format-list-bulleted" size={65} color="#2c3e50" />
							<Text style={{ color: 'black', marginLeft: 10}}>See the words</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.dictButtonContainer} onPress={this.onDeletePress}>
							<Icon name="delete" size={65} color="#c0392b" />
							<Text style={{ color: 'black', marginLeft: 10}}>Delete this dictionary</Text>
						</TouchableOpacity>
					</View>
				</Modal>

			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'gray',
	},
	dictButtonContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		alignSelf: 'stretch',
		backgroundColor : '#ecf0f1',
		padding: 5,
		margin: 5,
		borderRadius: 15,
	}
});
