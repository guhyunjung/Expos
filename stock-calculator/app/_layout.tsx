import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {router, Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import 'react-native-reanimated';

import {useColorScheme} from '@/hooks/use-color-scheme';
import {Button} from "react-native";

export default function RootLayout() {
	const colorScheme = useColorScheme();
	console.log("colorScheme", colorScheme);

	return (
		<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<Stack screenOptions={{ // 모든 화면에 공통적으로 옵션
				headerStyle: {backgroundColor: "f4511e"}, headerTintColor: "#fff",
				headerTitleStyle: {fontWeight: "bold"}
			}}>
				{/* 1. (tabs) 폴더: 보통 탭 네비게이션은 자체 헤더가 있으므로 스택 헤더는 숨깁니다. */}
				<Stack.Screen name="(tabs)" options={{headerShown: false}}/>
				{/* 2. 일반 화면: 제목을 커스텀하게 설정합니다. */}
				<Stack.Screen name="details/[id]" options={{
					title: '상세 정보',
					// 헤더 오른쪽에 버튼 추가 예시
					headerRight: () => (
						<Button onPress={() => router.push('/modal')} title="Info" color="#fff"/>
					),
				}} />
				{/* 3. 모달 화면: 아래에서 위로 올라오는 프레젠테이션 설정 */}
				<Stack.Screen
					name="modal"
					options={{
						presentation: 'transparentModal',
						animation: 'fade',
						headerShown: false,
					}}
				/>
				{/* 4. 설정 화면: 파일명은 settings.tsx지만, 헤더에는 '앱 설정'이라고 표시 */}
				<Stack.Screen
					name="settings"
					options={{title: '앱 설정'}}
				/>
			</Stack>
			<StatusBar style="auto"/>
		</ThemeProvider>
	);
}
