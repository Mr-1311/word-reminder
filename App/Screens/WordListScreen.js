import React, { Component } from 'react';
import { View, Text, FlatList, AsyncStorage } from 'react-native';
import ListItem from '../components/WordListItem';

export default class WordListScreen extends Component {

	state = { data: [] }

	static navigationOptions = ({ navigation }) => {
		const { params } = navigation.state;

		return {
			title: params ? params.dictName : 'Word List',
		}
	};

	async componentDidMount(){
		data = await AsyncStorage.getItem(this.props.navigation.state.params.dictName)
		this.setState({data: JSON.parse(data)})
	}

	refreshData = async () => {
		newWords = await AsyncStorage.getItem(this.props.navigation.state.params.dictName);
		this.setState({ data: JSON.parse(newWords) });
	}

	render() {
		return (
			<View>
				<FlatList
					data={this.state.data}
					renderItem={({ item }) => (

						<ListItem
							item={item}
							data={this.state.data}
							onPress={this.refreshData}
							dictName={this.props.navigation.state.params.dictName}
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
			</View>
		);
	}
}
