import {Pressable, StyleSheet, View} from 'react-native';

import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {useThemeColor} from "@/hooks/use-theme-color";
import {router} from "expo-router";

export default function ModalScreen() {
	// 현재 테마에 맞는 배경색 가져오기
	const backgroundColor = useThemeColor({}, 'background');

	return (
		<View style={styles.overlay}>
			{/* 반투명 배경을 누르면 창이 닫히도록 설정 */}
			<Pressable style={StyleSheet.absoluteFill} onPress={() => router.back()}/>

			{/* 중앙에 위치한 작은 팝업 창 */}
			<ThemedView style={[styles.modalContainer, {backgroundColor}]}>
				<ThemedText type="title" style={styles.title}>저장된 목록</ThemedText>

				<ThemedText style={styles.message}>
					여기에 저장된 계산 기록이 표시됩니다.
				</ThemedText>

				<Pressable
					style={({pressed}) => [styles.closeButton, {opacity: pressed ? 0.8 : 1}]}
					onPress={() => router.back()}>
					<ThemedText style={styles.closeButtonText}>닫기</ThemedText>
				</Pressable>
			</ThemedView>
		</View>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)', // 뒤쪽 배경을 반투명 검정으로 처리
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContainer: {
		width: '80%', // 화면 너비의 80%만 차지
		maxWidth: 340, // 너무 커지지 않도록 최대 너비 제한
		padding: 24,
		borderRadius: 16,
		alignItems: 'center',
		// 그림자 효과
		shadowColor: '#51595a',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		borderWidth: 1,
		borderColor: '#707070',
	},
	title: {
		marginBottom: 16,
		fontSize: 20,
	},
	message: {
		marginBottom: 24,
		textAlign: 'center',
	},
	closeButton: {
		backgroundColor: '#0a7ea4',
		paddingVertical: 10,
		paddingHorizontal: 24,
		borderRadius: 8,
		width: '100%',
		alignItems: 'center',
	},
	closeButtonText: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 16,
	},
});