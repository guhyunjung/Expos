import React, {useState} from 'react';
import {
	Pressable,
	StyleSheet,
	TextInput,
	View,
	Platform,
	requireNativeComponent,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {useThemeColor} from '@/hooks/use-theme-color';
import {router} from "expo-router";
import MaskInput from 'react-native-mask-input';
import type {TextInputProps} from 'react-native';

type DecimalTextInputNativeProps = TextInputProps & {
	decimalPlaces?: number;
};

const AndroidDecimalTextInput = Platform.OS === 'android'
	? requireNativeComponent<DecimalTextInputNativeProps>('DecimalTextInput')
	: null;

const PRIMARY_COLOR = '#0a7ea4';

// 물타기(평단가) 계산기 컴포넌트
// 사용자가 보유한 자산 정보와 추가 매수 계획을 입력받아 최종 평단가와 투자 금액을 계산합니다.
export default function Calculator() {
	// -------------------------------------------------------------------------
	// 상태 관리 (State Management)
	// -------------------------------------------------------------------------

	// 현재 보유 중인 자산의 매수 평단가와 수량 상태
	const [currentPrice, setCurrentPrice] = useState('');
	const [currentQty, setCurrentQty] = useState('');

	// 추가로 매수(물타기)할 자산의 희망가와 수량 상태
	const [addPrice, setAddPrice] = useState('');
	const [addQty, setAddQty] = useState('');

	const [phone, setPhone] = React.useState('');

	// -------------------------------------------------------------------------
	// 테마 및 스타일 관련 (Theme & Styles)
	// -------------------------------------------------------------------------

	// 현재 테마 모드(라이트/다크)에 맞는 색상값 추출
	const textColor = useThemeColor({}, 'text');
	const placeholderColor = useThemeColor({}, 'icon');
	const cardBackgroundColor = useThemeColor({}, 'background'); // 카드 배경색

	// -------------------------------------------------------------------------
	// 계산 로직 (Calculation Logic)
	// -------------------------------------------------------------------------

	// 실시간 계산 로직 함수
	// 입력된 값을 바탕으로 총 평가금액, 추가 투자금, 최종 평단가 등을 계산
	const calculate = () => {
		// 입력값에서 쉼표(,)를 제거하고 실수형 숫자로 변환 (값이 없으면 0으로 처리)
		const cp = parseFloat(currentPrice.replace(/,/g, '')) || 0;
		const cq = parseFloat(currentQty.replace(/,/g, '')) || 0;
		const ap = parseFloat(addPrice.replace(/,/g, '')) || 0;
		const aq = parseFloat(addQty.replace(/,/g, '')) || 0;

		// 현재 보유 자산의 총 평가금액 계산 (평단가 * 수량)
		const currentTotal = cp * cq;
		// 추가 매수할 자산의 총 투자금액 계산 (희망가 * 수량)
		const addTotal = ap * aq;

		// 최종 합산 계산
		// 1. 총 수량 = 현재 수량 + 추가 수량
		const totalQty = cq + aq;
		// 2. 총 투자금 = 현재 총액 + 추가 총액
		const totalInvested = currentTotal + addTotal;
		// 3. 최종 평단가 = 총 투자금 / 총 수량 (수량이 0일 경우 0으로 처리하여 나누기 에러 방지)
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

	// -------------------------------------------------------------------------
	// 유틸리티 함수 (Utilities)
	// -------------------------------------------------------------------------

	// 숫자 포맷팅 함수: 천 단위 콤마 추가 및 소수점 2자리까지 표시
	// 예: 10000 -> "10,000"
	const formatNumber = (num: number) => {
		return num.toLocaleString('ko-KR', {maximumFractionDigits: 2});
	};

	// -------------------------------------------------------------------------
	// 서브 컴포넌트 (Sub-components)
	// -------------------------------------------------------------------------

	const sanitizeDecimalInput = (text: string) => {
        if (text === '') return '';
        const onlyDigitsAndDot = text.replace(/[^\d.]/g, '');
        const [integerPart, ...decimalChunks] = onlyDigitsAndDot.split('.');
        const decimalPart = decimalChunks.join('').slice(0, 5);

        if (decimalChunks.length > 0) {
            return `${integerPart || '0'}.${decimalPart}`;
        }
        return integerPart;
    };

	// 재사용 가능한 입력 필드 컴포넌트
	// 라벨, 입력값, 변경 핸들러, 플레이스홀더를 props로 받음
	const InputField = ({label, value, onChangeText, placeholder}: {
		label: string,
		value: string,
		onChangeText: (text: string) => void,
		placeholder: string
	}) => {
		const handleChange = (text: string) => {
			if (Platform.OS === 'android') {
				onChangeText(text);
				return;
			}
			const sanitized = sanitizeDecimalInput(text);
			onChangeText(sanitized);
        };

		const sharedInputProps = {
			style: [styles.input, {color: textColor, borderColor: placeholderColor}],
			value,
			onChangeText: handleChange,
			placeholder,
			placeholderTextColor: placeholderColor,
			keyboardType: 'decimal-pad' as const,
			maxLength: 16,
		};

		return (
			<View style={styles.inputContainer}>
				<ThemedText style={styles.label}>{label}</ThemedText>
				{Platform.OS === 'android' && AndroidDecimalTextInput ? (
					<AndroidDecimalTextInput
						{...sharedInputProps}
						decimalPlaces={5}
					/>
				) : (
					<TextInput {...sharedInputProps} />
				)}
			</View>
	)};

	// -------------------------------------------------------------------------
	// 이벤트 핸들러 (Event Handlers)
	// -------------------------------------------------------------------------
	const resetForm = () => {
		setCurrentPrice('');
		setCurrentQty('');
		setAddPrice('');
		setAddQty('');
	};

	const openList = () => {
		// resetForm();
		router.push('/modal');
	};

	const saveForm = () => {
		resetForm();
	};

	// -------------------------------------------------------------------------
	// 렌더링 (Rendering)
	// -------------------------------------------------------------------------
	return (
		<ThemedView style={styles.container}>
			<KeyboardAwareScrollView
				style={{flex: 1}}
				contentContainerStyle={styles.scrollContent}
				enableOnAndroid={true} // 안드로이드에서도 동작하도록 설정
				extraScrollHeight={100} // 키보드 위로 여분의 공간을 확보하여 시인성 확보
				keyboardShouldPersistTaps="handled" //키보드가 떠있을 때 다른 곳 터치 처리를 원활하게 함
			>
				<ThemedText type="title" style={styles.headerTitle}>물타기 계산기</ThemedText>
				<ThemedText style={styles.subtitle}>평단가와 수량을 계산해보세요.</ThemedText>

				{/* 섹션 1: 현재 보유 자산 입력 영역 */}
				<View style={[styles.card, {borderColor: placeholderColor, backgroundColor: cardBackgroundColor}]}>
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

				<MaskInput
					value={phone}
					onChangeText={(masked, unmasked) => {
						setPhone(masked); // you can use the unmasked value as well

						// assuming you typed "9" all the way:
						console.log(masked); // (99) 99999-9999
						console.log(unmasked); // 99999999999
					}}
					mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
				/>

				{/* 섹션 2: 추가 매수 계획 입력 영역 */}
				<View style={[styles.card, {borderColor: placeholderColor, backgroundColor: cardBackgroundColor}]}>
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
				{/* resultCard에 색상을 지정하여 중요한 결과임을 시각적으로 강조 */}
				<View style={[styles.resultCard, {backgroundColor: PRIMARY_COLOR}]}>
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

				<View style={styles.btn}>
					<Pressable
						style={[styles.button, styles.buttonSecondary]}
						onPress={resetForm}>
						<ThemedText style={[styles.buttonText, styles.buttonTextSecondary]}>초기화</ThemedText>
					</Pressable>
					<Pressable
						style={[styles.button, styles.buttonSecondary]}
						onPress={openList}>
						<ThemedText style={[styles.buttonText, styles.buttonTextSecondary]}>목록</ThemedText>
					</Pressable>
					<Pressable
						style={[styles.button, styles.buttonPrimary]}
						onPress={saveForm}>
						<ThemedText style={[styles.buttonText, styles.buttonTextPrimary]}>저장</ThemedText>
					</Pressable>
				</View>

			</KeyboardAwareScrollView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {flex: 1},
	scrollContent: {padding: 20, paddingBottom: 40},
	headerTitle: {marginBottom: 8},
	subtitle: {marginBottom: 24, opacity: 0.7},
	card: {borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 20},
	cardTitle: {marginBottom: 16},
	inputContainer: {marginBottom: 16},
	label: {fontSize: 14, marginBottom: 8, opacity: 0.8},
	input: {borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16},
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
		marginBottom: 30,
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
	btn: {
		flexDirection: 'row',
		justifyContent: 'center',
		gap: 12,
		marginTop: 10,
		marginBottom: 10,
	},
	button: {
		flex: 1,
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonSecondary: {
		backgroundColor: '#e0e0e0',
	},
	buttonPrimary: {
		backgroundColor: PRIMARY_COLOR,
	},
	buttonText: {
		fontWeight: 'bold',
	},
	buttonTextSecondary: {
		color: '#333',
	},
	buttonTextPrimary: {
		color: '#fff',
	},
});
