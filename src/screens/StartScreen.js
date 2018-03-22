import React, { Component } from 'react';
import {
	View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList,
	ScrollView, Dimensions, StatusBar, Platform, AsyncStorage,
	Button
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AddNewWordSection from '../components/AddNewWordSection';
import ListItem from '../components/WordListItem';

export default class StartScreen extends Component {

	state = { addWord: false, data: [] }

	async componentDidMount() {

		//await AsyncStorage.clear();
		newWords = await AsyncStorage.getItem('Your Words');
		this.setState({ data: JSON.parse(newWords) });

	}

	addWordButtonPress = async () => {

		newWords = await AsyncStorage.getItem('Your Words');
		this.setState({ data: JSON.parse(newWords) });
		this.setState({ addWord: false });

	}

	refreshData = async () => {
		newWords = await AsyncStorage.getItem('Your Words');
		this.setState({ data: JSON.parse(newWords) });
	}

	addWordRender() {

		if (this.state.addWord) {
			return <AddNewWordSection onButtonPress={this.addWordButtonPress} />;
		}
		return (
			<TouchableOpacity style={styles.button} onPress={() => (this.setState({ addWord: true }))}>
				<Text style={styles.buttonText}>
					Add New Word
				</Text>
			</TouchableOpacity>
		);

	}

	wordsRender() {
		if (this.state.data === null) {
			return (
				<Text style={{alignSelf: 'center', color: 'gray', fontSize: 25, fontWeight: '800', padding: 20}}>
					You don't have any word yet
				</Text>
			);
		}
		else {
			return (
				<FlatList
					data={this.state.data}
					renderItem={({ item }) => (

						<ListItem
							item={item}
							data={this.state.data}
							onPress={this.refreshData}
							dictName='Your Words'
						/>

					)}
					keyExtractor={item => item.foreignWord}
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
			);
		}
	}

	render() {
		return (

			<ScrollView>

				<View style={styles.container}>
					<View style={styles.appNameContainer}>
						<Icon name='book-open-page-variant' size={70} color='#2c3e50' />
						<Text style={styles.appName}>
							Word Reminder
						</Text>

					</View>

					{this.addWordRender()}

					<Text style={styles.bottomText}>
						<Icon name='chevron-down' />slide down for your dict<Icon name='chevron-down' />
					</Text>
				</View>

				{this.wordsRender()}

			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({

	container: {
		...Platform.select({
			ios: {
				height: Dimensions.get('window').height - 20 - 50,
				marginTop: 20,
			},
			android: {
				height: Dimensions.get('window').height - StatusBar.currentHeight - 50,
			},
		}),
		backgroundColor: '#BFBFBF',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	appNameContainer: {
		backgroundColor: '#EEEEEE',
		alignSelf: 'stretch',
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 3,
		marginBottom: 20,
		elevation: 4,
	},
	appName: {
		fontSize: 25,
		color: '#2c3e50',
		fontWeight: "800",
		textAlign: 'center',
	},
	button: {
		alignItems: 'center',
		paddingHorizontal: 80,
		paddingVertical: 6,
		backgroundColor: '#FFF',
		borderRadius: 20,
		marginBottom: 35,
		elevation: 3,
	},
	buttonText: {
		alignItems: 'center',
		fontSize: 19,
		fontWeight: '600',
	},
	bottomText: {
		fontWeight: '200',
		margin: 10,
		fontSize: 13,
		color: '#2C3E50',
	}

});
