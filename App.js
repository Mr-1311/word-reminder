import React, { Component } from 'react';
import { TabNavigator, StackNavigator, TabBarBottom } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import StartScreen from './App/Screens/StartScreen';
import DictionariesScreen from './App/Screens/DictionariesScreen';
import SettingsScreen from './App/Screens/SettingsScreen';
import WordListScreen from './App/Screens/WordListScreen'

export const DictionariesStack = StackNavigator({
    DictionariesScreen: {
        screen: DictionariesScreen,
        navigationOptions: {
            title:'Dictionaries',
        },
    },
    WordListScreen: {
        screen: WordListScreen,
    },
});

export const Root = TabNavigator({
    StartScreen: {
        screen: StartScreen,
        navigationOptions: {
            tabBarLabel: 'Home',
            tabBarIcon: ({ tintColor }) => <Icon name="home" size={25} color={tintColor} />,
        },
    },
    DictionariesScreen: {
        screen: DictionariesStack,
        navigationOptions: {
            tabBarLabel: 'Dictionaries',
            tabBarIcon: ({ tintColor }) => <Icon name="th-list" size={25} color={tintColor} />,
        },
    },
/*    SettingsScreen: {
        screen: SettingsScreen,
        navigationOptions: {
            tabBarLabel: 'Settings',
            tabBarIcon: ({ tintColor }) => <Icon name="cog" size={25} color={tintColor} />,
        },
    },*/
},{
    tabBarComponent:TabBarBottom,
    tabBarOptions:{
        style: {height: 50},
    },
    tabBarPosition: 'bottom',
});



