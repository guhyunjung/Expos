package com.anonymous.stockcalculator

import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.views.textinput.ReactTextInputManager

class DecimalTextInputManager : ReactTextInputManager() {
    override fun getName(): String = "DecimalTextInput"

    override fun createViewInstance(reactContext: ThemedReactContext): DecimalEditText {
        return DecimalEditText(reactContext)
    }

    @ReactProp(name = "decimalPlaces", defaultInt = 5)
    fun setDecimalPlaces(view: DecimalEditText, decimalPlaces: Int) {
        view.setDecimalPlaces(decimalPlaces)
    }
}
