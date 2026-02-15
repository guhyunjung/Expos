package com.anonymous.stockcalculator

import android.content.Context
import android.text.InputFilter
import com.facebook.react.views.textinput.ReactEditText

class DecimalEditText(context: Context) : ReactEditText(context) {
    private var decimalPlaces: Int = 5
    private var decimalFilter: DecimalDigitsInputFilter = DecimalDigitsInputFilter(decimalPlaces)
    private var isApplyingFilters = false

    fun setDecimalPlaces(places: Int) {
        val normalized = places.coerceAtLeast(0)
        if (decimalPlaces == normalized) return
        decimalPlaces = normalized
        decimalFilter = DecimalDigitsInputFilter(decimalPlaces)
        applyCustomFilters()
    }

    override fun setFilters(filters: Array<InputFilter>?) {
        if (isApplyingFilters) return
        isApplyingFilters = true
        try {
            // filters 배열 자체가 null일 수 있고, 배열 내부 요소가 null일 수 있음
            val safeFilters = filters?.filterNotNull() ?: emptyList()
            // 기존에 등록된 DecimalDigitsInputFilter 제거 후 현재 인스턴스 추가
            val withoutDecimalFilter = safeFilters.filterNot { it is DecimalDigitsInputFilter }
            val updatedFilters = (withoutDecimalFilter + decimalFilter).toTypedArray()
            
            super.setFilters(updatedFilters)
        } catch (e: Exception) {
            // 예외 발생 시 최소한 기본 필터라도 설정되도록 시도 (안정성 확보)
            try {
                super.setFilters(filters ?: emptyArray())
            } catch (inner: Exception) {}
        } finally {
            isApplyingFilters = false
        }
    }

    private fun applyCustomFilters() {
        if (isApplyingFilters) return
        isApplyingFilters = true
        try {
            val currentFilters = filters ?: emptyArray()
            val existing = currentFilters.filterNotNull().filterNot { it is DecimalDigitsInputFilter }
            val updated = (existing + decimalFilter).toTypedArray()
            super.setFilters(updated)
        } catch (e: Exception) {
            // 무시
        } finally {
            isApplyingFilters = false
        }
    }
}
