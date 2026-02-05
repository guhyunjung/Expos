import {withLayoutContext} from 'expo-router';
import React from 'react';
import {Colors} from '@/constants/theme';
import {useColorScheme} from '@/hooks/use-color-scheme';
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {ParamListBase, TabNavigationState} from "@react-navigation/native";

// 1. Expo Router와 호환되는 Top Tab Navigator 생성
const {Navigator} = createMaterialTopTabNavigator()
export const MaterialTopTabs = withLayoutContext<TabNavigationState<ParamListBase>, typeof Navigator>(Navigator)

export default function TabLayout() {
	const colorScheme = useColorScheme();

	// 2. Tabs 대신 MaterialTopTabs 사용
	return (
		<MaterialTopTabs screenOptions={{
			tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
			tabBarLabelStyle: {fontSize: 14, fontWeight: 'bold'},
			tabBarIndicatorStyle: {backgroundColor: Colors[colorScheme ?? 'light'].tint},
		}}>
			<MaterialTopTabs.Screen
				name="index"
				options={{
					title: 'Home',
					// 상단 탭은 보통 아이콘 없이 텍스트만 쓰지만, 원한다면 아이콘 유지 가능
					// tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
				}}/>
			<MaterialTopTabs.Screen
				name="explore"
				options={{
					title: 'Explore',
				}}
			/>
		</MaterialTopTabs>
		/*<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
				headerShown: false,
				tabBarButton: HapticTab,
			}}>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Home',
					tabBarIcon: ({color}) => <IconSymbol size={28} name="house.fill" color={color}/>,
				}}
			/>
			<Tabs.Screen
				name="explore"
				options={{
					title: 'Explore',
					tabBarIcon: ({color}) => <IconSymbol size={28} name="paperplane.fill" color={color}/>,
				}}
			/>
		</Tabs>*/
	)
		;
}
