package com.anonymous.stockcalculator

import android.text.InputFilter
import android.text.Spanned
import java.util.regex.Pattern

class DecimalDigitsInputFilter(
    private val decimalDigits: Int
) : InputFilter {
    private val pattern = Pattern.compile("^\\d*(?:\\.\\d{0," + decimalDigits + "})?$")

    override fun filter(
        source: CharSequence?,
        start: Int,
        end: Int,
        dest: Spanned?,
        dstart: Int,
        dend: Int
    ): CharSequence? {
        // 방어적 코드: 시스템에서 null이 전달될 가능성에 대비
        if (source == null || dest == null) return null

        val replacement = source.subSequence(start, end).toString()
        val newValue = buildString {
            append(dest.subSequence(0, dstart))
            append(replacement)
            append(dest.subSequence(dend, dest.length))
        }

        return if (pattern.matcher(newValue).matches()) null else ""
    }
}
