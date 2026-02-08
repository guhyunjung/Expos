import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View} from 'react-native';
import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {useThemeColor} from '@/hooks/use-theme-color';

// 물타기(평단가) 계산기 컴포넌트
export default function Calculator() {
	// 현재 보유 중인 자산의 매수 평단가와 수량 상태
	const [currentPrice, setCurrentPrice] = useState('');
	const [currentQty, setCurrentQty] = useState('');

	// 추가로 매수(물타기)할 자산의 희망가와 수량 상태
	const [addPrice, setAddPrice] = useState('');
	const [addQty, setAddQty] = useState('');

	// 현재 테마 모드(라이트/다크)에 맞는 색상값 추출
	const textColor = useThemeColor({}, 'text');
	const placeholderColor = useThemeColor({}, 'icon');

	// 실시간 계산 로직 함수
	// 입력된 값을 바탕으로 총 평가금액, 추가 투자금, 최종 평단가 등을 계산
	const calculate = () => {
		// 입력값에서 쉼표(,)를 제거하고 실수형 숫자로 변환 (값이 없으면 0)
		const cp = parseFloat(currentPrice.replace(/,/g, '')) || 0;
		const cq = parseFloat(currentQty.replace(/,/g, '')) || 0;
		const ap = parseFloat(addPrice.replace(/,/g, '')) || 0;
		const aq = parseFloat(addQty.replace(/,/g, '')) || 0;

		// 현재 평가금액과 추가 투자금액 계산
		const currentTotal = cp * cq;
		const addTotal = ap * aq;

		// 최종 합산 계산 (총 수량, 총 투자금, 평단가)
		const totalQty = cq + aq;
		const totalInvested = currentTotal + addTotal;
		// 총 수량이 0보다 클 때만 평단가 계산 (0으로 나누기 방지)
		const avgPrice = totalQty > 0 ? totalInvested / totalQty : 0;

		return {
			currentTotal,
			addTotal,
			totalQty,
			totalInvested,
			avgPrice,
		};
	};

	const result = calculate();

	// 숫자 포맷팅 함수: 천 단위 콤마 추가 및 소수점 2자리까지 표시
	const formatNumber = (num: number) => {
		return num.toLocaleString('ko-KR', {maximumFractionDigits: 2});
	};

	// 재사용 가능한 입력 필드 컴포넌트
	const InputField = ({label, value, onChangeText, placeholder}: {
		label: string,
		value: string,
		onChangeText: (text: string) => void,
		placeholder: string
	}) => (
		<View style={styles.inputContainer}>
			<ThemedText style={styles.label}>{label}</ThemedText>
			<TextInput
				style={[styles.input, {color: textColor, borderColor: placeholderColor}]}
				value={value}
				onChangeText={onChangeText}
				placeholder={placeholder}
				placeholderTextColor={placeholderColor}
				keyboardType="numeric"
			/>
		</View>
	);

	return (
		<ThemedView style={styles.container}>
			{/* 키보드가 올라올 때 화면이 가려지지 않도록 패딩/높이 조절 */}
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={{flex: 1}}
			>
				<ScrollView contentContainerStyle={styles.scrollContent}>

					<ThemedText type="title" style={styles.headerTitle}>물타기 계산기</ThemedText>
					<ThemedText style={styles.subtitle}>평단가와 수량을 계산해보세요.</ThemedText>

					{/* 섹션 1: 현재 보유 자산 입력 영역 */}
					<View style={[styles.card, {borderColor: placeholderColor}]}>
						<ThemedText type="subtitle" style={styles.cardTitle}>현재 보유 주식/코인</ThemedText>
						<InputField
							label="매수 평균가"
							value={currentPrice}
							onChangeText={setCurrentPrice}
							placeholder="예: 1000"
						/>
						<InputField
							label="보유 수량"
							value={currentQty}
							onChangeText={setCurrentQty}
							placeholder="예: 50"
						/>
						<View style={styles.summaryRow}>
							<ThemedText>총 평가금액</ThemedText>
							<ThemedText type="defaultSemiBold">{formatNumber(result.currentTotal)} 원</ThemedText>
						</View>
					</View>

					{/* 섹션 2: 추가 매수 계획 입력 영역 */}
					<View style={[styles.card, {borderColor: placeholderColor}]}>
						<ThemedText type="subtitle" style={styles.cardTitle}>추가 매수 (물타기)</ThemedText>
						<InputField
							label="추가 희망가"
							value={addPrice}
							onChangeText={setAddPrice}
							placeholder="예: 800"
						/>
						<InputField
							label="매수 수량"
							value={addQty}
							onChangeText={setAddQty}
							placeholder="예: 50"
						/>
						<View style={styles.summaryRow}>
							<ThemedText>총 투자금액</ThemedText>
							<ThemedText type="defaultSemiBold">{formatNumber(result.addTotal)} 원</ThemedText>
						</View>
					</View>

					{/* 섹션 3: 최종 계산 결과 표시 영역 (강조된 스타일) */}
					<View style={[styles.resultCard, {backgroundColor: '#0a7ea4'}]}>
						<ThemedText type="subtitle" style={[styles.cardTitle, {color: '#fff'}]}>최종 결과</ThemedText>

						<View style={styles.resultRow}>
							<ThemedText style={{color: '#fff'}}>예상 평단가</ThemedText>
							<ThemedText type="title"
										style={{color: '#fff'}}>{formatNumber(result.avgPrice)}</ThemedText>
						</View>

						<View style={styles.resultDivider}/>

						<View style={styles.resultRow}>
							<ThemedText style={{color: '#fff'}}>총 보유 수량</ThemedText>
							<ThemedText type="defaultSemiBold"
										style={{color: '#fff'}}>{formatNumber(result.totalQty)}</ThemedText>
						</View>

						<View style={styles.resultRow}>
							<ThemedText style={{color: '#fff'}}>총 투자 금액</ThemedText>
							<ThemedText type="defaultSemiBold"
										style={{color: '#fff'}}>{formatNumber(result.totalInvested)}</ThemedText>
						</View>
					</View>

				</ScrollView>
			</KeyboardAvoidingView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollContent: {
		padding: 20,
		paddingBottom: 40,
	},
	headerTitle: {
		marginBottom: 8,
	},
	subtitle: {
		marginBottom: 24,
		opacity: 0.7,
	},
	card: {
		borderWidth: 1,
		borderRadius: 12,
		padding: 16,
		marginBottom: 20,
	},
	cardTitle: {
		marginBottom: 16,
	},
	inputContainer: {
		marginBottom: 16,
	},
	label: {
		fontSize: 14,
		marginBottom: 8,
		opacity: 0.8,
	},
	input: {
		borderWidth: 1,
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
	},
	summaryRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 8,
		paddingTop: 8,
		borderTopWidth: StyleSheet.hairlineWidth,
		borderTopColor: '#ccc',
	},
	resultCard: {
		borderRadius: 16,
		padding: 20,
		marginTop: 10,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	resultRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	resultDivider: {
		height: 1,
		backgroundColor: 'rgba(255,255,255,0.3)',
		marginVertical: 12,
	},
});
