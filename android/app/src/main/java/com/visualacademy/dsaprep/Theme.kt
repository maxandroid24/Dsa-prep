package com.visualacademy.dsaprep

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.sp
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.font.FontWeight

// Color tokens matching the elegant premium slate theme
val CosmicDark = Color(0xFF0F111A)
val CosmicSurface = Color(0xFF1B1E2E)
val CosmicCard = Color(0xFF23273E)
val AccentBlue = Color(0xFF4880FF)
val AccentPurple = Color(0xFF8B5CF6)
val SoftText = Color(0xFF8F9BB3)
val BorderColor = Color(0xFF2E334D)
val AccentGreen = Color(0xFF10B981)
val AccentOrange = Color(0xFFF59E0B)
val AccentRed = Color(0xFFEF4444)

// Custom text helper to provide elegant tracking/spacing
@androidx.compose.runtime.Composable
fun CustomTrackingText(
    text: String,
    color: Color,
    fontSize: androidx.compose.ui.unit.TextUnit,
    fontWeight: FontWeight,
    textAlign: androidx.compose.ui.text.style.TextAlign = androidx.compose.ui.text.style.TextAlign.Start,
    lineHeight: androidx.compose.ui.unit.TextUnit = androidx.compose.ui.unit.TextUnit.Unspecified,
    trackingSender: Float,
    modifier: androidx.compose.ui.Modifier = androidx.compose.ui.Modifier
) {
    androidx.compose.material3.Text(
        text = text,
        color = color,
        fontSize = fontSize,
        fontWeight = fontWeight,
        textAlign = textAlign,
        lineHeight = lineHeight,
        letterSpacing = (trackingSender * 1.5).sp,
        modifier = modifier
    )
}
